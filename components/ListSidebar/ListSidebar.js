import styles from './ListSidebar.module.scss';
import { RightSidebar } from 'components';

export default function ListSidebar({ title, items }) {
  return (
    <RightSidebar>
      <div className={styles.listFlex}>
        <h2 className={styles.title}>{title}</h2>
        {items}
      </div>
    </RightSidebar>
  );
}
