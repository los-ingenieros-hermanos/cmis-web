import clsx from 'clsx';
import { HeaderTab, Link } from 'components';
import Login from 'components/LoginRegister/Login/Login';
import Register from 'components/LoginRegister/Register/Register';
import { AuthContext } from 'pages/_app';
import { useContext, useEffect, useState } from 'react';
import styles from './Header.module.scss';

export default function Header() {
  const authContext = useContext(AuthContext);
  const [pfp, setPfp] = useState();

  useEffect(() => {
    (async () => {
      setPfp(await authContext.getUserPfp());
    })();
  }, [authContext]);

  function onLoginClicked() {
    authContext.setIsLoginOpen(true);
  }

  function onSignUpClicked() {
    authContext.setIsSignUpOpen(true);
  }

  function onBookmarksClicked() {}

  function onDmClicked() {}

  function onProfileClicked() {
    authContext.signOut();
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
        {!authContext.userData ? (
          <>
            <button className={styles.loginBtn} onClick={onLoginClicked}>
              Giriş
            </button>
            <button className={styles.loginBtn} onClick={onSignUpClicked}>
              Kayıt Ol
            </button>

            {authContext.isLoginOpen && <Login />}

            {authContext.isSignUpOpen && <Register />}
          </>
        ) : (
          <>
            <Link href={'/ogrenciler/' + authContext.userData.id + '/kaydedilenler'}>
              <button className={clsx(styles.bookmarksBtn, 'centerVertically')} onClick={onBookmarksClicked}>
                <img src='/icons/bookmarks-icon.svg' alt='bookmarks' />
              </button>
            </Link>
            <button className={clsx(styles.dmBtn, 'centerVertically')} onClick={onDmClicked}>
              <img src='/icons/dm-icon.svg' alt='dm' />
            </button>
            <button className={clsx(styles.profileBtn, 'centerVertically')} onClick={onProfileClicked}>
              <img
                src={
                  pfp ??
                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88OjpfwAI+QOoF8YQhgAAAABJRU5ErkJggg=='
                }
                alt='dm'
              />
            </button>
          </>
        )}
      </div>
    </header>
  );
}
