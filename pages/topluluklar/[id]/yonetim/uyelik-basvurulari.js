import clsx from 'clsx';
import ManagementPage from 'components/ManagementPage/ManagementPage';
import MemberListElement from 'components/MemberListElement/MemberListElement';
import Modal from 'components/Modal/Modal';
import { useRouter } from 'next/router';
import { AuthContext } from 'pages/_app';
import { useCallback, useContext, useEffect, useState } from 'react';
import styles from 'styles/Management.module.scss';

function ApplicationsListElement({ application, onChanged }) {
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

  async function onRejectClicked() {
    await authContext.rejectMemberApplication(router.query.id, application.student.id);
    setIsModalOpen(false);
    onChanged();
  }

  async function onAcceptClicked() {
    await authContext.acceptMemberApplication(router.query.id, application.student.id);
    setIsModalOpen(false);
    onChanged();
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

function ApplicationReqModal({ setIsApplicationReqOpen }) {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [applicationReq, setApplicationReq] = useState('');

  useEffect(() => {
    (async () => {
      const data = await authContext.getCommunity(router.query.id);
      setApplicationReq(data.applicationCriteria);
    })();
  }, [authContext, router.query.id]);

  function onApplicationReqSaved() {
    authContext.updateCommunity({ id: router.query.id, applicationCriteria: applicationReq });
    setIsApplicationReqOpen(false);
  }

  return (
    <div className={styles.modal}>
      <h2>Başvuru gereksinimleri</h2>
      <textarea
        placeholder='Başvuru gereksinimleri'
        value={applicationReq}
        onChange={(e) => setApplicationReq(e.target.value)}
      ></textarea>
      <div className={styles.modalButtons}>
        <button className='mainButton mainButtonNeutral' onClick={() => setIsApplicationReqOpen(false)}>
          Vazgeç
        </button>
        <button className='mainButton' onClick={onApplicationReqSaved}>
          Kaydet
        </button>
      </div>
    </div>
  );
}

export default function Applications() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [isApplicationReqOpen, setIsApplicationReqOpen] = useState(false);

  const fetchApplications = useCallback(async () => {
    setApplications((await authContext.getMemberApplications(router.query.id)) || []);
  }, [authContext, router.query.id]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  function getApplicationListElements() {
    return applications.map((application) => (
      <ApplicationsListElement key={application.id} application={application} onChanged={fetchApplications} />
    ));
  }

  return (
    <ManagementPage>
      <button
        className='mainButton'
        onClick={() => setIsApplicationReqOpen(true)}
        style={{ marginTop: '16px', height: '35px', fontSize: '16px' }}
      >
        Başvuru Gereksinimlerini Düzenle
      </button>
      <Modal isOpen={isApplicationReqOpen} setIsOpen={setIsApplicationReqOpen}>
        <ApplicationReqModal setIsApplicationReqOpen={setIsApplicationReqOpen} />
      </Modal>
      {getApplicationListElements().length > 0 ? (
        <div className={styles.managementList}>{getApplicationListElements()}</div>
      ) : (
        <p className='noApplications'>Üyelik başvurusu yok</p>
      )}
    </ManagementPage>
  );
}
