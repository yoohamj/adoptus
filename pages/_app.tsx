import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'tailwindcss/tailwind.css';
import ProgressBar from "@badrap/bar-of-progress";
import Router from "next/router";

import { Amplify, Auth, Hub } from 'aws-amplify';
import awsconfig from '../aws-exports' 
Amplify.configure({ ...awsconfig, ssr: true });

const progress = new ProgressBar({
  size: 4,
  color: "#FE595E",
  className:"z-50",
  delay: 100
});

Router.events.on('routeChangeStart', progress.start);
Router.events.on('routeChangeComplete', progress.finish);
Router.events.on('routeChangeError', progress.finish);

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
