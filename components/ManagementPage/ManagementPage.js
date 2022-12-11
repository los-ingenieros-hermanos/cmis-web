import styles from './ManagementPage.module.scss';
import { CommunityProfilePage, Tabs } from 'components';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ManagementPage({ children }) {
  // request id from backend and show 404 if id doesn't exist
  const router = useRouter();
  const [managementPath, setManagementPath] = useState('');

  useEffect(() => {
    setManagementPath(`/${router.query.communityType}/${router.query.id}/yonetim`);
  }, [router.query.communityType, router.query.id]);

  return (
    <CommunityProfilePage>
      <div className={styles.management}>
        <Tabs
          fontSize='18px'
          padding='4px'
          tabs={[
            { name: 'Üyeler', url: `${managementPath}/uyeler` },
            { name: 'Üyelik Başvuruları', url: `${managementPath}/uyelik-basvurulari` },
          ]}
        />
      </div>
      {children}
    </CommunityProfilePage>
  );
}
