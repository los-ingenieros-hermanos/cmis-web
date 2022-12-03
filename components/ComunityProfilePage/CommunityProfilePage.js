import styles from './CommunityProfilePage.module.scss';
import { Tabs, Link, Post } from 'components';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export const dummyCommunity = {
  id: 'xRTtShHBupaYOvugN0Bvp',
  name: 'GTÜ Bilgisayar Topluluğu',
  pfpSrc: '/images/pfp1.png',
  bannerSrc: '/images/banner1.png',
  bannerBgColor: '#000000',
  description:
    'Community description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue.',
  tags: ['bilim', 'teknoloji', 'sanat', 'doğa', 'elektronik', 'spor', 'denizcilik'],
  followerCount: 1234,
  memberCount: 123,
  isFollowed: false,
  isMember: false,
};

export const dummyTeam = {
  id: 'Jz4rdsWpk2xZYan86a6kW',
  name: 'Doğa Takımı',
  pfpSrc: '/images/pfp4.png',
  bannerSrc: '/images/banner2.png',
  bannerBgColor: '#1d5525',
  description:
    'Community description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue.',
  tags: ['bilim', 'teknoloji', 'sanat', 'doğa', 'elektronik', 'spor', 'denizcilik'],
  followerCount: 1234,
  memberCount: 123,
  isFollowed: false,
  isMember: false,
};

const isManager = false;

function Tag({ children }) {
  return (
    <Link className={styles.tag} href='#'>
      {children}
    </Link>
  );
}

export default function CommunityProfilePage({ children }) {
  const router = useRouter();
  const [data, setData] = useState({});
  const [profilePath, setProfilePath] = useState('');

  useEffect(() => {
    // fetch data with id from backend
    if (router.query.id === 'xRTtShHBupaYOvugN0Bvp') {
      setData({ ...dummyCommunity });
    } else if (router.query.id === 'Jz4rdsWpk2xZYan86a6kW') {
      setData({ ...dummyTeam });
    }
  }, [router.query.id]);

  useEffect(() => {
    setProfilePath(`/${router.query.communityType}/${router.query.id}`);
  }, [router.query.communityType, router.query.id]);

  function onEditClicked() {}

  function onFollowClicked() {
    setData((oldData) => {
      const newData = { ...oldData };
      newData.isFollowed = !newData.isFollowed;
      if (newData.isFollowed) {
        // send follow post request
        newData.followerCount++;
      } else {
        // send unfollow post request
        newData.followerCount--;
      }
      return newData;
    });
  }

  function onApplyClicked() {
    setData((oldData) => {
      const newData = { ...oldData };
      newData.isMember = !newData.isMember;
      if (newData.isMember) {
        // open application modal
        newData.memberCount++;
      } else {
        // send leave post request
        newData.memberCount--;
      }
      return newData;
    });
  }

  function onSendMessageClicked() {
    // open modal to send message
  }

  return (
    <div className={styles.page}>
      <div className={styles.bannerBg} style={{ backgroundColor: data.bannerBgColor }}>
        <img src={data.bannerSrc} className={styles.banner} alt='banner' />
      </div>
      <img src={data.pfpSrc} className={styles.pfp} alt='profile picture' />
      <h1>{data.name ?? 'Community'}</h1>
      <div className={styles.content}>
        <Tabs
          height={40}
          tabs={[
            { name: 'Gönderiler', url: `${profilePath}/gonderiler` },
            { name: 'Yaklaşan Etkinlikler', url: `${profilePath}/yaklasan-etkinlikler` },
            isManager ? { name: 'Yönetim', url: `${profilePath}/yonetim` } : undefined,
          ].filter(Boolean)}
        />
        {children}
        <div className={styles.infoPanel}>
          {isManager && (
            <button className={styles.editBtn} onClick={onEditClicked}>
              <img src='/icons/edit-icon.svg' alt='düzenle' />
            </button>
          )}
          <div className={styles.btnFlex}>
            {!isManager && (
              <button
                className={clsx('mainButton', data.isFollowed && 'mainButtonNegative')}
                onClick={onFollowClicked}
              >
                {data.isFollowed ? 'Takibi Bırak' : 'Takip Et'}
              </button>
            )}
            <p className='bold'>{data.followerCount} Takipçi</p>
          </div>
          <div className={styles.btnFlex}>
            {!isManager && (
              <button
                className={clsx('mainButton', data.isMember && 'mainButtonNegative')}
                onClick={onApplyClicked}
              >
                {data.isMember ? 'Üyelikten Çık' : 'Üye Ol'}
              </button>
            )}
            <p className='bold'>{data.memberCount} Üye</p>
          </div>
          <p>{data.description}</p>
          <div className={styles.tagsFlex}>
            <p className='bold'>Etiketler:</p>
            {data.tags && data.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
          </div>
          {!isManager && (
            <button className='mainButton' onClick={onSendMessageClicked}>
              Mesaj Gönder
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
