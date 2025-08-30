import Image from "next/image";
import { useRouter } from "next/dist/client/router"
import { useState } from 'react'

function Banner() {
  const router = useRouter();
  const [locating, setLocating] = useState(false)
  const search = () => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      router.push({ pathname: '/search', query: { location: 'Nearby' } })
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords || {}
        setLocating(false)
        if (typeof latitude === 'number' && typeof longitude === 'number') {
          router.push({ pathname: '/search', query: { lat: latitude.toFixed(6), lng: longitude.toFixed(6), location: 'Nearby' } })
        } else {
          router.push({ pathname: '/search', query: { location: 'Nearby' } })
        }
      },
      () => {
        setLocating(false)
        router.push({ pathname: '/search', query: { location: 'Nearby' } })
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    )
  };

  return (
    <div className="relative h-[280px] sm:h-[360px] lg:h-[350px] xl:h-[400px]">
      <Image
        src="https://links.papareact.com/0fm"
        alt="banner background"
        fill
        className="object-cover object-bottom"
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-transparent to-black/60">
        <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 text-center pb-8 md:pb-10">
          <h1 className="text-white text-2xl sm:text-4xl font-semibold drop-shadow">Find your new best friend</h1>
          <p className="text-white/90 hidden md:block mt-2">Browse pets from shelters and rescues near you.</p>
          <button
            onClick={search}
            disabled={locating}
            className={`mt-5 inline-flex items-center justify-center bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow hover:shadow-md active:scale-95 transition ${locating ? 'opacity-70 cursor-wait' : ''}`}
          >
            {locating ? 'Locating…' : 'Search Nearby'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Banner
