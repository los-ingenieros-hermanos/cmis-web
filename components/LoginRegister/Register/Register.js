import styles from './Register.module.scss';
import UserType from '../UserType/UserType';
import { useContext, useState } from 'react';
import { AuthContext } from 'pages/_app';

function Register({ setIsLoginOpen, setIsSignUpOpen }) {
  const [userType, setUserType] = useState('student');
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const authContext = useContext(AuthContext);

  function onBackgroundClicked() {
    authContext.setIsSignUpOpen(false);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleClick = async () => {
    // If any of the fields are empty, alert the user
    if (
      user.firstName === '' ||
      (userType === 'student' && user.lastName === '') ||
      user.email === '' ||
      user.password === '' ||
      user.confirmPassword === ''
    ) {
      alert('Lütfen tüm alanları doldurunuz.');
    } else {
      // If the passwords do not match, alert the user
      if (user.password !== user.confirmPassword) {
        alert('Şifreler uyuşmuyor.');
      } else {
        // If the passwords match, alert the user
        const data = await authContext.signUp(
          user.firstName,
          user.lastName,
          user.email,
          user.password,
          userType,
        );
        if (data) {
          authContext.setIsSignUpOpen(false);
          alert('Kayıt başarılı.');
        } else {
          alert('Kayıt başarısız');
        }
      }
    }
  };

  return (
    <div className={styles.background} onMouseDown={onBackgroundClicked}>
      <div className={styles.register} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.banner}>
          <p className={styles.logo}>cmis</p> <p>&apos;e Kayıt Ol</p>
        </div>

        <UserType userType={userType} setUserType={setUserType} />

        <div className={styles.welcome}>
          <p>Yeni bir</p>
          <p className={styles.logo}>cmis</p> <p>hesabı oluşturun</p>
        </div>

        {userType === 'student' ? (
          <>
            <input type={'text'} name='firstName' placeholder={'isim'} onChange={handleChange} />
            <input type={'text'} name='lastName' placeholder={'soy isim'} onChange={handleChange} />
          </>
        ) : (
          <input
            type={'text'}
            name='firstName'
            placeholder={'topluluk/takım ismi'}
            onChange={handleChange}
          />
        )}
        <input type={'text'} name='email' placeholder={'email'} onChange={handleChange} />
        <input type={'password'} name='password' placeholder={'şifre'} onChange={handleChange} />
        <input
          type={'password'}
          name='confirmPassword'
          placeholder={'şifre tekrar'}
          onChange={handleChange}
        />

        <div className={styles.entrance}>
          <button onClick={handleClick}> Kayıt Ol </button>
        </div>

        <div className={styles.foot}>
          <p className={styles.logo}>cmis</p> <p>hesabınızla giris yapmak için</p>{' '}
          <a
            onClick={() => {
              authContext.setIsLoginOpen(true);
              authContext.setIsSignUpOpen(false);
            }}
          >
            tıklayın
          </a>
        </div>
      </div>
    </div>
  );
}

export default Register;
