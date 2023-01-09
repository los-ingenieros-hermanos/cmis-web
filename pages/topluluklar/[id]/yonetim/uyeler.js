import clsx from 'clsx';
import ManagementPage from 'components/ManagementPage/ManagementPage';
import MemberListElement from 'components/MemberListElement/MemberListElement';
import Modal from 'components/Modal/Modal';
import { useRouter } from 'next/router';
import { AuthContext } from 'pages/_app';
import { useCallback, useContext, useEffect, useState } from 'react';
import styles from 'styles/Management.module.scss';

// Authorize modal for multiple authorization types
// function AuthorizeModal({ memberListElement, isAuthorizeModalOpen, setIsAuthorizeModalOpen }) {
//   const [roleInputValue, setRoleInputValue] = useState('');
//   const [isPostsChecked, setIsPostsChecked] = useState(false);
//   const [isAddMemberChecked, setIsAddMemberChecked] = useState(false);
//   const [isRemoveMemberChecked, setIsRemoveMemberChecked] = useState(false);
//   const [isAuthorizeChecked, setIsAuthorizeChecked] = useState(false);

//   useEffect(() => {
//     setRoleInputValue('');
//     setIsPostsChecked(false);
//     setIsAddMemberChecked(false);
//     setIsRemoveMemberChecked(false);
//     setIsAuthorizeChecked(false);
//   }, []);

//   function onCancelClicked() {
//     setIsAuthorizeModalOpen(false);
//   }

//   function onConfirmClicked() {
//     // backend stuff
//     setIsAuthorizeModalOpen(false);
//   }

//   <Modal isOpen={isAuthorizeModalOpen} setIsOpen={setIsAuthorizeModalOpen}>
//     <div className={clsx(styles.modal, styles.authorizeModal)}>
//       <h2>Yetkiler</h2>
//       {memberListElement}
//       <ul>
//         <div>
//           <input
//             type='checkbox'
//             id='posts'
//             checked={isPostsChecked}
//             onChange={(e) => setIsPostsChecked(e.target.checked)}
//           />
//           <label for='posts'>Gönderi ekleme/düzenleme/silme</label>
//         </div>
//         <div>
//           <input
//             type='checkbox'
//             id='addMember'
//             checked={isAddMemberChecked}
//             onChange={(e) => setIsAddMemberChecked(e.target.checked)}
//           />
//           <label for='addMember'>Üyelik başvurusu kabul etme/reddetme</label>
//         </div>
//         <div>
//           <input
//             type='checkbox'
//             id='removeMember'
//             checked={isRemoveMemberChecked}
//             onChange={(e) => setIsRemoveMemberChecked(e.target.checked)}
//           />
//           <label for='removeMember'>Üyelikten çıkarma</label>
//         </div>
//         <div>
//           <input
//             type='checkbox'
//             id='authorize'
//             checked={isAuthorizeChecked}
//             onChange={(e) => setIsAuthorizeChecked(e.target.checked)}
//           />
//           <label for='authorize'>Yetkileri düzenleme</label>
//         </div>
//       </ul>
//       <input
//         className={styles.roleInput}
//         type='text'
//         placeholder='rol'
//         onChange={(e) => setRoleInputValue(e.target.value)}
//       />
//       <div className={styles.modalButtons}>
//         <button className='mainButton mainButtonNeutral' onClick={onCancelClicked}>
//           Vazgeç
//         </button>
//         <button className='mainButton' onClick={onConfirmClicked} disabled={roleInputValue === ''}>
//           Onayla
//         </button>
//       </div>
//     </div>
//   </Modal>;
// }

function getMemberListElement(member) {
  return (
    <MemberListElement
      pfpSrc={member.student.image}
      name={`${member.student.user.firstName} ${member.student.user.lastName}`}
      profileLink={`/ogrenciler/${member.student.id}`}
    />
  );
}

function AuthorizeModal({ member, isOpen, setIsOpen, onChanged }) {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  function onCancelClicked() {
    setIsOpen(false);
  }

  async function onAuthorizeClicked() {
    if (member.authorizations[0] === 'NONE') {
      await authContext.authorizeMember(router.query.id, member.student.id);
    } else {
      await authContext.removeMemberAuthorization(router.query.id, member.student.id);
    }
    setIsOpen(false);
    onChanged();
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={clsx(styles.modal, styles.authorizeModal)}>
        <h2>Yetki Ver</h2>
        {getMemberListElement(member)}
        <p>Yetki verilen üye topluluk hesabıyla aynı yetkilere sahip olacak.</p>
        <div className={styles.modalButtons}>
          <button className='mainButton mainButtonNeutral' onClick={onCancelClicked}>
            Vazgeç
          </button>
          {member.authorizations[0] === 'NONE' ? (
            <button className='mainButton' onClick={onAuthorizeClicked}>
              Yetki Ver
            </button>
          ) : (
            <button className='mainButton mainButtonNegative' onClick={onAuthorizeClicked}>
              Yetkisini Kaldır
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

function RemoveMemberModal({ member, isOpen, setIsOpen, onChanged }) {
  const authContext = useContext(AuthContext);

  function onCancelClicked() {
    setIsOpen(false);
  }

  async function onRemoveMemberClicked() {
    await authContext.removeMember(authContext.userData?.id, member.student.id);
    setIsOpen(false);
    onChanged();
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={styles.modal}>
        <h2>Üyelikten Çıkar</h2>
        {getMemberListElement(member)}
        <div className={styles.modalButtons}>
          <button className='mainButton mainButtonNeutral' onClick={onCancelClicked}>
            Vazgeç
          </button>
          <button className='mainButton mainButtonNegative' onClick={onRemoveMemberClicked}>
            Üyelikten Çıkar
          </button>
        </div>
      </div>
    </Modal>
  );
}

function MembersListElement({ member, onChanged }) {
  const [isAuthorizeModalOpen, setIsAuthorizeModalOpen] = useState(false);
  const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);

  return (
    <div className={styles.membersListElement}>
      {getMemberListElement(member)}
      <div className={styles.buttons}>
        {member.authorizations[0] === 'NONE' ? (
          <button className='mainButton' onClick={() => setIsAuthorizeModalOpen(true)}>
            Yetki Ver
          </button>
        ) : (
          <button className='mainButton mainButtonNegative' onClick={() => setIsAuthorizeModalOpen(true)}>
            Yetkisini Kaldır
          </button>
        )}
        <button className='mainButton mainButtonNegative' onClick={() => setIsRemoveMemberModalOpen(true)}>
          Üyelikten Çıkar
        </button>
        <AuthorizeModal
          member={member}
          isOpen={isAuthorizeModalOpen}
          setIsOpen={setIsAuthorizeModalOpen}
          onChanged={onChanged}
        />
        <RemoveMemberModal
          member={member}
          isOpen={isRemoveMemberModalOpen}
          setIsOpen={setIsRemoveMemberModalOpen}
          onChanged={onChanged}
        />
      </div>
    </div>
  );
}

export default function Members() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    setMembers((await authContext.getMembers(router.query.id)) || []);
  }, [authContext, router.query.id]);

  useEffect(() => {
    fetchMembers();
    setIsLoading(false);
  }, [fetchMembers]);

  const getMembersListElements = useCallback(() => {
    const elem = members.map((member) => (
      <MembersListElement key={member.id} member={member} onChanged={fetchMembers} />
    ));
    return elem;
  }, [members, fetchMembers]);

  return (
    <ManagementPage>
      {isLoading ? (
        <div className='membersLoader'></div>
      ) : getMembersListElements().length > 0 ? (
        <div className={styles.managementList}>{getMembersListElements()}</div>
      ) : (
        <p className='noMembers'>Üye yok</p>
      )}
    </ManagementPage>
  );
}
