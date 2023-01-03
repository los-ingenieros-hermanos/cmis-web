import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Bookmarks } from 'components/Bookmarks/Bookmarks';

export default function BookmarksPage() {

  // const router = useRouter();
  // useEffect(() => {
  //   console.log('Student id: ' + router.query.id);
  // }, [router.query.id]);

  return <Bookmarks />;
}
