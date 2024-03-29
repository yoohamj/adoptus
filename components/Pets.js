import React from "react";
import house1 from "../images/Hollyhock.jpeg";
import house2 from "../images/Horacio.jpeg";
import house3 from "../images/Jean-Luc.jpeg";
import house4 from "../images/Jodie.jpeg";
import house5 from "../images/Suzette.jpeg";
import babykaymak from "../images/babykaymak.jpg";
import kaymak from "../images/kaymak.jpg";
import Pet from "./Pet";

const Pets = () => {
  const pets = [
    { name: "BabyKaymak", image: babykaymak, price: "350" },
    { name: "Kaymak", image: kaymak, price: "450" },
    { name: "Jean-Luc", image: house3, price: "300" },
    { name: "Jodie", image: house4, price: "500" },
    { name: "Suzette", image: house5, price: "700" },
    { name: "Hollyhock", image: house1, price: "0" },
    { name: "Horacio", image: house2, price: "200" },
    { name: "Jean-Luc", image: house3, price: "300" },
    { name: "Jodie", image: house4, price: "500" },
    { name: "Suzette", image: house5, price: "700" },
  ];
  return (
    <div className="py-3 sm:py-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
        {pets.map((pet) => (
          <Pet
            key={pet.image}
            name={pet.name}
            image={pet.image}
            price={pet.price}
          />
        ))}
      </div>
    </div>
  );
};

export default Pets;