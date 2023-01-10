import { Link, Post } from 'components';
import { ApiContext } from 'pages/_app';
import { useContext, useEffect, useState } from 'react';
import styles from './HomePage.module.scss';

function Banner({ isGlobalContext, setisGlobalContext, apiContext }) {
  return (
    <div className={styles.banner}>
      <Link href={'/'}> Anasayfa </Link>
      {apiContext.userData && !apiContext.userData?.isCommunity ? (
        <div className={styles.dropdown}>
          {isGlobalContext ? (
            <img src='/icons/public-icon.svg' alt='public' height={20} width={20} />
          ) : (
            <img src='/icons/private-icon.svg' alt='private' height={20} width={20} />
          )}
          <img src='/icons/down-arrow.svg' alt='drop-down' />
          <div className={styles.dropdownContent}>
            <div className={styles.dropDownItem} onClick={() => setisGlobalContext(true)}>
              <img src='/icons/public-icon.svg' alt='public' height={14} width={14} />
              <p>Genel</p>
            </div>
            <div className={styles.dropDownItem} onClick={() => setisGlobalContext(false)}>
              <img src='/icons/private-icon.svg' alt='private' height={14} width={14} />
              <p>Üye</p>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

function Posts({ isGlobalContext }) {
  const apiContext = useContext(ApiContext);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      let postsData = [];
      if (isGlobalContext) {
        postsData = await apiContext.getGlobalPosts();
        //  if user is community
        if (apiContext.userData?.isCommunity) {
          const privatePosts = await apiContext.getPrivateCommunityPosts(apiContext.userData.id);
          // append private posts to global posts if length is not 0
          if (privatePosts != null) {
            postsData = postsData.concat(privatePosts);
          }
        } else {
          const memberCommunityPosts = await apiContext.getMemberCommunityPosts();
          // append member community posts to global posts if length is not 0
          if (memberCommunityPosts != null) {
            postsData = postsData.concat(memberCommunityPosts);
          }
        }
      } else {
        //  remove posts that user not the member of the community
        postsData = await apiContext.getMemberCommunityPosts();
      }
      if (postsData) {
        // sort by id
        postsData.sort((a, b) => b.id - a.id);
        setPosts(
          postsData.map((postData) => (
            <Post
              key={postData.id}
              id={postData.id}
              eventId={postData.event[0] && postData.event[0].id}
              onPostDeleted={onPostDeleted}
            />
          )),
        );
      } else {
        setPosts([]);
      }
      setIsLoading(false);
    })();
  }, [apiContext, isGlobalContext]);

  function onPostDeleted(postId) {
    setPosts((oldPosts) => oldPosts.filter((post) => post.key != postId));
  }

  return isLoading ? (
    <div className='postsLoader mainLoader'></div>
  ) : (
    <ul>{posts.length > 0 ? posts : <p className='noPosts'>Gönderi yok</p>}</ul>
  );
}

function RightSide({ apiContext }) {
  const [followedCommunitiesList, setFollowedCommunitiesList] = useState([]);
  useEffect(() => {
    (async () => {
      const followedCommunities = await apiContext.getFollowedCommunities();

      setFollowedCommunitiesList(
        followedCommunities?.map((community) => <FollowedCommunitiesListElement key={community.id} data={community} />),
      );
    })();
  }, [apiContext]);

  return apiContext.signIn ? (
    <ul className={styles.right}>
      <h2 className={styles.followedTitle}>Takip Ettiklerim</h2>
      {followedCommunitiesList}
    </ul>
  ) : (
    <></>
  );
}

function FollowedCommunitiesListElement({ data }) {
  return (
    <li className={styles.followedListElement}>
      <Link href={getHref(data)}>
        <img
          src={
            data?.image ??
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88OjpfwAI+QOoF8YQhgAAAABJRU5ErkJggg=='
          }
          alt='profile picture'
        />
      </Link>
      <Link href={getHref(data)}>{data.user.firstName}</Link>
    </li>
  );
}

function getHref(data) {
  return `/topluluklar/${data.id}`;
}

export default function HomePage() {
  const apiContext = useContext(ApiContext);
  // Is the context global or followed
  const [isGlobalContext, setisGlobalContext] = useState(true);
  return (
    <div className={styles.page}>
      <Banner isGlobalContext={isGlobalContext} setisGlobalContext={setisGlobalContext} apiContext={apiContext} />
      <Posts isGlobalContext={isGlobalContext} />
      <RightSide apiContext={apiContext} />
    </div>
  );
}
