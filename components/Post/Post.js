import styles from './Post.module.scss';
import { Link } from 'components';
import { useEffect, useRef, useState } from 'react';

export default function Post({ postData }) {
  const [likeCount, setLikeCount] = useState(postData.likeCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [willAttend, setWillAttend] = useState(false);
  const [participantCount, setParticipantCount] = useState(postData.eventDetails?.participantCount);
  const [isContentOverflown, setIsContentOverflown] = useState(true);

  function onLikeClicked() {
    setLikeCount((oldLikeCount) => (isLiked ? oldLikeCount - 1 : oldLikeCount + 1));
    setIsLiked((oldIsLiked) => !oldIsLiked);
    // send request to backend
  }

  function onSaveClicked() {
    setIsSaved((oldIsSaved) => !oldIsSaved);
    // send request to backend
  }

  function onWillAttendClicked() {
    setParticipantCount((oldParticipantCount) =>
      willAttend ? oldParticipantCount - 1 : oldParticipantCount + 1,
    );
    setWillAttend((oldWillAttend) => !oldWillAttend);
    // send request to backend
  }

  return (
    <div className={styles.post} style={isContentOverflown ? { maxHeight: '400px' } : undefined}>
      <div className={styles.flex1}>
        <img src={postData.community.pfpSrc} alt='profile picture' />
        <div className={styles.flex2}>
          <Link href={postData.community.url || '#'}>{postData.community.name}</Link>
          <div className={styles.flex3}>
            <div className={styles.highlight}>{postData.poster.name}</div>
            <span className={styles.middot}>&middot;</span>
            <div className={styles.highlight}>{postData.poster.role}</div>
            <span className={styles.middot}>&middot;</span>
            {postData.date}
            <span className={styles.middot}>&middot;</span>
            <img
              src={postData.visibility === 'public' && '/icons/public-icon.svg'}
              alt='visibility icon'
              title={`${postData.visibility} post`}
            />
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
        <h2>{postData.title}</h2>
        <p>{postData.content}</p>
      </div>
      {postData.eventDetails && (
        <>
          <div className={styles.flex4}>
            <div className={styles.btnFlex}>
              <button className={styles.btnFlex} onClick={onWillAttendClicked}>
                <img
                  src={willAttend ? '/icons/attend-icon-active.svg' : '/icons/attend-icon.svg'}
                  alt='katılacağını belirt'
                />
                <span className={styles.bottomText}>Katılacağını Belirt</span>
              </button>
              <span className={styles.middot}>&middot;</span>
              <span className={styles.bottomText}>{`${participantCount} Katılımcı`}</span>
            </div>
            <div className={styles.eventDate}>
              <img src='/icons/date-icon.svg' alt='etkinlik tarihi' />
              {postData.eventDetails.date}
            </div>
          </div>
          <div className={styles.divider}></div>
        </>
      )}
      <div className={styles.flex4}>
        <div className={styles.btnFlex}>
          <button className={styles.btnFlex} onClick={onLikeClicked}>
            <img
              src={isLiked ? '/icons/like-icon-active.svg' : '/icons/like-icon.svg'}
              alt='beğen'
            />
            <span className={styles.bottomText}>Beğen</span>
          </button>
          <span className={styles.middot}>&middot;</span>
          <span className={styles.bottomText}>{`${likeCount} Beğeni`}</span>
        </div>
        <button className={styles.btnFlex} onClick={onSaveClicked}>
          <img
            src={isSaved ? '/icons/save-icon-active.svg' : '/icons/save-icon.svg'}
            alt='kaydet'
          />
          <span className={styles.bottomText}>Kaydet</span>
        </button>
      </div>
    </div>
  );
}
