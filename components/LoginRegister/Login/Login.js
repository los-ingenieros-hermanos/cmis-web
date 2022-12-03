import styles from './Login.module.scss';
import UserType from '../UserType/UserType';
import { useState } from 'react';


function Login({ setIsLoggedIn }) {

  const [user, setUser] = useState({ username: "", password: "" });
  const [userType, setUserType] = useState("student");

  const handleChange = (e) => { 
    if (e.target.type === "text") {
      setUser({ ...user, username: e.target.value });
    }
    else if (e.target.type === "password") {
      setUser({ ...user, password: e.target.value });
    }
  };

  const handleClick = () => {
    if (user.username === "admin" && user.password === "admin") {
      alert("Giris Basarili");
      setIsLoggedIn(true);
    }
    else {
      alert("Giris Basarisiz");
      setIsLoggedIn(false);
    }
  }

  // Buraya UserType'a gore giris cikis yapilabilir

  return (
    <div className={styles.login}>
      
      <div className={styles.banner}>
        <p className={styles.logo}>cmis</p> <p>'e Giriş Yap</p>
      </div>

      <UserType userType={userType} setUserType={setUserType}/>
      
      <div className={styles.welcome}>
        <p className={styles.logo}>cmis</p> <p>hesabı ile giriş yapın</p>

      </div>

      <input type={"text"} placeholder={"kullanıcı adı"} onChange={handleChange}/>
      <input type={"password"} placeholder={"şifre"} onChange={handleChange}/>

      <div className={styles.entrance}>
        <a href="">Şifremi Unuttum</a>
        <button onClick={handleClick}> Giriş </button> 
      </div>

      <div className={styles.foot}>
        <p className={styles.logo}>cmis</p> <p>hesabı oluşturmak için</p> <a href=''>tıklayın</a>
      </div>
      
    </div>
  )
}

export default Login