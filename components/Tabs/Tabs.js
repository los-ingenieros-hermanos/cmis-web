import Link from 'components/Link/Link';
import styles from './Tabs.module.scss';
import { nanoid } from 'nanoid';
import clsx from 'clsx';
import { useRouter } from 'next/router';

export default function Tabs({ width, height, tabs }) {
  const router = useRouter();

  const tabEls = tabs.map((tab) => (
    <Link
      className={clsx(
        decodeURIComponent(tab.url) === decodeURIComponent(router.asPath) && styles.active,
      )}
      key={nanoid()}
      href={tab.url}
      replace
    >
      {tab.name}
    </Link>
  ));

  return (
    <ul className={styles.tabs} style={{ width, height, fontSize: height - 20 }}>
      {tabEls}
    </ul>
  );
}
