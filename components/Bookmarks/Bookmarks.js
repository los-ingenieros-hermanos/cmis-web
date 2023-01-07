import styles from './Bookmarks.module.scss';
import { AuthContext } from 'pages/_app';
import { useContext, useEffect, useRef, useState } from 'react';
import { Link, Post } from 'components';
import LeftMenu from 'components/LeftMenu/LeftMenu';



export const Bookmarks = () => {
    const authContext = useContext(AuthContext);
    const [bookmarks, setBookmarks] = useState();

    useEffect(() => {
        (async () => {
            if (authContext.userData) {
                const reqData = await Promise.all([
                    authContext.getBookmarkedProjectIdeas(),
                    authContext.getBookmarkedPosts(),
                ]);
                const posts = reqData[0];
                posts.push(...reqData[1]);
                // sort by id
                posts.sort((a, b) => b.id - a.id);
                console.log(posts);
                setBookmarks(posts.map((post) => <Post key={post.id} id={post.id} eventId={post.eventId} isProjectIdea={post?.student} isBookmark={true}/>));
            }
        }
        )()
    }, [authContext.userData]); 

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
}

// Path: components\Bookmarks\Bookmarks.module.css
