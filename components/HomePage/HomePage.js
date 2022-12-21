import styles from './HomePage.module.scss';
import { Tabs, Link, Post } from 'components';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { AuthContext } from 'pages/_app';

  export const dummyCommunityPosts = [
    {
      community: {
        name: 'GTÜ Bilgisayar Topluluğu',
        pfpSrc: '/images/pfp1.png',
        url: '/topluluklar/xRTtShHBupaYOvugN0Bvp',
      },
      poster: { name: 'Alperen Öztürk', role: 'Başkan Yardımcısı' },
      date: '6 Ocak, 2021',
      visibility: 'public',
      title: 'Lorem Ipsum Post Title',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue.',
      likeCount: 236,
      eventDetails: {
        date: '10 Ocak, 2021 | 16.00 - 18.00',
        participantCount: 72,
      },
    },
    {
      community: {
        name: 'GTÜ Bilgisayar Topluluğu',
        pfpSrc: '/images/pfp1.png',
        url: '/topluluklar/xRTtShHBupaYOvugN0Bvp',
      },
      poster: { name: 'Alperen Öztürk', role: 'Başkan Yardımcısı' },
      date: '7 Ocak, 2021',
      visibility: 'public',
      title: 'Lorem Ipsum Post Title',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue.',
      likeCount: 236,
    },
    {
      community: {
        name: 'GTÜ Bilgisayar Topluluğu',
        pfpSrc: '/images/pfp1.png',
        url: '/topluluklar/xRTtShHBupaYOvugN0Bvp',
      },
      poster: { name: 'Alperen Öztürk', role: 'Başkan Yardımcısı' },
      date: '19 Ocak, 2021',
      visibility: 'public',
      title: 'Lorem Ipsum Post Title',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus.',
      likeCount: 236,
    },
  ];
  
  export const dummyTeamPosts = [
    {
      community: {
        name: 'Doğa Takımı',
        pfpSrc: '/images/pfp4.png',
        url: '/takimlar/Jz4rdsWpk2xZYan86a6kW',
      },
      poster: { name: 'Alperen Öztürk', role: 'Başkan Yardımcısı' },
      date: '7 Şubat, 2021',
      visibility: 'public',
      title: 'Lorem Ipsum Post Title',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue.',
      likeCount: 236,
      eventDetails: {
        date: '10 Ocak, 2021 | 16.00 - 18.00',
        participantCount: 72,
      },
    },
    {
      community: {
        name: 'Doğa Takımı',
        pfpSrc: '/images/pfp4.png',
        url: '/takimlar/Jz4rdsWpk2xZYan86a6kW',
      },
      pfpSrc: '/images/pfp4.png',
      poster: { name: 'Alperen Öztürk', role: 'Başkan Yardımcısı' },
      date: '6 Ocak, 2021',
      visibility: 'public',
      title: 'Lorem Ipsum Post Title',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue.',
      likeCount: 236,
    },
  ];

    // Merge the two arrays
    const dummyPosts = [...dummyCommunityPosts, ...dummyTeamPosts];
    
    // Sort the array by date
    dummyPosts.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });
  
  function Banner() {
    return (
      <div className={styles.banner}>
        <Link href={'/'}> Anasayfa </Link>
      </div>
    );
  }

  function Posts() {
    const router = useRouter();
  
    // request id from backend and show 404 if id doesn't exist
    return (
        <div>
            {/* map the lists and pass datas to the Post componenent */}
            {dummyPosts.map((post) => (
                <Post postData={post} />
            ))}
        </div>
    );
  }

  function LeftSide({ postData }) {
    return (
        <ul className={styles.left}>
            <p>Buraya linkler gelecek</p>
            <p>Buraya linkler gelecek</p>

            {/* Bookmarks */}
            <li className={styles.item}>
              <Link href={'/yaklasan-etkinlikler'}>
                  <img src={'/icons/sidebar-events.svg'} alt='yaklasan-etkinlikler' />
              </Link>
              <Link href={'/yaklasan-etkinlikler'}>
                Etkinlikler
              </Link>
            </li>
            <li className={styles.item}>
              <Link href={'/topluluklar'}>
                  <img src={'/icons/sidebar-communities.svg'} alt='topluluklar/takimlar' />
              </Link>
              <Link href={'/topluluklar'}>
                Topluluklar/Takımlar
              </Link>
            </li>
            <li className={styles.item}>
              <Link href={'/askida-proje'}>
                  <img src={'/icons/sidebar-project-idea.svg'} alt='yaklasan-etkinlikler' />
              </Link>
              <Link href={'/askida-proje'}>
                Askıda Proje
              </Link>
            </li>
        </ul>
    );
  }


  export default function HomePage() {
    return (
        <div className={styles.page}>
            <Banner />
            <LeftSide />
            <Posts />
        </div>
    );
  }
