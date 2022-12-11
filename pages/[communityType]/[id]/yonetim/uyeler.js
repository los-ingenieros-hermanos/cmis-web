import styles from 'styles/Members.module.scss';
import ManagementPage from 'components/ManagementPage/ManagementPage';
import MemberListElement from 'components/MemberListElement/MemberListElement';

function MembersListElement() {
  return (
    <div className={styles.membersListElement}>
      <MemberListElement pfpSrc='images/pfp6.png' name='Şamil Berat Delioğulları' profileLink='#' />
    </div>
  );
}

export default function Members() {
  return (
    <ManagementPage>
      <MembersListElement />
      <MembersListElement />
      <MembersListElement />
      <MembersListElement />
      <MembersListElement />
    </ManagementPage>
  );
}
