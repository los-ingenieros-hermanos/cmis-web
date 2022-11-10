import '../styles/globals.scss';
import { Header } from 'components';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>GTU Community Management and Interaction System</title>
      </Head>
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
