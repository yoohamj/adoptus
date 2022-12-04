import Head from 'next/head'

import Banner from '../components/Banner'
import Header from '../components/Header'
import Footer from '../components/Footer'

import React, { useEffect, useState } from 'react';
import { Amplify, Auth, Hub } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import awsconfig from '../aws-exports'

Amplify.configure(awsconfig);

export default function Home({}) {
  return (
    <div className="">
      <Head>
        <title>Adopt Us</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <Banner />
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