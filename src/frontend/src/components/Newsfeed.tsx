import React, { useState, useEffect } from 'react';
import './Newsfeed.css';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Post {
  id: string;
  user: string;
  userAvatar: string;
  text: string;
  highlightedWords?: string[];
  likes: number;
  comments: number;
  shares: number;
  timestamp: Date;
  liked: boolean;
}

const Newsfeed: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Get theme preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }

    // Initialize with sample posts (text-focused, Threads-style)
    const samplePosts: Post[] = [
      {
        id: '1',
        user: 'John Smith',
        userAvatar: 'JS',
        text: 'Just finished reading an *incredible* book about **philosophy** and the meaning of life. It really changed my perspective on how we approach daily challenges. Highly recommend! 📚✨',
        highlightedWords: [],
        likes: 1234,
        comments: 89,
        shares: 45,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        liked: false
      },
      {
        id: '2',
        user: 'Mary Johnson',
        userAvatar: 'MJ',
        text: 'Coding is not just about writing code, it\'s about **solving problems** and *creating solutions* that make people\'s lives better. Every line of code is an opportunity to make a difference. 💻🚀 #coding #developer',
        highlightedWords: [],
        likes: 2567,
        comments: 156,
        shares: 78,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        liked: false
      },
      {
        id: '3',
        user: 'David Wilson',
        userAvatar: 'DW',
        text: '**Success** is not final, *failure* is not fatal: it is the **courage to continue** that counts. Keep pushing forward even when things get tough. Your breakthrough might be just around the corner! 💪🎯',
        highlightedWords: [],
        likes: 3421,
        comments: 234,
        shares: 112,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        liked: false
      },
      {
        id: '4',
        user: 'Sarah Lee',
        userAvatar: 'SL',
        text: 'The **best time** to plant a tree was 20 years ago. The *second best time* is **now**. Don\'t wait for the perfect moment, take the moment and make it perfect. Start today! 🌱✨',
        highlightedWords: [],
        likes: 5678,
        comments: 345,
        shares: 234,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        liked: false
      }
    ];

    setPosts(samplePosts);
  }, []);

  // Add mouse wheel scroll handler
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleWheel = (e: Event) => {
      const wheelEvent = e as WheelEvent;
      wheelEvent.preventDefault();
      
      // Clear existing timeout
      clearTimeout(scrollTimeout);
      
      // Set a timeout to prevent too rapid scrolling
      scrollTimeout = setTimeout(() => {
        if (wheelEvent.deltaY > 0) {
          // Scrolling down
          handleScroll('down');
        } else if (wheelEvent.deltaY < 0) {
          // Scrolling up
          handleScroll('up');
        }
      }, 100);
    };

    const container = document.querySelector('.newsfeed-container');
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
      clearTimeout(scrollTimeout);
    };
  }, [currentPostIndex, posts.length]);

  // Add touch swipe handler for mobile devices with improved sensitivity
  useEffect(() => {
    let touchStartY = 0;
    let touchEndY = 0;
    let isSwiping = false;
    
    const handleTouchStart = (e: Event) => {
      const touchEvent = e as TouchEvent;
      touchStartY = touchEvent.touches[0].clientY;
      touchEndY = touchStartY;
      isSwiping = true;
    };
    
    const handleTouchMove = (e: Event) => {
      if (!isSwiping) return;
      const touchEvent = e as TouchEvent;
      touchEndY = touchEvent.touches[0].clientY;
      
      // Calculate swipe distance
      const swipeDistance = touchStartY - touchEndY;
      
      // Optional: Add visual feedback while swiping
      // You can add a transform or opacity effect here if needed
    };
    
    const handleTouchEnd = () => {
      if (!isSwiping) return;
      
      const swipeDistance = touchStartY - touchEndY;
      const minSwipeDistance = 80; // Increased from 50 to 80 - người dùng phải kéo dài hơn
      
      // Only trigger scroll if swipe distance is significant
      if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance > 0) {
          // Swiped up - go to next post
          handleScroll('down');
        } else {
          // Swiped down - go to previous post
          handleScroll('up');
        }
      }
      
      // Reset state
      touchStartY = 0;
      touchEndY = 0;
      isSwiping = false;
    };
    
    const handleTouchCancel = () => {
      // Reset if touch is cancelled
      touchStartY = 0;
      touchEndY = 0;
      isSwiping = false;
    };

    const container = document.querySelector('.mobile-feed');
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchmove', handleTouchMove, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
      container.addEventListener('touchcancel', handleTouchCancel, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
        container.removeEventListener('touchcancel', handleTouchCancel);
      }
    };
  }, [currentPostIndex, posts.length]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - timestamp.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays}d ago`;
    }
    if (diffInHours > 0) {
      return `${diffInHours}h ago`;
    }
    return 'Just now';
  };

  const highlightText = (text: string, highlightWords?: string[]): React.ReactNode => {
    // Parse text for bold (**text**), italic (*text*), and hashtags
    const parts: React.ReactNode[] = [];
    let currentText = text;
    let key = 0;

    // Regular expression to match bold, italic, and hashtags
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|#\w+)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(currentText)) !== null) {
      // Add normal text before the match
      if (match.index > lastIndex) {
        parts.push(
          <span key={key++}>{currentText.substring(lastIndex, match.index)}</span>
        );
      }

      const matchedText = match[0];
      
      if (matchedText.startsWith('**') && matchedText.endsWith('**')) {
        // Bold text
        parts.push(
          <strong key={key++} className="bold-text">
            {matchedText.slice(2, -2)}
          </strong>
        );
      } else if (matchedText.startsWith('*') && matchedText.endsWith('*')) {
        // Italic text
        parts.push(
          <em key={key++} className="italic-text">
            {matchedText.slice(1, -1)}
          </em>
        );
      } else if (matchedText.startsWith('#')) {
        // Hashtag
        parts.push(
          <span key={key++} className="hashtag">
            {matchedText}
          </span>
        );
      }

      lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < currentText.length) {
      parts.push(
        <span key={key++}>{currentText.substring(lastIndex)}</span>
      );
    }

    return <>{parts}</>;
  };

  const handleScroll = (direction: 'up' | 'down') => {
    if (direction === 'down' && currentPostIndex < posts.length - 1) {
      setScrollDirection('down');
      setCurrentPostIndex(currentPostIndex + 1);
    } else if (direction === 'up' && currentPostIndex > 0) {
      setScrollDirection('up');
      setCurrentPostIndex(currentPostIndex - 1);
    }
  };

  // Reset scroll direction after animation completes
  useEffect(() => {
    if (scrollDirection) {
      const timer = setTimeout(() => {
        setScrollDirection(null);
        
        // Force reset any lingering transforms on mobile
        const postItem = document.querySelector('.post-item');
        if (postItem instanceof HTMLElement) {
          postItem.style.transform = 'translateY(0)';
        }
      }, 600); // Tăng từ 400ms lên 600ms để match với animation duration mới

      return () => clearTimeout(timer);
    }
  }, [scrollDirection, currentPostIndex]);

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  const currentPost = posts[currentPostIndex];

  return (
    <div className={`newsfeed-container ${theme}`}>
      {/* Header */}
      <div className="newsfeed-header">
        <div className="header-content">
          <h1 className="logo">Dream Social</h1>
          <div className="header-actions">
            <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button className="icon-btn" onClick={() => window.location.href = '/profile'} title="Profile">
              👤
            </button>
            <button className="icon-btn logout" onClick={handleLogout} title="Logout">
              🚪
            </button>
          </div>
        </div>
      </div>

      {/* Mobile-sized Feed Container */}
      <div className="feed-wrapper">
        <div className="mobile-feed">
          {currentPost && (
            <div className={`post-item ${scrollDirection ? `slide-${scrollDirection}` : ''}`}>
              {/* Post Content - Text Focused */}
              <div className="post-content-center">
                {/* Post Text - Main Focus */}
                <div className="post-text">
                  <p>{highlightText(currentPost.text, currentPost.highlightedWords)}</p>
                </div>
              </div>

              {/* Right Side Actions - TikTok Style */}
              <div className="right-sidebar">
                {/* User Info */}
                <div className="sidebar-user-info">
                  <div className="user-avatar-sidebar">
                    {currentPost.userAvatar}
                  </div>
                  <div className="user-name-sidebar">
                    {currentPost.user}
                  </div>
                  <div className="user-time-sidebar">
                    {formatTime(currentPost.timestamp)}
                  </div>
                </div>

                {/* Action Buttons with Counts */}
                <div className="sidebar-actions">
                  <div className="sidebar-action-item">
                    <button 
                      className={`sidebar-action-btn ${currentPost.liked ? 'liked' : ''}`}
                      onClick={() => handleLike(currentPost.id)}
                    >
                      <span className="sidebar-action-icon">{currentPost.liked ? '❤️' : '🤍'}</span>
                    </button>
                    <span className="sidebar-action-count">{formatNumber(currentPost.likes)}</span>
                  </div>

                  <div className="sidebar-action-item">
                    <button className="sidebar-action-btn">
                      <span className="sidebar-action-icon">💬</span>
                    </button>
                    <span className="sidebar-action-count">{formatNumber(currentPost.comments)}</span>
                  </div>

                  <div className="sidebar-action-item">
                    <button className="sidebar-action-btn">
                      <span className="sidebar-action-icon">📤</span>
                    </button>
                    <span className="sidebar-action-count">{formatNumber(currentPost.shares)}</span>
                  </div>
                </div>
              </div>

              {/* Post Counter */}
              <div className="post-counter">
                {currentPostIndex + 1} / {posts.length}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Arrows - Moved outside mobile-feed to avoid animation interference */}
        <div className="navigation-arrows">
          <button 
            className={`nav-arrow up ${currentPostIndex === 0 ? 'disabled' : ''}`}
            onClick={() => handleScroll('up')}
            disabled={currentPostIndex === 0}
            title={currentPostIndex === 0 ? 'Already at the first post' : 'Previous post'}
          >
            ↑
          </button>
          <button 
            className={`nav-arrow down ${currentPostIndex >= posts.length - 1 ? 'disabled' : ''}`}
            onClick={() => handleScroll('down')}
            disabled={currentPostIndex >= posts.length - 1}
            title={currentPostIndex >= posts.length - 1 ? 'Already at the last post' : 'Next post'}
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  );
};

export default Newsfeed;