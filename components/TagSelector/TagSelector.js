import { useRouter } from 'next/router';
import { ApiContext } from 'pages/_app';
import { useContext, useEffect, useRef, useState } from 'react';
import styles from './TagSelector.module.scss';

const tagNames = {
  TAG_ART: 'sanat',
  TAG_BIOLOGY: 'biyoloji',
  TAG_SCIENCE: 'bilim',
  TAG_DRONE: 'drone',
  TAG_CHEMISTRY: 'kimya',
  TAG_COMPUTER: 'bilgisayar',
  TAG_ENGINEERING: 'mühendislik',
  TAG_ENTERTAINMENT: 'eğlence',
  TAG_FOOD: 'yemek',
  TAG_GAMING: 'oyun',
  TAG_LITERATURE: 'edebiyat',
  TAG_MATH: 'matematik',
  TAG_MUSIC: 'müzik',
  TAG_PHILOSOPHY: 'felsefe',
  TAG_PHYSICS: 'fizik',
  TAG_ROBOT: 'robot',
  TAG_SOCIAL: 'sosyal',
  TAG_SPORT: 'spor',
  TAG_TEAM: 'takım',
};

export function Tag({ tag, onTagRemoved }) {
  return (
    <div className={styles.tag}>
      {tagNames[tag.tag]}
      {onTagRemoved && (
        <button
          className={styles.tagRemove}
          onClick={() => {
            onTagRemoved(tag);
          }}
        >
          x
        </button>
      )}
    </div>
  );
}

function TagSelect({ tags, onTagSelected }) {
  const selectRef = useRef();

  return (
    <select
      ref={selectRef}
      onChange={onTagSelected}
      onClick={() => {
        selectRef.current.selectedIndex = -1;
      }}
    >
      {tags.map((tag) => (
        <option key={tag.id} value={tag.id}>
          {tagNames[tag.tag]}
        </option>
      ))}
    </select>
  );
}

export default function TagSelector({ onTagsSelected, isSearching }) {
  const router = useRouter();
  const apiContext = useContext(ApiContext);
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [unselectedTags, setUnselectedTags] = useState([]);

  useEffect(() => {
    (async () => {
      setAllTags(await apiContext.getAllTags());
    })();
  }, [apiContext]);

  useEffect(() => {
    onTagsSelected(selectedTags);
    setUnselectedTags(allTags?.filter((tag) => !selectedTags.some((selectedTag) => selectedTag.id == tag.id)));
  }, [allTags, onTagsSelected, selectedTags]);

  useEffect(() => {
    (async () => {
      if (!isSearching) {
        let selectedTags_;
        if (apiContext.userData?.isCommunity) {
          selectedTags_ = await apiContext.getCommunityTags(router.query.id);
        } else {
          selectedTags_ = await apiContext.getStudentTags(router.query.id);
        }

        setSelectedTags(selectedTags_);
      }
    })();
  }, [apiContext, isSearching, router.query.id]);

  function onTagSelected(e) {
    if (e.target.value) {
      setSelectedTags((oldSelectedTags) => [
        ...oldSelectedTags,
        unselectedTags.find((tag) => tag.id == e.target.value),
      ]);
    }
  }

  function onTagRemoved(tag) {
    setSelectedTags((oldSelectedTags) => oldSelectedTags.filter((selectedTag) => selectedTag.id != tag.id));
  }

  async function selectInterests() {
    const interests = await apiContext.getStudentTags(apiContext.userData?.id);
    setSelectedTags(interests);
  }

  return (
    <div className={styles.tags}>
      <span>Etiket arama: </span>
      {isSearching && !apiContext.userData?.isCommunity && (
        <>
          <button className='mainButton mainButtonNeutral' onClick={selectInterests}>
            İlgi alanlarını seç
          </button>
        </>
      )}
      {selectedTags?.map((selectedTag) => (
        <Tag key={selectedTag.id} tag={selectedTag} onTagRemoved={onTagRemoved} />
      ))}
      {unselectedTags?.length > 0 && <TagSelect tags={unselectedTags} onTagSelected={onTagSelected} />}
    </div>
  );
}
