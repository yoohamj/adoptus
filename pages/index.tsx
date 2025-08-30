import Head from 'next/head'
import Header from '../components/Header'
import Banner from '../components/Banner'
import PetsDB from '../components/PetsDB'
import Footer from '../components/Footer'
import LandingQuickNav from '../components/LandingQuickNav'

import React, { useEffect, useState } from 'react';

export default function Home({}) {
  return (
    <div className="">
      <Head>
        <title>Adopt Us</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <div className="relative">
        <Banner />
        <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center translate-y-1/2">
          <LandingQuickNav />
        </div>
      </div>
      <div className="bg-white">
        <div className="h-[200px] md:h-[100px]" />
      </div>

      <section className="mt-0">
        <h2 className='text-4xl font-semibold p-5'>Pets Recently Added</h2>
        <div className="sm:mx-6 md:mx-10 lg:mx-12 px-3">
          <PetsDB />
        </div>
      </section>
      
      <Footer />
    </div>
  )
}

export async function getStaticProps() {
  const exploreData = await fetch('https://www.jsonkeeper.com/b/4G1G')
  .then(
    (res) => res.json()
  );

  const cardsData = await fetch('https://www.jsonkeeper.com/b/VHHT')
  .then((res) => res.json()); 

  return {
    props: {
      exploreData,
      cardsData
    }
  }
}
