import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from 'next/app'
import { ReactDOM } from 'react';


export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}