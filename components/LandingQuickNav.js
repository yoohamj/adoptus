import Link from 'next/link'

const Item = ({ href, iconId, label }) => (
  <Link
    href={href}
    className="group block rounded-[10px] border border-gray-300 bg-white p-4 shadow hover:bg-gray-100 hover:shadow-md hover:outline hover:outline-2 hover:outline-blue-600 active:scale-[0.99] transition"
  >
    <div className="flex flex-col items-center justify-center gap-3 aspect-square">
      <svg className="h-14 w-14 text-blue-700" aria-hidden>
        <use href={`/icons/sprites.svg#${iconId}`} />
      </svg>
      <span className="text-sm font-medium text-gray-800">{label}</span>
    </div>
  </Link>
)

export default function LandingQuickNav() {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Item href="/search?location=Dogs" iconId="IconDogPortrait" label="Dogs" />
        <Item href="/search?location=Cats" iconId="IconCatPortrait" label="Cats" />
        <Item href="/search?location=Other%20Animals" iconId="IconPawOutline" label="Other Animals" />
        <Item href="/search?location=Shelters%20%26%20Rescues" iconId="IconSheltersRescues" label="Shelters & Rescues" />
      </div>
    </section>
  )
}
