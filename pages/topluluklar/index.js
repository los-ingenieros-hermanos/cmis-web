import clsx from 'clsx';
import { Link } from 'components';
import TagSelector from 'components/TagSelector/TagSelector';
import { useRouter } from 'next/router';
import { ApiContext } from 'pages/_app';
import { useCallback, useContext, useEffect, useState } from 'react';
import styles from 'styles/Communities.module.scss';

function getHref(data) {
  return `/topluluklar/${data.id}`;
}

function CommunitiesListElement({ data, addToFollowed, removeFromFollowed }) {
  const router = useRouter();
  const apiContext = useContext(ApiContext);
  const [isFollowerOf, setIsFollowerOf] = useState(data.isFollowed);

  useEffect(() => {
    (async () => {
      setIsFollowerOf(await apiContext.isFollowerOfCommunity(data.id));
    })();
  }, [apiContext, data.id]);

  function onFollowClicked() {
    if (!apiContext.userData) {
      apiContext.setIsLoginOpen(true);
      return;
    }

    setIsFollowerOf((oldIsFollowerOf) => {
      if (!oldIsFollowerOf) {
        apiContext.followCommunity(data.id);
        addToFollowed(data);
      } else {
        apiContext.unfollowCommunity(data.id);
        removeFromFollowed(data.id);
      }
      return !oldIsFollowerOf;
    });
  }

  function onGoToProfileClicked() {
    if (!apiContext.userData) {
      apiContext.setIsLoginOpen(true);
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
        {!apiContext.userData?.isCommunity && (
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
  const apiContext = useContext(ApiContext);
  const [communitiesList, setCommunitiesList] = useState([]);
  const [followedCommunitiesList, setFollowedCommunitiesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTags, setSearchTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(true);
      let mainCommunities = await apiContext.getCommunities(searchTerm);

      mainCommunities = mainCommunities.filter((community) => {
        for (const searchTag of searchTags) {
          if (!community.tags.some((tag) => tag.id == searchTag.id)) {
            return false;
          }
        }
        return true;
      });

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
      setIsLoading(false);
    })();
  }, [addToFollowed, apiContext, removeFromFollowed, searchTerm, searchTags]);

  useEffect(() => {
    (async () => {
      const followedCommunities = await apiContext.getFollowedCommunities();

      setFollowedCommunitiesList(
        followedCommunities?.map((community) => <FollowedCommunitiesListElement key={community.id} data={community} />),
      );
    })();
  }, [addToFollowed, apiContext, removeFromFollowed, router.query.communityType]);

  function onTagsSelected(tags) {
    setSearchTags(tags);
  }

  return (
    <>
      <div className={styles.searchAndMainList}>
        <div className={styles.flex1}>
          <input className={styles.searchBar} onChange={onSearchChanged} type='text' placeholder="cmis'te ara" />
          <div className={styles.tagSelector}>
            <TagSelector onTagsSelected={onTagsSelected} isSearching={true} />
          </div>
        </div>
        <ul className={styles.mainList}>
          {isLoading ? <div className='eventsLoader'></div> : communitiesList}
          {apiContext.userData?.roles[0] === 'ROLE_STUDENT' && (
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
