import styles from 'styles/Management.module.scss';
import ManagementPage from 'components/ManagementPage/ManagementPage';
import MemberListElement from 'components/MemberListElement/MemberListElement';
import { useEffect, useRef, useState } from 'react';
import Modal from 'components/Modal/Modal';
import clsx from 'clsx';

function MembersListElement() {
  const memberListElement = (
    <MemberListElement pfpSrc='/images/pfp6.png' name='Şamil Berat Delioğulları' profileLink='#' />
  );
  const [isAuthorizeModalOpen, setIsAuthorizeModalOpen] = useState(false);
  const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);
  const [roleInputValue, setRoleInputValue] = useState('');
  const [isPostsChecked, setIsPostsChecked] = useState(false);
  const [isAddMemberChecked, setIsAddMemberChecked] = useState(false);
  const [isRemoveMemberChecked, setIsRemoveMemberChecked] = useState(false);
  const [isAuthorizeChecked, setIsAuthorizeChecked] = useState(false);

  useEffect(() => {
    setRoleInputValue('');
    setIsPostsChecked(false);
    setIsAddMemberChecked(false);
    setIsRemoveMemberChecked(false);
    setIsAuthorizeChecked(false);
  }, [isAuthorizeModalOpen]);

  function confirmAuthorizeModal() {
    setIsAuthorizeModalOpen(false);
  }

  function confirmRemoveMemberModal() {
    setIsRemoveMemberModalOpen(false);
  }

  return (
    <div className={styles.membersListElement}>
      {memberListElement}
      <div className={styles.buttons}>
        <button className='mainButton' onClick={() => setIsAuthorizeModalOpen(true)}>
          Yetkiler
        </button>
        <button className='mainButton mainButtonNegative' onClick={() => setIsRemoveMemberModalOpen(true)}>
          Üyelikten Çıkar
        </button>
      </div>
      <Modal isOpen={isAuthorizeModalOpen} setIsOpen={setIsAuthorizeModalOpen}>
        <div className={clsx(styles.modal, styles.authorizeModal)}>
          <h2>Yetkiler</h2>
          {memberListElement}
          <ul>
            <div>
              <input type='checkbox' id='posts' onChange={(e) => setIsPostsChecked(e.target.checked)} />
              <label for='posts'>Gönderi ekleme/düzenleme/silme</label>
            </div>
            <div>
              <input type='checkbox' id='addMember' onChange={(e) => setIsAddMemberChecked(e.target.checked)} />
              <label for='addMember'>Üyelik başvurusu kabul etme/reddetme</label>
            </div>
            <div>
              <input type='checkbox' id='removeMember' onChange={(e) => setIsRemoveMemberChecked(e.target.checked)} />
              <label for='removeMember'>Üyelikten çıkarma</label>
            </div>
            <div>
              <input type='checkbox' id='authorize' onChange={(e) => setIsAuthorizeChecked(e.target.checked)} />
              <label for='authorize'>Yetkileri düzenleme</label>
            </div>
          </ul>
          <input
            className={styles.roleInput}
            type='text'
            placeholder='rol'
            onChange={(e) => setRoleInputValue(e.target.value)}
          />
          <div className={styles.modalButtons}>
            <button className='mainButton mainButtonNeutral' onClick={() => setIsAuthorizeModalOpen(false)}>
              Vazgeç
            </button>
            <button className='mainButton' onClick={confirmAuthorizeModal} disabled={roleInputValue === ''}>
              Onayla
            </button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={isRemoveMemberModalOpen} setIsOpen={setIsRemoveMemberModalOpen}>
        <div className={styles.modal}>
          <h2>Üyelikten Çıkar</h2>
          {memberListElement}
          <div className={styles.modalButtons}>
            <button className='mainButton mainButtonNeutral' onClick={() => setIsRemoveMemberModalOpen(false)}>
              Vazgeç
            </button>
            <button className='mainButton mainButtonNegative' onClick={confirmRemoveMemberModal}>
              Üyelikten Çıkar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function Members() {
  return (
    <ManagementPage>
      <div className={styles.managementList}>
        <MembersListElement />
        <MembersListElement />
        <MembersListElement />
        <MembersListElement />
        <MembersListElement />
      </div>
    </ManagementPage>
  );
}
