import styles from './HomePage.module.scss';
import { Link, Post } from 'components';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from 'pages/_app';
import LeftMenu from 'components/LeftMenu/LeftMenu';

  function Banner({ isGlobalContext, setisGlobalContext, authContext }) {
    return (
      <div className={styles.banner}>
        <Link href={'/'}> Anasayfa </Link>
        {authContext.userData && !authContext.userData?.isCommunity ? (
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
              <p>Üye</p>
            </div>
          </div>
        </div>
        )
        : (<></>)}
      </div>
    );
  }

  function Posts( { isGlobalContext } ) {
    const authContext = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    
    useEffect(() => {
      (async () => {
        let postsData = [];
        if (isGlobalContext) {
           postsData = await authContext.getGlobalPosts();
          //  if user is community
          if (authContext.userData?.isCommunity) {
            const privatePosts = await authContext.getPrivateCommunityPosts(authContext.userData.id);
            // append private posts to global posts if length is not 0
            if (privatePosts != null) {
              postsData = postsData.concat(privatePosts);
            }
          }
          else {
            const memberCommunityPosts = await authContext.getMemberCommunityPosts();
            // append member community posts to global posts if length is not 0
            if (memberCommunityPosts != null) {
              postsData = postsData.concat(memberCommunityPosts);
            }
          }
        } else {
          //  remove posts that user not the member of the community
           postsData = await authContext.getMemberCommunityPosts();
        }
        if (postsData) {
          postsData.reverse();
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
        }
      })();
    }, [authContext, isGlobalContext]);

    function onPostDeleted(postId) {
      setPosts((oldPosts) => oldPosts.filter((post) => post.key != postId));
    }

    return (
        <ul>
          {posts}
        </ul>
    );
  }

  function RightSide( {authContext} ) {
  const [followedCommunitiesList, setFollowedCommunitiesList] = useState([]);
  useEffect(() => {
    (async () => {
      const followedCommunities = await authContext.getFollowedCommunities();

      setFollowedCommunitiesList(
        followedCommunities?.map((community) => <FollowedCommunitiesListElement key={community.id} data={community} />),
      );
    })();
  }, [authContext]);
  
    return ((authContext.signIn) ? (
      <ul className={styles.right}>
        <h2 className={styles.followedTitle}>Takip Ettiklerim</h2>
        {followedCommunitiesList}
      </ul>
    ) : (<></>));
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
    const authContext = useContext(AuthContext);
    // Is the context global or followed
    const [isGlobalContext, setisGlobalContext] = useState(true);
      return (
        <div className={styles.page}>
            <Banner isGlobalContext={isGlobalContext} setisGlobalContext={setisGlobalContext} authContext={authContext} />
            <LeftMenu />
            <Posts isGlobalContext={isGlobalContext}/>
            <RightSide authContext={authContext} />
        </div>
    );
  }
