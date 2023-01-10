import clsx from 'clsx';
import { useRouter } from 'next/router';
import { ApiContext, imageToBase64 } from 'pages/_app';
import { useContext, useState } from 'react';
import styles from './NewPost.module.scss';

export default function NewPost({ setIsNewPostOpen, isProjectIdea, onPostSent }) {
  const router = useRouter();
  const apiContext = useContext(ApiContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isImageChecked, setIsImageChecked] = useState(false);
  const [image, setImage] = useState('');
  const [isEventChecked, setIsEventChecked] = useState(false);
  const [eventDate, setEventDate] = useState(new Date());
  const [visibility, setVisibility] = useState('Genel');

  function getDateString(date) {
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    return offsetDate.toISOString().substring(0, 10);
  }

  function getTimeString(date) {
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    return offsetDate.toISOString().substring(11, 16);
  }

  function onTitleChanged(e) {
    setTitle(e.target.value);
  }

  function onContentChanged(e) {
    setContent(e.target.value);
  }

  function onImageCheckboxChanged(e) {
    setIsImageChecked(e.target.checked);
  }

  function onImageChanged(e) {
    imageToBase64(e.target.files[0], (base64) => setImage(base64));
  }

  function onEventCheckboxChanged(e) {
    setIsEventChecked(e.target.checked);
  }

  function onEventDateChanged(e) {
    setEventDate((oldEventDate) => {
      const newEventDate = new Date(e.target.value + 'T' + getTimeString(oldEventDate));
      try {
        newEventDate.toISOString();
        return newEventDate;
      } catch {
        return oldEventDate;
      }
    });
  }

  function onEventTimeChanged(e) {
    setEventDate((oldEventDate) => {
      const newEventDate = new Date(getDateString(oldEventDate) + 'T' + e.target.value + ':00');
      try {
        newEventDate.toISOString();
        return newEventDate;
      } catch {
        return oldEventDate;
      }
    });
  }

  function onVisibilityChanged(e) {
    setVisibility(e.target.value);
  }

  function onCancelClicked() {
    setIsNewPostOpen(false);
  }

  async function onSendClicked() {
    const date = new Date();

    const postData = {
      title,
      text: content,
      image,
      visibility: isProjectIdea ? null : visibility === 'Genel' ? 'global' : 'private',
      event: isProjectIdea
        ? null
        : isEventChecked
        ? [
            {
              date: {
                year: eventDate.getFullYear(),
                month: eventDate.getMonth(),
                day: eventDate.getDate(),
                hour: eventDate.getHours(),
                minute: eventDate.getMinutes(),
              },
            },
          ]
        : null,
      date: isProjectIdea
        ? null
        : {
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes(),
          },
    };

    let newPostData;
    if (isProjectIdea) {
      newPostData = await apiContext.sendStudentPost(postData);
    } else {
      newPostData = await apiContext.sendCommunityPost(router.query.id, postData);
    }

    onPostSent(newPostData);
    setIsNewPostOpen(false);
  }

  return (
    <div className={styles.newPost}>
      <input className={styles.title} type='text' placeholder='Başlık' onChange={onTitleChanged} value={title} />
      <textarea className={styles.content} id='content' onChange={onContentChanged} value={content}></textarea>
      <div className={styles.checkboxInput}>
        <div className={styles.checkbox} onChange={onImageCheckboxChanged}>
          <input type='checkbox' id='image' />
          <label htmlFor='image'>Görüntü ekle</label>
        </div>
        {isImageChecked && <input type='file' accept='image/*' onChange={onImageChanged} />}
      </div>
      {!isProjectIdea && (
        <div className={styles.checkboxInput}>
          <div className={styles.checkbox} onChange={onEventCheckboxChanged}>
            <input type='checkbox' id='event' />
            <label htmlFor='event'>Etkinlik ekle</label>
          </div>
          {isEventChecked && (
            <>
              <input
                className={styles.eventDate}
                type='date'
                value={getDateString(eventDate)}
                onChange={onEventDateChanged}
              />
              <input
                className={styles.eventTime}
                type='time'
                value={getTimeString(eventDate)}
                onChange={onEventTimeChanged}
              />
            </>
          )}
        </div>
      )}
      {!isProjectIdea && (
        <div className={styles.visibilityInput}>
          <label htmlFor='visibility'>Görünürlük:</label>
          <select id='visibility' value={visibility} onChange={onVisibilityChanged}>
            <option>Genel</option>
            <option>Üye</option>
          </select>
        </div>
      )}
      <div className={styles.buttons}>
        <button className={clsx('mainButton', 'mainButtonNeutral')} onClick={onCancelClicked}>
          Vazgeç
        </button>
        <button className='mainButton' onClick={onSendClicked} disabled={!title || !content}>
          Gönder
        </button>
      </div>
    </div>
  );
}
