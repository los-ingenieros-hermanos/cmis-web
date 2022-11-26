import styles from './HeaderTabs.module.scss';
import { Link } from 'components';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export default function HeaderTab({ pathnames, iconPath, activeIconPath, alt }) {
  const router = useRouter();
  const [currentPathname, setCurrentPathname] = useState('/');

  useEffect(() => {
    setCurrentPathname(router.pathname);
  }, [router.pathname]);

  function isActive() {
    return pathnames.includes('/')
      ? currentPathname === '/'
      : pathnames.some((pathname) => currentPathname.includes(pathname));
  }

  return (
    <li>
      <Link className={clsx('centerVertically', styles.headerTab)} href={pathnames[0]}>
        <img src={isActive() ? activeIconPath : iconPath} alt={alt} />
        {isActive() && <div className={clsx('indicator', styles.indicator)}></div>}
      </Link>
    </li>
  );
}
