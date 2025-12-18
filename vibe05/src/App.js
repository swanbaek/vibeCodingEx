import './App.css';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { AiOutlineHeart, AiFillHeart, AiOutlineSearch } from 'react-icons/ai';
import { FiSend, FiMessageCircle } from 'react-icons/fi';
import { BsBookmark, BsBookmarkFill, BsMoon, BsSun } from 'react-icons/bs';
import { IoHomeOutline, IoHome, IoClose, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { MdOutlineOndemandVideo } from 'react-icons/md';
import { FaRegUser, FaUser } from 'react-icons/fa';

function Avatar({ src, size = 36, alt = 'avatar' }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }}
    />
  );
}

function Header({ theme, toggleTheme }) {
  return (
    <div className="ig-header">
      <div className="ig-header-inner">
        <div className="ig-logo"><NavLink to="/">Lifegram</NavLink></div>
        <div className="ig-actions">
          <button aria-label="Search"><AiOutlineSearch size={24} /></button>
          <button aria-label="Notifications"><AiOutlineHeart size={24} /></button>
          <button aria-label="Messages"><FiSend size={24} /></button>
          <button aria-label="Toggle theme" onClick={toggleTheme}>
            {theme === 'dark' ? <BsSun size={24} /> : <BsMoon size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
}

function Stories({ onStoryClick }) {
  const stories = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    username: `user_${i + 1}`,
    avatar: `https://picsum.photos/seed/story_av_${i + 1}/96/96`,
    hasStory: true,
  }));

  return (
    <div className="stories-container">
      <div className="stories-scroll">
        {stories.map((story) => (
          <div key={story.id} className="story-item" onClick={() => onStoryClick(story.id)}>
            <div className="story-ring">
              <Avatar src={story.avatar} size={56} alt={`${story.username} story`} />
            </div>
            <span className="story-username">{story.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StoryViewer({ storyIndex, onClose, onNext, onPrev }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const storyImages = Array.from({ length: 3 }).map((_, i) => ({
    id: i,
    image: `https://picsum.photos/seed/story_${storyIndex}_${i}/1080/1920`,
  }));

  const username = `user_${storyIndex + 1}`;
  const avatar = `https://picsum.photos/seed/story_av_${storyIndex + 1}/96/96`;

  useEffect(() => {
    setProgress(0);
    const duration = 3000; // 3초
    const interval = 30;
    let elapsed = 0;

    progressIntervalRef.current = setInterval(() => {
      elapsed += interval;
      setProgress((elapsed / duration) * 100);
    }, interval);

    timerRef.current = setTimeout(() => {
      handleNext();
    }, duration);

    return () => {
      clearTimeout(timerRef.current);
      clearInterval(progressIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImageIndex, storyIndex]);

  const handleNext = () => {
    if (currentImageIndex < storyImages.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    } else {
      onNext();
    }
  };

  const handlePrev = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    } else {
      onPrev();
    }
  };

  const handleAreaClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const third = rect.width / 3;
    if (x < third) {
      handlePrev();
    } else if (x > third * 2) {
      handleNext();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImageIndex]);

  return (
    <div className="story-viewer-overlay" onClick={onClose}>
      <div className="story-viewer" onClick={(e) => e.stopPropagation()}>
        <div className="story-header">
          <div className="story-user-info">
            <Avatar src={avatar} size={32} alt={username} />
            <span className="story-viewer-username">{username}</span>
          </div>
          <button className="story-close" onClick={onClose}>
            <IoClose size={28} />
          </button>
        </div>
        <div className="story-progress-bars">
          {storyImages.map((_, i) => (
            <div key={i} className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{
                  width: i < currentImageIndex ? '100%' : i === currentImageIndex ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>
        <div className="story-content" onClick={handleAreaClick}>
          <img src={storyImages[currentImageIndex].image} alt="story" />
        </div>
        <button className="story-nav story-nav-left" onClick={handlePrev}>
          <IoChevronBack size={32} />
        </button>
        <button className="story-nav story-nav-right" onClick={handleNext}>
          <IoChevronForward size={32} />
        </button>
      </div>
    </div>
  );
}

function Post({ username, imageUrl, avatarUrl, likes = 0, caption = '', postId }) {
  const [liked, setLiked] = useState(() => {
    try {
      const likedStore = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      return Array.isArray(likedStore) && likedStore.includes(postId);
    } catch (e) {
      return false;
    }
  });
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [bookmarked, setBookmarked] = useState(() => {
    const saved = localStorage.getItem('savedPosts');
    return saved ? JSON.parse(saved).includes(postId) : false;
  });
  const displayLikes = likes + (liked ? 1 : 0);

  const persistLike = (nextLiked) => {
    try {
      const storeRaw = localStorage.getItem('likedPosts');
      let likedStore = storeRaw ? JSON.parse(storeRaw) : [];
      if (!Array.isArray(likedStore)) likedStore = [];
      if (nextLiked) {
        if (postId && !likedStore.includes(postId)) likedStore.push(postId);
      } else {
        likedStore = likedStore.filter(id => id !== postId);
      }
      localStorage.setItem('likedPosts', JSON.stringify(likedStore));
    } catch (e) {
      // ignore storage errors
    }
  };

  const toggleLike = () => {
    setLiked((prev) => {
      const next = !prev;
      persistLike(next);
      return next;
    });
  };

  const likeOnImage = () => {
    if (!liked) {
      setLiked(true);
      persistLike(true);
    }
  };

  const toggleBookmark = () => {
    const saved = localStorage.getItem('savedPosts');
    let savedPosts = saved ? JSON.parse(saved) : [];
    
    if (bookmarked) {
      savedPosts = savedPosts.filter(id => id !== postId);
    } else {
      savedPosts.push(postId);
    }
    
    localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
    setBookmarked(!bookmarked);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      username: 'me',
      text: commentText.trim(),
      timestamp: new Date().toISOString(),
    };
    setComments(prev => [...prev, newComment]);
    setCommentText('');
  };

  return (
    <article className="post">
      <header className="post-header">
        <div className="post-user">
          <div className="avatar-ring">
            <Avatar src={avatarUrl} size={32} alt={`${username} avatar`} />
          </div>
          <span className="post-username">{username}</span>
        </div>
        <button className="post-more" aria-label="More options">⋯</button>
      </header>
      <div className="post-image" onDoubleClick={likeOnImage}>
        <img src={imageUrl} alt={caption || 'post image'} loading="lazy" />
      </div>
      <div className="post-actions">
        <div className="left">
          <button className={liked ? 'like liked' : 'like'} aria-pressed={liked} aria-label="Like" onClick={toggleLike}>
            {liked ? <AiFillHeart size={24} /> : <AiOutlineHeart size={24} />}
          </button>
          <button aria-label="Comment" title="댓글"><FiMessageCircle size={24} /></button>
          <button aria-label="Share" title="공유"><FiSend size={24} /></button>
        </div>
        <div className="right">
          <button 
            className={bookmarked ? 'bookmark bookmarked' : 'bookmark'} 
            aria-label="Save" 
            title="저장" 
            onClick={toggleBookmark}
          >
            {bookmarked ? <BsBookmarkFill size={24} /> : <BsBookmark size={24} />}
          </button>
        </div>
      </div>
      <div className="post-info">
        <div className="likes">좋아요 {displayLikes.toLocaleString()}개</div>
        {caption && (
          <div className="caption"><span className="post-username">{username}</span> {caption}</div>
        )}
        {comments.length > 0 && (
          <div className="comments-section">
            <button className="view-comments" onClick={() => setShowAllComments(!showAllComments)}>
              댓글 {comments.length}개 {showAllComments ? '숨기기' : '모두 보기'}
            </button>
            {showAllComments && (
              <div className="comments-list">
                {comments.map(c => (
                  <div key={c.id} className="comment">
                    <span className="comment-username">{c.username}</span> {c.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <form className="comment-form" onSubmit={handleAddComment}>
        <input
          type="text"
          placeholder="댓글 달기..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="comment-input"
        />
        <button type="submit" className="comment-submit" disabled={!commentText.trim()}>
          게시
        </button>
      </form>
    </article>
  );
}

function Feed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [viewingStory, setViewingStory] = useState(null);
  const sentinelRef = useRef(null);

  const loadMorePosts = () => {
    if (loading || !hasMore) return;
    setLoading(true);

    // 페이지당 6개 포스트, 최대 5페이지(30개)
    const startIdx = page * 6;
    if (startIdx >= 30) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const newPosts = Array.from({ length: 6 }).map((_, i) => {
        const seed = startIdx + i + 1;
        const size = 1080;
        return {
          id: `post_${seed}`,
          postId: `post_${seed}`,
          username: `user_${seed}`,
          imageUrl: `https://picsum.photos/seed/insta_${seed}/${size}/${size}`,
          avatarUrl: `https://picsum.photos/seed/av_${seed}/96/96`,
          likes: Math.floor(Math.random() * 5000) + 1,
          caption: '랜덤 이미지로 구성된 인스타그램 클론 피드',
        };
      });
      setPosts(prev => [...prev, ...newPosts]);
      setPage(prev => prev + 1);
      setLoading(false);
    }, 600);
  };

  useEffect(() => {
    loadMorePosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loading, page]);

  const handleStoryClick = (storyId) => {
    setViewingStory(storyId);
  };

  const handleCloseStory = () => {
    setViewingStory(null);
  };

  const handleNextStory = () => {
    if (viewingStory < 9) {
      setViewingStory(viewingStory + 1);
    } else {
      setViewingStory(null);
    }
  };

  const handlePrevStory = () => {
    if (viewingStory > 0) {
      setViewingStory(viewingStory - 1);
    }
  };

  return (
    <main className="feed">
      <Stories onStoryClick={handleStoryClick} />
      {posts.map((p) => (
        <Post key={p.id} {...p} />
      ))}
      {hasMore && (
        <div ref={sentinelRef} className="feed-sentinel">
          {loading && <div className="spinner">로딩 중...</div>}
        </div>
      )}
      {!hasMore && <div className="feed-end">모든 게시물을 확인했습니다</div>}
      {viewingStory !== null && (
        <StoryViewer
          storyIndex={viewingStory}
          onClose={handleCloseStory}
          onNext={handleNextStory}
          onPrev={handlePrevStory}
        />
      )}
    </main>
  );
}

function SavedPosts({ refreshKey }) {
  const [savedPostIds, setSavedPostIds] = useState([]);

  useEffect(() => {
    const loadSaved = () => {
      const saved = localStorage.getItem('savedPosts');
      setSavedPostIds(saved ? JSON.parse(saved) : []);
    };
    
    loadSaved();
    
    // storage 이벤트 리스너 추가 (다른 탭에서 변경 시)
    window.addEventListener('storage', loadSaved);
    
    return () => window.removeEventListener('storage', loadSaved);
  }, [refreshKey]);

  const savedPosts = savedPostIds
    .filter(postId => postId && typeof postId === 'string')
    .map(postId => {
      const seed = parseInt(postId.split('_')[1]);
      return {
        id: postId,
        imageUrl: `https://picsum.photos/seed/insta_${seed}/600/600`,
      };
    });

  if (savedPosts.length === 0) {
    return (
      <div className="empty-saved">
        <BsBookmark size={64} />
        <p>저장한 게시물이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="profile-grid">
      {savedPosts.map((post) => (
        <div className="grid-item" key={post.id}>
          <img src={post.imageUrl} alt="saved post" loading="lazy" />
        </div>
      ))}
    </div>
  );
}

function LikedPosts({ refreshKey }) {
  const [likedPostIds, setLikedPostIds] = useState([]);

  useEffect(() => {
    const loadLiked = () => {
      try {
        const liked = localStorage.getItem('likedPosts');
        const parsed = liked ? JSON.parse(liked) : [];
        setLikedPostIds(Array.isArray(parsed) ? parsed.filter(Boolean) : []);
      } catch (e) {
        setLikedPostIds([]);
      }
    };

    loadLiked();
    window.addEventListener('storage', loadLiked);
    return () => window.removeEventListener('storage', loadLiked);
  }, [refreshKey]);

  const likedPosts = likedPostIds
    .filter(postId => postId && typeof postId === 'string')
    .map(postId => {
      const seed = parseInt(postId.split('_')[1]);
      return {
        id: postId,
        imageUrl: `https://picsum.photos/seed/insta_${seed}/600/600`,
      };
    });

  if (likedPosts.length === 0) {
    return (
      <div className="empty-saved">
        <AiOutlineHeart size={64} />
        <p>좋아요한 게시물이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="profile-grid">
      {likedPosts.map((post) => (
        <div className="grid-item" key={post.id}>
          <img src={post.imageUrl} alt="liked post" loading="lazy" />
        </div>
      ))}
    </div>
  );
}

function Profile() {
  const avatar = '/images/profile.png';
  const [activeTab, setActiveTab] = useState('posts');
  const [refreshKey, setRefreshKey] = useState(0);
  const [likedRefreshKey, setLikedRefreshKey] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [likedCount, setLikedCount] = useState(0);
  const imgs = Array.from({ length: 12 }).map((_, i) => `https://picsum.photos/seed/profile_${i + 1}/600/600`);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'saved') {
      setRefreshKey(prev => prev + 1);
    }
    if (tab === 'liked') {
      setLikedRefreshKey(prev => prev + 1);
    }
  };

  useEffect(() => {
    const syncCounts = () => {
      try {
        const saved = localStorage.getItem('savedPosts');
        const liked = localStorage.getItem('likedPosts');
        const savedParsed = saved ? JSON.parse(saved) : [];
        const likedParsed = liked ? JSON.parse(liked) : [];
        setSavedCount(Array.isArray(savedParsed) ? savedParsed.filter(Boolean).length : 0);
        setLikedCount(Array.isArray(likedParsed) ? likedParsed.filter(Boolean).length : 0);
      } catch (e) {
        setSavedCount(0);
        setLikedCount(0);
      }
    };

    syncCounts();
  }, [refreshKey, likedRefreshKey]);
  
  return (
    <main className="profile">
      <div className="profile-header">
        <Avatar src={avatar} size={80} alt="my avatar" />
        <div className="profile-meta">
          <div className="row">
            <span className="username">me</span>
          </div>
          <div className="row muted">
            <span>게시물 {imgs.length}</span>
            <span>팔로워 1,024</span>
            <span>팔로우 120</span>
          </div>
        </div>
      </div>
      <div className="profile-tabs">
        <button 
          className={activeTab === 'posts' ? 'tab active' : 'tab'} 
          onClick={() => handleTabChange('posts')}
        >
          내 게시물<span className="tab-count">{imgs.length}</span>
        </button>
        <button 
          className={activeTab === 'saved' ? 'tab active' : 'tab'} 
          onClick={() => handleTabChange('saved')}
        >
          저장됨{savedCount ? <span className="tab-count">{savedCount}</span> : null}
        </button>
        <button 
          className={activeTab === 'liked' ? 'tab active' : 'tab'} 
          onClick={() => handleTabChange('liked')}
        >
          좋아요{likedCount ? <span className="tab-count">{likedCount}</span> : null}
        </button>
      </div>
      {activeTab === 'posts' ? (
        <div className="profile-grid">
          {imgs.map((src, i) => (
            <div className="grid-item" key={i}>
              <img src={src} alt={`post ${i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      ) : activeTab === 'saved' ? (
        <SavedPosts key={refreshKey} refreshKey={refreshKey} />
      ) : (
        <LikedPosts key={likedRefreshKey} refreshKey={likedRefreshKey} />
      )}
    </main>
  );
}

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end>
        {({ isActive }) => isActive ? <IoHome size={26} /> : <IoHomeOutline size={26} />}
      </NavLink>
      <button aria-label="Search" disabled><AiOutlineSearch size={26} /></button>
      <button aria-label="Reels" disabled><MdOutlineOndemandVideo size={26} /></button>
      <NavLink to="/profile">
        {({ isActive }) => isActive ? <FaUser size={24} /> : <FaRegUser size={24} />}
      </NavLink>
    </nav>
  );
}

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <div className="app-root">
        <Header theme={theme} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
