import styles from './HeaderTab.module.scss';
import { Link } from 'components';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import clsx from 'clsx';

export default function HeaderTab({ pathnames, iconPath, activeIconPath, alt }) {
  const router = useRouter();

  const isActive = useCallback(() => {
    return pathnames.includes('/')
      ? router.asPath === '/'
      : pathnames.some((pathname) => router.asPath.startsWith(pathname));
  }, [pathnames, router.asPath]);

  return (
    <li>
      <Link className={clsx('centerVertically', styles.headerTab)} href={pathnames[0]}>
        <img src={isActive() ? activeIconPath : iconPath} alt={alt} />
        {isActive() && <div className={clsx('indicator', styles.indicator)}></div>}
      </Link>
    </li>
  );
}
