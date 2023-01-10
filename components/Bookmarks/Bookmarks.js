import { Post } from 'components';
import LeftMenu from 'components/LeftMenu/LeftMenu';
import { ApiContext } from 'pages/_app';
import { useContext, useEffect, useState } from 'react';
import styles from './Bookmarks.module.scss';

export const Bookmarks = () => {
  const apiContext = useContext(ApiContext);
  const [bookmarks, setBookmarks] = useState();

  useEffect(() => {
    (async () => {
      if (apiContext.userData) {
        const reqData = await Promise.all([apiContext.getBookmarkedProjectIdeas(), apiContext.getBookmarkedPosts()]);
        const posts = reqData[0];
        posts.push(...reqData[1]);
        // sort by id
        posts.sort((a, b) => b.id - a.id);
        setBookmarks(
          posts.map((post) => (
            <Post key={post.id} id={post.id} eventId={post.eventId} isProjectIdea={post?.student} isBookmark={true} />
          )),
        );
      }
    })();
  }, [apiContext.userData]);

  return (
    <>
      <div className={styles.leftMenuPanel}></div>
      <LeftMenu />

      <div className={styles.content}>
        <div className={styles.banner}>
          <div className={styles.bannerText}>
            <h1>Kaydedilenler</h1>
          </div>
        </div>
        {bookmarks}
      </div>
    </>
  );
};

// Path: components\Bookmarks\Bookmarks.module.css
