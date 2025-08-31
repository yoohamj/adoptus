import React, { useEffect, useMemo, useState } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Pet from '../components/Pet'
import Link from 'next/link'
import { useRouter } from "next/dist/client/router";


function Search({ searchResults }) {
  const router = useRouter();
  const { location, lat, lng, radius } = router.query;
  const [results, setResults] = useState(Array.isArray(searchResults) ? searchResults : [])
  const [sortBy, setSortBy] = useState('distance')
  const [filterAge, setFilterAge] = useState('any')
  const [filterGender, setFilterGender] = useState('any')
  const [filterFee, setFilterFee] = useState('any')
  const [filterNeutered, setFilterNeutered] = useState('any')

  // Resolve the center coordinates based on query (lat/lng), a searched location string, or user geolocation
  const [center, setCenter] = useState(() => {
    const latNum = lat ? parseFloat(String(lat)) : null
    const lngNum = lng ? parseFloat(String(lng)) : null
    return latNum != null && !Number.isNaN(latNum) && lngNum != null && !Number.isNaN(lngNum)
      ? { lat: latNum, lng: lngNum }
      : null
  })

  useEffect(() => {
    const latNum = lat ? parseFloat(String(lat)) : null
    const lngNum = lng ? parseFloat(String(lng)) : null
    if (latNum != null && !Number.isNaN(latNum) && lngNum != null && !Number.isNaN(lngNum)) {
      setCenter({ lat: latNum, lng: lngNum })
      return
    }
    // If a location string is provided, geocode it
    const q = typeof location === 'string' ? location.trim() : ''
    const NON_GEO_CATEGORIES = new Set(['Dogs', 'Cats', 'Other Animals', 'Shelters & Rescues'])
    if (q && !NON_GEO_CATEGORIES.has(q)) {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`
      fetch(url, { headers: { 'Accept': 'application/json' } })
        .then(r => r.ok ? r.json() : Promise.reject(new Error('geocode_failed')))
        .then(arr => {
          const hit = Array.isArray(arr) && arr[0]
          const latN = hit ? parseFloat(hit.lat) : NaN
          const lonN = hit ? parseFloat(hit.lon) : NaN
          if (!Number.isNaN(latN) && !Number.isNaN(lonN)) {
            setCenter({ lat: latN, lng: lonN })
          }
        })
        .catch(() => { /* noop, fallback below if needed */ })
      return
    }
    // No query or location string: try user geolocation as a fallback
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords || {}
          if (typeof latitude === 'number' && typeof longitude === 'number') {
            setCenter({ lat: latitude, lng: longitude })
          }
        },
        () => { /* ignore errors; will show unfiltered */ },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      )
    }
  }, [location, lat, lng])

  // Load pets from Amplify API on the client and map to display shape
  useEffect(() => {
    let cancelled = false
    async function loadPets() {
      try {
        const { API, Storage } = await import('aws-amplify')
        const { listPets } = await import('../src/graphql/queries')
        const res = await API.graphql({ query: listPets })
        const pets = res?.data?.listPets?.items || []
        const mapped = await Promise.all(pets.map(async (p) => {
          let img = null
          if (Array.isArray(p.photoKeys) && p.photoKeys.length > 0) {
            try { img = await Storage.get(p.photoKeys[0], { level: 'public' }) } catch {}
          }
          const title = p.petName || 'Pet'
          const locText = [p.city, p.state].filter(Boolean).join(', ')
          return {
            id: p.id,
            title,
            description: p.description || '',
            img: img,
            location: locText,
            price: p.adoptionFee || '—',
            feeValue: (() => { const n = parseFloat(String(p.adoptionFee).replace(/[^0-9.\-]/g, '')); return Number.isNaN(n) ? null : n })(),
            createdAt: p.createdAt || null,
            age: p.age || '',
            gender: p.gender || '',
            spayedNeutered: typeof p.spayedNeutered === 'boolean' ? p.spayedNeutered : null,
            __address: [p.address, p.city, p.state, p.zip].filter(Boolean).join(', ')
          }
        }))
        // Only replace initial SSR results if we actually have pets in the DB
        if (!cancelled && mapped.length > 0) setResults(mapped)
      } catch (err) {
        console.warn('Amplify pets fetch failed; using initial results', err)
      }
    }
    loadPets()
    return () => { cancelled = true }
  }, [])

  // Geocode pet addresses to lat/long (cached) so we can compute distance
  useEffect(() => {
    async function geocodeAll() {
      if (!results || results.length === 0) return
      const cache = typeof window !== 'undefined' ? window.sessionStorage : null
      const getC = (k) => { if (!cache) return null; try { const v = cache.getItem(k); return v ? JSON.parse(v) : null } catch { return null } }
      const setC = (k, v) => { if (!cache) return; try { cache.setItem(k, JSON.stringify(v)) } catch {} }
      const out = await Promise.all(results.map(async (r) => {
        if (r.lat != null && r.long != null) return r
        const addr = r.__address || r.location || ''
        if (!addr) return r
        const key = `geo:${addr}`
        let c = getC(key)
        if (!c) {
          try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}&limit=1`
            const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
            const arr = await res.json()
            const hit = Array.isArray(arr) && arr[0]
            const la = hit ? parseFloat(hit.lat) : NaN
            const lo = hit ? parseFloat(hit.lon) : NaN
            if (!Number.isNaN(la) && !Number.isNaN(lo)) { c = { lat: la, long: lo }; setC(key, c) }
          } catch {}
        }
        return c ? { ...r, ...c } : r
      }))
      setResults(out)
    }
    geocodeAll()
  }, [results.length])

  const filtered = useMemo(() => {
    const latNum = center?.lat ?? null
    const lngNum = center?.lng ?? null
    const category = typeof location === 'string' && ['Dogs','Cats','Other Animals','Shelters & Rescues'].includes(location) ? location : null

    const items = Array.isArray(results) ? [...results] : []

    // Helper to compute approximate distance in km
    function haversine(lat1, lon1, lat2, lon2) {
      const toRad = (d) => (d * Math.PI) / 180
      const R = 6371
      const dLat = toRad(lat2 - lat1)
      const dLon = toRad(lon2 - lon1)
      const a = Math.sin(dLat/2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) ** 2
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      return R * c
    }

    // Category filter (heuristic based on title/description)
    const lcIncludes = (s, term) => (s || '').toLowerCase().includes(term)
    const isDog = (r) => lcIncludes(r.title, 'dog') || lcIncludes(r.title, 'puppy') || lcIncludes(r.description, 'dog') || lcIncludes(r.description, 'puppy')
    const isCat = (r) => lcIncludes(r.title, 'cat') || lcIncludes(r.title, 'kitten') || lcIncludes(r.description, 'cat') || lcIncludes(r.description, 'kitten')
    const isOther = (r) => (
      !isDog(r) && !isCat(r)
    ) || [
      'bird','rabbit','hamster','guinea','ferret','reptile','turtle','snake','lizard','fish','parrot','goat','pig','horse'
    ].some(t => lcIncludes(r.title, t) || lcIncludes(r.description, t))

    let typed = items
    if (category === 'Dogs') typed = items.filter(isDog)
    else if (category === 'Cats') typed = items.filter(isCat)
    else if (category === 'Other Animals') typed = items.filter(isOther)
    // For Shelters & Rescues, we currently show all pets (no special filter available in dataset)

    // Apply sidebar filters
    const ageMatches = (r) => {
      if (filterAge === 'any') return true
      const aText = String(r.age || '').toLowerCase()
      // Try numeric parse first
      let years = null
      const m = aText.match(/(\d+(?:\.\d+)?)\s*(year|yr|years|yrs)/)
      const mm = aText.match(/(\d+(?:\.\d+)?)\s*(month|mo|months|mos)/)
      if (m) years = parseFloat(m[1])
      else if (mm) years = parseFloat(mm[1]) / 12
      if (typeof years === 'number' && !Number.isNaN(years)) {
        if (filterAge === 'young') return years <= 1
        if (filterAge === 'adult') return years > 1 && years <= 7
        if (filterAge === 'senior') return years > 7
      }
      // Fallback to substring match if numeric not present
      return aText.includes(filterAge)
    }
    const genderMatches = (r) => {
      if (filterGender === 'any') return true
      const g = String(r.gender || '').toLowerCase()
      return g === filterGender
    }
    const feeMatches = (r) => {
      if (filterFee === 'any') return true
      const v = typeof r.feeValue === 'number' ? r.feeValue : parseFloat(String(r.price).replace(/[^0-9.\-]/g, ''))
      const n = Number.isNaN(v) ? null : v
      if (n == null) return filterFee === 'any'
      if (filterFee === 'free') return n === 0
      if (filterFee === 'lt100') return n > 0 && n < 100
      if (filterFee === '100to300') return n >= 100 && n <= 300
      if (filterFee === 'gt300') return n > 300
      return true
    }
    const neuteredMatches = (r) => {
      if (filterNeutered === 'any') return true
      const v = r.spayedNeutered
      if (filterNeutered === 'yes') return v === true
      if (filterNeutered === 'no') return v === false
      return true
    }
    typed = typed.filter((r) => ageMatches(r) && genderMatches(r) && feeMatches(r) && neuteredMatches(r))

    // Annotate distances (when center available) but do not filter out by radius
    let annotated = typed
    if (latNum != null && !Number.isNaN(latNum) && lngNum != null && !Number.isNaN(lngNum)) {
      annotated = typed.map((r) => {
        const la = parseFloat(String(r.lat))
        const lo = parseFloat(String(r.long))
        if (!Number.isNaN(la) && !Number.isNaN(lo)) {
          return { ...r, distanceKm: haversine(latNum, lngNum, la, lo) }
        }
        return r
      })
    }

    // Apply sort
    const toNumber = (v) => {
      const n = parseFloat(String(v).replace(/[^0-9.\-]/g, ''))
      return Number.isNaN(n) ? Number.POSITIVE_INFINITY : n
    }
    const sorted = [...annotated]
    if (sortBy === 'distance') {
      sorted.sort((a, b) => {
        const da = typeof a.distanceKm === 'number' ? a.distanceKm : Number.POSITIVE_INFINITY
        const db = typeof b.distanceKm === 'number' ? b.distanceKm : Number.POSITIVE_INFINITY
        return da - db
      })
    } else if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    } else if (sortBy === 'price_asc') {
      sorted.sort((a, b) => toNumber(a.price) - toNumber(b.price))
    } else if (sortBy === 'name_asc') {
      sorted.sort((a, b) => String(a.title || '').localeCompare(String(b.title || '')))
    }
    return sorted
  }, [results, center, location, sortBy, filterAge, filterGender, filterFee, filterNeutered])

  return (
    <div>
        <Header />

        <main className='flex-grow pt-14 px-6'>
            <section className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 items-start">
                {/* Sidebar filters */}
                <aside className="hidden md:block">
                  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <h3 className="mb-3 text-sm font-semibold text-gray-800">Filters</h3>
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="f-age" className="block text-xs text-gray-600 mb-1">Age</label>
                        <select id="f-age" value={filterAge} onChange={(e)=>setFilterAge(e.target.value)} className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm">
                          <option value="any">Any</option>
                          <option value="young">Young (0–1 years)</option>
                          <option value="adult">Adult (2–7 years)</option>
                          <option value="senior">Senior (8+ years)</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="f-gender" className="block text-xs text-gray-600 mb-1">Gender</label>
                        <select id="f-gender" value={filterGender} onChange={(e)=>setFilterGender(e.target.value)} className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm">
                          <option value="any">Any</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="f-fee" className="block text-xs text-gray-600 mb-1">Fee</label>
                        <select id="f-fee" value={filterFee} onChange={(e)=>setFilterFee(e.target.value)} className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm">
                          <option value="any">Any</option>
                          <option value="free">Free</option>
                          <option value="lt100">Under $100</option>
                          <option value="100to300">$100 – $300</option>
                          <option value="gt300">Over $300</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="f-neutered" className="block text-xs text-gray-600 mb-1">Spayed/Neutered</label>
                        <select id="f-neutered" value={filterNeutered} onChange={(e)=>setFilterNeutered(e.target.value)} className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm">
                          <option value="any">Any</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                      <div className="pt-1">
                        <button type="button" onClick={()=>{setFilterAge('any');setFilterGender('any');setFilterFee('any');setFilterNeutered('any')}} className="text-xs text-[#FF5A5F] underline">Clear all</button>
                      </div>
                    </div>
                  </div>
                </aside>
                {/* Results column */}
                <div>
                <p className='text-xs text-gray-600'>
                  {Array.isArray(results) ? `${results.length} ${results.length === 1 ? 'pet' : 'pets'} in database` : '0 pets in database'}
                </p>

                <h1 className='text-3xl font-semibold mt-2 mb-6'>
                  {center ? (location ? `Pets near ${location}` : 'Pets near you') : (location ? `Pets in ${location}` : 'Pets near you')}
                </h1>

                <div className="mb-4 flex items-center justify-end">
                  <label htmlFor="sortBy" className="mr-2 text-sm text-gray-600">Sort by</label>
                  <select
                    id="sortBy"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                  >
                    <option value="distance">Nearest</option>
                    <option value="newest">Newest</option>
                    <option value="price_asc">Fee: Low to High</option>
                    <option value="name_asc">Name A–Z</option>
                  </select>
                </div>

                {Array.isArray(filtered) && filtered.length > 0 ? (
                  <div className="py-3 sm:py-5">
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                      {filtered.map((r, idx) => {
                        const name = r.title || 'Pet'
                        const id = r.id || `search-${String(name).toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${idx}`
                        const image = r.img
                        const price = r.price || '—'
                        const loc = r.location || '—'
                        return (
                          <Link key={`${id}-${idx}`} href={`/pet/${id}`} className="block">
                            <Pet id={id} name={name} image={image} price={price} location={loc} distanceKm={typeof r.distanceKm === 'number' ? r.distanceKm : undefined} />
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="py-20">
                    <div className="mx-auto max-w-md flex flex-col items-center text-center gap-3">
                      <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500" />
                      <h2 className="text-xl font-semibold text-gray-800">No pets found nearby</h2>
                      <p className="text-gray-600">We couldn’t find any pets within your selected area. Try increasing the search radius or choosing a different location.</p>
                    </div>
                  </div>
                )}

                </div>

            </section>

        </main>

        <Footer />
    </div>
  )
}

export default Search;

export async function getServerSideProps() {
  // Use local fallback pets so SSR never shows unrelated apartment data.
  // Client will replace this with real Amplify data when available.
  const { fallbackPets } = await import('../lib/petsFallback')
  const searchResults = (fallbackPets || []).map((p) => ({
    id: p.id,
    title: p.name,
    description: p.description || '',
    img: (p.image && p.image.src) ? p.image.src : p.image,
    location: p.location || '',
    price: p.price || '—',
  }))

  return {
    props: {
      searchResults,
    },
  }
}
