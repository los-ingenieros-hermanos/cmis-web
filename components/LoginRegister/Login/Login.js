import { ApiContext } from 'pages/_app';
import { useContext, useEffect, useState } from 'react';
import UserType from '../UserType/UserType';
import styles from './Login.module.scss';

function Login() {
  const [user, setUser] = useState({ email: '', password: '' });
  const [userType, setUserType] = useState('student');
  const apiContext = useContext(ApiContext);

  // Close modal with esc key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        apiContext.setIsLoginOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [apiContext]);

  function onBackgroundClicked() {
    apiContext.setIsLoginOpen(false);
  }

  const handleChange = (e) => {
    if (e.target.type === 'text') {
      setUser({ ...user, email: e.target.value });
    } else if (e.target.type === 'password') {
      setUser({ ...user, password: e.target.value });
    }
  };

  const login = async () => {
    const data = await apiContext.signIn(user.email, user.password);
    if (data) {
      apiContext.setIsLoginOpen(false);
    } else {
      alert('Giris Basarisiz');
    }
  };

  async function handleClick() {
    await login();
  }

  async function handleEnter(e) {
    if (e.key === 'Enter') {
      await login();
    }
  }

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

        <input type={'text'} placeholder={'email'} onChange={handleChange} onKeyDown={handleEnter} />
        <input type={'password'} placeholder={'şifre'} onChange={handleChange} onKeyDown={handleEnter} />

        <div className={styles.entrance}>
          <a href=''>Şifremi Unuttum</a>
          <button onClick={handleClick}> Giriş </button>
        </div>

        <div className={styles.foot}>
          <p className={styles.logo}>cmis</p> <p>hesabı oluşturmak için</p>{' '}
          <a
            onClick={() => {
              apiContext.setIsLoginOpen(false);
              apiContext.setIsSignUpOpen(true);
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
