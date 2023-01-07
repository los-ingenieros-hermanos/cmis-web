import { CommunityProfilePage, Tabs } from 'components';
import { useRouter } from 'next/router';
import styles from './ManagementPage.module.scss';

export default function ManagementPage({ children }) {
  const router = useRouter();

  return (
    <CommunityProfilePage>
      <div className={styles.management}>
        <Tabs
          fontSize='18px'
          padding='4px'
          tabs={[
            { name: 'Üyeler', url: `/topluluklar/${router.query.id}/yonetim/uyeler` },
            { name: 'Üyelik Başvuruları', url: `/topluluklar/${router.query.id}/yonetim/uyelik-basvurulari` },
          ]}
        />
      </div>
      {children}
    </CommunityProfilePage>
  );
}
