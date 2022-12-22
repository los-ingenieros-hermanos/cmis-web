import styles from './ProjectIdea.module.scss';
import { Tabs, Link, Post } from 'components';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { AuthContext } from 'pages/_app';

  const dummyIdeaPosts = [
    {
      community: {
        name: 'Azra Arslan',
        pfpSrc: '/icons/default-user-icon.svg',
        url: '/ogrenciler/xRTtShHBupaYOvugN0Bvp',
      },
      date: '6 Ocak, 2021',
      title: 'Lorem Ipsum Post Title',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue.',
    },
    {
      community: {
        name: 'Azra Arslan',
        pfpSrc: '/icons/default-user-icon.svg',
        url: '/ogrenciler/xRTtShHBupaYOvugN0Bvp',
      },
      date: '6 Ocak, 2021',
      title: 'Lorem Ipsum Post Title',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue.',
    },
    {
      community: {
        name: 'Azra Arslan',
        pfpSrc: '/icons/default-user-icon.svg',
        url: '/ogrenciler/xRTtShHBupaYOvugN0Bvp',
      },
      date: '6 Ocak, 2021',
      title: 'Lorem Ipsum Post Title',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue.',
    },
  ];
  
  // Merge the two arrays
  const dummyIdeas = [...dummyIdeaPosts];
  
  const dummyUser = {
    type: 'ogrenciler',
    id: 'xRTtShHBupaYOvugN0Bvp',
    name: 'Azra Arslan',
    pfpSrc: '/icons/default-user-icon.svg',
    bannerSrc: '/images/banner1.png',
    bannerBgColor: '#000000',
    description:
      'Community description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue.',
    isFollowed: false,
  };

  const UserHasIdeaListElementList = Array(4).fill(<UserHasIdeaListElement data={dummyUser} />);
  

  function Banner({ isGlobal, setIsGlobal, authContext }) {
    return (
      <div className={styles.banner}>
        <Link href={'/askida-proje'}> Askıda Projeler </Link>
      </div>
    );
  }

  function Posts( { authContext , isGlobal } ) {
    const router = useRouter();
  
    // request id from backend and show 404 if id doesn't exist
    return (
        <ul>
            {/* map the lists and pass datas to the Post componenent */}
            {dummyIdeas.map((post) => (
                <Post
                    key={post.id}
                    postData={post}
                />
            ))}

        </ul>
    );
  }

  function LeftSide({ authContext }) {
    return (
        <ul className={styles.left}>
            {authContext.isLoggedIn ? (
                <li className={styles.item}>
                  <Link href={'/profilim'}>
                      <img src={'/icons/sidebar-sign-in.svg'} alt='profilim' />
                  </Link>
                  <Link href={'/profilim'}>Profilim</Link>
                </li>
            ) : (
                <li className={styles.item} onClick={() => authContext.setIsLoginOpen(true)}>
                  <img src={'/icons/sidebar-sign-in.svg'} alt='giris-yap' />
                  <a>Giriş Yap</a>
                </li>
            )}
            {authContext.isLoggedIn ? (
                <li className={styles.item}>
                  <Link href={'/kaydedilenler'}>
                      <img src={'/icons/sidebar-bookmark.svg'} alt='kaydedilenler' />
                  </Link>
                  <Link href={'/profilim'}>Kaydedilenler</Link>
                </li>
            ) : (
                <li className={styles.item} onClick={() => authContext.setIsSignUpOpen(true)}>
                  <img src={'/icons/sidebar-sign-up.svg'} alt='kayit-ol' />
                  <a>Kayıt Ol</a>
                </li>
            )}
            
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

  function RightSide( {authContext} ) {
    return ((authContext.isLoggedIn) ? (
      <ul className={styles.right}>
        <h2 className={styles.followedTitle}>Askıda Projesi Olanlar</h2>
        {UserHasIdeaListElementList}
      </ul>
    ) : (<></>));
  }

  function UserHasIdeaListElement({ data }) {
    return (
      <li className={styles.UserHasIdeaListElement}>
        <Link href={getHref(data)}>
          <img src={data.pfpSrc} alt='profile picture' />
        </Link>
        <Link href={getHref(data)}>{data.name}</Link>
      </li>
    );
  }

  function getHref(data) {
    return `/${data.type}/${data.id}`;
  }

  export default function ProjectIdea() {
    const authContext = useContext(AuthContext);
    const [isGlobal, setIsGlobal] = useState(true);
      return (
        <div className={styles.page}>
            <Banner isGlobal={isGlobal} setIsGlobal={setIsGlobal} authContext={authContext} />
            <LeftSide authContext={authContext} />
            <Posts isGlobal={isGlobal}/>
            <RightSide authContext={authContext} />
        </div>
    );
  }
