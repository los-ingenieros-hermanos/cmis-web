import styles from "./LeftMenu.module.scss";
import Link from "next/link";

export default function LeftMenu({ authContext }) {
    return (
        <ul className={styles.left}>
            {authContext.isLoggedIn ? (
                <li className={styles.item}>
                  <Link href={'/profilim'}>
                      <img src={'/icons/sidebar-sign-in.svg'} alt='profilim' />
                  </Link>
                  <Link href={'/profilim'}>Profilim</Link>
                </li>
            ) : (
                <li className={styles.item} onClick={() => authContext.setIsLoginOpen(true)}>
                  <img src={'/icons/sidebar-sign-in.svg'} alt='giris-yap' />
                  <a>Giriş Yap</a>
                </li>
            )}
            {authContext.isLoggedIn ? (
                <li className={styles.item}>
                  <Link href={'/kaydedilenler'}>
                      <img src={'/icons/sidebar-bookmark.svg'} alt='kaydedilenler' />
                  </Link>
                  <Link href={'/profilim'}>Kaydedilenler</Link>
                </li>
            ) : (
                <li className={styles.item} onClick={() => authContext.setIsSignUpOpen(true)}>
                  <img src={'/icons/sidebar-sign-up.svg'} alt='kayit-ol' />
                  <a>Kayıt Ol</a>
                </li>
            )}
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
        </ul>
    );
  }