import Image from "next/image";
import { useRouter } from "next/dist/client/router"

function Banner() {
  const router = useRouter();
  const search = () => {
    router.push('/search');
  };

  return (
    <div className="relative h-[300px] sm:h-[500px] lg:h-[600px] xl:h-[700px]">
      <Image
        src="https://links.papareact.com/0fm"
        alt="banner background"
        fill
        className="object-cover object-top"
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-transparent to-black/60">
        <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 text-center pb-8 md:pb-10">
          <h1 className="text-white text-2xl sm:text-4xl font-semibold drop-shadow">Find your new best friend</h1>
          <p className="text-white/90 hidden md:block mt-2">Browse pets from shelters and rescues near you.</p>
          <button
            onClick={search}
            className="mt-5 inline-flex items-center justify-center bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow hover:shadow-md active:scale-95 transition"
          >
            Search Nearby
          </button>
        </div>
      </div>
    </div>
  )
}

export default Banner
