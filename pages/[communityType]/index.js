import styles from 'styles/Communities.module.scss';
import { Link, Tabs } from 'components';
import Custom404 from 'pages/404';
import { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { api, AuthContext } from 'pages/_app';

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
  const type = data.user.roles[0].name === 'ROLE_COMMUNITY' ? 'topluluklar' : 'takimlar';
  return `/${type}/${data.id}`;
}

function CommunitiesListElement({ data }) {
  const [isFollowed, setIsFollowed] = useState(data.isFollowed);

  function onFollowClicked() {
    setIsFollowed((oldIsFollowed) => !oldIsFollowed);
  }

  return (
    <li className={styles.mainListElement}>
      <img className={styles.banner} src={`data:image/png;base64, ${data.banner}`} alt='banner' />
      <img className={styles.pfp} src={`data:image/png;base64, ${data.image}`} alt='profile picture' />
      <h2>{data.user.firstName}</h2>
      <p>{data.info}</p>
      <div className={styles.buttons}>
        <button onClick={onFollowClicked} className={clsx('mainButton', isFollowed && 'mainButtonNegative')}>
          {isFollowed ? 'Takipten Çık' : 'Takip Et'}
        </button>
        <Link href={getHref(data)}>Profile Git {'>'}</Link>
      </div>
    </li>
  );
}

function FollowedCommunitiesListElement({ data }) {
  return (
    <li className={styles.followedListElement}>
      <Link href={getHref(data)}>
        <img src={`data:image/png;base64, ${data.image}`} alt='profile picture' />
      </Link>
      <Link href={getHref(data)}>{data.name}</Link>
    </li>
  );
}

export default function Communities() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [communitiesList, setCommunitiesList] = useState([]);
  const [followedCommunitiesList, setFollowedCommunitiesList] = useState([]);

  useEffect(() => {
    (async () => {
      let mainCommunities;
      let followedCommunities;

      if (router.query.communityType === 'topluluklar') {
        // send backend topluluklar as type
        mainCommunities = await authContext.getCommunities();
        if (authContext.userData?.roles[0] === 'ROLE_STUDENT') {
          followedCommunities = await authContext.getFollowedCommunities(authContext.userData.id);
        }
      } else if (router.query.communityType === 'takimlar') {
        // send backend takımlar as type
        mainCommunities = await authContext.getCommunities();
        if (authContext.userData?.roles[0] === 'ROLE_STUDENT') {
          followedCommunities = await authContext.getFollowedCommunities(authContext.userData.id);
        }
      }

      setCommunitiesList(
        mainCommunities?.map((community) => <CommunitiesListElement key={community.id} data={community} />),
      );
      setFollowedCommunitiesList(
        followedCommunities?.map((community) => <FollowedCommunitiesListElement key={community.id} data={community} />),
      );
    })();
  }, [authContext, router.query.communityType]);

  return router.query.communityType !== 'topluluklar' && router.query.communityType !== 'takimlar' ? (
    <Custom404 />
  ) : (
    <div className={styles.tabsAndMainList}>
      <Tabs
        fontSize='20px'
        padding='5px'
        tabs={[
          { name: 'Topluluklar', url: '/topluluklar' },
          { name: 'Takımlar', url: '/takimlar' },
        ]}
      />
      <ul className={styles.mainList}>
        {communitiesList}
        {authContext.userData?.roles[0] === 'ROLE_STUDENT' && (
          <div className={styles.followedPanel}>
            <h2 className={styles.followedTitle}>Takip Ettiklerim</h2>
            {followedCommunitiesList}
          </div>
        )}
      </ul>
    </div>
  );
}
