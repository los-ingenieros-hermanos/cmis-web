import styles from './CommunityProfilePage.module.scss';
import { Tabs, Link, Post } from 'components';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { AuthContext } from 'pages/_app';

export const dummyCommunity = {
  id: 'xRTtShHBupaYOvugN0Bvp',
  name: 'GTÜ Bilgisayar Topluluğu',
  pfpSrc: '/images/pfp1.png',
  bannerSrc: '/images/banner1.png',
  bannerBgColor: '#000000',
  description:
    'Community description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue.',
  tags: ['bilim', 'teknoloji', 'sanat', 'doğa', 'elektronik', 'spor', 'denizcilik'],
  followerCount: 0,
  memberCount: 0,
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

const isManager = true;

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
  const authContext = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [descriptionHeight, setDescriptionHeight] = useState();

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

  function onFollowClicked() {
    setData((oldData) => {
      const newData = { ...oldData };
      newData.isFollowed = !newData.isFollowed;
      let method;
      if (newData.isFollowed) {
        method = 'POST';
        newData.followerCount++;
      } else {
        method = 'DELETE';
        newData.followerCount--;
      }
      fetch(`http://localhost:8070/api/cmis/communities/${router.query.id}/followers`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: authContext.userData.id }),
      });
      console.log(JSON.stringify({ id: authContext.userData.id }));
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

  useEffect(() => {
    setIsEditing(false);
  }, [data]);

  function onDescriptionTextareaChanged(e) {
    setEditData((oldEditData) => ({ ...oldEditData, description: e.target.value }));
  }

  function onEditClicked() {
    setIsEditing(true);
  }

  function onCancelClicked() {
    setIsEditing(false);
  }

  function onSaveClicked() {
    setIsEditing(false);
    authContext.updateCommunityData({ id: router.query.id, info: editData.description });
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
          fontSize='20px'
          padding='5px'
          tabs={[
            { name: 'Gönderiler', url: `${profilePath}/gonderiler` },
            { name: 'Yaklaşan Etkinlikler', url: `${profilePath}/yaklasan-etkinlikler` },
            isManager ? { name: 'Yönetim', url: `${profilePath}/yonetim` } : undefined,
          ].filter(Boolean)}
        />
        {children}
        <div className={styles.infoPanel}>
          {isManager && !isEditing ? (
            <button className={styles.editBtn} onClick={onEditClicked}>
              <img src='/icons/edit-icon.svg' alt='düzenle' />
            </button>
          ) : (
            <div className={styles.editConfirmationButtons}>
              <button className='mainButton mainButtonNeutral' onClick={onCancelClicked}>
                Vazgeç
              </button>
              <button className='mainButton' onClick={onSaveClicked}>
                Kaydet
              </button>
            </div>
          )}
          <div className={styles.btnFlex}>
            {!isManager && (
              <button className={clsx('mainButton', data.isFollowed && 'mainButtonNegative')} onClick={onFollowClicked}>
                {data.isFollowed ? 'Takibi Bırak' : 'Takip Et'}
              </button>
            )}
            <p className='bold'>{data.followerCount} Takipçi</p>
          </div>
          <div className={styles.btnFlex}>
            {!isManager && (
              <button className={clsx('mainButton', data.isMember && 'mainButtonNegative')} onClick={onApplyClicked}>
                {data.isMember ? 'Üyelikten Çık' : 'Üye Ol'}
              </button>
            )}
            <p className='bold'>{data.memberCount} Üye</p>
          </div>
          {!isEditing ? (
            <p
              ref={(el) => {
                if (el) {
                  setDescriptionHeight(el.getBoundingClientRect().height);
                }
              }}
            >
              {data.description}
            </p>
          ) : (
            <textarea
              style={{ height: descriptionHeight }}
              ref={(el) => {
                if (el) {
                  el.value = data.description;
                }
              }}
              onChange={onDescriptionTextareaChanged}
            ></textarea>
          )}
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
