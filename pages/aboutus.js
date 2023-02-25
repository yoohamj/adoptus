import React from 'react'
import Header from '../components/Header'
import Yooham from "../images/Yooham.jpeg";
import Gul from "../images/Gul.jpeg";
import Kubra from "../images/Kubra.jpeg";

function AboutUs() {
  return (
    <div>
        <Header/>
        <div class="container my-24 px-6 mx-auto">
        <section class="mb-32 text-gray-800 text-center">
            <h2 class="text-3xl font-bold mb-12">Meet the <u class="text-blue-600">Team</u></h2>

            <div class="grid md:grid-cols-3 gap-x-6 lg:gap-x-12">
            <div class="mb-6 lg:mb-0">
                <div class="bg-white block rounded-lg shadow-lg">
                <div class="relative overflow-hidden bg-no-repeat bg-cover">
                    <img src="https://media.licdn.com/dms/image/C4D03AQFR94UTJmk0-A/profile-displayphoto-shrink_400_400/0/1661206751624?e=1682553600&v=beta&t=QkSVxWRsmlm0UKk7PrR5B__nzGC1YqttTWrpwBogfCM" referrerpolicy="no-referrer" class="w-full rounded-t-lg" />
                    <a href="#!">
                    <div class="absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-fixed"></div>
                    </a>
                    <svg class="absolute" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" styles="left: 0; bottom: 0">
                    <path fill="#fff" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
                    </path>
                    </svg>
                </div>
                <div class="p-6">
                    <h5 class="text-lg font-bold mb-4">Kubra Alihanoglu</h5>
                    <p class="text-gray-500 mb-4">Chief Technology Officer</p>
                    <ul class="list-inside flex mx-auto justify-center">
                    <a href="https://www.linkedin.com/in/kubra-alihanoglu-631798249/" referrerpolicy="no-referrer" class="px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-4 h-4 text-blue-600">
                        <path fill="currentColor" d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                        </svg>
                    </a>
                    </ul>
                </div>
                </div>
            </div>

            <div class="mb-6 lg:mb-0">
                <div class="bg-white block rounded-lg shadow-lg">
                <div class="relative overflow-hidden bg-no-repeat bg-cover">
                    <img src="https://media.licdn.com/dms/image/C5103AQFejZLkqSPKXQ/profile-displayphoto-shrink_400_400/0/1517103793919?e=1682553600&v=beta&t=y2cUJeooWTd4_FL-k6GQTLEH39aiFI4igJe4XYC5Cpk" class="w-full rounded-t-lg" />
                    <a href="#!">
                    <div class="absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-fixed"></div>
                    </a>
                    <svg class="absolute" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" styles="left: 0; bottom: 0">
                    <path fill="#fff" d="M0,96L48,128C96,160,192,224,288,240C384,256,480,224,576,213.3C672,203,768,213,864,202.7C960,192,1056,160,1152,128C1248,96,1344,64,1392,48L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
                    </path>
                    </svg>
                </div>
                <div class="p-6">
                    <h5 class="text-lg font-bold mb-4">Yooham Jung</h5>
                    <p class="text-gray-500 mb-4">Chief Executive Officer</p>
                    <ul class="list-inside flex mx-auto justify-center">
                    <a href="#!" class="px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="w-4 h-4 text-blue-600">
                        <path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                        </svg>
                    </a>
                    <a href="#!" class="px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-4 h-4 text-blue-600">
                        <path fill="currentColor" d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
                        </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/john-yooham-jung-497294113/" className="px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-4 h-4 text-blue-600">
                        <path fill="currentColor" d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                        </svg>
                    </a>
                    <a href="https://www.instagram.com/kaymak_dad/" class="px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-4 h-4 text-blue-600">
                        <path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                        </svg>
                    </a>
                    </ul>
                </div>
                </div>
            </div>

            <div class="">
                <div class="bg-white block rounded-lg shadow-lg">
                <div class="relative overflow-hidden bg-no-repeat bg-cover">
                    <img src="https://media.licdn.com/dms/image/C5603AQEXt5MB1HK6BA/profile-displayphoto-shrink_800_800/0/1552658064150?e=1682553600&v=beta&t=WwagyVBV3Nm-PbpN3E-XhpNr4dX_yAALrPIk80cM3ds" class="w-full rounded-t-lg" />
                    <a href="#!">
                    <div class="absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-fixed"></div>
                    </a>
                    <svg class="absolute" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" styles="left: 0; bottom: 0">
                    <path fill="#fff" d="M0,288L48,256C96,224,192,160,288,160C384,160,480,224,576,213.3C672,203,768,117,864,85.3C960,53,1056,75,1152,69.3C1248,64,1344,32,1392,16L1440,0L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
                    </path>
                    </svg>
                </div>
                <div class="p-6">
                    <h5 class="text-lg font-bold mb-4">Nigara Gulinigeer</h5>
                    <p class="text-gray-500 mb-4">Chief Financial Officer</p>
                    <ul class="list-inside flex mx-auto justify-center">
                    <a href="https://www.linkedin.com/in/gulinigeer-nigara-wulayimujiang-662b14125/" class="px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-4 h-4 text-blue-600">
                        <path fill="currentColor" d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                        </svg>
                    </a>
                    </ul>
                </div>
                </div>
            </div>
            </div>
        </section>
        </div>
    </div>
    )
}

export default AboutUs