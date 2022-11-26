import styles from './PostsPage.module.scss';
import { CommunityProfilePage } from 'components';

export default function PostsPage() {
  return (
    <CommunityProfilePage>
      <div className={styles.posts}></div>
    </CommunityProfilePage>
  );
}
