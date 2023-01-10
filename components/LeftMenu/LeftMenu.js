import Link from 'next/link';
import { ApiContext } from 'pages/_app';
import React, { useEffect } from 'react';
import styles from './LeftMenu.module.scss';

export default function LeftMenu() {
  const apiContext = React.useContext(ApiContext);
  const [pfp, setPfp] = React.useState();

  useEffect(() => {
    (async () => {
      setPfp(await apiContext.getUserPfp());
    })();
  }, [apiContext]);

  return (
    <ul className={styles.left}>
      {!apiContext.userData && (
        <li className={styles.item} onClick={() => apiContext.setIsLoginOpen(true)}>
          <img src={'/icons/sidebar-sign-in.svg'} alt='giris-yap' />
          <a>Giriş Yap</a>
        </li>
      )}
      {!apiContext.userData && (
        <li className={styles.item} onClick={() => apiContext.setIsSignUpOpen(true)}>
          <img src={'/icons/sidebar-sign-up.svg'} alt='kayit-ol' />
          <a>Kayıt Ol</a>
        </li>
      )}
      {apiContext.userData && (
        <li className={styles.item}>
          <Link href={(apiContext.userData.isCommunity ? '/topluluklar/' : '/ogrenciler/') + apiContext.userData.id}>
            <img
              src={pfp}
              alt='profil'
              style={{
                borderRadius: '50%',
                height: '42px',
                width: '42px',
                boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)',
                margin: '0px 0px 6px 4px',
              }}
            />
          </Link>
          <Link
            href={
              apiContext.userData.isCommunity
                ? '/topluluklar/' + apiContext.userData.id + '/gonderiler'
                : '/ogrenciler/' + apiContext.userData.id
            }
          >
            {apiContext.userData.isCommunity
              ? apiContext.userData.firstName
              : apiContext.userData.firstName + ' ' + apiContext.userData.lastName}
          </Link>
        </li>
      )}
      {apiContext.userData && !apiContext.userData.isCommunity && (
        <li className={styles.item}>
          <Link href={'/kaydedilenler'}>
            <img src={'/icons/sidebar-bookmark.svg'} alt='kaydedilenler' />
          </Link>
          <Link href={'/kaydedilenler'}>Kaydedilenler</Link>
        </li>
      )}
      <li className={styles.item}>
        <Link href={'/yaklasan-etkinlikler'}>
          <img src={'/icons/sidebar-events.svg'} alt='yaklasan-etkinlikler' />
        </Link>
        <Link href={'/yaklasan-etkinlikler'}>Etkinlikler</Link>
      </li>
      <li className={styles.item}>
        <Link href={'/topluluklar'}>
          <img src={'/icons/sidebar-communities.svg'} alt='topluluklar/takimlar' />
        </Link>
        <Link href={'/topluluklar'}>Topluluklar/Takımlar</Link>
      </li>
      <li className={styles.item}>
        <Link href={'/askida-proje'}>
          <img src={'/icons/sidebar-project-idea.svg'} alt='yaklasan-etkinlikler' />
        </Link>
        <Link href={'/askida-proje'}>Askıda Proje</Link>
      </li>
      {apiContext.userData && (
        <li className={styles.item} onClick={() => apiContext.signOut()}>
          <img src={'/icons/sidebar-sign-in.svg'} alt='cikis' style={{ transform: 'scaleX(-1)' }} />
          <a>Çıkış Yap</a>
        </li>
      )}
    </ul>
  );
}
