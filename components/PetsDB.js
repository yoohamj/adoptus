import React, { useEffect, useState } from "react";
import Link from 'next/link'
import Pet from "./Pet";
import babykaymak from "../images/babykaymak.jpg";
import { fallbackPets } from "../lib/petsFallback";

export default function PetsDB() {
  const [items, setItems] = useState(fallbackPets);
  const [total, setTotal] = useState(fallbackPets.length);
  const [visibleCount, setVisibleCount] = useState(2);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { API, Storage } = await import('aws-amplify');
        const { listPets } = await import('../src/graphql/queries');
        const result = await API.graphql({ query: listPets });
        const pets = result?.data?.listPets?.items || [];
        pets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        // Fetch a reasonable upper bound; actual display count is responsive
        const latest = pets.slice(0, 20);
        const withUrls = await Promise.all(latest.map(async (p) => {
          let image = null;
          if (Array.isArray(p.photoKeys) && p.photoKeys.length > 0) {
            try { image = await Storage.get(p.photoKeys[0], { level: 'public' }); } catch {}
          }
          return {
            id: p.id,
            name: p.petName || 'Pet',
            image: image || babykaymak,
            price: p.adoptionFee || '—',
            location: p.city || p.state || '—',
          };
        }));
        if (!cancelled && withUrls.length) {
          setItems(withUrls);
          setTotal(pets.length);
        }
        if (!cancelled && pets.length === 0) { try { await fetch('/api/seed-cats', { method: 'POST' }); } catch {} }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Failed to load pets from API, using fallback.', err);
      }
    }
    load();
    return () => { cancelled = true };
  }, []);

  // Determine how many cards to show responsively: 2 / 2 / 3 / 4 / 5
  useEffect(() => {
    const calc = () => {
      if (typeof window === 'undefined') return 2;
      const w = window.innerWidth;
      if (w >= 1280) return 4; // xl
      if (w >= 1024) return 3; // lg
      if (w >= 768) return 2;  // md
      return 1; // base & sm
    };
    const apply = () => setVisibleCount(calc());
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);

  return (
    <div className="py-3 sm:py-5">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {items.slice(0, visibleCount).map((pet, idx) => {
          const id = pet.id || `fallback-${pet.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`
          return (
            <Link key={`${id}-${idx}`} href={`/pet/${id}`} className="block">
              <Pet
                id={id}
                name={pet.name}
                image={pet.image}
                price={pet.price}
                location={pet.location}
              />
            </Link>
          )
        })}
        {(() => {
          const shown = Math.min(visibleCount, items?.length || 0);
          const moreCount = Math.max(0, (total || 0) - shown)
          const label = moreCount > 0 ? `${moreCount}+ more` : 'Explore more'
          return (
            <Link href="/search" className="block">
              <div className="hover:scale-110 transition duration-300 ease-in-out w-full mx-auto">
                <div className="relative aspect-[0.8/1]">
                  <div className="absolute inset-0 rounded-[1.3rem] bg-[#FF5A5F]/10 border border-[#FF5A5F]/30 flex items-center justify-center">
                    <div className="px-4 text-center">
                      <p className="text-2xl font-semibold text-[#FF5A5F]">{label}</p>
                      <p className="text-sm text-gray-600">pets available on AdoptUs</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })()}
      </div>
    </div>
  );
}
