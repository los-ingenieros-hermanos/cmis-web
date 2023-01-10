import clsx from 'clsx';
import { Modal, Tabs } from 'components';
import TagSelector, { Tag } from 'components/TagSelector/TagSelector';
import { useRouter } from 'next/router';
import Custom404 from 'pages/404';
import { ApiContext, imageToBase64 } from 'pages/_app';
import { useCallback, useContext, useEffect, useState } from 'react';
import styles from './CommunityProfilePage.module.scss';

function ApplyModal({ data, setIsOpen, onApplied, onApplicationCancelled, isEditing }) {
  const apiContext = useContext(ApiContext);
  const router = useRouter();
  const [info, setInfo] = useState('');

  useEffect(() => {
    (async () => {
      const application = await apiContext.getMemberApplication(router.query.id, apiContext.userData?.id);
      if (application?.message) {
        setInfo(application.message);
      }
    })();
  }, [apiContext, router.query.id]);

  function onTextareaChanged(e) {
    setInfo(e.target.value);
  }

  function onCancelClicked() {
    setIsOpen(false);
  }

  function onSendClicked() {
    apiContext.applyToCommunity(router.query.id, info);
    onApplied();
    setIsOpen(false);
  }

  function onCancelApplicationClicked() {
    apiContext.cancelMemberApplication(router.query.id);
    onApplicationCancelled();
    setIsOpen(false);
  }

  return (
    <div className={styles.applyModal}>
      <h2>{data.hasApplied ? 'Başvuruyu düzenle' : 'Üyelik başvurusu'}</h2>
      {data.applicationCriteria && (
        <p>
          <span>Başvuru gereksinimleri: </span>
          {data.applicationCriteria}
        </p>
      )}

      <textarea
        className={styles.applyTextarea}
        placeholder='Başvuru bilgileri'
        value={info}
        onChange={onTextareaChanged}
      ></textarea>
      <div className={styles.buttons}>
        <button className={clsx('mainButton', 'mainButtonNeutral')} onClick={onCancelClicked}>
          Vazgeç
        </button>
        <button className='mainButton' onClick={onSendClicked}>
          {data.hasApplied ? 'Kaydet' : 'Gönder'}
        </button>
        {isEditing && (
          <button className={clsx('mainButton', 'mainButtonNegative')} onClick={onCancelApplicationClicked}>
            Başvuruyu İptal Et
          </button>
        )}
      </div>
    </div>
  );
}

function LeaveModal({ setIsOpen, onLeft }) {
  const router = useRouter();
  const apiContext = useContext(ApiContext);

  function onCancelClicked() {
    setIsOpen(false);
  }

  function onLeaveClicked() {
    apiContext.removeMember(router.query.id, apiContext.userData?.id);
    onLeft();
    setIsOpen(false);
    router.reload();
  }

  return (
    <div className={styles.leaveModal}>
      Kulüpten çıkmak istediğine emin misin? (Tekrar girebilmek için tekrar başvurman gerekecek.)
      <div className={styles.buttons}>
        <button className={clsx('mainButton', 'mainButtonNeutral')} onClick={onCancelClicked}>
          Vazgeç
        </button>
        <button className={clsx('mainButton', 'mainButtonNegative')} onClick={onLeaveClicked}>
          Üyelikten Çık
        </button>
      </div>
    </div>
  );
}

export default function CommunityProfilePage({ children }) {
  const router = useRouter();
  const apiContext = useContext(ApiContext);
  const [data, setData] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [descriptionHeight, setDescriptionHeight] = useState();
  const [isManager, setIsManager] = useState();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      if (router.query.id) {
        const reqData = await Promise.all([
          apiContext.getCommunity(router.query.id),
          !apiContext.userData?.isCommunity && apiContext.isFollowerOfCommunity(router.query.id),
          !apiContext.userData?.isCommunity && apiContext.isMemberOfCommunity(router.query.id),
          !apiContext.userData?.isCommunity && apiContext.hasAppliedToCommunity(router.query.id),
        ]);

        if (reqData[0]) {
          setData({
            ...reqData[0],
            isFollowerOf: reqData[1],
            isMemberOf: reqData[2],
            hasApplied: reqData[3],
          });
        } else {
          setData(undefined);
        }
      }
    })();
  }, [apiContext, router.query.id]);

  useEffect(() => {
    (async () => {
      let isAuthorizedMember = false;
      if (!apiContext.userData?.isCommunity) {
        isAuthorizedMember = await apiContext.isAuthorizedMember(router.query.id);
      }
      setIsManager(apiContext.userData?.id == router.query.id || isAuthorizedMember);
    })();
  }, [apiContext, router.query.id]);

  function onBannerChange(e) {
    imageToBase64(e.target.files[0], (base64) => setEditData((oldEditData) => ({ ...oldEditData, banner: base64 })));
  }

  function onPfpChange(e) {
    imageToBase64(e.target.files[0], (base64) => setEditData((oldEditData) => ({ ...oldEditData, image: base64 })));
  }

  function onFollowClicked() {
    if (!apiContext.userData) {
      apiContext.setIsLoginOpen(true);
      return;
    }

    setData((oldData) => {
      const newData = { ...oldData };
      if (!newData.isFollowerOf) {
        apiContext.followCommunity(router.query.id);
        newData.followerCount++;
      } else {
        apiContext.unfollowCommunity(router.query.id);
        newData.followerCount--;
      }
      newData.isFollowerOf = !newData.isFollowerOf;
      return newData;
    });
  }

  function onApplyClicked() {
    if (!apiContext.userData) {
      apiContext.setIsLoginOpen(true);
      return;
    }

    setData((oldData) => {
      const newData = { ...oldData };
      if (!newData.isMemberOf) {
        setIsApplyModalOpen(true);
      } else {
        setIsLeaveModalOpen(true);
      }
      return newData;
    });
  }

  function onApplied() {
    setData((oldData) => ({ ...oldData, hasApplied: true }));
  }

  function onApplicationCancelled() {
    setData((oldData) => ({ ...oldData, hasApplied: false }));
  }

  function onLeft() {
    setData((oldData) => ({ ...oldData, isMemberOf: false, memberCount: oldData.memberCount - 1 }));
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
    apiContext.updateCommunity(editData);
  }

  function onDescriptionTextareaChanged(e) {
    setEditData((oldEditData) => ({ ...oldEditData, info: e.target.value }));
  }

  const onTagsSelected = useCallback((selectedTags) => {
    setEditData((oldEditData) => ({ ...oldEditData, tags: selectedTags }));
  }, []);

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
      <h1>{data?.user?.firstName ?? 'Community'}</h1>
      <div className={styles.content}>
        <Tabs
          fontSize='20px'
          padding='5px'
          tabs={[
            { name: 'Gönderiler', url: `/topluluklar/${router.query.id}/gonderiler` },
            { name: 'Yaklaşan Etkinlikler', url: `/topluluklar/${router.query.id}/yaklasan-etkinlikler` },
            isManager ? { name: 'Yönetim', url: `/topluluklar/${router.query.id}/yonetim` } : undefined,
          ].filter(Boolean)}
        />
        {children}
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
          <div className={styles.btnFlex}>
            {!apiContext.userData?.isCommunity && (
              <button
                className={clsx('mainButton', data.isFollowerOf && 'mainButtonNegative')}
                onClick={onFollowClicked}
              >
                {data.isFollowerOf ? 'Takibi Bırak' : 'Takip Et'}
              </button>
            )}
            <p className='bold'>{data.followerCount} Takipçi</p>
          </div>
          <div className={styles.btnFlex}>
            {!apiContext.userData?.isCommunity && (
              <button
                className={clsx(
                  'mainButton',
                  data.isMemberOf && 'mainButtonNegative',
                  data.hasApplied && !data.isMemberOf && 'mainButtonNeutral',
                )}
                onClick={onApplyClicked}
              >
                {data.isMemberOf ? 'Üyelikten Çık' : data.hasApplied ? 'Başvuruyu Düzenle' : 'Üye Ol'}
              </button>
            )}
            <p className='bold'>{data.memberCount} Üye</p>
          </div>
          {!isEditing ? (
            <p
              className={styles.description}
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
              placeholder='Topluluk açıklaması'
              value={editData.info || ''}
            ></textarea>
          )}
          {isEditing ? (
            <div>
              Etiketler:
              <TagSelector selectedTags={editData.tags} onTagsSelected={onTagsSelected} />
            </div>
          ) : (
            data.tags.length > 0 && (
              <div className={styles.tagsFlex}>
                Etiketler:
                {data.tags.map((tag) => (
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
          <Modal isOpen={isApplyModalOpen} setIsOpen={setIsApplyModalOpen}>
            <ApplyModal
              data={data}
              setIsOpen={setIsApplyModalOpen}
              onApplied={onApplied}
              onApplicationCancelled={onApplicationCancelled}
              isEditing={data.hasApplied}
            />
          </Modal>
          <Modal isOpen={isLeaveModalOpen} setIsOpen={setIsLeaveModalOpen}>
            <LeaveModal setIsOpen={setIsLeaveModalOpen} onLeft={onLeft} />
          </Modal>
        </div>
      </div>
    </div>
  );
}
