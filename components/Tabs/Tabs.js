import Link from 'components/Link/Link';
import styles from './Tabs.module.scss';
import { nanoid } from 'nanoid';
import clsx from 'clsx';
import { useRouter } from 'next/router';

export default function Tabs({ width, fontSize, padding, tabs }) {
  const router = useRouter();

  const tabEls = tabs.map((tab) => (
    <Link
      className={clsx(
        decodeURIComponent(router.asPath).startsWith(decodeURIComponent(tab.url)) && styles.active,
      )}
      key={nanoid()}
      href={tab.url}
      replace
    >
      {tab.name}
    </Link>
  ));

  return (
    <ul
      className={styles.tabs}
      style={{ width, fontSize, paddingTop: padding, paddingBottom: padding }}
    >
      {tabEls}
    </ul>
  );
}
