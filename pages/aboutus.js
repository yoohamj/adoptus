import React from 'react'
import Header from '../components/Header'
import Yooham from "../images/Yooham.jpeg";

function AboutUs() {
  return (
    <div>
        <Header/>
        <div class="container my-24 px-6 mx-auto">
        <section class="mb-32 text-gray-800 text-center">
            <h2 class="text-3xl font-bold mb-12">Meet the <u class="text-blue-600">Team</u></h2>

            <div class="mb-6 lg:mb-0">
                <div class="bg-white block rounded-lg shadow-lg">
                <div class="relative overflow-hidden bg-no-repeat bg-cover">
                    <img src={Yooham} class="w-full rounded-t-lg" />
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
                    <a href="https://www.linkedin.com/in/john-yooham-jung-497294113/" className="px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-4 h-4 text-blue-600">
                        <path fill="currentColor" d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                        </svg>
                    </a>
                    <a href="https://www.instagram.com/yooham_kaymak/" class="px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-4 h-4 text-blue-600">
                        <path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                        </svg>
                    </a>
                    </ul>
                </div>
                </div>
            </div>

        </section>
        </div>
    </div>
    )
}

export default AboutUs