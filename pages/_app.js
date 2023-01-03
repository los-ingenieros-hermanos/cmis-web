import { Header } from 'components';
import Head from 'next/head';
import { createContext, useCallback, useEffect, useState } from 'react';
import '../styles/globals.scss';

function api(path) {
  // return 'https://cmisbackend.azurewebsites.net/api/' + path;
  return 'http://localhost:8070/api/' + path;
}

async function request(method, path, body, useCredentials) {
  const res = await fetch(api(path), {
    method,
    credentials: useCredentials && 'include',
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  let data;
  if (res.ok) {
    data = await res.json();
  }
  return [res, data];
}

export const AuthContext = createContext();

function MyApp({ Component, pageProps }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [userData, setUserData] = useState();

  useEffect(() => {
    const userData_ = JSON.parse(localStorage.getItem('userData'));
    setUserData(userData_);
  }, []);

  function setUserData_(data) {
    setUserData(data);
    localStorage.setItem('userData', JSON.stringify(data));
  }

  const signIn = useCallback(async (email, password) => {
    const [res, data] = await request('POST', 'auth/signin', JSON.stringify({ email, password }), true);
    if (res.ok) {
      setUserData_(data);
      return data;
    }
  }, []);

  const signUp = useCallback(
    async (firstName, lastName, email, password, role) => {
      const [res, data] = await request(
        'POST',
        'auth/signup',
        JSON.stringify({ firstName, lastName, email, password, role: [role] }),
      );
      if (res.ok) {
        await signIn(email, password);
        return data;
      }
    },
    [signIn],
  );

  const signOut = useCallback(async () => {
    const [res, _] = await request('POST', 'auth/signout', undefined, true);
    if (res.ok) {
      setUserData_(null);
    }
  }, []);

  const getCommunities = useCallback(async () => {
    const [_, data] = await request('GET', 'cmis/communities');
    return data;
  }, []);

  const getFollowedCommunities = useCallback(async () => {
    if (userData?.roles[0] === 'ROLE_STUDENT') {
      const [_, data] = await request('GET', `cmis/students/${userData.id}/followingCommunities`, undefined, true);
      return data;
    }
  }, [userData]);

  const getCommunity = useCallback(async (communityId) => {
    const [_, data] = await request('GET', `cmis/communities/${communityId}`, undefined, true);
    return data;
  }, []);

  const updateCommunity = useCallback(async (communityData) => {
    const [_, data] = request('PUT', `cmis/communities/${communityData.id}`, JSON.stringify(communityData));
    return data;
  }, []);

  const followCommunity = useCallback(
    async (communityId) => {
      if (userData?.roles[0] === 'ROLE_STUDENT') {
        const [_, data] = request('POST', `cmis/students/${userData.id}/followingCommunities`, { id: communityId });
        return data;
      }
    },
    [userData],
  );

  const unfollowCommunity = useCallback(
    async (communityId) => {
      if (userData?.roles[0] === 'ROLE_STUDENT') {
        const [_, data] = request('DELETE', `cmis/students/${userData.id}/followingCommunities${communityId}`);
        return data;
      }
    },
    [userData],
  );

  return (
    <AuthContext.Provider
      value={{
        isLoginOpen,
        setIsLoginOpen,
        isSignUpOpen,
        setIsSignUpOpen,
        signUp,
        signIn,
        signOut,
        userData,
        getCommunities,
        getFollowedCommunities,
        getCommunityData: getCommunity,
        updateCommunityData: updateCommunity,
        followCommunity,
        unfollowCommunity,
      }}
    >
      <Head>
        <title>GTU Community Management and Interaction System</title>
      </Head>
      {
        // if page is not admin panel, show header
        Component.name !== 'AdminPanelPage' && <Header />
      }
      <main>
        <Component {...pageProps} />
      </main>
    </AuthContext.Provider>
  );
}

export default MyApp;
