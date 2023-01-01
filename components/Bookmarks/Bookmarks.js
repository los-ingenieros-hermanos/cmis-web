import styles from './Bookmarks.module.css';
import { useRouter } from 'next/router';

export const Bookmarks = () => {
    const router = useRouter();
    const { id } = router.query;
    
    return (
        <div className={styles.container}>
        <h1>Bookmarks</h1>
        <p>id: {id}</p>
        </div>
    );
}

// Path: components\Bookmarks\Bookmarks.module.css
