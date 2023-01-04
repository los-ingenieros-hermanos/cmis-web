import styles from './AdminPanel.module.scss';
import { AuthContext } from 'pages/_app';
import { React, useContext, useEffect, useRef, useState } from 'react';
import { Link, Post } from 'components';
import { dummyCommunity } from 'components/ComunityProfilePage/CommunityProfilePage';

//  -------------- UTILS --------------
function selectAll(e) {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = e.target.checked;
  })
}

function checkItem(e) {
  const checkbox = e.target.parentElement.parentElement.querySelector('input[type="checkbox"]');
  checkbox.checked = !checkbox.checked;
}

function Login() {
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleChange(e) {
    if (e.target.id === 'email') {
      setEmail(e.target.value);
    } else if (e.target.id === 'password') {
      setPassword(e.target.value);
    }
  }
  
  async function handleClick() {
    const data = await authContext.signIn(email, password);
    if (data) {
        if (data.roles[0] !== 'ROLE_ADMIN')
        {
          alert('Giriş Başarısız');
          authContext.signOut();
        }
    } else {
      alert('Giriş Başarısız');
    }
    console.log(data);
  }

  return (
    <div className={styles.loginPage}>
      <Link href={'/'} className={styles.logo}>
        cmis
      </Link>
      <div className={styles.login}>
        <div className={styles.loginTitle}>
          Yönetici Olarak Giriş Yapın
        </div>
        <div className={styles.loginForm}>
          <div className={styles.loginInput}>
            <label htmlFor={'email'}>E-Posta</label>
            <input type={'text'} id={'email'} placeholder={'email@gtu.edu.tr'} onChange={handleChange} />
          </div>
          <div className={styles.loginInput}>
            <label htmlFor={'password'}>Şifre</label>
            <input type={'password'} id={'password'} placeholder={'Şifrenizi girin'} onChange={handleChange} />
          </div>
          <button className={styles.loginButton} onClick={handleClick}>Giriş</button>
        </div>
      </div>
    </div>
  )
}

function LeftMenu({ setMenuOption, menuOption }) {
  const authContext = useContext(AuthContext);    

  return (
    <div className={styles.leftMenu}>
      <div className={styles.leftMenuTitle}>
        <h2>Menü</h2>
      </div>
      <div className={styles.leftMenuOptions}>
        <div className={styles.leftMenuOption} onClick={() => setMenuOption('communities')} style={{ backgroundColor: menuOption === 'communities' ? '#D9D9D9' : null }}>
          <h2> Topluluklar </h2>
        </div>
        <div className={styles.leftMenuOption} onClick={() => setMenuOption('students')} style={{ backgroundColor: menuOption === 'students' ? '#D9D9D9' : null }}>
          <h2> Öğrenciler </h2>
        </div>
        <div className={styles.leftMenuOption} onClick={() => setMenuOption('posts')} style={{ backgroundColor: menuOption === 'posts' ? '#D9D9D9' : null }}>
          <h2> Gönderiler </h2>
        </div>
        <div className={styles.leftMenuOption} onClick={() => setMenuOption('applications')} style={{ backgroundColor: menuOption === 'applications' ? '#D9D9D9' : null }}>
          <h2> Topluluk Başvuruları </h2>
        </div>
        <div className={styles.leftMenuOption} onClick={() => authContext.signOut()}>
          <h2> Çıkış Yap </h2>
        </div>
      </div>
    </div>
  )
}

function manageCommunities() {
  return (
    <div className={styles.managementWindow}>
      <h1>Topluluklar</h1>
    </div>
  )
}


function manageStudents() {
  return (
    <div className={styles.managementWindow}>
      <h1>Öğrenciler</h1>
    </div>
  )
}



function managePosts() {
  return (
    <div className={styles.managementWindow}>
      <h1>Gönderiler</h1>
    </div>
  )

}



function manageApplications() {
  // fill array with community objects but change the id and name with spread operator
  const dummyCommunities = Array(10).fill(dummyCommunity).map((community, index) => ({ ...community, id: index, name: `Topluluk ${index}` }));
  

  function onApproveClicked() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const checked = [];
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked && checkbox.id !== 'setAll') {
        checked.push(checkbox.value);
      }
    })
    console.log(checked);
  }


  return (
    <div className={styles.managementWindow}>
      <div className={styles.topBar}>
        <input type='search' placeholder='Topluluk Ara' />
        <div className={styles.labelInput}>
          <label htmlFor='setAll'>Tümünü Seç</label>
          <input type='checkbox' id='setAll' onChange={selectAll} />
        </div>
      </div>

      <ul className={styles.elementList}>
        {dummyCommunities.map((community) => (
          <li className={styles.element} key={community.id}>
            <div className={styles.elementInfo}>
              <img src={community.pfpSrc} alt="community.name" className={styles.pfpSrc} onClick={checkItem}/>
              <div className={styles.elementName} onClick={checkItem}>
                {community.name}
              </div>
            </div>
            <input type="checkbox" value={community.id} />
          </li>
        ))}
      </ul>
      <div className={styles.bottomBar}> 
        <div className={styles.buttons}>
          <button className={styles.buttonApprove} type='submit' onClick={onApproveClicked}>Başvuruları Onayla</button>
          <button className={styles.buttonDeny} type='submit'>Reddet</button>
        </div>
      </div>
    </div>
  )
}


export default function AdminPanel() {
  const authContext = useContext(AuthContext);    
  const [menuOption, setMenuOption] = useState('communities');

  return (
    <div>
        {!authContext.userData ?
          <Login /> :
          <div className={styles.adminPanel}>
            <div className={styles.banner}>
              <h1>Yönetim Paneli</h1>
            </div>
            <LeftMenu setMenuOption={setMenuOption} menuOption={menuOption}/>
            <>
              {menuOption === 'communities' && manageCommunities()}
              {menuOption === 'students' && manageStudents()}
              {menuOption === 'posts' && managePosts()}
              {menuOption === 'applications' && manageApplications()}
            </>
          </div>
        }
    </div>
  );
}
