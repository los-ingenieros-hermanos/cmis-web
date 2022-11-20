import '../styles/globals.scss';
import Head from 'next/head';
import { Header } from 'components';

function MyApp({ Component, pageProps }) {
  const rightSidebarContent = pageProps['rightSidebarContent'];

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
