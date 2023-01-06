import clsx from 'clsx';
import Link from 'components/Link/Link';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './Tabs.module.scss';

export default function Tabs({ width, fontSize, padding, tabs }) {
  const router = useRouter();
  const [tabEls, setTabEls] = useState([]);

  useEffect(() => {
    setTabEls(
      tabs.map((tab) => (
        <Link
          className={clsx(decodeURIComponent(router.asPath).startsWith(decodeURIComponent(tab.url)) && styles.active)}
          key={nanoid()}
          href={tab.url}
          replace
        >
          {tab.name}
        </Link>
      )),
    );
  }, [router.asPath, tabs]);

  return (
    <ul className={styles.tabs} style={{ width, fontSize, paddingTop: padding, paddingBottom: padding }}>
      {tabEls}
    </ul>
  );
}
