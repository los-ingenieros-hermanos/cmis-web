import styles from './CommunitiesPage.module.scss';
import { Link, ListSidebar, Tabs } from 'components';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { nanoid } from 'nanoid';

const dummyCommunity = {
  name: 'GTÜ Bilgisayar Topluluğu',
  pfpSrc: '/images/pfp1.png',
  bannerSrc: '/images/banner1.png',
  description:
    'Community description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue.',
  isFollowed: false,
};

const dummyTeam = {
  name: 'Doğa Takımı',
  pfpSrc: '/images/pfp4.png',
  bannerSrc: '/images/banner2.png',
  description:
    'Community description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue.',
  isFollowed: false,
};

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
      <div className={styles.banner} style={{ backgroundImage: `url(${data.bannerSrc})` }}></div>
      <div className={styles.pfp} style={{ backgroundImage: `url(${data.pfpSrc})` }}></div>
      <h2>{data.name}</h2>
      <p>{data.description}</p>
      <div className={styles.buttons}>
        <button onClick={onFollowClicked} className={clsx(isFollowed && styles.followed)}>
          {isFollowed ? 'Takipten Çık' : 'Takip Et'}
        </button>
        <Link href='#'>Profile Git {'>'}</Link>
      </div>
    </li>
  );
}

function FollowedListElement({ data }) {
  return (
    <li className={styles.followedListElement}>
      <Link href='#'>
        <Image src={data.pfpSrc} width='40px' height='40px' alt='profile picture' />
      </Link>
      <Link href='#'>{data.name}</Link>
    </li>
  );
}

export default function CommunitiesPage({ pageName }) {
  const isCommunities = pageName === 'topluluklar';

  return (
    <div className={styles.tabsAndMainList}>
      <Tabs
        height={40}
        tabs={[
          { name: 'Topluluklar', url: '/topluluklar', active: isCommunities },
          { name: 'Takımlar', url: '/takımlar', active: !isCommunities },
        ]}
      />
      <ul className={styles.mainList}>{isCommunities ? mainCommunitiesList : mainTeamsList}</ul>
      <ListSidebar
        title='Takip Ettiklerim'
        items={isCommunities ? followedCommunitiesList : followedTeamsList}
      />
    </div>
  );
}
