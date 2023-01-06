import { Header } from 'components';
import Head from 'next/head';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import '../styles/globals.scss';

export function imageToBase64(file, callback) {
  const reader = new FileReader();
  reader.onload = () => {
    callback(reader.result);
  };
  if (file) {
    reader.readAsDataURL(file);
  }
}

function api(path) {
  //return 'https://cmisbackend.azurewebsites.net/api/' + path;
  return 'http://localhost:8070/api/' + path;
}

async function request(method, path, body, useCredentials = true) {
  if (!path || path.includes('/undefined')) {
    return [null, null];
  }
  const res = await fetch(api(path), {
    method,
    credentials: useCredentials ? 'include' : undefined,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  let data;
  if (res.ok && res.status !== 204) {
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
    if (userData_ && !isSessionExpired(userData_)) {
      setUserData_(userData_);
    } else {
      setUserData(undefined);
    }
  }, []);

  function setUserData_(data) {
    if (data) {
      data.isCommunity = data.roles[0] === 'ROLE_COMMUNITY' || data.roles[0] === 'ROLE_UNVERIFIED';
    }
    setUserData(data);
    localStorage.setItem('userData', JSON.stringify(data));
  }

  const getUser = useCallback(async (userId) => {
    const [res, data] = await request('GET', `cmis/users/${userId}`);
    return [res, data];
  }, []);

  function isSessionExpired(userData_) {
    return parseInt(userData_.expires) - 10000 < new Date().getTime();
  }

  const signIn = useCallback(async (email, password) => {
    const [res, data] = await request('POST', 'auth/signin', { email, password });
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
        { firstName, lastName, email, password, role: [role] },
        false,
      );
      if (res.ok) {
        await signIn(email, password);
        return data;
      }
    },
    [signIn],
  );

  const signOut = useCallback(async () => {
    const [res, _] = await request('POST', 'auth/signout');
    if (res.ok) {
      setUserData_(null);
    }
  }, []);

  useEffect(() => {
    const userData_ = JSON.parse(localStorage.getItem('userData'));
    // get user with id
    if (userData_) {
      getUser(userData_.id).then(([_, data]) => {
        if (!data) {
          signOut();
        }
      });
    }
  }, [getUser, signOut]);

  const getCommunities = useCallback(async (searchTerm) => {
    let _, data;
    if (!searchTerm) {
      [_, data] = await request('GET', 'cmis/communities');
    } else {
      [_, data] = await request('GET', `cmis/communities/search?search=${searchTerm}`);
    }
    return data;
  }, []);

  const getFollowedCommunities = useCallback(async () => {
    if (userData?.roles[0] === 'ROLE_STUDENT') {
      const [_, data] = await request('GET', `cmis/students/${userData.id}/followingCommunities`);
      return data;
    }
  }, [userData]);

  const getCommunity = useCallback(async (communityId) => {
    const [_, data] = await request('GET', `cmis/communities/${communityId}`);
    return data;
  }, []);

  const updateCommunity = useCallback(async (communityData) => {
    const [_, data] = await request('PUT', `cmis/communities/${communityData.id}`, communityData);
    return data;
  }, []);

  const followCommunity = useCallback(
    async (communityId) => {
      const [_, data] = await request('POST', `cmis/students/${userData.id}/followingCommunities/${communityId}`, {
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
    const [_, data] = await request('GET', `cmis/communities/${userData.id}/members`);
    return data;
  }, [userData]);

  const getMemberApplications = useCallback(async () => {
    const [_, data] = await request('GET', `cmis/communities/${userData.id}/membersApplications`);
    return data;
  }, [userData]);

  const getMemberApplication = useCallback(async (communityId, studentId) => {
    const [_, data] = await request('GET', `cmis/communities/${communityId}/membersApplications/${studentId}`);
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
        const [_, data] = await request('GET', `cmis/students/${userData.id}/isFollowerOf/${communityId}`);
        return data;
      }
    },
    [userData],
  );

  const isMemberOfCommunity = useCallback(
    async (communityId) => {
      if (userData?.roles[0] === 'ROLE_STUDENT') {
        const [_, data] = await request('GET', `cmis/students/${userData.id}/isMemberOf/${communityId}`);
        return data;
      }
    },
    [userData],
  );

  const getCommunityPosts = useCallback(async (communityId) => {
    const [res, data] = await request('GET', `cmis/communities/${communityId}/posts`);
    return data;
  }, []);

  const getUserPfp = useCallback(async () => {
    if (!userData) return;
    let _, data;
    if (userData?.roles[0] === 'ROLE_STUDENT') {
      [_, data] = await request('GET', `cmis/students/${userData.id}`);
    } else {
      [_, data] = await request('GET', `cmis/communities/${userData.id}`);
    }
    return data?.image;
  }, [userData]);

  const getStudent = useCallback(async (studentId) => {
    const [_, data] = await request('GET', `cmis/students/${studentId}`);
    return data;
  }, []);

  const sendCommunityPost = useCallback(
    async (postData) => {
      const [_, data] = await request('POST', `cmis/communities/${userData.id}/posts`, postData);
      return data;
    },
    [userData],
  );

  const getStudentPosts = useCallback(async (studentId) => {
    const [_, data] = await request('GET', `cmis/students/${studentId}/projectidea`);
    return data;
  }, []);

  const sendStudentPost = useCallback(
    async (postData) => {
      const [_, data] = await request('POST', `cmis/students/${userData.id}/projectidea`, postData);
      return data;
    },
    [userData],
  );

  // ------------------ YUSUF ARSLAN API CALLS ------------------ //
  const getUnverifiedCommunities = useCallback(
    async (search) => {
      if (!search) {
        const [_, data] = await request('GET', `cmis/admin/${userData?.id}/unverifiedCommunities`);
        return data;
      } else {
        const [_, data] = await request('GET', `cmis/unverified/search?search=${search}`);
        return data;
      }
    },
    [userData],
  );

  const acceptCommunity = useCallback(
    async (communityId) => {
      const [_, data] = await request('POST', `cmis/admin/${userData?.id}/unverifiedCommunities/${communityId}/accept`);
      return data;
    },
    [userData],
  );

  const rejectCommunity = useCallback(
    async (communityId) => {
      const [_, data] = await request(
        'POST',
        `cmis/admin/${userData?.id}/unverifiedCommunities/${communityId}/decline`,
      );
      return data;
    },
    [userData],
  );

  const deleteCommunity = useCallback(
    async (communityId) => {
      const [_, data] = await request('DELETE', `cmis/communities/${communityId}`);
      return data;
    },
    [userData],
  );

  const getStudents = useCallback(
    async (search) => {
      if (!search) {
        const [_, data] = await request('GET', `cmis/students`);
        return data;
      } else {
        const [_, data] = await request('GET', `cmis/students/search?search=${search}`);
        return data;
      }
    },
    [userData],
  );

  const deleteStudent = useCallback(
    async (studentId) => {
      const [_, data] = await request('DELETE', `cmis/students/${studentId}`);
      return data;
    },
    [userData],
  );

  const getPosts = useCallback(
    async (search) => {
      if (!search) {
        const [_, data] = await request('GET', `cmis/posts`);
        return data;
      } else {
        const [_, data] = await request('GET', `cmis/posts/search?search=${search}`);
        return data;
      }
    },
    [userData],
  );

  const deletePost = useCallback(
    async (postId) => {
      const [_, data] = await request('DELETE', `cmis/posts/${postId}`);
      return data;
    },
    [userData],
  );

  const getProjectIdeas = useCallback(
    async (search) => {
      if (!search) {
        const [_, data] = await request('GET', `cmis/projectidea`);
        return data;
      } else {
        const [_, data] = await request('GET', `cmis/projectidea/search?search=${search}`);
        return data;
      }
    },
    [userData],
  );

  const deleteProjectIdea = useCallback(
    async (projectIdeaId) => {
      const [_, data] = await request('DELETE', `cmis/projectidea/${projectIdeaId}`);
      return data;
    },
    [userData],
  );

  // ------------------ YUSUF ARSLAN API CALLS END--------------- //

  const value = useMemo(
    () => ({
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
      getStudent,
      sendCommunityPost,
      getStudentPosts,
      sendStudentPost,

      // ------------------ YUSUF ARSLAN API CALLS ------------------ //
      getUnverifiedCommunities,
      acceptCommunity,
      rejectCommunity,
      deleteCommunity,
      getStudents,
      deleteStudent,
      getPosts,
      deletePost,
      getProjectIdeas,
      deleteProjectIdea,
    }),
    [
      isLoginOpen,
      isSignUpOpen,
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
      getStudent,
      sendCommunityPost,
      getStudentPosts,
      sendStudentPost,
      getUnverifiedCommunities,
      acceptCommunity,
      rejectCommunity,
      deleteCommunity,
      getStudents,
      deleteStudent,
      getPosts,
      deletePost,
      getProjectIdeas,
      deleteProjectIdea,
    ],
  );
  return (
    <AuthContext.Provider value={value}>
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
