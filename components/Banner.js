import Image from "next/image";
import { useRouter } from "next/dist/client/router"

function Banner() {
    const router = useRouter();
    const search = () => {
        router.push('/search');
    }; 

    return (
        
        <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px]">
            <Image
                src="https://links.papareact.com/0fm"
                alt = "banner background"
                fill
                className="object-contain object-left"
            />
            <div className="absolute top-1/2 w-full text-center">
                <p className="text-sm sm:text-lg">
                    Find your fur friend forever.
                </p>
                <button onClick={search} className="text-purple-500 bg-white px-10 py-4 shadow-md rounded-full font-bold my-3 hover:shadow-xl active:scale-90 transition duration-150">
                    Search Nearby
                </button>
            </div>
        </div>
    )
}

export default Banner