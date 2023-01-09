import { CommunityProfilePage, Post } from 'components';
import { useRouter } from 'next/router';

export default function PostPage() {
  const router = useRouter();

  return (
    <CommunityProfilePage>
      <Post
        id={router.query.postId}
        eventId={router.query.eventId}
        onPostDeleted={() => router.replace(`/topluluklar/${router.query.id}`)}
      />
    </CommunityProfilePage>
  );
}
