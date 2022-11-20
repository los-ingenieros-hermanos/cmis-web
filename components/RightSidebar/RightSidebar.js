import styles from './RightSidebar.module.scss';

export default function RightSidebar({ children }) {
  return <div className={styles.rightSidebar}>{children}</div>;
}
