import styles from './Login.module.scss';
import UserType from '../UserType/UserType';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from 'pages/_app';

function Login() {
  const [user, setUser] = useState({ email: '', password: '' });
  const [userType, setUserType] = useState('student');
  const authContext = useContext(AuthContext);

  // Close modal with esc key
  useEffect(() => {
    const handleEsc = (event) => {
       if (event.keyCode === 27) {
          authContext.setIsLoginOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  function onBackgroundClicked() {
    authContext.setIsLoginOpen(false);
  }

  const handleChange = (e) => {
    if (e.target.type === 'text') {
      setUser({ ...user, email: e.target.value });
    } else if (e.target.type === 'password') {
      setUser({ ...user, password: e.target.value });
    }
  };

  const handleClick = async () => {
    const data = await authContext.signIn(user.email, user.password);
    if (data) {
      authContext.setIsLoginOpen(false);
      alert('Giris Basarili');
    } else {
      alert('Giris Basarisiz');
    }
  };


  // Buraya UserType'a gore giris cikis yapilabilir
  return (
    <div className={styles.background} onMouseDown={onBackgroundClicked}>
      <div className={styles.login} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.banner}>
          <p className={styles.logo}>cmis</p> <p>&apos;e Giriş Yap</p>
        </div>

        <UserType userType={userType} setUserType={setUserType} />

        <div className={styles.welcome}>
          <p className={styles.logo}>cmis</p> <p>hesabı ile giriş yapın</p>
        </div>

        <input type={'text'} placeholder={'email'} onChange={handleChange} />
        <input type={'password'} placeholder={'şifre'} onChange={handleChange} />

        <div className={styles.entrance}>
          <a href=''>Şifremi Unuttum</a>
          <button onClick={handleClick}> Giriş </button>
        </div>

        <div className={styles.foot}>
          <p className={styles.logo}>cmis</p> <p>hesabı oluşturmak için</p>{' '}
          <a
            onClick={() => {
              authContext.setIsLoginOpen(false);
              authContext.setIsSignUpOpen(true);
            }}
          >
            tıklayın
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
