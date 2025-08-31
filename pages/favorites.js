import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '../components/Header'
import Pet from '../components/Pet'
import { getFavorites } from '../lib/favorites'
import { fallbackPets } from '../lib/petsFallback'
import { Auth } from 'aws-amplify'

export default function FavoritesPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        await Auth.currentAuthenticatedUser()
        if (!cancelled) setSignedIn(true)
        const ids = await getFavorites()
        const results = []
        const dbIds = []
        for (const id of ids) {
          if (id.startsWith('fallback-')) {
            const f = fallbackPets.find(p => p.id === id)
            if (f) results.push({ id, name: f.name, image: f.image, price: f.price, location: f.location })
          } else {
            dbIds.push(id)
          }
        }
        if (dbIds.length) {
          try {
            const { API, Storage } = await import('aws-amplify')
            const { getPet } = await import('../src/graphql/queries')
            for (const did of dbIds) {
              try {
                const res = await API.graphql({ query: getPet, variables: { id: did } })
                const p = res?.data?.getPet
                if (p) {
                  let image = null
                  if (Array.isArray(p.photoKeys) && p.photoKeys.length > 0) {
                    try { image = await Storage.get(p.photoKeys[0], { level: 'public' }) } catch {}
                  }
                  results.push({ id: p.id, name: p.petName || 'Pet', image, price: p.adoptionFee || '—', location: p.city || p.state || '—' })
                }
              } catch {}
            }
          } catch {}
        }
        if (!cancelled) setItems(results)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <div>
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-semibold">Favorites</h1>
        {loading ? (
          <p className="text-gray-600 mt-4">Loading…</p>
        ) : !signedIn ? (
          <p className="text-gray-600 mt-4">Please sign in to view your Favorites.</p>
        ) : items.length === 0 ? (
          <p className="text-gray-600 mt-4">No favorites yet. Tap the heart on a pet to save it.</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((pet) => (
              <Link key={pet.id} href={`/pet/${pet.id}`} className="block">
                <Pet id={pet.id} name={pet.name} image={pet.image} price={pet.price} location={pet.location} />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
