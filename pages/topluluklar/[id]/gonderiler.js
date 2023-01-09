import { CommunityProfilePage, NewPost, Post } from 'components';
import { useRouter } from 'next/router';
import { AuthContext } from 'pages/_app';
import { useContext, useEffect, useState } from 'react';
import styles from 'styles/Management.module.scss';

function VisibilityDropdown({ isGlobalContext, setisGlobalContext, isManager }) {
  return (
    <div className={styles.visibilityDropdown} style={isManager ? { top: '112px' } : undefined}>
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
    </div>
  );
}

export default function Posts() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [posts, setPosts] = useState();
  const [isManager, setIsManager] = useState();
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [isGlobalContext, setisGlobalContext] = useState(true);

  useEffect(() => {
    (async () => {
      let postsData;
      if (isGlobalContext) {
        postsData = await authContext.getCommunityPosts(router.query.id);
      } else {
        postsData = await authContext.getPrivateCommunityPosts(router.query.id);
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
  }, [authContext, isGlobalContext, router.query.id]);

  useEffect(() => {
    (async () => {
      let isAuthorizedMember = false;
      if (!authContext.userData?.isCommunity) {
        isAuthorizedMember = await authContext.isAuthorizedMember(router.query.id);
      }
      setIsManager(authContext.userData?.id == router.query.id || isAuthorizedMember);
    })();
  }, [authContext, router.query.id]);

  function onPostDeleted(postId) {
    setPosts((oldPosts) => oldPosts.filter((post) => post.key != postId));
  }

  function onNewPostClicked() {
    setIsNewPostOpen(true);
  }

  function onPostSent(newPostData) {
    setPosts((oldPosts) => {
      const newPosts = [...oldPosts];
      newPosts.unshift(<Post key={newPostData.id} id={newPostData.id} onPostDeleted={onPostDeleted} />);
      return newPosts;
    });
  }

  return (
    <CommunityProfilePage>
      {isManager && (
        <>
          {isNewPostOpen ? (
            <NewPost setIsNewPostOpen={setIsNewPostOpen} onPostSent={onPostSent} />
          ) : (
            <button
              className='mainButton'
              onClick={onNewPostClicked}
              style={{ marginTop: '16px', height: '40px', fontSize: '18px' }}
            >
              Yeni Gönderi
            </button>
          )}
        </>
      )}
      <>
        {posts?.length > 0 && (
          <VisibilityDropdown
            isGlobalContext={isGlobalContext}
            setisGlobalContext={setisGlobalContext}
            isManager={isManager}
          />
        )}
        {!posts || posts.length > 0 || isManager ? posts : <p className='noPosts'>Gönderi yok</p>}
      </>
    </CommunityProfilePage>
  );
}
