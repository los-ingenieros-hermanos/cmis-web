import { Header, LeftMenu } from 'components';
import Head from 'next/head';
import { useRouter } from 'next/router';
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
  //return 'https://cmis.azurewebsites.net/api/' + path;
  return 'http://localhost:8070/api/' + path;
}

export const AuthContext = createContext();

function MyApp({ Component, pageProps }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [userData, setUserData] = useState();
  const router = useRouter();

  const request = useCallback(async (method, path, body, useCredentials = true) => {
    if (!path || path.includes('/undefined')) {
      return [null, null];
    }

    const res = await fetch(api(path), {
      method,
      credentials: useCredentials ? 'include' : undefined,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        // get token from local storage if token exists
        Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : undefined,
      },
    });

    let data;
    if (res.ok && res.status !== 204) {
      data = await res.json();
    } else if (res.status === 401) {
      setIsLoginOpen(true);
    }
    return [res, data];
  }, []);

  function setUserData_(data) {
    if (data) {
      data.isCommunity = data.roles[0] === 'ROLE_COMMUNITY' || data.roles[0] === 'ROLE_UNVERIFIED';
    }
    setUserData(data);
    localStorage.setItem('userData', JSON.stringify(data));
    localStorage.setItem('token', data?.token);
  }

  const getUser = useCallback(
    async (userId) => {
      const [res, data] = await request('GET', `cmis/users/${userId}`);
      return [res, data];
    },
    [request],
  );

  useEffect(() => {
    const userData_ = JSON.parse(localStorage.getItem('userData'));
    if (userData_ && !isSessionExpired(userData_)) {
      setUserData_(userData_);
    } else {
      setUserData(undefined);
    }
  }, []);

  const signIn = useCallback(
    async (email, password) => {
      const [res, data] = await request('POST', 'auth/signin', { email, password });
      if (res.ok) {
        data.expires = new Date().getTime() + 86400000;
        setUserData_(data);
        return data;
      }
    },
    [request],
  );

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
    [signIn, request],
  );

  const signOut = useCallback(async () => {
    const [res, _] = await request('POST', 'auth/signout');
    if (res.ok) {
      setUserData_(null);
    }
  }, [request]);

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

  function isSessionExpired(userData_) {
    return parseInt(userData_.expires) - 10000 < new Date().getTime();
  }

  const getCommunities = useCallback(
    async (searchTerm) => {
      let _, data;
      if (!searchTerm) {
        [_, data] = await request('GET', 'cmis/communities');
      } else {
        [_, data] = await request('GET', `cmis/communities/search?search=${searchTerm}`);
      }
      return data;
    },
    [request],
  );

  const getFollowedCommunities = useCallback(async () => {
    if (userData?.roles[0] === 'ROLE_STUDENT') {
      const [_, data] = await request('GET', `cmis/students/${userData?.id}/followingCommunities`);
      return data;
    }
  }, [request, userData]);

  const getCommunity = useCallback(
    async (communityId) => {
      const [_, data] = await request('GET', `cmis/communities/${communityId}`);
      return data;
    },
    [request],
  );

  const updateCommunity = useCallback(
    async (communityData) => {
      const [_, data] = await request('PUT', `cmis/communities/${communityData.id}`, communityData);
      return data;
    },
    [request],
  );

  const updateStudent = useCallback(
    async (studentData) => {
      const [_, data] = await request('PUT', `cmis/students/${studentData.id}`, studentData);
      return data;
    },
    [request],
  );

  const followCommunity = useCallback(
    async (communityId) => {
      const [_, data] = await request('POST', `cmis/students/${userData?.id}/followingCommunities`, {
        id: communityId,
      });
      return data;
    },
    [request, userData],
  );

  const unfollowCommunity = useCallback(
    async (communityId) => {
      const [_, data] = await request('DELETE', `cmis/students/${userData?.id}/followingCommunities/${communityId}`);
      return data;
    },
    [request, userData],
  );

  const applyToCommunity = useCallback(
    async (communityId, description) => {
      const [_, data] = await request('POST', `cmis/communities/${communityId}/apply/${userData?.id}`, {
        message: description,
      });
      return data;
    },
    [request, userData],
  );

  const hasAppliedToCommunity = useCallback(
    async (communityId) => {
      const [_, data] = await request('GET', `cmis/communities/${communityId}/memberApplications/${userData?.id}`);
      return data;
    },
    [request, userData],
  );

  const leaveCommunity = useCallback(
    async (communityId) => {
      const [_, data] = await request('DELETE', `cmis/communities/${communityId}/members/${userData?.id}`);
      return data;
    },
    [request, userData],
  );

  const getMembers = useCallback(
    async (communityId) => {
      const [_, data] = await request('GET', `cmis/communities/${communityId}/members`);
      return data;
    },
    [request],
  );

  const getMemberApplications = useCallback(
    async (communityId) => {
      const [_, data] = await request('GET', `cmis/communities/${communityId}/memberApplications`);
      return data;
    },
    [request],
  );

  const getMemberApplication = useCallback(
    async (communityId, studentId) => {
      const [_, data] = await request('GET', `cmis/communities/${communityId}/memberApplications/${studentId}`);
      return data;
    },
    [request],
  );

  const cancelMemberApplication = useCallback(
    async (communityId) => {
      const [_, data] = await request('DELETE', `cmis/communities/${communityId}/cancelApplication/${userData?.id}`);
      return data;
    },
    [request, userData],
  );

  const acceptMemberApplication = useCallback(
    async (communityId, studentId) => {
      const [_, data] = await request('PUT', `cmis/communities/${communityId}/memberApplications/${studentId}/accept`);
      return data;
    },
    [request],
  );

  const rejectMemberApplication = useCallback(
    async (communityId, studentId) => {
      const [_, data] = await request('PUT', `cmis/communities/${communityId}/memberApplications/${studentId}/reject`);
      return data;
    },
    [request],
  );

  const removeMember = useCallback(
    async (communityId, studentId) => {
      const [_, data] = await request('DELETE', `cmis/communities/${communityId}/members/${studentId}`);
      return data;
    },
    [request],
  );

  const authorizeMember = useCallback(
    async (communityId, studentId) => {
      const [_, data] = await request('PUT', `cmis/communities/${communityId}/members/${studentId}`, ['ALL']);
      return data;
    },
    [request],
  );

  const removeMemberAuthorization = useCallback(
    async (communityId, studentId) => {
      const [_, data] = await request('PUT', `cmis/communities/${communityId}/members/${studentId}`, ['NONE']);
      return data;
    },
    [request],
  );

  const isAuthorizedMember = useCallback(
    async (communityId) => {
      const [_, data] = await request('GET', `cmis/communities/${communityId}/isAuthorized/${userData?.id}/`);
      return data;
    },
    [request, userData],
  );

  const isFollowerOfCommunity = useCallback(
    async (communityId) => {
      if (userData?.roles[0] === 'ROLE_STUDENT') {
        const [_, data] = await request('GET', `cmis/students/${userData?.id}/isFollowerOf/${communityId}`);
        return data;
      }
    },
    [request, userData],
  );

  const isMemberOfCommunity = useCallback(
    async (communityId) => {
      if (userData?.roles[0] === 'ROLE_STUDENT') {
        const [_, data] = await request('GET', `cmis/students/${userData?.id}/isMemberOf/${communityId}`);
        return data;
      } else {
        return false;
      }
    },
    [request, userData],
  );

  const getCommunityPosts = useCallback(
    async (communityId) => {
      const [_, data] = await request('GET', `cmis/communities/${communityId}/posts`);
      return data;
    },
    [request],
  );

  const getCommunityPost = useCallback(
    async (postId) => {
      const [_, data] = await request('GET', `cmis/posts/${postId}`);
      return data;
    },
    [request],
  );

  const getUserPfp = useCallback(async () => {
    if (!userData) return;
    let _, data;
    if (userData?.roles[0] === 'ROLE_STUDENT') {
      [_, data] = await request('GET', `cmis/students/${userData?.id}`);
    } else {
      [_, data] = await request('GET', `cmis/communities/${userData?.id}`);
    }
    return data?.image;
  }, [request, userData]);

  const getStudent = useCallback(
    async (studentId) => {
      const [_, data] = await request('GET', `cmis/students/${studentId}`);
      return data;
    },
    [request],
  );

  const sendCommunityPost = useCallback(
    async (communityId, postData) => {
      const [_, data] = await request('POST', `cmis/communities/${communityId}/posts`, postData);
      return data;
    },
    [request],
  );

  const getStudentPosts = useCallback(
    async (studentId) => {
      const [_, data] = await request('GET', `cmis/students/${studentId}/projectidea`);
      return data;
    },
    [request],
  );

  const getStudentPost = useCallback(
    async (postId) => {
      const [_, data] = await request('GET', `cmis/projectidea/${postId}`);
      return data;
    },
    [request],
  );

  const sendStudentPost = useCallback(
    async (postData) => {
      const [_, data] = await request('POST', `cmis/students/${userData?.id}/projectidea`, postData);
      return data;
    },
    [request, userData],
  );

  const isStudentPostLiked = useCallback(
    async (postId) => {
      const [_, data] = await request('GET', `cmis/students/${userData?.id}/projectIdeas/${postId}/isLiked`);
      return data;
    },
    [request, userData?.id],
  );

  const isStudentPostBookmarked = useCallback(
    async (postId) => {
      const [_, data] = await request('GET', `cmis/students/${userData?.id}/projectIdeas/${postId}/isBookmarked`);
      return data;
    },
    [request, userData?.id],
  );

  const isCommunityPostLiked = useCallback(
    async (postId) => {
      const [_, data] = await request('GET', `cmis/posts/${postId}/isLikedByStudent/${userData?.id}`);
      return data;
    },
    [request, userData],
  );

  const isCommunityPostBookmarked = useCallback(
    async (postId) => {
      const [_, data] = await request('GET', `cmis/posts/${postId}/isBookmarkedByStudent/${userData?.id}`);
      return data;
    },
    [userData, request],
  );

  const isCommunityPostAttended = useCallback(
    async (eventId) => {
      const [_, data] = await request('GET', `cmis/students/${userData?.id}/events/${eventId}/isAttended`);
      return data;
    },
    [request, userData],
  );

  const likeCommunityPost = useCallback(
    async (postId) => {
      const [_, data] = await request('POST', `cmis/students/${userData?.id}/posts/${postId}/like`);
      return data;
    },
    [request, userData],
  );

  const bookmarkCommunityPost = useCallback(
    async (postId) => {
      const [_, data] = await request('POST', `cmis/students/${userData?.id}/bookmarkedPosts`, { id: postId });
      return data;
    },
    [request, userData],
  );

  const removeCommunityPostBookmark = useCallback(
    async (postId) => {
      const [_, data] = await request('DELETE', `cmis/students/${userData?.id}/bookmarkedPosts/${postId}`);
      return data;
    },
    [request, userData],
  );

  const attendCommunityPost = useCallback(
    async (eventId) => {
      const [_, data] = await request('POST', `cmis/students/${userData?.id}/events`, { id: eventId });
      return data;
    },
    [request, userData],
  );

  const removeCommunityPostAttendance = useCallback(
    async (eventId) => {
      const [_, data] = await request('DELETE', `cmis/students/${userData?.id}/events/${eventId}`);
      return data;
    },
    [request, userData],
  );

  const likeStudentPost = useCallback(
    async (postId) => {
      const [_, data] = await request('POST', `cmis/students/${userData?.id}/projectidea/${postId}/like`);
      return data;
    },
    [request, userData?.id],
  );

  const bookmarkStudentPost = useCallback(
    async (postId) => {
      const [_, data] = await request('POST', `cmis/students/${userData?.id}/bookMarkedProjectIdeas`, { id: postId });
      return data;
    },
    [request, userData?.id],
  );

  const removeStudentPostBookmark = useCallback(
    async (postId) => {
      const [_, data] = await request('POST', `cmis/students/${userData?.id}/bookMarkedProjectIdeas/${postId}`);
      return data;
    },
    [request, userData?.id],
  );

  const deleteCommunityPost = useCallback(
    async (postId) => {
      const [_, data] = await request('DELETE', `cmis/posts/${postId}`);
      return data;
    },
    [request],
  );

  const deleteStudentPost = useCallback(
    async (postId) => {
      const [_, data] = await request('DELETE', `cmis/projectidea/${postId}`);
      return data;
    },
    [request],
  );

  const getEvents = useCallback(async () => {
    let _, data;
    if (userData?.isCommunity) {
      [_, data] = await request('GET', `cmis/communities/${userData?.id}/allEventDetails`);
    } else {
      [_, data] = await request('GET', `cmis/students/${userData?.id}/allEventDetails`);
    }
    return data;
  }, [request, userData]);

  const getCommunityEvents = useCallback(
    async (communityId) => {
      const [_, data] = await request('GET', `cmis/communities/${communityId}/allEventDetails`);
      return data;
    },
    [request],
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
    [request, userData],
  );

  const acceptCommunity = useCallback(
    async (communityId) => {
      const [_, data] = await request('POST', `cmis/admin/${userData?.id}/unverifiedCommunities/${communityId}/accept`);
      return data;
    },
    [request, userData],
  );

  const rejectCommunity = useCallback(
    async (communityId) => {
      const [_, data] = await request(
        'POST',
        `cmis/admin/${userData?.id}/unverifiedCommunities/${communityId}/decline`,
      );
      return data;
    },
    [request, userData],
  );

  const deleteCommunity = useCallback(
    async (communityId) => {
      const [_, data] = await request('DELETE', `cmis/communities/${communityId}`);
      return data;
    },
    [request],
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
    [request],
  );

  const deleteStudent = useCallback(
    async (studentId) => {
      const [_, data] = await request('DELETE', `cmis/students/${studentId}`);
      return data;
    },
    [request],
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
    [request],
  );

  const deletePost = useCallback(
    async (postId) => {
      const [_, data] = await request('DELETE', `cmis/posts/${postId}`);
      return data;
    },
    [request],
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
    [request],
  );

  const deleteProjectIdea = useCallback(
    async (projectIdeaId) => {
      const [_, data] = await request('DELETE', `cmis/projectidea/${projectIdeaId}`);
      return data;
    },
    [request],
  );

  const getGlobalPosts = useCallback(
    async (search) => {
      if (!search) {
        const [_, data] = await request('GET', `cmis/posts/global`);
        return data;
      } else {
        const [_, data] = await request('GET', `cmis/posts/global/search?search=${search}`);
        return data;
      }
    },
    [request],
  );

  const getBookmarkedPosts = useCallback(
    async (search) => {
      if (!search) {
        const [_, data] = await request('GET', `cmis/students/${userData?.id}/bookmarkedPosts`);
        return data;
      } else {
        const [_, data] = await request('GET', `cmis/students/${userData?.id}/bookmarkedPosts/search?search=${search}`);
        return data;
      }
    },
    [request, userData],
  );

  const getBookmarkedProjectIdeas = useCallback(
    async (search) => {
      if (!search) {
        const [_, data] = await request('GET', `cmis/students/${userData?.id}/bookMarkedProjectIdeas`);
        return data;
      } else {
        const [_, data] = await request('GET', `cmis/students/${userData?.id}/bookMarkedPosts/search?search=${search}`);
        return data;
      }
    },
    [request, userData],
  );

  const getPrivateCommunityPosts = useCallback(
    async (communityId) => {
      const [_, data] = await request('GET', `cmis/posts/communities/${communityId}/private`);
      return data;
    },
    [request],
  );

  const getMemberCommunityPosts = useCallback(async () => {
    const [_, data] = await request('GET', `cmis/posts/${userData?.id}/private`);
    return data;
  }, [request, userData]);

  const getStudentsHasProjectIdea = useCallback(async () => {
    const [_, data] = await request('GET', `cmis/students/withProjectIdea`);
    return data;
  }, [request]);

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
      getCommunityPost,
      getStudentPost,
      isStudentPostLiked,
      isStudentPostBookmarked,
      isCommunityPostLiked,
      isCommunityPostBookmarked,
      isCommunityPostAttended,
      likeCommunityPost,
      bookmarkCommunityPost,
      removeCommunityPostBookmark,
      attendCommunityPost,
      removeCommunityPostAttendance,
      likeStudentPost,
      bookmarkStudentPost,
      removeStudentPostBookmark,
      deleteCommunityPost,
      deleteStudentPost,
      updateStudent,
      removeMember,
      authorizeMember,
      removeMemberAuthorization,
      isAuthorizedMember,
      getEvents,
      getCommunityEvents,

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
      hasAppliedToCommunity,
      getGlobalPosts,
      getBookmarkedPosts,
      getBookmarkedProjectIdeas,
      getPrivateCommunityPosts,
      getMemberCommunityPosts,
      getStudentsHasProjectIdea,
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
      getCommunityPost,
      getStudentPost,
      isStudentPostLiked,
      isStudentPostBookmarked,
      isCommunityPostLiked,
      isCommunityPostBookmarked,
      isCommunityPostAttended,
      likeCommunityPost,
      bookmarkCommunityPost,
      removeCommunityPostBookmark,
      attendCommunityPost,
      removeCommunityPostAttendance,
      likeStudentPost,
      bookmarkStudentPost,
      removeStudentPostBookmark,
      deleteCommunityPost,
      deleteStudentPost,
      updateStudent,
      removeMember,
      authorizeMember,
      removeMemberAuthorization,
      isAuthorizedMember,
      getEvents,
      getCommunityEvents,
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
      hasAppliedToCommunity,
      getGlobalPosts,
      getBookmarkedPosts,
      getBookmarkedProjectIdeas,
      getPrivateCommunityPosts,
      getMemberCommunityPosts,
      getStudentsHasProjectIdea,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      <Head>
        <title>GTU Community Management and Interaction System</title>
      </Head>
      {
        // if page is not admin panel, show header
        !router.asPath.includes('admin-paneli') && <Header />
      }
      <main>
        {(router.asPath === '/' ||
          router.asPath === '/yaklasan-etkinlikler' ||
          router.asPath === '/topluluklar' ||
          router.asPath === '/askida-proje') && <LeftMenu />}
        <Component {...pageProps} />
      </main>
    </AuthContext.Provider>
  );
}

export default MyApp;
