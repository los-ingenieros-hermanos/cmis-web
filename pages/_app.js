import { Header } from 'components';
import Head from 'next/head';
import { createContext, useCallback, useEffect, useState } from 'react';
import '../styles/globals.scss';

function api(path) {
  //return 'https://cmisbackend.azurewebsites.net/api/' + path;
  return 'http://localhost:8070/api/' + path;
}

async function request(method, path, body, useCredentials) {
  if (!path) {
    return [null, null];
  }

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
    function getUserData() {
      const userData_ = JSON.parse(localStorage.getItem('userData'));
      if (userData_ && !isSessionExpired(userData_)) {
        setUserData_(userData_);
      } else {
        setUserData(undefined);
      }
    }

    getUserData();
    setInterval(getUserData, 9000);
  }, []);

  function setUserData_(data) {
    if (data) {
      data.isCommunity = data.roles[0] === 'ROLE_COMMUNITY' || data.roles[0] === 'ROLE_UNVERIFIED';
    }
    setUserData(data);
    localStorage.setItem('userData', JSON.stringify(data));
  }

  function isSessionExpired(userData_) {
    return parseInt(userData_.expires) - 10000 < new Date().getTime();
  }

  const signIn = useCallback(async (email, password) => {
    const [res, data] = await request('POST', 'auth/signin', JSON.stringify({ email, password }), true);
    if (res.ok) {
      data.expires = new Date().getTime() + 86400000;
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
    const [_, data] = await request('PUT', `cmis/communities/${communityData.id}`, JSON.stringify(communityData));
    return data;
  }, []);

  const followCommunity = useCallback(
    async (communityId) => {
      const [_, data] = await request('POST', `cmis/students/${userData.id}/followingCommunities`, {
        id: communityId,
      });
      return data;
    },
    [userData],
  );

  const unfollowCommunity = useCallback(
    async (communityId) => {
      const [_, data] = await request('DELETE', `cmis/students/${userData.id}/followingCommunities/${communityId}`);
      return data;
    },
    [userData],
  );

  const applyToCommunity = useCallback(
    async (communityId, description) => {
      const [_, data] = await request('POST', `cmis/communities/${communityId}/apply/${userData.id}`, description);
      return data;
    },
    [userData],
  );

  const leaveCommunity = useCallback(
    async (communityId) => {
      const [_, data] = await request('DELETE', `cmis/communities/${communityId}/members/${userData.id}`);
      return data;
    },
    [userData],
  );

  const getMembers = useCallback(async () => {
    const [_, data] = await request(`cmis/communities/${userData.id}/members`);
    return data;
  }, [userData]);

  const getMemberApplications = useCallback(async () => {
    const [_, data] = await request(`cmis/communities/${userData.id}/membersApplications`);
    return data;
  }, [userData]);

  const getMemberApplication = useCallback(async (communityId, studentId) => {
    const [_, data] = await request(`cmis/communities/${communityId}/membersApplications/${studentId}`);
    return data;
  }, []);

  const cancelMemberApplication = useCallback(
    async (communityId) => {
      const [_, data] = await request('DELETE', `cmis/communities/${communityId}/cancelApplication/${userData.id}`);
      return data;
    },
    [userData],
  );

  const acceptMemberApplication = useCallback(
    async (studentId) => {
      const [_, data] = await request('PUT', `cmis/communities/${userData.id}/membersApplications/${studentId}/accept`);
      return data;
    },
    [userData],
  );

  const rejectMemberApplication = useCallback(
    async (studentId) => {
      const [_, data] = await request('PUT', `cmis/communities/${userData.id}/membersApplications/${studentId}/reject`);
      return data;
    },
    [userData],
  );

  const isFollowerOfCommunity = useCallback(
    async (communityId) => {
      if (userData?.roles[0] === 'ROLE_STUDENT') {
        const [_, data] = await request(`cmis/students/${userData.id}/isFollowerOf/${communityId}`);
        return data;
      }
    },
    [userData],
  );

  const isMemberOfCommunity = useCallback(
    async (communityId) => {
      if (userData?.roles[0] === 'ROLE_STUDENT') {
        const [_, data] = await request(`cmis/students/${userData.id}/isMemberOf/${communityId}`);
        return data;
      }
    },
    [userData],
  );

  const getCommunityPosts = useCallback(async (communityId) => {
    const [res, data] = await request(`cmis/communities/${communityId}/posts`);
    return data;
  }, []);

  const getUserPfp = useCallback(async () => {
    let _, data;
    if (userData?.roles[0] === 'ROLE_STUDENT') {
      [_, data] = await request(`cmis/students/${userData.id}/image`);
    } else if (userData?.roles[0] === 'ROLE_COMMUNITY') {
      [_, data] = await request(`cmis/communities/${userData.id}/image`);
    }
    return data;
  }, [userData]);

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
        getCommunity,
        updateCommunity,
        followCommunity,
        unfollowCommunity,
        isFollowerOfCommunity,
        isMemberOfCommunity,
        applyToCommunity,
        leaveCommunity,
        getMembers,
        getMemberApplications,
        getMemberApplication,
        cancelMemberApplication,
        acceptMemberApplication,
        rejectMemberApplication,
        getCommunityPosts,
        getUserPfp,
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
