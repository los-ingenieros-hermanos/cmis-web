import styles from './Header.module.scss';
import { Link } from 'components';
import Image from 'next/image';
import clsx from 'clsx';
import { useState } from 'react';
import { HeaderTab } from 'components';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function onLogInClicked() {
    setIsLoggedIn(true);
  }

  function onSignUpClicked() {
    setIsLoggedIn(true);
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
            pathname='/'
            iconPath='/home-icon.svg'
            activeIconPath='/home-icon-active.svg'
            alt='ana sayfa'
          />
          <HeaderTab
            pathname='/etkinlikler'
            iconPath='/events-icon.svg'
            activeIconPath='/events-icon-active.svg'
            alt='etkinlikler'
          />
          <HeaderTab
            pathname='/topluluklar'
            iconPath='/communities-icon.svg'
            activeIconPath='/communities-icon-active.svg'
            alt='topluluklar'
          />
          <HeaderTab
            pathname='/askida-proje'
            iconPath='/project-ideas-icon.svg'
            activeIconPath='/project-ideas-icon-active.svg'
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
          </>
        ) : (
          <>
            <button
              className={clsx(styles.bookmarksBtn, 'centerVertically')}
              onClick={onBookmarksClicked}
            >
              <Image src='/bookmarks-icon.svg' width='40px' height='40px' alt='bookmarks' />
            </button>
            <button className={clsx(styles.dmBtn, 'centerVertically')} onClick={onDmClicked}>
              <Image src='/dm-icon.svg' width='40px' height='40px' alt='dm' />
            </button>
            <button
              className={clsx(styles.profileBtn, 'centerVertically')}
              onClick={onProfileClicked}
            >
              <Image src='/profile-image.png' width='40px' height='40px' alt='dm' />
            </button>
          </>
        )}
      </div>
    </header>
  );
}
