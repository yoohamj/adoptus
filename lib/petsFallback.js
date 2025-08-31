import house1 from "../images/Hollyhock.jpeg";
import house2 from "../images/Horacio.jpeg";
import house3 from "../images/Jean-Luc.jpeg";
import house4 from "../images/Jodie.jpeg";
import house5 from "../images/Suzette.jpeg";
import babykaymak from "../images/babykaymak.jpg";
import kaymak from "../images/kaymak.jpg";

// Minimal fallback dataset used when the API has no pets yet
// or when API access is unavailable. IDs are stable strings.
export const fallbackPets = [
  { id: 'fallback-babykaymak', name: 'BabyKaymak', image: babykaymak, price: '350', location: 'Toronto', petType: 'Cat', breed: 'Domestic', age: 'Young', gender: 'Unknown', size: 'Small', color: 'Mixed', vaccinated: false, spayedNeutered: false, microchipped: false, description: 'Playful kitten looking for a loving home.' },
  { id: 'fallback-kaymak', name: 'Kaymak', image: kaymak, price: '450', location: 'Toronto', petType: 'Cat', breed: 'Domestic', age: 'Adult', gender: 'Unknown', size: 'Medium', color: 'Mixed', vaccinated: false, spayedNeutered: false, microchipped: false, description: 'Gentle and affectionate, ready to cuddle.' },
  { id: 'fallback-jean-luc', name: 'Jean-Luc', image: house3, price: '300', location: 'Toronto', petType: 'Cat', breed: 'Domestic', age: 'Adult', gender: 'Male', size: 'Medium', color: 'Mixed', vaccinated: false, spayedNeutered: false, microchipped: false, description: 'Curious explorer with a calm temperament.' },
  { id: 'fallback-jodie', name: 'Jodie', image: house4, price: '500', location: 'Toronto', petType: 'Cat', breed: 'Domestic', age: 'Adult', gender: 'Female', size: 'Medium', color: 'Mixed', vaccinated: false, spayedNeutered: false, microchipped: false, description: 'Friendly and social, great with families.' },
  { id: 'fallback-suzette', name: 'Suzette', image: house5, price: '700', location: 'Toronto', petType: 'Cat', breed: 'Domestic', age: 'Adult', gender: 'Female', size: 'Medium', color: 'Mixed', vaccinated: false, spayedNeutered: false, microchipped: false, description: 'Elegant cat with a sweet personality.' },
  { id: 'fallback-hollyhock', name: 'Hollyhock', image: house1, price: '0', location: 'Toronto', petType: 'Cat', breed: 'Domestic', age: 'Senior', gender: 'Female', size: 'Medium', color: 'Mixed', vaccinated: false, spayedNeutered: false, microchipped: false, description: 'Senior sweetheart who loves sunny spots.' },
  { id: 'fallback-horacio', name: 'Horacio', image: house2, price: '200', location: 'Toronto', petType: 'Cat', breed: 'Domestic', age: 'Adult', gender: 'Male', size: 'Medium', color: 'Mixed', vaccinated: false, spayedNeutered: false, microchipped: false, description: 'Chill companion who enjoys quiet time.' },
];

