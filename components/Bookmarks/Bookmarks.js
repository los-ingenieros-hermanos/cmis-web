import styles from './Bookmarks.module.scss';
import { useRouter } from 'next/router';
import { AuthContext } from 'pages/_app';
import { useContext, useEffect, useRef, useState } from 'react';
import { Link, Post } from 'components';
import LeftMenu from 'components/LeftMenu/LeftMenu';
import { dummyCommunity } from 'components/ComunityProfilePage/CommunityProfilePage';
import { dummyCommunityPosts } from 'pages/[communityType]/[id]/gonderiler';

function api(path) {
    // return 'https://cmisbackend.azurewebsites.net/api/' + path;
    return 'http://localhost:8070/api/' + path;
  }
const dummyEvent = {
    title: 'Lorem Ipsum Dummy Event',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue.',
    visibility: 'false',
    event: {
        attendance: true,
        date: {
            year: 2023,
            month: 1,
            day: 3,
        },
    },
    community: {
        id: 1,
        url: '/topluluklar/1',
        image: '/images/placeholder.png',
        user: {
            firstName: 'Dummy Team',
            role: 'ROLE_STUDENT'
        },
    },
    image: '/images/dummy-image.png',
    
};

const dummyPost = {
    title: 'Lorem Ipsum Dummy Post',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue.',
    visibility: 'public',
    event: null,
    community: {
        id: 1,
        url: '/topluluklar/1',
        image: '/images/placeholder.png',
        user: {
            firstName: 'Dummy Team',
            role: 'ROLE_STUDENT'
        },
    },
    image: '/images/placeholder.png',
};

const dummyIdea = {
    title: 'Lorem Ipsum Dummy Idea',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in egestas erat, in aliquet metus. Praesent porta quis nunc eu elerisque. Sed id nulla venenatis tortor euismod imperdiet ac sed augue.',
    visibility: 'public',
    event: null,
    community: {
        id: 1,
        url: '/ogrenciler/1',
        image: '/images/placeholder.png',
        user: {
            firstName: 'Dummy Team',
            role: 'ROLE_STUDENT'
        },
    },
    image: '/images/banner2.png',
    idea: true,
};


export function expired(event) {
    const today = new Date();
    // Hide the event if it is expired (Month takes 0-11) (day +1 because attandance will close at 23:59)
    const eventDate = new Date(event.date.year, event.date.month - 1, event.date.day + 1);
    return today > eventDate;
}

/**
* Hook that alerts clicks outside of the passed ref
*/
export function useOutsideAlerter(ref, setShowUnBookmark) {
   useEffect(() => {
   /**
    * Alert if clicked on outside of element
    */
   function handleClickOutside(event) {
       if (ref.current && !ref.current.contains(event.target)) {
              setShowUnBookmark(false);
       }
   }
   // Bind the event listener
   document.addEventListener("mousedown", handleClickOutside);
   return () => {
       // Unbind the event listener on clean up
       document.removeEventListener("mousedown", handleClickOutside);
   };
   }, [ref]);
}



function Bookmark({post}) {

    const [extendedText, setExtendedText] = useState(false);
    const [willAttend, setWillAttend] = useState(post.event && post.event.attendance);

    // function unBookmarkClicked() {
    //     console.log('Bookmark Removed');
    // }
    
    const wrapperRef = useRef(null);
    const [showUnBookmark, setShowUnBookmark] = useState(false);
    
    function onShowUnBookmarkClicked() {
        setShowUnBookmark(true);
    }

    function unBookmarkClicked() {
        console.log('Bookmark Removed');
        setShowUnBookmark(false);
        // TODO: Remove bookmark from database
    }

    function onWillAttendClicked() {
        setWillAttend(true);
        post.event.attendance = true;
        console.log(post.event.attendance);
    }

    function onWillNotAttendClicked() {
        setWillAttend(false);
        post.event.attendance = false;
        console.log(post.event.attendance);
    }

    useOutsideAlerter(wrapperRef, setShowUnBookmark);

    return (
        <div className={styles.bookmark}>
            {post.image &&
            <div className={styles.image}>
                <img src={post.image} alt="bookmark"/>
            </div>
            }
            <div className={styles.contentflex}>
                <div className={styles.textflex} onClick={() => setExtendedText(!extendedText)}>
                    <div className={styles.title}>
                        <h1> {post.title} </h1>
                    </div>
                    <div className={extendedText ? styles.extendedText : styles.text}>
                        <p> {post.text} </p>
                    </div>
                </div>
                <div className={styles.fromUser}>
                    <Link href={post.community.url}>
                        {post.community.user.firstName}
                    </Link>
                    <p>gönderisinden kaydedildi.</p>
                </div>
                <div className={styles.buttons}>
                    {post.event &&  // If post is an event
                        (expired(post.event) ?
                            <button className={styles.buttonExpired} disabled>Süresi Dolmuş</button>
                        :
                        (willAttend ? 
                            <button className={styles.button} onClick={onWillNotAttendClicked}>Katıldın</button> :
                            <button className={styles.button} onClick={onWillAttendClicked}>Takvime Ekle</button>
                            
                        ))
                    }
                    {post.idea &&
                        <Link href={post.community.url}>
                            <button className={styles.button}>İletişim Kur</button>
                        </Link>
                    }
                    <div className={styles.unBookmark} ref={wrapperRef}>
                        <button className={styles.hiddenButton} onClick={onShowUnBookmarkClicked}>· · ·</button>
                        {showUnBookmark &&
                            <div className={styles.dropdown} onClick={unBookmarkClicked}>
                                <div className={styles.items}>
                                    <img src="/icons/remove-bookmark.svg" alt="kaydedilenlerden çıkar"/>
                                    <p>Kaydedilenlerden Çıkar</p>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}


export const Bookmarks = () => {
    const authContext = useContext(AuthContext);     

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
                <Bookmark post={dummyEvent}/>
                <Bookmark post={dummyPost}/>
                <Bookmark post={dummyIdea}/>
                <Bookmark post={dummyEvent}/>
                <Bookmark post={dummyEvent}/>
                <Bookmark post={dummyEvent}/>
                <Bookmark post={dummyEvent}/>
                <Bookmark post={dummyEvent}/>
            </div>
        </>
    );
}

// Path: components\Bookmarks\Bookmarks.module.css
