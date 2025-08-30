import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import InfoCard from '../components/InfoCard'
import { useRouter } from "next/dist/client/router";


function Search({ searchResults }) {
  const router = useRouter();
  const { location } = router.query;

  return (
    <div>
        <Header />

        <main className='flex-grow pt-14 px-6'>
            <section>
                <p className='text-xs'> 300+ Stays for 5 number of guests</p>

                <h1 className='text-3xl font-semibold mt-2 mb-6'>Pets in {location || 'Toronto'} </h1>

                <div className='hidden lg:inline-flex mb-5 space-x-3 text-gray-800 whitespace-nowrap'>
                    <p className='button'>Age</p>
                    <p className='button'>Gender</p>
                    <p className='button'>Fee</p>
                    <p className='button'>Neuteured</p>
                    <p className='button'>More filters</p>
                </div>

                <div className="flex flex-col">
                        {searchResults.map(
                            ({ img, description, lat, location, long, price, star, title, total,
                            }) => (
                                <InfoCard
                                    key={img}
                                    img={img}
                                    description={description}
                                    lat={lat}
                                    location={location}
                                    long={long}
                                    price={price}
                                    star={star}
                                    title={title}
                                    total={total}
                                />
                            )
                        )}
                    </div>

            </section>

        </main>

        <Footer />
    </div>
  )
}

export default Search;

export async function getServerSideProps() {
  const searchResults = await fetch("https://www.jsonkeeper.com/b/5NPS").then(
      (res) => res.json()
  );

  return {
      props: {
          searchResults,
      },
  };
}
