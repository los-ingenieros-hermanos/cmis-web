import { NewPost, Post } from 'components';
import TagSelector, { Tag } from 'components/TagSelector/TagSelector';
import { useRouter } from 'next/router';
import Custom404 from 'pages/404';
import { ApiContext, imageToBase64 } from 'pages/_app';
import { useCallback, useContext, useEffect, useState } from 'react';
import styles from 'styles/StudentProfile.module.scss';

export default function StudentProfile() {
  const router = useRouter();
  const apiContext = useContext(ApiContext);
  const [data, setData] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [descriptionHeight, setDescriptionHeight] = useState();
  const [isManager, setIsManager] = useState();
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [posts, setPosts] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const postsData = await apiContext.getStudentPosts(router.query.id);
      if (postsData) {
        postsData.reverse();
        setPosts(
          postsData.map((postData) => (
            <Post key={postData.id} id={postData.id} isProjectIdea={true} onPostDeleted={onPostDeleted} />
          )),
        );
      }
      setIsLoading(false);
    })();
  }, [apiContext, router.query.id]);

  useEffect(() => {
    (async () => {
      if (router.query.id) {
        setData(await apiContext.getStudent(router.query.id));
      }
    })();
  }, [apiContext, router.query.id]);

  useEffect(() => {
    (async () => {
      setIsManager(apiContext.userData?.id == router.query.id);
    })();
  }, [apiContext.userData?.id, router.query.id]);

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

  async function onSaveEditClicked() {
    setIsEditing(false);
    setData(editData);
    apiContext.updateStudent(editData);
    const requests = [];
    for (let i = 1; i <= 19; i++) {
      requests.push(apiContext.removeStudentTag(router.query.id, i));
    }
    await Promise.all(requests);
    for (const tag of editData.interests) {
      apiContext.addStudentTag(router.query.id, tag.id);
    }
  }

  const onTagsSelected = useCallback((selectedTags) => {
    setEditData((oldEditData) => ({ ...oldEditData, interests: selectedTags }));
  }, []);

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
                Yeni Askıda Proje
              </button>
            )}
          </>
        )}
        {isLoading ? (
          <div className='postsLoader'></div>
        ) : !posts || posts.length > 0 || isManager ? (
          posts
        ) : (
          <p className='noPosts'>Askıda proje yok</p>
        )}
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
            <textarea
              style={{ height: descriptionHeight }}
              onChange={onDescriptionTextareaChanged}
              placeholder='Öğrenci açıklaması'
              value={editData.info || ''}
            ></textarea>
          )}
          {isEditing ? (
            <div>
              İlgi alanları:
              <TagSelector onTagsSelected={onTagsSelected} />
            </div>
          ) : (
            data.interests.length > 0 && (
              <div className={styles.tagsFlex}>
                İlgi alanları:
                {data.interests.map((tag) => (
                  <Tag key={tag.id} tag={tag} />
                ))}
              </div>
            )
          )}
          <div className={!isEditing ? styles.socials : styles.socialsEditing}>
            {!isEditing ? (
              <>
                {data.instagram && (
                  <a href={'https://www.instagram.com/' + data.instagram} target='_blank' rel='noreferrer'>
                    <img src='/icons/instagram-icon.svg' alt='instagram' />
                  </a>
                )}
                {data.twitter && (
                  <a href={'https://twitter.com/' + data.twitter} target='_blank' rel='noreferrer'>
                    <img src='/icons/twitter-icon.svg' alt='twitter' />
                  </a>
                )}
                {data.github && (
                  <a href={'https://github.com/' + data.github} target='_blank' rel='noreferrer'>
                    <img src='/icons/github-icon.svg' alt='github' />
                  </a>
                )}
                {data.linkedin && (
                  <a href={'https://www.linkedin.com/in/' + data.linkedin} target='_blank' rel='noreferrer'>
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
