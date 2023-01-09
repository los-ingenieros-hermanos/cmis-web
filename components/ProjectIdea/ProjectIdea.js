import { Link, Post } from 'components';
import { AuthContext } from 'pages/_app';
import { useContext, useEffect, useState } from 'react';
import styles from './ProjectIdea.module.scss';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
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
      setIsLoading(false);
    })();
  }, [authContext]);

  function onPostDeleted(postId) {
    setPosts((oldPosts) => oldPosts.filter((post) => post.key != postId));
  }

  return isLoading ? (
    <div className='postsLoader mainLoader'></div>
  ) : (
    <ul>{posts.length > 0 ? posts : <p className='noPosts'>Askıda proje yok</p>}</ul>
  );
}

function RightSide() {
  const authContext = useContext(AuthContext);
  const [userHasIdeaList, setUserHasIdeaList] = useState([]);
  useEffect(() => {
    (async () => {
      const userHasIdeaListData = await authContext.getStudentsHasProjectIdea();
      // delete duplicated users
      const filteredList = userHasIdeaListData?.filter((data, index) => {
        return userHasIdeaListData.findIndex((d) => d.id === data.id) === index;
      });
      if (filteredList) {
        setUserHasIdeaList(filteredList.map((data) => <UserHasIdeaListElement key={data.user.id} data={data} />));
      }
    })();
  }, [authContext]);

  return (
    <ul className={styles.right}>
      <h2 className={styles.followedTitle}>Askıda Projesi Olanlar</h2>
      {userHasIdeaList}
    </ul>
  );
}

function UserHasIdeaListElement({ data }) {
  return (
    <li className={styles.userHasIdeaListElement}>
      <Link href={getHref(data)}>
        <img
          src={
            data?.image ??
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88OjpfwAI+QOoF8YQhgAAAABJRU5ErkJggg=='
          }
          alt='profile picture'
        />
      </Link>
      <Link href={getHref(data)}>{data.user.firstName + ' ' + data.user.lastName} </Link>
    </li>
  );
}

function getHref(data) {
  return `/ogrenciler/${data.id}`;
}

export default function ProjectIdea() {
  return (
    <div className={styles.page}>
      <Banner />
      <Posts />
      <RightSide />
    </div>
  );
}
