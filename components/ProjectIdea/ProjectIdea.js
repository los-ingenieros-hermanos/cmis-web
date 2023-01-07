import styles from './ProjectIdea.module.scss';
import { Tabs, Link, Post } from 'components';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { AuthContext } from 'pages/_app';
import LeftMenu from 'components/LeftMenu/LeftMenu';

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
  

  function Banner() {
    return (
      <div className={styles.banner}>
        <Link href={'/askida-proje'}> Askıda Projeler </Link>
      </div>
    );
  }

  function Posts() {
    const authContext = useContext(AuthContext);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
      (async () => {
        const postsData = await authContext.getProjectIdeas();
        if (postsData) {
          // sort by likeNum
          postsData.sort((a, b) => b.likeNum - a.likeNum);          
          setPosts(
            postsData.map((postData) => (
              <Post key={postData.id} id={postData.id} isProjectIdea={true} onPostDeleted={onPostDeleted} />
            )),
          );
        }
      })();
    }, [authContext]);

    function onPostDeleted(postId) {
      setPosts((oldPosts) => oldPosts.filter((post) => post.key != postId));
    }
    
    return (
        <ul>
            {posts}
        </ul>
    );
  }

  function RightSide( ) {
    return (
      <ul className={styles.right}>
        <h2 className={styles.followedTitle}>Askıda Projesi Olanlar</h2>
        {UserHasIdeaListElementList}
      </ul>
    );
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
      return (
        <div className={styles.page}>
            <Banner />
            <LeftMenu />
            <Posts />
            <RightSide />
        </div>
    );
  }
