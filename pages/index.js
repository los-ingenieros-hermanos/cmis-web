import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.scss';

export default function Home() {
  return (
    <>
      <Head>
        <title>GTU Community Management and Interaction System</title>
      </Head>

      <div className={styles.container}>
        <h1>GTU Community Management and Interaction System</h1>
      </div>
    </>
  );
}
