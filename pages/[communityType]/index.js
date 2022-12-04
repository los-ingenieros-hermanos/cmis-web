import styles from 'styles/Communities.module.scss';
import { Link, Tabs } from 'components';
import Custom404 from 'pages/404';
import { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';

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

function getHref(data) {
  return `/${data.type}/${data.id}`;
}

const mainCommunitiesList = Array(9).fill(<MainListElement data={dummyCommunity} />);
const followedCommunitiesList = Array(4).fill(<FollowedListElement data={dummyCommunity} />);

const mainTeamsList = Array(9).fill(<MainListElement data={dummyTeam} />);
const followedTeamsList = Array(4).fill(<FollowedListElement data={dummyTeam} />);

function MainListElement({ data }) {
  const [isFollowed, setIsFollowed] = useState(data.isFollowed);

  function onFollowClicked() {
    setIsFollowed((oldIsFollowed) => !oldIsFollowed);
  }

  return (
    <li className={styles.mainListElement}>
      <img className={styles.banner} src={data.bannerSrc} alt='banner' />
      <img className={styles.pfp} src={data.pfpSrc} alt='profile picture' />
      <h2>{data.name}</h2>
      <p>{data.description}</p>
      <div className={styles.buttons}>
        <button
          onClick={onFollowClicked}
          className={clsx('mainButton', isFollowed && 'mainButtonNegative')}
        >
          {isFollowed ? 'Takipten Çık' : 'Takip Et'}
        </button>
        <Link href={getHref(data)}>Profile Git {'>'}</Link>
      </div>
    </li>
  );
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

export default function Communities() {
  const router = useRouter();
  const [communityType, setCommunityType] = useState('');

  useEffect(() => {
    if (router.query.communityType === 'topluluklar') {
      setCommunityType('topluluklar');
    } else if (router.query.communityType === 'takimlar') {
      setCommunityType('takimlar');
    } else {
      setCommunityType('other');
    }
  }, [router.query.communityType]);

  return communityType === 'other' ? (
    <Custom404 />
  ) : (
    <div className={styles.tabsAndMainList}>
      <Tabs
        height={40}
        tabs={[
          { name: 'Topluluklar', url: '/topluluklar' },
          { name: 'Takımlar', url: '/takimlar' },
        ]}
      />
      <ul className={styles.mainList}>
        {communityType === 'topluluklar' ? mainCommunitiesList : mainTeamsList}
        <div className={styles.followedPanel}>
          <h2 className={styles.followedTitle}>Takip Ettiklerim</h2>
          {communityType === 'topluluklar' ? followedCommunitiesList : followedTeamsList}
        </div>
      </ul>
    </div>
  );
}
