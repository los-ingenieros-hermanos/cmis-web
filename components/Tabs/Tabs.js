import Link from 'components/Link/Link';
import styles from './Tabs.module.scss';
import { nanoid } from 'nanoid';
import clsx from 'clsx';

export default function Tabs({ width, height, tabs }) {
  const tabEls = tabs.map((tab) => (
    <Link className={clsx({ [styles.active]: tab.active })} key={nanoid()} href={tab.url}>
      {tab.name}
    </Link>
  ));

  return (
    <ul className={styles.tabs} style={{ width, height, fontSize: height - 20 }}>
      {tabEls}
    </ul>
  );
}
