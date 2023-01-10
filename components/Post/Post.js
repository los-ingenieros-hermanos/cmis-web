import { Link } from 'components';
import { ApiContext } from 'pages/_app';
import { useContext, useEffect, useState } from 'react';
import styles from './Post.module.scss';

export default function Post({ id, eventId, isProjectIdea, onPostDeleted, isBookmark = false }) {
  const apiContext = useContext(ApiContext);
  const [isContentOverflown, setIsContentOverflown] = useState(true);
  const [data, setData] = useState();
  const [isPoster, setIsPoster] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function isEventExpired() {
    const date = new Date(
      data.event[0].date.year,
      data.event[0].date.month,
      data.event[0].date.day,
      data.event[0].date.hour,
      data.event[0].date.minute,
    );
    const now = new Date();
    return now > date;
  }

  useEffect(() => {
    function onClick() {
      setIsMenuOpen(false);
    }

    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    setIsPoster(data?.student?.id == apiContext.userData?.id || data?.community?.id == apiContext.userData?.id);
  }, [apiContext.userData?.id, data?.community?.id, data?.student?.id]);

  useEffect(() => {
    (async () => {
      if (isProjectIdea) {
        const reqData = await Promise.all([
          apiContext.getStudentPost(id),
          !apiContext.userData?.isCommunity && apiContext.isStudentPostLiked(id),
          !apiContext.userData?.isCommunity && apiContext.isStudentPostBookmarked(id),
        ]);

        if (reqData[0]) {
          setData({ ...reqData[0], isLiked: reqData[1], isBookmarked: reqData[2] });
        } else {
          setData(undefined);
        }
      } else {
        const reqData = await Promise.all([
          apiContext.getCommunityPost(id),
          !apiContext.userData?.isCommunity && apiContext.isCommunityPostLiked(id),
          !apiContext.userData?.isCommunity && apiContext.isCommunityPostBookmarked(id),
          !apiContext.userData?.isCommunity && apiContext.isCommunityPostAttended(eventId),
        ]);

        if (reqData[0]) {
          setData({ ...reqData[0], isLiked: reqData[1], isBookmarked: reqData[2], isAttended: reqData[3] });
        } else {
          setData(undefined);
        }
      }
    })();
  }, [apiContext, eventId, id, isProjectIdea]);

  function onLikeClicked() {
    setData((oldData) => {
      const newData = { ...oldData };
      newData.isLiked = !newData.isLiked;
      newData.likeNum += newData.isLiked ? 1 : -1;
      return newData;
    });

    if (isProjectIdea) {
      apiContext.likeStudentPost(id);
    } else {
      apiContext.likeCommunityPost(id);
    }
  }

  function onSaveClicked() {
    setData((oldData) => {
      if (!oldData.isBookmarked) {
        if (isProjectIdea) {
          apiContext.bookmarkStudentPost(id);
        } else {
          apiContext.bookmarkCommunityPost(id);
        }
      } else {
        if (isProjectIdea) {
          apiContext.removeStudentPostBookmark(id);
        } else {
          apiContext.removeCommunityPostBookmark(id);
        }
      }

      return { ...oldData, isBookmarked: !oldData.isBookmarked };
    });
  }

  function onWillAttendClicked() {
    setData((oldData) => {
      if (!oldData.isAttended) {
        apiContext.attendCommunityPost(eventId);
      } else {
        apiContext.removeCommunityPostAttendance(eventId);
      }

      const newData = { ...oldData };
      newData.isAttended = !newData.isAttended;
      newData.event[0].attendantsNum += newData.isAttended ? 1 : -1;
      return newData;
    });
  }

  function getMonthName(monthIndex) {
    return [
      'Ocak',
      'Şubat',
      'Mart',
      'Nisan',
      'Mayıs',
      'Haziran',
      'Temmuz',
      'Ağustos',
      'Eylül',
      'Ekim',
      'Kasım',
      'Aralık',
    ][monthIndex];
  }

  function getDayName(dayIndex) {
    return ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'][dayIndex];
  }

  function getDateAndTime(date) {
    function getTime(time) {
      return time < 10 ? '0' + time : time;
    }

    return (
      date &&
      `${getDayName(new Date(date.year, date.month, date.day).getDay())} ${date.day} ${getMonthName(date.month)} ${
        date.year
      } ${getTime(date.hour)}:${getTime(date.minute)}`
    );
  }

  function onMenuClicked(e) {
    e.stopPropagation();
    setIsMenuOpen((oldIsMenuOpen) => !oldIsMenuOpen);
  }

  function onDeletePostClicked() {
    if (isProjectIdea) {
      apiContext.deleteStudentPost(id);
    } else {
      apiContext.deleteCommunityPost(id);
    }

    onPostDeleted(id);
  }

  return (
    data && (
      <div
        className={styles.post}
        style={
          isContentOverflown && !isBookmark
            ? { maxHeight: '400px' }
            : undefined || (isContentOverflown && isBookmark)
            ? { maxHeight: '400px', minWidth: 'calc(50% + 365px)' }
            : undefined || (!isContentOverflown && isBookmark)
            ? { minWidth: 'calc(50% + 365px)' }
            : undefined
        }
      >
        {isPoster && (
          <button className={styles.menuBtn} onClick={onMenuClicked}>
            <img src='/icons/three-dots-icon.svg' alt='üç nokta' />
          </button>
        )}
        {isMenuOpen && (
          <div className={styles.menu}>
            <button onClick={onDeletePostClicked}>Gönderiyi Sil</button>
          </div>
        )}
        <div className={styles.flex1}>
          <Link
            className={styles.imgLink}
            href={isProjectIdea ? '/ogrenciler/' + data.student.id : '/topluluklar/' + data.community.id}
          >
            <img src={isProjectIdea ? data.student.image : data.community.image} alt='profile picture' />
          </Link>
          <div className={styles.flex2}>
            <Link href={isProjectIdea ? '/ogrenciler/' + data.student.id : '/topluluklar/' + data.community.id}>
              {isProjectIdea
                ? data.student.user.firstName + ' ' + data.student.user.lastName
                : data.community.user.firstName}
            </Link>
            <div className={styles.flex3}>
              {getDateAndTime(data.date)}
              {!isProjectIdea && (
                <>
                  <span className={styles.middot}>&middot;</span>
                  <img
                    src={data.visibility === 'global' ? '/icons/public-icon.svg' : '/icons/private-icon.svg'}
                    alt='visibility icon'
                    title={`${data.visibility === 'global' ? 'genel' : 'üyelere özel'} gönderi`}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        <div
          className={styles.content}
          ref={(el) => {
            if (el) {
              setIsContentOverflown(el.scrollHeight > el.clientHeight);
            }
          }}
          onClick={() => setIsContentOverflown(false)}
          style={isContentOverflown ? { cursor: 'pointer' } : undefined}
        >
          {isContentOverflown && <div className={styles.contentClickable}></div>}
          <h2>{data.title}</h2>
          <p>{data.text}</p>
          {data.image && <img src={data.image} alt='post image' />}
        </div>
        {!isProjectIdea && data.event[0] && (
          <>
            <div className={styles.flex4}>
              <div className={styles.btnFlex}>
                {!apiContext.userData?.isCommunity && !isEventExpired() && (
                  <>
                    <button className={styles.btnFlex} onClick={onWillAttendClicked}>
                      <img
                        src={data.isAttended ? '/icons/attend-icon-active.svg' : '/icons/attend-icon.svg'}
                        alt='katılacağını belirt'
                      />
                      <span className={styles.bottomText}>Katılacağını Belirt</span>
                    </button>
                    {!apiContext.userData?.isCommunity && <span className={styles.middot}>&middot;</span>}
                    <span className={styles.bottomText}>{`${data.event[0].attendantsNum} Katılımcı`}</span>
                  </>
                )}
                {isEventExpired() && (
                  <span className={styles.bottomText}>{`${data.event[0].attendantsNum} Kişi Katıldı`}</span>
                )}
              </div>
              {isEventExpired() && <div className={styles.eventDate}>Etkinliğin Süresi Doldu</div>}
              {!isEventExpired() && (
                <div className={styles.eventDate}>
                  <img src='/icons/date-icon.svg' alt='etkinlik tarihi' />
                  {getDateAndTime(data.event[0].date)}
                </div>
              )}
            </div>
            <div className={styles.divider}></div>
          </>
        )}
        <div className={styles.flex4}>
          <div className={styles.btnFlex}>
            <>
              {!isPoster && !apiContext.userData?.isCommunity && (
                <button className={styles.btnFlex} onClick={onLikeClicked}>
                  <img src={data.isLiked ? '/icons/like-icon-active.svg' : '/icons/like-icon.svg'} alt='beğen' />
                  <span className={styles.bottomText}>Beğen</span>
                </button>
              )}
              {!isPoster && !apiContext.userData?.isCommunity && <span className={styles.middot}>&middot;</span>}
              <span className={styles.bottomText}>{`${data.likeNum} Beğeni`}</span>
            </>
          </div>
          {!apiContext.userData?.isCommunity && (
            <button className={styles.btnFlex} onClick={onSaveClicked}>
              <img src={data.isBookmarked ? '/icons/save-icon-active.svg' : '/icons/save-icon.svg'} alt='kaydet' />
              <span className={styles.bottomText}>Kaydet</span>
            </button>
          )}
        </div>
      </div>
    )
  );
}
