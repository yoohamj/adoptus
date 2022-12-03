import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useRouter } from "next/dist/client/router";

function Search() {
  const router = useRouter();
  const { location } = router.query;

  return (
    <div>
        <Header />

        <main className='flex-grow pt-14 px-6'>
            <section>
                <p className='text-xs'> 300+ Stays for 5 number of guests</p>

                <h1 className='text-3xl font-semibold mt-2 mb-6'>Pets in {location} </h1>

                <div className='hidden lg:inline-flex mb-5 space-x-3 text-gray-800 whitespace-nowrap'>
                    <p className='button'>Age</p>
                    <p className='button'>Gender</p>
                    <p className='button'>Fee</p>
                    <p className='button'>Neuteured</p>
                    <p className='button'>More filters</p>
                </div>

            </section>

        </main>

        <Footer />
    </div>
  )
}

export default Search
