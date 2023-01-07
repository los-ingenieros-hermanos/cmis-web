import clsx from 'clsx';
import ManagementPage from 'components/ManagementPage/ManagementPage';
import MemberListElement from 'components/MemberListElement/MemberListElement';
import Modal from 'components/Modal/Modal';
import { useRouter } from 'next/router';
import { AuthContext } from 'pages/_app';
import { useContext, useEffect, useState } from 'react';
import styles from 'styles/Management.module.scss';

function ApplicationsListElement({ application }) {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const memberListElement = (
    <MemberListElement
      pfpSrc={application.student.image}
      name={`${application.student.user.firstName} ${application.student.user.lastName}`}
      profileLink={`/ogrenciler/${application.student.id}`}
    />
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  function onCancelClicked() {
    setIsModalOpen(false);
  }

  function onRejectClicked() {
    authContext.rejectMemberApplication(router.query.id, application.student.id);
    setIsModalOpen(false);
  }

  function onAcceptClicked() {
    authContext.acceptMemberApplication(router.query.id, application.student.id);
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
          <p>{application.message}</p>
          <div className={styles.modalButtons}>
            <button className='mainButton mainButtonNeutral' onClick={onCancelClicked}>
              Vazgeç
            </button>
            <button className='mainButton mainButtonNegative' onClick={onRejectClicked}>
              Reddet
            </button>
            <button className='mainButton' onClick={onAcceptClicked}>
              Kabul Et
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function Applications() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    (async () => {
      setApplications((await authContext.getMemberApplications(router.query.id)) || []);
    })();
  }, [authContext, router.query.id]);

  function getApplicationListElements() {
    return applications.map((application) => (
      <ApplicationsListElement key={application.id} application={application} />
    ));
  }

  return (
    <ManagementPage>
      <div className={styles.managementList}>{getApplicationListElements()}</div>
    </ManagementPage>
  );
}
