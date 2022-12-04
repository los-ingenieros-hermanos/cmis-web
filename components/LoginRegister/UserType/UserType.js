import styles from './UserType.module.scss';

function UserType({ userType, setUserType }) {
  const clickStudent = () => {
    setUserType('student');
  };
  const clickCommunity = () => {
    setUserType('community');
  };

  if (userType === 'student') {
    return (
      <div className={styles.userType}>
        <div>
          <img src='/icons/login-user-icon.svg' alt='student' />
          <a className={styles.active} onClick={clickStudent}>
            Öğrenci
          </a>
        </div>
        <div>
          <img src='/icons/group-icon.svg' alt='' />
          <a onClick={clickCommunity}>Topluluk/Takım</a>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.userType}>
        <div>
          <img src='/icons/login-user-icon.svg' alt='student' />
          <a onClick={clickStudent}>Öğrenci</a>
        </div>
        <div>
          <img src='/icons/group-icon.svg' alt='' />
          <a className={styles.active} onClick={clickCommunity}>
            Topluluk/Takım
          </a>
        </div>
      </div>
    );
  }
}

export default UserType;
