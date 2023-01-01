import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Bookmarks() {
  const router = useRouter();

  useEffect(() => {
    console.log('Student id: ' + router.query.id);
  }, [router.query.id]);

  return <div></div>;
}
