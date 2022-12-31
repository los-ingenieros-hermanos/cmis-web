import styles from './HomePage.module.scss';
import { Tabs, Link, Post } from 'components';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { AuthContext } from 'pages/_app';
import LeftMenu from 'components/LeftMenu/LeftMenu';


  const dummyCommunityPosts = [
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
  
  const dummyTeamPosts = [
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
  
  const dummyCommunity = {
    type: 'topluluklar',
    id: 'xRTtShHBupaYOvugN0Bvp',
    name: 'GTÜ Bilgisayar Topluluğu',
    pfpSrc: '/images/pfp1.png',
    bannerSrc: '/images/banner1.png',
    bannerBgColor: '#000000',
    description:
      'Community description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue.',
    isFollowed: false,
  };
  
  const dummyTeam = {
    type: 'takimlar',
    id: 'Jz4rdsWpk2xZYan86a6kW',
    name: 'Doğa Takımı',
    pfpSrc: '/images/pfp4.png',
    bannerSrc: '/images/banner2.png',
    bannerBgColor: '#1d5525',
    description:
      'Community description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue.',
    isFollowed: false,
  };

  const followedTeamsOrCommunityList = Array(4).fill(<FollowedListElement data={dummyTeam} />);
  followedTeamsOrCommunityList.push(...Array(4).fill(<FollowedListElement data={dummyCommunity} />));

  function Banner({ isGlobalContext, setisGlobalContext, authContext }) {
    return (
      <div className={styles.banner}>
        <Link href={'/'}> Anasayfa </Link>
        {authContext.signIn ? (
          <div className={styles.dropdown}>
          {isGlobalContext ? (
              <img src="/icons/public-icon.svg" alt="public" height={20} width={20} />
          ) : (
              <img src="/icons/private-icon.svg" alt="private" height={20} width={20} />
          )}
          <img src="/icons/down-arrow.svg" alt="drop-down" />
          <div className={styles.dropdownContent}>
            <div className={styles.dropDownItem} onClick={() => setisGlobalContext(true)}>
              <img src="/icons/public-icon.svg" alt="public" height={14} width={14} />
              <p>Genel</p>
            </div>
            <div className={styles.dropDownItem} onClick={() => setisGlobalContext(false)}>
              <img src="/icons/private-icon.svg" alt="private" height={14} width={14} />
              <p>Takip Ettiklerim</p>
            </div>
          </div>
        </div>
        )
        : (<></>)}
      </div>
    );
  }

  function Posts( { authContext , isGlobalContext } ) {
    const router = useRouter();
  
    // request id from backend and show 404 if id doesn't exist
    return (
        <ul>
            {/* map the lists and pass datas to the Post componenent */}
            {dummyPosts.map((post) => (
                <Post
                    key={post.id}
                    postData={post}
                />
            ))}

        </ul>
    );
  }

  function RightSide( {authContext} ) {
    return ((authContext.signIn) ? (
      <ul className={styles.right}>
        <h2 className={styles.followedTitle}>Takip Ettiklerim</h2>
        {followedTeamsOrCommunityList}
      </ul>
    ) : (<></>));
  }

  function FollowedListElement({ data }) {
    return (
      <li className={styles.followedListElement}>
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


  export default function HomePage() {
    const authContext = useContext(AuthContext);
    // Is the context global or followed
    const [isGlobalContext, setisGlobalContext] = useState(true);
      return (
        <div className={styles.page}>
            <Banner isGlobalContext={isGlobalContext} setisGlobalContext={setisGlobalContext} authContext={authContext} />
            <LeftMenu authContext={authContext} />
            <Posts isGlobalContext={isGlobalContext}/>
            <RightSide authContext={authContext} />
        </div>
    );
  }
