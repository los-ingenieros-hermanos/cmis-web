import styles from 'styles/Management.module.scss';
import ManagementPage from 'components/ManagementPage/ManagementPage';
import MemberListElement from 'components/MemberListElement/MemberListElement';
import { useState } from 'react';
import Modal from 'components/Modal/Modal';
import clsx from 'clsx';

function ApplicationsListElement() {
  const memberListElement = (
    <MemberListElement pfpSrc='/images/pfp6.png' name='Şamil Berat Delioğulları' profileLink='#' />
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  function acceptMember() {
    setIsModalOpen(false);
  }

  function rejectMember() {
    setIsModalOpen(false);
  }

  return (
    <div className={styles.membersListElement}>
      {memberListElement}
      <div className={styles.buttons}>
        <button className='mainButton' onClick={() => setIsModalOpen(true)}>
          Başvuruyu Görüntüle
        </button>
      </div>
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        <div className={clsx(styles.modal, styles.applicationModal)}>
          <h2>Üyelik Başvurusu</h2>
          {memberListElement}
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lobortis maximus nisl, id rutrum ex
            pellentesque at. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
            Maecenas ut lacinia massa, vitae bibendum erat. Nulla mollis id elit nec sollicitudin. Vestibulum ante ipsum
            primis in faucibus orci luctus et ultrices posuere cubilia curae; Quisque cursus aliquam ultricies.
            Suspendisse varius efficitur purus, a fringilla dolor efficitur id. Nam in sodales mauris, ac tempor turpis.
            Duis vitae libero nec elit rhoncus pulvinar vel ac lectus. Curabitur interdum mi non dolor aliquam, nec
            tristique urna fermentum. Pellentesque id aliquet nisl, eu congue neque. Morbi lectus nunc, rhoncus id est
            vitae, mattis dictum urna. In eget vestibulum lacus, et sollicitudin leo. Proin tincidunt laoreet tincidunt.
          </p>
          <div className={styles.modalButtons}>
            <button className='mainButton mainButtonNeutral' onClick={() => setIsModalOpen(false)}>
              Vazgeç
            </button>
            <button className='mainButton' onClick={acceptMember}>
              Kabul Et
            </button>
            <button className='mainButton mainButtonNegative' onClick={rejectMember}>
              Reddet
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function Applications() {
  return (
    <ManagementPage>
      <div className={styles.managementList}>
        <ApplicationsListElement />
        <ApplicationsListElement />
        <ApplicationsListElement />
        <ApplicationsListElement />
        <ApplicationsListElement />
      </div>
    </ManagementPage>
  );
}
