import Link from "next/link"

function Footer() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-y-10 px-32 py-14 bg-gray-100 text-gray-600">
            <div className="space-y-4 text-xs text-gray-800">
                <h5 className="font-bold">ABOUT</h5>
                <p></p>
                <Link
                    href="/aboutus"
                >AboutUs
                </Link>
                <p><Link
                    href="https://www.instagram.com/yooham_kaymak/"
                >Newsroom
                </Link></p>
                <p>Investors</p>
            </div>
            <div className="space-y-4 text-xs text-gray-800">
                <h5 className="font-bold">COMMUNITY</h5>
                <p>Diversity & Belonging</p>
                <p>Against Discrimination</p>
                <p>Accessibility</p>
            </div>
            <div className="space-y-4 text-xs text-gray-800">
                <h5 className="font-bold">HOST</h5>
                <p>Host your pet</p>
                <p>Responsible hosting</p>
                <p>Resource Center</p>
            </div>
            <div className="space-y-4 text-xs text-gray-800">
                <h5 className="font-bold">SUPPORT</h5>
                <p>Neighborhood Support</p>
                <p>Help Center</p>
                <p>Trust & Safety</p>
            </div>
        </div>
    )
}

export default Footer