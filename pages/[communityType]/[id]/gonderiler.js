import { CommunityProfilePage, Post } from 'components';
import { useRouter } from 'next/router';

export const dummyCommunityPosts = [
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
    date: '7 Ocak, 2021',
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
    date: '7 Ocak, 2021',
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
    date: '7 Ocak, 2021',
    visibility: 'public',
    title: 'Lorem Ipsum Post Title',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue.',
    likeCount: 236,
  },
];

const isManager = false;

export default function Posts() {
  const router = useRouter();

  // request id from backend and show 404 if id doesn't exist

  function onNewPostClicked() {}

  return (
    <CommunityProfilePage>
      {isManager && (
        <button
          className='mainButton'
          onClick={onNewPostClicked}
          style={{ marginTop: '16px', height: '40px', fontSize: '18px' }}
        >
          Yeni Gönderi
        </button>
      )}
      <Post
        postData={
          router.query.communityType === 'topluluklar' ? dummyCommunityPosts[0] : dummyTeamPosts[0]
        }
      />
      <Post
        postData={
          router.query.communityType === 'topluluklar' ? dummyCommunityPosts[1] : dummyTeamPosts[1]
        }
      />
      {router.query.communityType === 'topluluklar' && <Post postData={dummyCommunityPosts[2]} />}
    </CommunityProfilePage>
  );
}
