import Header from '../../components/Header'
import { useRouter } from 'next/router'
import { useEffect, useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { fallbackPets } from '../../lib/petsFallback'
import { API, Storage } from 'aws-amplify'
import { getPet } from '../../src/graphql/queries'
import AuthPromptModal from '../../components/AuthPromptModal'
import { Auth } from 'aws-amplify'
import { getOrCreateConversation } from '../../lib/messages'

export default function PetDetailPage() {
  const { query } = useRouter()
  const pet = fallbackPets.find(p => p.id === String(query.id))
  const [dbPet, setDbPet] = useState(null as any)
  const [images, setImages] = useState([] as string[])
  const id = String(query.id || '')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [showAuth, setShowAuth] = useState(false)
  const ownerEmail = (dbPet && dbPet.ownerEmail) || null
  const ownerSub = (dbPet && dbPet.owner) || null

  const gallery: string[] = images.length > 0
    ? images
    : pet ? [pet.image?.src || (pet.image as any)] : []

  const openLightbox = (idx: number) => { setLightboxIndex(idx); setLightboxOpen(true) }
  const closeLightbox = () => setLightboxOpen(false)
  const prev = () => setLightboxIndex((i) => (i - 1 + gallery.length) % gallery.length)
  const next = () => setLightboxIndex((i) => (i + 1) % gallery.length)
  
  // Fetch DB pet by ID if exists
  useEffect(() => {
    const id = String(query.id || '')
    if (!id) return
    let cancelled = false
    async function load() {
      try {
        const res: any = await API.graphql({ query: getPet, variables: { id } })
        const p = res?.data?.getPet
        if (p && !cancelled) {
          setDbPet(p)
          // load photos
          const urls: string[] = []
          if (Array.isArray(p.photoKeys)) {
            for (const key of p.photoKeys) {
              try { const u = await Storage.get(key, { level: 'public' }); if (typeof u === 'string') urls.push(u) } catch {}
            }
          }
          if (!cancelled && urls.length) setImages(urls)
        }
      } catch {}
    }
    load()
    return () => { cancelled = true }
  }, [query.id])

  const display = dbPet || pet
  const displayName = (dbPet?.petName) || pet?.name
  const displayType = (dbPet?.petType) || pet?.petType
  const displayBreed = (dbPet?.breed) || pet?.breed
  const displayGender = (dbPet?.gender) || pet?.gender
  const displaySize = (dbPet?.size) || pet?.size
  const displayColor = (dbPet?.color) || pet?.color
  const displayLocation = [dbPet?.city || pet?.location, dbPet?.state].filter(Boolean).join(', ')
  const displayPrice = (dbPet?.adoptionFee) || pet?.price
  const ageText = (dbPet?.age) || (pet as any)?.age
  const ageNumYears = (() => {
    if (!ageText) return null
    const s = String(ageText).toLowerCase()
    const m = s.match(/(\d+(?:\.\d+)?)\s*(year|yr|years|yrs)/)
    const mm = s.match(/(\d+(?:\.\d+)?)\s*(month|mo|months|mos)/)
    if (m) return parseFloat(m[1])
    if (mm) return parseFloat(mm[1]) / 12
    const onlyNum = s.match(/\d+(?:\.\d+)?/)
    return onlyNum ? parseFloat(onlyNum[0]) : null
  })()

  async function messageOwner() {
    try {
      await Auth.currentAuthenticatedUser()
    } catch {
      setShowAuth(true)
      return
    }
    // Try in-app conversation first (cloud/local fallback)
    try {
      const otherLabel = ownerEmail || 'Owner'
      // @ts-ignore dbPet may be null on fallback pets
      const convo = await getOrCreateConversation({ otherLabel, petId: id, petName: pet?.name || (dbPet as any)?.petName || 'Pet', otherSub: ownerSub || undefined })
      if (convo && convo.id) {
        window.location.href = `/messages/${convo.id}`
        return
      }
    } catch {}
    const email = ownerEmail
    if (!email) {
      alert('Owner contact is not available yet.')
      return
    }
    const subject = encodeURIComponent(`Inquiry about ${pet?.name || dbPet?.petName || 'your pet'}`)
    const body = encodeURIComponent('Hello, I am interested in your pet listed on Adopt Us.\n\n')
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
  }
  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!pet ? (
          <>
            <h1 className="text-2xl font-semibold">Pet Details</h1>
            <p className="text-gray-600">ID: {String(query.id || '')}</p>
            <p className="mt-2 text-gray-500">This pet will load from the database when available.</p>
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {gallery.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={pet.name}
                  className="w-full rounded-lg object-cover cursor-zoom-in"
                  onClick={() => openLightbox(i)}
                />
              ))}
            </div>
            <div className="lg:col-span-2">
              <h1 className="text-2xl font-semibold">{displayName}</h1>
              <p className="text-gray-600">{displayType}{displayBreed ? ` • ${displayBreed}` : ''}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {ageText && (
                  <div><span className="text-gray-500">Age:</span> {typeof ageNumYears === 'number' ? `${ageNumYears < 1 ? Math.round(ageNumYears*12) + ' months' : ageNumYears.toFixed(ageNumYears % 1 === 0 ? 0 : 1) + ' years'}` : ageText}</div>
                )}
                {displayGender && <div><span className="text-gray-500">Gender:</span> {displayGender}</div>}
                {displaySize && <div><span className="text-gray-500">Size:</span> {displaySize}</div>}
                {displayColor && <div><span className="text-gray-500">Color:</span> {displayColor}</div>}
              </div>
              {(dbPet?.description || pet.description) && (
                <div className="mt-4">
                  <h2 className="font-semibold">About</h2>
                  <p className="mt-1 whitespace-pre-line">{dbPet?.description || pet.description}</p>
                </div>
              )}
              <div className="mt-4">
                <h2 className="font-semibold">Location</h2>
                <p className="text-gray-700">{displayLocation}</p>
              </div>
              <div className="mt-4">
                <h2 className="font-semibold">Adoption Fee</h2>
                <p className="text-gray-800">{displayPrice ? `$${displayPrice}` : '—'}</p>
              </div>
              <div className="mt-6">
                <button
                  onClick={messageOwner}
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700"
                >
                  Message Owner
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      {/* Image Lightbox */}
      <Transition appear show={lightboxOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeLightbox}>
          <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/80" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded bg-black/0 p-0 text-left align-middle">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={gallery[lightboxIndex]} alt="pet" className="max-h-[85vh] w-auto mx-auto rounded" />
                    {gallery.length > 1 && (
                      <>
                        <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-2xl">‹</button>
                        <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-2xl">›</button>
                      </>
                    )}
                    <button onClick={closeLightbox} className="absolute right-2 top-2 text-white text-xl">✕</button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {/* Auth Prompt for messaging */}
      <AuthPromptModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
        onSignIn={() => { setShowAuth(false); window.location.href = '/profile' }}
        action="message the owner"
        title={"Please sign in to message the owner"}
        description={""}
      />
    </>
  )
}
