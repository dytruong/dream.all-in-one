import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform, animate } from 'framer-motion';
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
  question?: string; // Câu hỏi hiển thị ở trên cùng
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
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [verticalDirection, setVerticalDirection] = useState<'up' | 'down' | null>(null);
  const [dragDirection, setDragDirection] = useState<'horizontal' | 'vertical' | null>(null);

  // Motion values for drag feedback
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  
  // Transform for preview layers - always calculate, even when not dragging
  const prevPageTransform = useTransform(dragX, (x) => -window.innerWidth + x);
  const nextPageTransform = useTransform(dragX, (x) => window.innerWidth + x);

  // Maximum characters per page
  const MAX_CHARS_PER_PAGE = 420;

  // Split text into pages based on character limit
  const splitTextIntoPages = (text: string): string[] => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const pages: string[] = [];
    let currentPage = '';

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();

      if (currentPage.length + trimmedSentence.length > MAX_CHARS_PER_PAGE && currentPage.length > 0) {
        pages.push(currentPage.trim());
        currentPage = trimmedSentence + ' ';
      } else {
        currentPage += trimmedSentence + ' ';
      }
    }

    if (currentPage.trim().length > 0) {
      pages.push(currentPage.trim());
    }

    return pages.length > 0 ? pages : [text];
  };

  // Get current post's pages
  const getCurrentPostPages = (): string[] => {
    if (posts.length === 0) return [];
    return splitTextIntoPages(posts[currentPostIndex].text);
  };

  // Navigate to next/prev page
  const handleNextPage = () => {
    const pages = getCurrentPostPages();
    if (currentPageIndex < pages.length - 1) {
      setDirection('left');
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setDirection('right');
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  // Navigate to next/prev post
  const handleNextPost = () => {
    if (currentPostIndex < posts.length - 1) {
      setVerticalDirection('up');
      setCurrentPostIndex(currentPostIndex + 1);
      setCurrentPageIndex(0); // Reset to first page of new post
    }
  };

  const handlePrevPost = () => {
    if (currentPostIndex > 0) {
      setVerticalDirection('down');
      setCurrentPostIndex(currentPostIndex - 1);
      setCurrentPageIndex(0); // Reset to first page of new post
    }
  };

  // Get pagination dots
  const getPaginationDots = (): number[] => {
    const pages = getCurrentPostPages();
    const totalPages = pages.length;

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    const current = currentPageIndex;

    if (current <= 2) {
      return [0, 1, 2, 3, 4];
    } else if (current >= totalPages - 3) {
      return [totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1];
    } else {
      return [current - 2, current - 1, current, current + 1, current + 2];
    }
  };

  // Framer Motion variants for page transitions (horizontal)
  const pageVariants = {
    enter: (direction: string) => ({
      x: direction === 'left' ? '100%' : '-100%',
      opacity: 1,
      scale: 1,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: string) => ({
      x: direction === 'left' ? '-100%' : '100%',
      opacity: 1,
      scale: 1,
    }),
  };

  // Framer Motion variants for post transitions (vertical)
  const postVariants = {
    enter: (direction: string) => ({
      y: direction === 'up' ? '100%' : '-100%',
      opacity: 1,
      scale: 1,
    }),
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: string) => ({
      y: direction === 'up' ? '-100%' : '100%',
      opacity: 1,
      scale: 1,
    }),
  };

  const pageTransition = {
    type: 'spring' as const,
    stiffness: 500,
    damping: 35,
    mass: 0.3,
  };

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

    // Initialize with sample posts
    const samplePosts: Post[] = [
      {
        id: '1',
        user: 'John Smith',
        userAvatar: 'JS',
        question: 'What book changed your perspective on life?',
        text: 'Just finished reading an *incredible* book about **philosophy** and the meaning of life. It really changed my perspective on how we approach daily challenges. The author argues that true happiness comes not from achieving our goals, but from the journey itself. We spend so much time focusing on the destination that we forget to appreciate the present moment. Every step, every struggle, every small victory is part of what makes life meaningful. **Highly recommend** to anyone seeking deeper understanding! 📚✨ #philosophy #mindfulness #bookrecommendation',
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
        question: 'What does coding mean to you?',
        text: 'Coding is not just about writing code, it\'s about **solving problems** and *creating solutions* that make people\'s lives better. Every line of code is an opportunity to make a difference. After 10 years in this industry, I\'ve learned that the best developers are not those who know every syntax or framework, but those who can **empathize with users** and understand the real problems they face. Technology is just a tool - what matters is how we use it to build something meaningful. Whether you\'re building a small app or a large system, always remember: **you\'re building for people, not machines**. Keep that human connection at the heart of everything you create. 💻🚀 #coding #developer #softwareengineering #tech',
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
        question: 'How do you handle failure?',
        text: '**Success** is not final, *failure* is not fatal: it is the **courage to continue** that counts. Keep pushing forward even when things get tough. Your breakthrough might be just around the corner! I\'ve failed more times than I can count - failed job interviews, failed projects, failed relationships. But each failure taught me something valuable. The key is not to avoid failure, but to *learn from it* and **keep moving forward**. When you fall down, you have two choices: stay down or get back up stronger. I choose to get back up every single time. Remember, every successful person you admire has failed countless times - the difference is they didn\'t give up. **Don\'t give up on your dreams**. 💪🎯 #motivation #nevergiveup #success',
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
        question: 'When is the right time to start?',
        text: 'The **best time** to plant a tree was 20 years ago. The *second best time* is **now**. Don\'t wait for the perfect moment, take the moment and make it perfect. Start today! I used to be the queen of procrastination - always waiting for the "right time" to start my business, learn that new skill, or pursue my passion. But guess what? The right time never came. Until I realized that there is no perfect moment. Life is messy, chaotic, and unpredictable. If you wait for everything to be perfect, you\'ll be waiting forever. So I stopped waiting and started doing. And you know what happened? Things weren\'t perfect, but they were *real*. And that real progress, no matter how small, beats perfect planning any day. **Take action today**, even if it\'s just one small step. That small step will lead to another, and another, and before you know it, you\'ve traveled miles. 🌱✨ #justdoit #takeaction #motivation #growth',
        highlightedWords: [],
        likes: 5678,
        comments: 345,
        shares: 234,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        liked: false
      },
      {
        id: '5',
        user: 'Alex Chen',
        userAvatar: 'AC',
        question: 'How do you take care of your mental health?',
        text: 'Mental health is just as important as physical health, yet we often neglect it. In our fast-paced world, we\'re constantly bombarded with notifications, deadlines, and expectations. We push ourselves to the limit, thinking that\'s what success looks like. But **true success** includes taking care of your mental wellbeing. I learned this the hard way after experiencing burnout last year. I was working 80-hour weeks, barely sleeping, always stressed. I thought I was being productive, but I was actually destroying myself. It took hitting rock bottom for me to realize that *rest is not laziness* - it\'s necessary for sustainable success. Now I prioritize my mental health: I meditate daily, I take breaks, I say no to things that drain me, and I surround myself with positive people. The result? I\'m more creative, more productive, and infinitely happier. **Take care of your mind** - it\'s the only one you\'ve got. 🧠💚 #mentalhealth #selfcare #wellness #burnout #mindfulness',
        highlightedWords: [],
        likes: 4521,
        comments: 287,
        shares: 156,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        liked: false
      },
      {
        id: '6',
        user: 'Emma Rodriguez',
        userAvatar: 'ER',
        question: 'What can we do about climate change?',
        text: 'Climate change is not a distant threat - it\'s happening right now, and we all have a role to play in fighting it. Every small action counts. I know it can feel overwhelming, like "what difference can one person make?" But imagine if everyone thought that way - nothing would ever change. Instead, imagine if everyone made just *one small change*: using reusable bags, reducing meat consumption, cycling instead of driving, or supporting sustainable businesses. Those individual actions multiply. I\'ve been making conscious choices for the past year: **zero waste lifestyle**, plant-based diet, buying secondhand, and supporting eco-friendly companies. Has it been perfect? No. Has it been easy? Not always. But is it worth it? Absolutely. We don\'t need a handful of people doing zero waste perfectly - we need millions of people doing it *imperfectly*. Start where you are, use what you have, do what you can. **The planet needs all of us**. 🌍♻️ #climatechange #sustainability #zerowaste #ecofriendly #savetheplanet',
        highlightedWords: [],
        likes: 6234,
        comments: 412,
        shares: 289,
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        liked: false
      }
    ];

    setPosts(samplePosts);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
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
    const parts: React.ReactNode[] = [];
    let currentText = text;
    let key = 0;

    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|#\w+)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(currentText)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={key++}>{currentText.substring(lastIndex, match.index)}</span>
        );
      }

      const matchedText = match[0];

      if (matchedText.startsWith('**') && matchedText.endsWith('**')) {
        parts.push(
          <strong key={key++} className="bold-text">
            {matchedText.slice(2, -2)}
          </strong>
        );
      } else if (matchedText.startsWith('*') && matchedText.endsWith('*')) {
        parts.push(
          <em key={key++} className="italic-text">
            {matchedText.slice(1, -1)}
          </em>
        );
      } else if (matchedText.startsWith('#')) {
        parts.push(
          <span key={key++} className="hashtag">
            {matchedText}
          </span>
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < currentText.length) {
      parts.push(
        <span key={key++}>{currentText.substring(lastIndex)}</span>
      );
    }

    return <>{parts}</>;
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  const currentPost = posts[currentPostIndex];
  const currentPostPages = getCurrentPostPages();

  return (
    <div className={`newsfeed-container ${theme}`}>
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

      <div className="feed-wrapper">
        <div className="mobile-feed" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Question section - Cố định vị trí, không bị ảnh hưởng bởi animation */}
          {currentPost && currentPost.question && (
            <div style={{ 
              position: 'absolute',
              top: '50%',
              left: '20px',
              right: '50px', // Giảm từ 70px xuống 50px - mở rộng text thêm 20px
              transform: 'translateY(calc(-50% - 200px))', // Đặt phía trên box
              zIndex: 30,
            }}>
              <div className="post-question">
                <div className="question-content">
                  <h3 className="question-text">{currentPost.question}</h3>
                </div>
              </div>
            </div>
          )}

          <AnimatePresence initial={false} custom={verticalDirection} mode="popLayout">
            {currentPost && (
              <motion.div
                key={`post-${currentPostIndex}`}
                className="post-item page-block active"
                custom={verticalDirection}
                variants={postVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.6}
                dragDirectionLock={true}
                dragMomentum={false}
                onDragStart={(e, info) => {
                  if (dragDirection !== 'horizontal') {
                    setDragDirection('vertical');
                  }
                }}
                onDrag={(e, info) => {
                  if (dragDirection === 'vertical') {
                    dragY.set(info.offset.y);
                  }
                }}
                onDragEnd={(e, info) => {
                  if (dragDirection === 'vertical') {
                    setDragDirection(null);
                    dragY.set(0);
                    
                    const screenHeight = window.innerHeight;
                    const draggedEnough = Math.abs(info.offset.y) > screenHeight * 0.15;
                    const hasVelocity = Math.abs(info.velocity.y) > 250;

                    if ((draggedEnough || hasVelocity) && info.offset.y < 0 && currentPostIndex < posts.length - 1) {
                      handleNextPost();
                    } else if ((draggedEnough || hasVelocity) && info.offset.y > 0 && currentPostIndex > 0) {
                      handlePrevPost();
                    }
                  }
                }}
                style={{ zIndex: 10 }}
              >
                {/* Horizontal scroll container with preview effect */}
                <div style={{ 
                  position: 'relative', 
                  width: '100%', 
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                  paddingRight: '70px', // Giảm từ 100px xuống 70px - mở rộng text thêm 30px
                }}>
                  <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
                    {/* Previous page preview */}
                    {currentPageIndex > 0 && (
                      <motion.div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          x: prevPageTransform,
                          zIndex: 2,
                          opacity: 0.5,
                          pointerEvents: 'none',
                        }}
                        className="post-content-center"
                      >
                        <div className="post-text">
                          <p>{highlightText(currentPostPages[currentPageIndex - 1], currentPost.highlightedWords)}</p>
                        </div>
                      </motion.div>
                    )}

                    {/* Current page */}
                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                      <motion.div
                        key={`page-${currentPageIndex}`}
                        className="post-content-center"
                        custom={direction}
                        variants={pageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 35,
                          mass: 0.3,
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.6}
                        dragDirectionLock={true}
                        dragMomentum={false}
                        onDragStart={(e, info) => {
                          setDragDirection('horizontal');
                        }}
                        onDrag={(e, info) => {
                          dragX.set(info.offset.x);
                        }}
                        onDragEnd={(e, info) => {
                          const pages = getCurrentPostPages();
                          const screenWidth = window.innerWidth;
                          const draggedEnough = Math.abs(info.offset.x) > screenWidth * 0.2;
                          const hasVelocity = Math.abs(info.velocity.x) > 250;

                          if ((draggedEnough || hasVelocity) && info.offset.x < 0 && currentPageIndex < pages.length - 1) {
                            handleNextPage();
                            dragX.set(0);
                            setDragDirection(null);
                          } else if ((draggedEnough || hasVelocity) && info.offset.x > 0 && currentPageIndex > 0) {
                            handlePrevPage();
                            dragX.set(0);
                            setDragDirection(null);
                          } else {
                            // Snap back if not dragged enough
                            setDragDirection(null);
                            dragX.set(0);
                          }
                        }}
                        style={{ 
                          backgroundColor: theme === 'dark' ? '#000' : '#fff',
                          zIndex: 5,
                          position: 'relative',
                          padding: '24px',
                        }}
                      >
                        <div className="post-text">
                          <p>{highlightText(currentPostPages[currentPageIndex], currentPost.highlightedWords)}</p>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Next page preview */}
                    {currentPageIndex < currentPostPages.length - 1 && (
                      <motion.div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          x: nextPageTransform,
                          zIndex: 2,
                          opacity: 0.5,
                          pointerEvents: 'none',
                        }}
                        className="post-content-center"
                      >
                        <div className="post-text">
                          <p>{highlightText(currentPostPages[currentPageIndex + 1], currentPost.highlightedWords)}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="right-sidebar" style={{ position: 'absolute', zIndex: 20 }}>
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

                  <div className="sidebar-actions">
                    <div className="sidebar-action-item">
                      <button className={`sidebar-action-btn ${currentPost.liked ? 'liked' : ''}`}>
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

                {currentPostPages.length > 1 && (
                  <div className="pagination-controls" style={{ position: 'absolute', zIndex: 20 }}>
                    <button
                      className={`pagination-arrow left ${currentPageIndex === 0 ? 'disabled' : ''}`}
                      onClick={handlePrevPage}
                      disabled={currentPageIndex === 0}
                    >
                      &lt;
                    </button>

                    <div className="pagination-dots">
                      {getPaginationDots().map((index) => (
                        <div
                          key={index}
                          className={`pagination-dot ${index === currentPageIndex ? 'active' : ''}`}
                          onClick={() => setCurrentPageIndex(index)}
                        />
                      ))}
                    </div>

                    <button
                      className={`pagination-arrow right ${currentPageIndex >= currentPostPages.length - 1 ? 'disabled' : ''}`}
                      onClick={handleNextPage}
                      disabled={currentPageIndex >= currentPostPages.length - 1}
                    >
                      &gt;
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="navigation-arrows">
          <button 
            className={`nav-arrow up ${currentPostIndex === 0 ? 'disabled' : ''}`}
            onClick={handlePrevPost}
            disabled={currentPostIndex === 0}
          >
            ↑
          </button>
          <button 
            className={`nav-arrow down ${currentPostIndex >= posts.length - 1 ? 'disabled' : ''}`}
            onClick={handleNextPost}
            disabled={currentPostIndex >= posts.length - 1}
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  );
};

export default Newsfeed;