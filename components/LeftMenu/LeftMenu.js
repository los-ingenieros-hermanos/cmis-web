import styles from "./LeftMenu.module.scss";
import Link from "next/link";
import { AuthContext } from 'pages/_app';
import React, { useEffect } from 'react';

export default function LeftMenu() {
    const authContext = React.useContext(AuthContext);
    const [pfp, setPfp] = React.useState();

    useEffect(() => {
        (async () => {
            setPfp(await authContext.getUserPfp());
        })();
    }, [authContext]);

   


    return (
        <ul className={styles.left}>
            {!authContext.userData && 
                <li className={styles.item} onClick={() => authContext.setIsLoginOpen(true)}>
                  <img src={'/icons/sidebar-sign-in.svg'} alt='giris-yap' />
                  <a>Giriş Yap</a>
                </li>
            }
            {!authContext.userData && 
                <li className={styles.item} onClick={() => authContext.setIsSignUpOpen(true)}>
                  <img src={'/icons/sidebar-sign-up.svg'} alt='kayit-ol' />
                  <a>Kayıt Ol</a>
                </li>
            }
            {authContext.userData &&
              <li className={styles.item}>
                <Link href={(authContext.userData.isCommunity ? '/topluluklar/' : '/ogrenciler/') + authContext.userData.id}>
                    <img src={pfp} alt='profil' style={{borderRadius: '50%', height: '42px', width: '42px', boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)', margin: "0px 0px 6px 4px"}} />
                </Link>
                <Link href={authContext.userData.isCommunity ? "/topluluklar/" + authContext.userData.id + "/gonderiler" : "/ogrenciler/" + authContext.userData.id}>
                  {authContext.userData.isCommunity ? authContext.userData.firstName : authContext.userData.firstName + " " + authContext.userData.lastName}
                </Link>
              </li>
            }
            {authContext.userData && !authContext.userData.isCommunity &&
              <li className={styles.item}>
                <Link href={"/kaydedilenler"}>
                    <img src={'/icons/sidebar-bookmark.svg'} alt='kaydedilenler' />
                </Link>
                <Link href={"/kaydedilenler"}>Kaydedilenler</Link>
              </li>
            }
            <li className={styles.item}>
              <Link href={'/yaklasan-etkinlikler'}>
                  <img src={'/icons/sidebar-events.svg'} alt='yaklasan-etkinlikler' />
              </Link>
              <Link href={'/yaklasan-etkinlikler'}>
                Etkinlikler
              </Link>
            </li>
            <li className={styles.item}>
              <Link href={'/topluluklar'}>
                  <img src={'/icons/sidebar-communities.svg'} alt='topluluklar/takimlar' />
              </Link>
              <Link href={'/topluluklar'}>
                Topluluklar/Takımlar
              </Link>
            </li>
            <li className={styles.item}>
              <Link href={'/askida-proje'}>
                  <img src={'/icons/sidebar-project-idea.svg'} alt='yaklasan-etkinlikler' />
              </Link>
              <Link href={'/askida-proje'}>
                Askıda Proje
              </Link>
            </li>
            {authContext.userData && 
              <li className={styles.item} onClick={() => authContext.signOut()}>
                <img src={'/icons/sidebar-sign-in.svg'} alt='cikis' style={{transform: 'scaleX(-1)'}} />
                <a>Çıkış Yap</a>
              </li>
            }
        </ul>
    );
  }