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

const Input = ({type, className, placeholder, setSearch}) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setSearch(event.target.value);
    }
  }
  return <input type={type} className={className} placeholder={placeholder} onKeyDown={handleKeyDown} />
}

//  -------------- UTILS --------------

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
        <div className={styles.leftMenuOption} onClick={() => setMenuOption('projectIdeas')} style={{ backgroundColor: menuOption === 'projectIdeas' ? '#D9D9D9' : null }}>
          <h2> Askıda Projeler </h2>
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

function ManageCommunities() {
  const authContext = useContext(AuthContext);
  const [communities, setCommunities] = useState([]);
  const[search, setSearch] = useState('');

  useEffect(() => {
    if (communities.length > 0) return; // if there are already communities, do not fetch again
    (async () => {
      const result = await authContext.getCommunities();
      if (result) {
        // sort result by id
        result.sort((a, b) => a.id - b.id);
        setCommunities(result);
      }
    })();
  }, [authContext]);

  useEffect(() => {
    if (search === '') {
      // Fetch all communities
      (async () => {
        const result = await authContext.getCommunities();
        if (result) {
          // sort result by id
          result.sort((a, b) => a.id - b.id);
          setCommunities(result);
        }
      })();
    } else {
      // Fetch communities that match the query
      (async () => {
        const result = await authContext.searchCommunities(search);
        if (result) {
          // sort result by id
          result.sort((a, b) => a.id - b.id);
          setCommunities(result);
        }
      })();
    }
  }, [search]);

  function onDeleteClicked() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const checked = [];
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked && checkbox.id !== 'setAll') {
        checked.push(checkbox.value);
      }
    })

    if (checked.length === 0) return; // if there is no checked community, do not continue
    
    checked.forEach(async (id) => {
      const result = await authContext.deleteCommunity(id);
      if (result) {
        setCommunities(communities.filter((community) => community.id !== id));
      }
    })
    
    // reload to window
    // window.location.reload();
  }

  return (
    <div className={styles.managementWindow}>
      <div className={styles.topBar}>
        <Input type={'search'} placeholder={'Topluluk Ara'} setSearch={setSearch} />
        <div className={styles.labelInput}>
          <label htmlFor='setAll'>Tümünü Seç</label>
          <input type='checkbox' id='setAll' onChange={selectAll} />
        </div>
      </div>
      <ul className={styles.elementList}>
        {communities.map((community) => (
          <li className={styles.element} key={community.id}>
            <div className={styles.elementInfo}>
              <img src='/icons/group-icon.svg' alt="pfp" className={styles.pfpSrc} onClick={checkItem} />
              <div className={styles.info}>
                <div>
                  {community.name}
                </div>
                <div style={{ color: '#666666', fontSize: '0.8rem' }}>
                  {community.user.email}
                </div>
              </div>
            </div>
            <input type="checkbox" value={community.id} />
          </li>
        ))}
      </ul>
      <div className={styles.bottomBar}> 
        <div className={styles.buttons}>
          <button className={styles.buttonReject} type='submit' onClick={onDeleteClicked}>Sil</button>
        </div>
      </div>
    </div>
  )
}

function ManageStudents() {
  return (
    <div className={styles.managementWindow}>
      <h1>Öğrenciler</h1>
    </div>
  )
}

function ManageProjectIdeas() {
  return (
    <div className={styles.managementWindow}>
      <h1>Askıda Projeler</h1>
    </div>
  )
}


function ManagePosts() {
  return (
    <div className={styles.managementWindow}>
      <h1>Gönderiler</h1>
    </div>
  )
}

function ManageApplications() {
  const authContext = useContext(AuthContext);
  const [unverifiedCommunities, setUnverifiedCommunities] = useState([]);
  const[search, setSearch] = useState('');
  
  useEffect(() => {
    if (unverifiedCommunities.length > 0) return; // if there are already communities, do not fetch again
    (async () => {
      const result = await authContext.getUnverifiedCommunities();
      if (result) {
        // sort result by id
        result.sort((a, b) => a.id - b.id);
        setUnverifiedCommunities(result);
      }
    })();
  }, [authContext]);

  useEffect(() => {
    if (search === '') {
      // Fetch all communities
      (async () => {
        const result = await authContext.getUnverifiedCommunities();
        if (result) {
          // sort result by id
          result.sort((a, b) => a.id - b.id);
          setUnverifiedCommunities(result);
        }
      })();
    } else {
      // Fetch communities that match the query
      (async () => {
        const result = await authContext.searchUnverifiedCommunities(search);
        if (result) {
          // sort result by id
          result.sort((a, b) => a.id - b.id);
          setUnverifiedCommunities(result);
        }
      })();
    }
  }, [search]);
  
  
  function onApproveClicked() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const checked = [];
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked && checkbox.id !== 'setAll') {
        checked.push(checkbox.value);
      }
    })

    if (checked.length === 0) return; // if there is no checked community, do not continue

    checked.forEach(async (id) => {
      const result = await authContext.acceptCommunity(id);
      if (result) {
        setUnverifiedCommunities(unverifiedCommunities.filter((community) => community.id !== id));
      }
    })
    
    // reload to window
    // window.location.reload();
  }

  function onRejectClicked() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const checked = [];
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked && checkbox.id !== 'setAll') {
        checked.push(checkbox.value);
      }
    })

    if (checked.length === 0) return; // if there is no checked community, do not continue

    checked.forEach(async (id) => {
      const result = await authContext.rejectCommunity(id);
      if (result) {
        setUnverifiedCommunities(unverifiedCommunities.filter((community) => community.id !== id));
      }
    })
    
    // reload to window
    // window.location.reload();
  }

  // by pressing ESC, fetch unverified communities again
  useEffect(() => {
    const handleEsc = (event) => {
       if (event.keyCode === 27) {
        (async () => {
          const result = await authContext.getUnverifiedCommunities();
          if (result) {
            // sort result by id
            result.sort((a, b) => a.id - b.id);
            setUnverifiedCommunities(result);
          }
        })();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);


  return (
    <div className={styles.managementWindow}>
      <div className={styles.topBar}>
        <Input type={'search'} placeholder={'Topluluk Ara'} setSearch={setSearch} />
        <div className={styles.labelInput}>
          <label htmlFor='setAll'>Tümünü Seç</label>
          <input type='checkbox' id='setAll' onChange={selectAll} />
        </div>
      </div>

      <ul className={styles.elementList}>
        {unverifiedCommunities.map((community) => (
          <li className={styles.element} key={community.id}>
            <div className={styles.elementInfo}>
              <img src='/icons/group-icon.svg' alt="pfp" className={styles.pfpSrc} onClick={checkItem} />
              <div className={styles.info}>
                <div>
                  {community.name}
                </div>
                <div style={{ color: '#666666', fontSize: '0.8rem' }}>
                  {community.user.email}
                </div>
              </div>
            </div>
            <input type="checkbox" value={community.id} />
          </li>
        ))}
      </ul>
      <div className={styles.bottomBar}> 
        <div className={styles.buttons}>
          <button className={styles.buttonApprove} type='submit' onClick={onApproveClicked}>Başvuruları Onayla</button>
          <button className={styles.buttonReject} type='submit' onClick={onRejectClicked}>Reddet</button>
        </div>
      </div>
    </div>
  )
}


export default function AdminPanel() {
  const authContext = useContext(AuthContext);    
  // store menuOption in localStorage, so that it is not reset when the page is refreshed
  if (typeof window !== 'undefined') {
    var storedMenuOption = localStorage.getItem('menuOption');
  }
  const [menuOption, setMenuOption] = useState(storedMenuOption ? storedMenuOption : 'communities');
  
  useEffect(() => {
    localStorage.setItem('menuOption', String(menuOption));
  }, [menuOption]);
  


  return (
    <div>
        {!authContext.userData || authContext.userData?.roles[0] !== 'ROLE_ADMIN' ?
          <Login /> :
          <div className={styles.adminPanel}>
            <div className={styles.banner}>
              <h1>Yönetim Paneli</h1>
            </div>
            <LeftMenu setMenuOption={setMenuOption} menuOption={menuOption}/>
            <>
              {menuOption === 'communities' && <ManageCommunities/>}
              {menuOption === 'students' && <ManageStudents/>}
              {menuOption === 'posts' && <ManagePosts/>}
              {menuOption === 'projectIdeas' && <ManageProjectIdeas/>}
              {menuOption === 'applications' && <ManageApplications/>}
            </>
          </div>
        }
    </div>
  );
}
