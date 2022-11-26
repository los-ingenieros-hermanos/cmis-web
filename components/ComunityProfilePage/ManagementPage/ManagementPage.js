import styles from './ManagementPage.module.scss';
import { CommunityProfilePage } from 'components';

export default function ManagementPage() {
  return (
    <CommunityProfilePage>
      <div className={styles.management}></div>
    </CommunityProfilePage>
  );
}
