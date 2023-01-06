import { CommunityProfilePage, NewPost, Post } from 'components';
import { useRouter } from 'next/router';
import { AuthContext } from 'pages/_app';
import { useContext, useEffect, useState } from 'react';

export default function Posts() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [posts, setPosts] = useState();
  const [isManager, setIsManager] = useState();
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const postsData = await authContext.getCommunityPosts(router.query.id);
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
  }, [authContext, router.query.id]);

  useEffect(() => {
    (async () => {
      setIsManager(authContext.userData?.id == router.query.id);
    })();
  }, [authContext.userData?.id, router.query.id]);

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
      {posts}
    </CommunityProfilePage>
  );
}
