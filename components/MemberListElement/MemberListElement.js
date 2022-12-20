import Link from 'components/Link/Link';
import styles from './MemberListElement.module.scss';

export default function MemberListElement({ pfpSrc, name, profileLink }) {
  return (
    <div className={styles.memberListElement}>
      <Link className={styles.imageLink} href={profileLink}>
        <img src={pfpSrc} alt='profil fotoğrafı' />
      </Link>
      <Link href={profileLink}>{name}</Link>
    </div>
  );
}
