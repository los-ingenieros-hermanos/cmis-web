import { Link, NewPost, Post } from 'components';
import { useRouter } from 'next/router';
import Custom404 from 'pages/404';
import { AuthContext, imageToBase64 } from 'pages/_app';
import { useContext, useEffect, useRef, useState } from 'react';
import styles from 'styles/StudentProfile.module.scss';

function Description({ height, content, onDescriptionTextareaChanged }) {
  const descriptionRef = useRef();

  useEffect(() => {
    descriptionRef.current.value = content;
  }, [content]);

  return <textarea style={{ height }} ref={descriptionRef} onChange={onDescriptionTextareaChanged}></textarea>;
}

function Tag({ children }) {
  return (
    <Link className={styles.tag} href='#'>
      {children}
    </Link>
  );
}

export default function StudentProfile() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [data, setData] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [descriptionHeight, setDescriptionHeight] = useState();
  const [isManager, setIsManager] = useState();
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [posts, setPosts] = useState();

  useEffect(() => {
    (async () => {
      const postsData = await authContext.getStudentPosts(router.query.id);
      if (postsData) {
        postsData.reverse();
        setPosts(
          postsData.map((postData) => (
            <Post key={postData.id} id={postData.id} isProjectIdea={true} onPostDeleted={onPostDeleted} />
          )),
        );
      }
    })();
  }, [authContext, router.query.id]);

  useEffect(() => {
    (async () => {
      if (router.query.id) {
        setData(await authContext.getStudent(router.query.id));
      }
    })();
  }, [authContext, router.query.id]);

  useEffect(() => {
    (async () => {
      setIsManager(authContext.userData?.id == router.query.id);
    })();
  }, [authContext.userData?.id, router.query.id]);

  function onNewPostClicked() {
    setIsNewPostOpen(true);
  }

  function onPostDeleted(postId) {
    setPosts((oldPosts) => oldPosts.filter((post) => post.key != postId));
  }

  function onPostSent(newPostData) {
    setPosts((oldPosts) => {
      const newPosts = [...oldPosts];
      newPosts.unshift(
        <Post key={newPostData.id} id={newPostData.id} isProjectIdea={true} onPostDeleted={onPostDeleted} />,
      );
      return newPosts;
    });
  }

  function onBannerChange(e) {
    imageToBase64(e.target.files[0], (base64) => setEditData((oldEditData) => ({ ...oldEditData, banner: base64 })));
  }

  function onPfpChange(e) {
    imageToBase64(e.target.files[0], (base64) => setEditData((oldEditData) => ({ ...oldEditData, image: base64 })));
  }

  function onEditClicked() {
    setIsEditing(true);
    setEditData(data);
  }

  function onCancelEditClicked() {
    setIsEditing(false);
  }

  function onSaveEditClicked() {
    setIsEditing(false);
    setData(editData);
    authContext.updateCommunity(editData);
  }

  function onDescriptionTextareaChanged(e) {
    setEditData((oldEditData) => ({ ...oldEditData, info: e.target.value }));
  }

  function onInstagramInputChanged(e) {
    setEditData((oldEditData) => ({ ...oldEditData, instagram: e.target.value }));
  }

  function onTwitterInputChanged(e) {
    setEditData((oldEditData) => ({ ...oldEditData, twitter: e.target.value }));
  }

  function onGithubInputChanged(e) {
    setEditData((oldEditData) => ({ ...oldEditData, github: e.target.value }));
  }

  function onLinkedinInputChanged(e) {
    setEditData((oldEditData) => ({ ...oldEditData, linkedin: e.target.value }));
  }

  return !data ? (
    <Custom404 />
  ) : (
    <div className={styles.page}>
      <div className={styles.bannerContainer}>
        <img
          className={styles.banner}
          src={
            (isEditing ? editData?.banner : data?.banner) ??
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88OjpfwAI+QOoF8YQhgAAAABJRU5ErkJggg=='
          }
          alt='banner'
        />
        <input
          className={styles.bannerFileInput}
          type='file'
          onChange={onBannerChange}
          style={isEditing ? { cursor: 'pointer', display: 'block' } : undefined}
        />
      </div>
      <div className={styles.pfpContainer}>
        <img
          className={styles.pfp}
          src={
            (isEditing ? editData?.image : data?.image) ??
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88OjpfwAI+QOoF8YQhgAAAABJRU5ErkJggg=='
          }
          alt='profile picture'
        />
        <input
          className={styles.pfpFileInput}
          type='file'
          onChange={onPfpChange}
          style={isEditing ? { cursor: 'pointer', display: 'block' } : undefined}
        />
      </div>
      <h1>{`${data?.user?.firstName} ${data?.user?.lastName}` ?? 'Student'}</h1>
      <div className={styles.content}>
        <div className={styles.title}>
          <h2>Askıda Projeler</h2>
        </div>
        {isManager && (
          <>
            {isNewPostOpen ? (
              <NewPost setIsNewPostOpen={setIsNewPostOpen} isProjectIdea={true} onPostSent={onPostSent} />
            ) : (
              <button
                className='mainButton'
                onClick={onNewPostClicked}
                style={{ marginTop: '16px', height: '40px', fontSize: '18px' }}
              >
                Yeni Gönderi
              </button>
            )}
          </>
        )}
        {posts}
        <div className={styles.infoPanel}>
          {isManager &&
            (!isEditing ? (
              <button className={styles.editBtn} onClick={onEditClicked}>
                <img src='/icons/edit-icon.svg' alt='düzenle' />
              </button>
            ) : (
              <div className={styles.editConfirmationButtons}>
                <button className='mainButton mainButtonNeutral' onClick={onCancelEditClicked}>
                  Vazgeç
                </button>
                <button className='mainButton' onClick={onSaveEditClicked}>
                  Kaydet
                </button>
              </div>
            ))}
          {!isEditing ? (
            <p
              ref={(el) => {
                if (el) {
                  setDescriptionHeight(el.getBoundingClientRect().height);
                }
              }}
            >
              {data?.info}
            </p>
          ) : (
            <Description
              height={descriptionHeight}
              content={data?.info}
              onDescriptionTextareaChanged={onDescriptionTextareaChanged}
            />
          )}
          <div className={styles.tagsFlex}>
            <p className='bold'>İlgi alanları:</p>
            {data?.tags?.map((tag) => (
              <Tag key={tag.id}>{tag.tag}</Tag>
            ))}
          </div>
          <div className={!isEditing ? styles.socials : styles.socialsEditing}>
            {!isEditing ? (
              <>
                {data.instagram && (
                  <a href={data.instagram} target='_blank' rel='noreferrer'>
                    <img src='/icons/instagram-icon.svg' alt='instagram' />
                  </a>
                )}
                {data.twitter && (
                  <a href={data.twitter} target='_blank' rel='noreferrer'>
                    <img src='/icons/twitter-icon.svg' alt='twitter' />
                  </a>
                )}
                {data.github && (
                  <a href={data.github} target='_blank' rel='noreferrer'>
                    <img src='/icons/github-icon.svg' alt='github' />
                  </a>
                )}
                {data.linkedin && (
                  <a href={data.linkedin} target='_blank' rel='noreferrer'>
                    <img src='/icons/linkedin-icon.svg' alt='linkedin' />
                  </a>
                )}
              </>
            ) : (
              <>
                <div className={styles.socialsEditItem}>
                  <img src='/icons/instagram-icon.svg' alt='instagram' />
                  <input type='text' value={editData.instagram || ''} onChange={onInstagramInputChanged} />
                </div>
                <div className={styles.socialsEditItem}>
                  <img src='/icons/twitter-icon.svg' alt='twitter' />
                  <input type='text' value={editData.twitter || ''} onChange={onTwitterInputChanged} />
                </div>
                <div className={styles.socialsEditItem}>
                  <img src='/icons/github-icon.svg' alt='github' />
                  <input type='text' value={editData.github || ''} onChange={onGithubInputChanged} />
                </div>
                <div className={styles.socialsEditItem}>
                  <img src='/icons/linkedin-icon.svg' alt='linkedin' />
                  <input type='text' value={editData.linkedin || ''} onChange={onLinkedinInputChanged} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
