import React from 'react'
import Image from "next/image";

function Selection ({ image, type, description }) {
  return (
    <div class="h-screen">
      <div class="w-80 mt-24 m-auto lg:mt-16 max-w-sm">
        <Image 
          src={image} 
          alt=""
          class="rounded-t-2xl shadow-2xl lg:w-full 2xl:w-full 2xl:h-44 object-cover"/>
        <div class="bg-white shadow-2xl rounded-b-3xl">
          <h2 class="text-center text-gray-800 text-2xl font-bold pt-6">{type}</h2>
          <div class="w-5/6 m-auto">
            <p class="text-center text-gray-500 pt-5">{description}</p>
          </div>  
          <div class="bg-blue-700 w-72 lg:w-5/6 m-auto mt-6 p-2 hover:bg-indigo-500 rounded-2xl  text-white text-center shadow-xl shadow-bg-blue-700">
            <button classs="lg:text-sm text-lg font-bold">Register</button>
          </div>
          <div class="text-center m-auto mt-6 w-full h-16">
            <button class="text-gray-500 font-bold lg:text-sm hover:text-gray-900">Cancel</button>
          </div>  
        </div>
      </div>
    </div>
  )
}

export default Selection