import React from "react";
import { StarIcon } from '@heroicons/react/24/solid'
import Image from "next/image";

const Pet = ({ name, image, price }) => {
  return (
    <div className="hover:scale-110 transition duration-300 ease-in-out">
      <div className="relative">
        <div className="grad absolute w-full h-full rounded-b-[1.3rem]"></div>
        <div className="flex">
          {/* Background */}
          <Image
            src={image}
            alt=""
            className="object-cover rounded-[1.3rem] sm:h-[17rem]  md:h-[17rem] w-full"
          />
        </div>
      </div>
      {/* Description */}
      <div className="pt-3 flex justify-between items-start">
        {/* Left */}
        <div className="">
          <p className="max-w-[17rem] font-semibold text-[17px]">
            {name}
          </p>
          <p className="max-w-[17rem]  text-[16px] -mt-1 text-gray-500">
            Location
          </p>
          <p className="max-w-[17rem] font-semibold text-[17px]">${price}</p>
        </div>
        {/* Right */}
        <div className="flex items-center space-x-1">
          <StarIcon />
          <p className="text-[15px]">5.0</p>
        </div>
      </div>
    </div>
  );
};

export default Pet;