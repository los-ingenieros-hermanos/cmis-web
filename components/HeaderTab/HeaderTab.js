import styles from './HeaderTab.module.scss';
import { Link } from 'components';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export default function HeaderTab({ pathname, iconPath, activeIconPath, alt }) {
  const router = useRouter();
  const [currentPathname, setCurrentPathname] = useState('/');

  useEffect(() => {
    setCurrentPathname(router.pathname);
  }, [router.pathname]);

  return (
    <Link className={clsx('centerVertically', styles.headerTab)} href={pathname}>
      <Image
        src={currentPathname === pathname ? activeIconPath : iconPath}
        width='100%'
        height='24px'
        alt={alt}
      />
      {currentPathname === pathname && <div className={clsx('indicator', styles.indicator)}></div>}
    </Link>
  );
}
