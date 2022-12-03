import styles from './Register.module.scss';
import UserType from '../UserType/UserType';
import { useState } from 'react';

function Register({ setIsSignedUp, setIsLoggedIn }) {
  const [userType, setUserType] = useState("student");
  const [user, setUser] = useState({ username: "", 
                                     name: "", 
                                     password: "", 
                                     confirmPassword: "" 
  });

  const handleChange = (e) => {
    const {name, value} = e.target; 
    console.log(name, value);
    setUser((prev) => {
      return {...prev, [name]: value}
    })
  };

  const handleClick = () => {
    // If any of the fields are empty, alert the user
    if (user.username === "" || user.name === "" || user.password === "" || user.confirmPassword === "") {
      alert("Lütfen tüm alanları doldurunuz.");
      setIsSignedUp(false);
    }
    else
    {
      // If the passwords do not match, alert the user
      if (user.password !== user.confirmPassword) {
        alert("Şifreler uyuşmuyor.");
        setIsSignedUp(false);
        setIsLoggedIn(false);
      }
      else
      {
        // If the passwords match, alert the user
        alert("Kayıt başarılı.");
        setIsSignedUp(true);
        setIsLoggedIn(true);
      }
    }
  };

  return (
    <div className={styles.register}>
      
      <div className={styles.banner}>
        <p className={styles.logo}>cmis</p> <p>'e Kayıt Ol</p>
      </div>
      
      <UserType userType={userType} setUserType={setUserType}/>

      <div className={styles.welcome}>
         <p>Yeni bir</p>
         <p className={styles.logo}>cmis</p> <p>hesabı oluşturun</p>
      </div>

      <input type={"text"} name='username' placeholder={"kullanıcı adı"} onChange={handleChange} />
      
      {userType === "student" ? 
        <input type={"text"} name='name' placeholder={"isim ve soyisim"} onChange={handleChange}/> :
        <input type={"text"} name='name' placeholder={"topluluk/takım adı"} onChange={handleChange} />    
      }
      <input type={"password"} name='password' placeholder={"şifre"} onChange={handleChange} />
      <input type={"password"} name='confirmPassword' placeholder={"şifre tekrar"} onChange={handleChange} />

      <div className={styles.entrance}>
        <button onClick={handleClick}> Kayıt Ol </button>
      </div>

      <div className={styles.foot}>
        <p className={styles.logo}>cmis</p> <p>hesabınızla giris yapmak için</p> <a href="">tıklayın</a>
      </div>
      
    </div>
  )
}

export default Register