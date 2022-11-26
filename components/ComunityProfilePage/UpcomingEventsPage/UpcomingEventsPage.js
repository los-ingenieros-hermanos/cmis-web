import styles from './UpcomingEventsPage.module.scss';
import { CommunityProfilePage } from 'components';

export default function UpcomingEventsPage() {
  return (
    <CommunityProfilePage>
      <div className={styles.upcomingEvents}></div>
    </CommunityProfilePage>
  );
}
