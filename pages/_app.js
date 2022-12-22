import '../styles/globals.scss';
import Head from 'next/head';
import { Header } from 'components';
import { createContext, useCallback, useState } from 'react';

export function api(path) {
  return 'http://localhost:8070/api/' + path;
}

export const AuthContext = createContext();

function MyApp({ Component, pageProps }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userData, setUserData] = useState({});

  const signUp = useCallback(async (firstName, lastName, email, password, role) => {
    const res = await fetch(api('auth/signup'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, email, password, role: [role] }),
    });
    if (res.ok) {
      const data = await res.json();
      setIsLoggedIn(true);
      setUserData(data);
      return data;
    }
  }, []);

  const signIn = useCallback(async (email, password) => {
    const res = await fetch(api('auth/signin'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      setIsLoggedIn(true);
      setUserData(data);
      return data;
    }
  }, []);

  const signOut = useCallback(() => {
    setIsLoggedIn(false);
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
        isLoggedIn,
        userData,
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
