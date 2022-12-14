import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'tailwindcss/tailwind.css';
import ProgressBar from "@badrap/bar-of-progress";
import Router from "next/router";
import Link from 'next/link'
import { useEffect } from 'react';

const progress = new ProgressBar({
  size: 4,
  color: "#FE595E",
  className:"z-50",
  delay: 100
});

Router.events.on('routeChangeStart', progress.start);
Router.events.on('routeChangeComplete', progress.finish);
Router.events.on('routeChangeError', progress.finish);

function App({ Component, pageProps }: AppProps) {


  useEffect(() => {
  const use = async () => {
    (await require('tw-elements')).default;
      };
      use();
    }, []);
  
    return <Component {...pageProps} />;
  }
  
  export default App;