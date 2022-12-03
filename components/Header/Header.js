import styles from './Header.module.scss';
import { Link } from 'components';
import clsx from 'clsx';
import { useState } from 'react';
import { HeaderTab } from 'components';
import Login from 'components/LoginRegister/Login/Login';
import Register from 'components/LoginRegister/Register/Register';

export default function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);


  function onLogInClicked() {
    setIsLoginOpen(!isLoginOpen);
    setIsSignUpOpen(false);
  }

  function onSignUpClicked() {
    setIsSignUpOpen(!isSignUpOpen);
    setIsLoginOpen(false);
  }

  
  // Arrow function to close the login/register modal
  const closeLoginRegister = () => {
    setIsLoginOpen(false);
    setIsSignUpOpen(false);
  }

  

  function onBookmarksClicked() {}

  function onDmClicked() {}

  function onProfileClicked() {
    setIsLoggedIn(false);
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <ul className={styles.tabFlex}>
          <HeaderTab
            pathnames={['/']}
            iconPath='/icons/home-icon.svg'
            activeIconPath='/icons/home-icon-active.svg'
            alt='ana sayfa'
          />
          <HeaderTab
            pathnames={['/yaklasan-etkinlikler']}
            iconPath='/icons/events-icon.svg'
            activeIconPath='/icons/events-icon-active.svg'
            alt='etkinlikler'
          />
          <HeaderTab
            pathnames={['/topluluklar', '/takimlar']}
            iconPath='/icons/communities-icon.svg'
            activeIconPath='/icons/communities-icon-active.svg'
            alt='topluluklar'
          />
          <HeaderTab
            pathnames={['/askida-proje']}
            iconPath='/icons/project-ideas-icon.svg'
            activeIconPath='/icons/project-ideas-icon-active.svg'
            alt='askıda proje'
          />
        </ul>
      </nav>
      <div className={styles.flex1}>
        <h1>
          <Link className={styles.logo} href='/'>
            cmis
          </Link>
        </h1>
        <input className={styles.searchBar} type='text' placeholder="cmis'te ara" />
      </div>
      <div className={styles.flex2}>
        {!isLoggedIn ? (
            <>
            <button className={styles.loginBtn} onClick={onLogInClicked}>
              Giriş
            </button>
            <button className={styles.loginBtn} onClick={onSignUpClicked}>
              Kayıt Ol
            </button>
            
            {isLoginOpen ? (
            <Login setIsLoggedIn={setIsLoggedIn} />
            ) : null}

            {isSignUpOpen ? (
              <Register setIsSignedUp={setIsSignedUp} setIsLoggedIn={setIsLoggedIn} />
            ) : null}
          </>
        ) : (
          <>
            <button
              className={clsx(styles.bookmarksBtn, 'centerVertically')}
              onClick={onBookmarksClicked}
            >
              <img src='/icons/bookmarks-icon.svg' alt='bookmarks' />
            </button>
            <button className={clsx(styles.dmBtn, 'centerVertically')} onClick={onDmClicked}>
              <img src='/icons/dm-icon.svg' alt='dm' />
            </button>
            <button
              className={clsx(styles.profileBtn, 'centerVertically')}
              onClick={onProfileClicked}
            >
              <img src='/images/pfp1.png' alt='dm' />
            </button>         
          </>
        )}
        


      </div>
    </header>
  );
}
