import styles from './UserType.module.scss'
import { useState } from 'react'

function UserType({ userType, setUserType }) {
  
  const clickStudent = (e) => {
    setUserType("student");
  };
  const clickCommunity = (e) => {
    setUserType("community");
  };

  if (userType === "student") {
    return (
        <div className={styles.userType}>
          <div>
            <img src="/icons/login-user-icon.svg" alt="student" />
            <a className={styles.active} onClick={clickStudent} >Öğrenci</a>
          </div>
          <div>
            <img src="/icons/group-icon.svg" alt="" />
            <a onClick={clickCommunity}>Topluluk/Takım</a>
          </div>
      </div>
    )
  }
  else {
    return (
      <div className={styles.userType}>
        <div>
          <img src="/icons/login-user-icon.svg" alt="student" />
          <a onClick={clickStudent}>Öğrenci</a>
        </div>
        <div>
          <img src="/icons/group-icon.svg" alt="" />
          <a className={styles.active} onClick={clickCommunity}>Topluluk/Takım</a>
        </div>
      </div>
    )
  }
}

export default UserType