import React, { useEffect, useMemo, useState } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import Header from '../components/Header'
import Footer from '../components/Footer'
import InfoCard from '../components/InfoCard'
import { useRouter } from "next/dist/client/router";


function Search({ searchResults }) {
  const router = useRouter();
  const { location, lat, lng, radius } = router.query;

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

  const filtered = useMemo(() => {
    const latNum = center?.lat ?? null
    const lngNum = center?.lng ?? null
    const radKm = radius ? parseFloat(String(radius)) : 50
    if (latNum == null || lngNum == null || Number.isNaN(latNum) || Number.isNaN(lngNum)) return searchResults
    function haversine(lat1, lon1, lat2, lon2) {
      const toRad = (d) => (d * Math.PI) / 180
      const R = 6371
      const dLat = toRad(lat2 - lat1)
      const dLon = toRad(lon2 - lon1)
      const a = Math.sin(dLat/2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) ** 2
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      return R * c
    }
    const withDistances = []
    for (const r of (searchResults || [])) {
      const la = parseFloat(String(r.lat))
      const lo = parseFloat(String(r.long))
      if (Number.isNaN(la) || Number.isNaN(lo)) continue
      const d = haversine(latNum, lngNum, la, lo)
      if (d <= radKm) withDistances.push({ ...r, distanceKm: d })
    }
    withDistances.sort((a, b) => (a.distanceKm - b.distanceKm))
    return withDistances
  }, [searchResults, center, radius])

  return (
    <div>
        <Header />

        <main className='flex-grow pt-14 px-6'>
            <section>
                <p className='text-xs'> 300+ Stays for 5 number of guests</p>

                <h1 className='text-3xl font-semibold mt-2 mb-6'>
                  {center ? (location ? `Pets near ${location}` : 'Pets near you') : (location ? `Pets in ${location}` : 'Pets near you')}
                </h1>

                <div className='hidden lg:inline-flex mb-5 space-x-3 text-gray-800 whitespace-nowrap'>
                    <p className='button'>Age</p>
                    <p className='button'>Gender</p>
                    <p className='button'>Fee</p>
                    <p className='button'>Neuteured</p>
                    <p className='button'>More filters</p>
                </div>

                {Array.isArray(filtered) && filtered.length > 0 ? (
                  <div className="flex flex-col">
                    {filtered.map(({ img, description, lat, location, long, price, title, total, distanceKm }) => (
                      <InfoCard
                        key={img}
                        img={img}
                        description={description}
                        lat={lat}
                        location={location}
                        long={long}
                        price={price}
                        title={title}
                        total={total}
                        distanceKm={distanceKm}
                      />
                    ))}
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

            </section>

        </main>

        <Footer />
    </div>
  )
}

export default Search;

export async function getServerSideProps() {
  const searchResults = await fetch("https://www.jsonkeeper.com/b/5NPS").then(
      (res) => res.json()
  );

  return {
      props: {
          searchResults,
      },
  };
}
