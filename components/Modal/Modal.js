import { useState } from 'react';
import styles from './Modal.module.scss';

export default function Modal({ children, isOpen, setIsOpen }) {
  const [isBackgroundMouseDown, setIsBackgroundMouseDown] = useState(false);

  function stopForegroundEvent(event) {
    event.stopPropagation();
    setIsBackgroundMouseDown(false);
  }

  return (
    isOpen && (
      <div
        className={styles.background}
        onMouseDown={() => setIsBackgroundMouseDown(true)}
        onMouseUp={() => {
          if (isBackgroundMouseDown) {
            setIsOpen(false);
            setIsBackgroundMouseDown(false);
          }
        }}
      >
        <div onMouseDown={stopForegroundEvent} onMouseUp={stopForegroundEvent}>
          {children}
        </div>
      </div>
    )
  );
}
