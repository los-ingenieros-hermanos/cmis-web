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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setPfp(await authContext.getUserPfp());
    })();
  }, [authContext]);

  useEffect(() => {
    function onClick() {
      setIsMenuOpen(false);
    }

    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  });

  function onLoginClicked() {
    authContext.setIsLoginOpen(true);
  }

  function onSignUpClicked() {
    authContext.setIsSignUpOpen(true);
  }

  function onProfileClicked(e) {
    e.stopPropagation();
    setIsMenuOpen((oldIsMenuOpen) => !oldIsMenuOpen);
  }

  function onSignOutClicked() {
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
      <h1>
        <Link className={styles.logo} href='/'>
          cmis
        </Link>
      </h1>
      <div className={styles.rightFlex}>
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
            {!authContext.userData.isCommunity && (
              <Link className={clsx(styles.bookmarksBtn, 'centerVertically')} href={'/kaydedilenler'}>
                <img src='/icons/bookmarks-icon.svg' alt='bookmarks' />
              </Link>
            )}
            <button className={clsx(styles.profileBtn, 'centerVertically')} onClick={onProfileClicked}>
              <img
                src={
                  pfp ??
                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88OjpfwAI+QOoF8YQhgAAAABJRU5ErkJggg=='
                }
                alt='dm'
              />
            </button>
            {isMenuOpen && (
              <div className={styles.menu}>
                <Link
                  className={styles.menuItem}
                  href={(authContext.userData.isCommunity ? '/topluluklar/' : '/ogrenciler/') + authContext.userData.id}
                >
                  Profil
                </Link>
                <button className={styles.menuItem} onClick={onSignOutClicked}>
                  Çıkış Yap
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}
