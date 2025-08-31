import React, { useEffect, useState } from "react";
import { StarIcon, HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline'
// Use native img to keep SSR/CSR markup identical and avoid domain config issues
import AuthPromptModal from './AuthPromptModal'
import { useRouter } from 'next/router'

import { isFavorite, toggleFavorite } from '../lib/favorites'
import { Auth } from 'aws-amplify'

const Pet = ({ id, name, image, price, location, distanceKm }) => {
  const [fav, setFav] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const router = useRouter()
  useEffect(() => {
    let mounted = true
    if (!id) return
    Auth.currentAuthenticatedUser().then(() => setSignedIn(true)).catch(() => setSignedIn(false))
    isFavorite(id).then(v => { if (mounted) setFav(!!v) })
    return () => { mounted = false }
  }, [id])

  const onHeart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!id) return
    try {
      await Auth.currentAuthenticatedUser()
    } catch {
      setShowPrompt(true)
      return
    }
    await toggleFavorite(id)
    setFav(v => !v)
  }
  return (
    <div className="hover:scale-110 transition duration-300 ease-in-out w-full mx-auto">
      <div className="relative aspect-[0.8/1]">
        <div className="grad absolute inset-0 rounded-b-[1.3rem]"></div>
        <div className="flex">
          {/* Background */}
          {(() => {
            const src = typeof image === 'string' ? image : (image && image.src) || ''
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover rounded-[1.3rem]" />
            )
          })()}
        </div>
        <button
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          onClick={onHeart}
          className="absolute top-2 right-2 z-10 inline-flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow p-1"
        >
          {fav ? <HeartSolid className="h-5 w-5 text-red-500" /> : <HeartOutline className="h-5 w-5 text-gray-700" />}
        </button>
      </div>
      <AuthPromptModal
        open={showPrompt}
        onClose={() => setShowPrompt(false)}
        onSignIn={() => { setShowPrompt(false); router.push('/profile') }}
        action="Favorite"
        title={"Please sign in to save to Favorites"}
        description=""
      />
      {/* Description */}
      <div className="pt-3">
        <p className="max-w-[17rem] font-semibold text-[17px] text-[#FF5A5F]">
          {name}
        </p>
        <p className="max-w-[17rem] text-[15px] -mt-1 text-gray-500">
          {location || 'Location'}
          {typeof distanceKm === 'number' && (
            <span> • ~ {distanceKm < 10 ? distanceKm.toFixed(1) : Math.round(distanceKm)} km</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default Pet;
