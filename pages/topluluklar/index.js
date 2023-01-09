import clsx from 'clsx';
import { Link } from 'components';
import { useRouter } from 'next/router';
import { AuthContext } from 'pages/_app';
import { useCallback, useContext, useEffect, useState } from 'react';
import styles from 'styles/Communities.module.scss';

function getHref(data) {
  return `/topluluklar/${data.id}`;
}

function CommunitiesListElement({ data, addToFollowed, removeFromFollowed }) {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [isFollowerOf, setIsFollowerOf] = useState(data.isFollowed);

  useEffect(() => {
    (async () => {
      setIsFollowerOf(await authContext.isFollowerOfCommunity(data.id));
    })();
  }, [authContext, data.id]);

  function onFollowClicked() {
    if (!authContext.userData) {
      authContext.setIsLoginOpen(true);
      return;
    }

    setIsFollowerOf((oldIsFollowerOf) => {
      if (!oldIsFollowerOf) {
        authContext.followCommunity(data.id);
        addToFollowed(data);
      } else {
        authContext.unfollowCommunity(data.id);
        removeFromFollowed(data.id);
      }
      return !oldIsFollowerOf;
    });
  }

  function onGoToProfileClicked() {
    if (!authContext.userData) {
      authContext.setIsLoginOpen(true);
    } else {
      router.push(getHref(data));
    }
  }

  return (
    <li className={styles.mainListElement}>
      <img
        className={styles.banner}
        src={
          data?.banner ??
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88OjpfwAI+QOoF8YQhgAAAABJRU5ErkJggg=='
        }
        alt='banner'
      />
      <img
        className={styles.pfp}
        src={
          data?.image ??
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88OjpfwAI+QOoF8YQhgAAAABJRU5ErkJggg=='
        }
        alt='profile picture'
      />
      <h2>{data.user.firstName}</h2>
      <p>{data.info}</p>
      <div className={styles.buttons}>
        {!authContext.userData?.isCommunity && (
          <button onClick={onFollowClicked} className={clsx('mainButton', isFollowerOf && 'mainButtonNegative')}>
            {isFollowerOf ? 'Takibi Bırak' : 'Takip Et'}
          </button>
        )}
        <button className={styles.goToProfileBtn} onClick={onGoToProfileClicked}>
          Profile Git {'>'}
        </button>
      </div>
    </li>
  );
}

function FollowedCommunitiesListElement({ data }) {
  return (
    <li className={styles.followedListElement}>
      <Link href={getHref(data)}>
        <img
          src={
            data?.image ??
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88OjpfwAI+QOoF8YQhgAAAABJRU5ErkJggg=='
          }
          alt='profile picture'
        />
      </Link>
      <Link href={getHref(data)}>{data.user.firstName}</Link>
    </li>
  );
}

export default function Communities() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [communitiesList, setCommunitiesList] = useState([]);
  const [followedCommunitiesList, setFollowedCommunitiesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  function onSearchChanged(e) {
    setSearchTerm(e.target.value);
  }

  const addToFollowed = useCallback((data) => {
    setFollowedCommunitiesList((oldList) => [...oldList, <FollowedCommunitiesListElement key={data.id} data={data} />]);
  }, []);

  const removeFromFollowed = useCallback((id) => {
    setFollowedCommunitiesList((oldList) => {
      return oldList.filter((elem) => {
        return elem.key != id;
      });
    });
  }, []);

  useEffect(() => {
    (async () => {
      const mainCommunities = await authContext.getCommunities(searchTerm);

      setCommunitiesList(
        mainCommunities?.map((community) => (
          <CommunitiesListElement
            key={community.id}
            data={community}
            addToFollowed={addToFollowed}
            removeFromFollowed={removeFromFollowed}
          />
        )),
      );
    })();
  }, [addToFollowed, authContext, removeFromFollowed, searchTerm]);

  useEffect(() => {
    (async () => {
      const followedCommunities = await authContext.getFollowedCommunities();

      setFollowedCommunitiesList(
        followedCommunities?.map((community) => <FollowedCommunitiesListElement key={community.id} data={community} />),
      );
    })();
  }, [addToFollowed, authContext, removeFromFollowed, router.query.communityType]);

  return (
    <>
      <div className={styles.searchAndMainList}>
        <div className={styles.flex1}>
          <input className={styles.searchBar} onChange={onSearchChanged} type='text' placeholder="cmis'te ara" />
        </div>
        <ul className={styles.mainList}>
          {communitiesList}
          {authContext.userData?.roles[0] === 'ROLE_STUDENT' && (
            <div className={styles.followedPanel}>
              <h2 className={styles.followedTitle}>Takip Ettiklerim</h2>
              {followedCommunitiesList}
            </div>
          )}
        </ul>
      </div>
    </>
  );
}
