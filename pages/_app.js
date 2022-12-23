import '../styles/globals.scss';
import Head from 'next/head';
import { Header } from 'components';
import { createContext, useCallback, useState } from 'react';

export function api(path) {
  return 'https://cmisservice-cmis-backend.azuremicroservices.io/api/' + path;
}

export const AuthContext = createContext();

function MyApp({ Component, pageProps }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [userData, setUserData] = useState();

  const signIn = useCallback(async (email, password) => {
    const res = await fetch(api('auth/signin'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        withCredentials: true,
      },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      setUserData(data);
      return data;
    }
  }, []);

  const signUp = useCallback(
    async (firstName, lastName, email, password, role) => {
      const res = await fetch(api('auth/signup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password, role: [role] }),
      });
      if (res.ok) {
        await signIn(email, password);
        const data = await res.json();
        return data;
      }
    },
    [signIn],
  );

  const signOut = useCallback(async () => {
    const res = await fetch(api('auth/signout'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      setUserData(undefined);
    }
  }, []);

  const getCommunities = useCallback(async () => {
    const res = await fetch(api(`cmis/communities`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  }, []);

  const getFollowedCommunities = useCallback(async (studentId) => {
    const res = await fetch(api(`cmis/students/${studentId}/followingCommunities`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  }, []);

  const updateCommunityData = useCallback(async (communityData) => {
    const res = await fetch(api(`cmis/communities/${communityData.id}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(communityData),
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  }, []);

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
        updateCommunityData,
        getCommunities,
        getFollowedCommunities,
      }}
    >
      <Head>
        <title>GTU Community Management and Interaction System</title>
      </Head>
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
    </AuthContext.Provider>
  );
}

export default MyApp;
