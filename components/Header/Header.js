import styles from './Header.module.scss';
import { Link } from 'components';
import clsx from 'clsx';
import { useState } from 'react';
import { HeaderTabs } from 'components';

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
          <HeaderTabs
            pathnames={['/']}
            iconPath='/icons/home-icon.svg'
            activeIconPath='/icons/home-icon-active.svg'
            alt='ana sayfa'
          />
          <HeaderTabs
            pathnames={['/etkinlikler']}
            iconPath='/icons/events-icon.svg'
            activeIconPath='/icons/events-icon-active.svg'
            alt='etkinlikler'
          />
          <HeaderTabs
            pathnames={['/topluluklar', '/takimlar']}
            iconPath='/icons/communities-icon.svg'
            activeIconPath='/icons/communities-icon-active.svg'
            alt='topluluklar'
          />
          <HeaderTabs
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
