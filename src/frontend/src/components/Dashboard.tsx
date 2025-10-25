import React, { useState, useEffect } from 'react';
import './Dashboard.css';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  isOwn: boolean;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Initialize with some sample chat messages
    const sampleMessages: ChatMessage[] = [
      {
        id: '1',
        user: 'John Smith',
        message: 'Hey! Welcome to Dream Social! 👋',
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        isOwn: false
      },
      {
        id: '2',
        user: 'Mary Johnson',
        message: 'Thanks for joining our community!',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        isOwn: false
      }
    ];
    setChatMessages(sampleMessages);
  }, []);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login
    window.location.href = '/login';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      user: user.name,
      message: newMessage,
      timestamp: new Date(),
      isOwn: true
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate receiving a response (for demo purposes)
    setTimeout(() => {
      const responses = [
        "That's awesome! 🎉",
        "Thanks for sharing!",
        "Great to hear from you!",
        "Interesting! Tell me more.",
        "Nice! 👍"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        user: 'Community Bot',
        message: randomResponse,
        timestamp: new Date(),
        isOwn: false
      };
      
      setChatMessages(prev => [...prev, responseMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) {
    return (
      <div className="facebook-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="facebook-container">
      {/* Header Navigation */}
      <div className="facebook-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="logo">Dream Social</h1>
          </div>
          <div className="header-right">
            <div className="user-menu">
              <div className="profile-avatar small">
                {getInitials(user.name)}
              </div>
              <span className="user-name">{user.name}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        {/* Cover Photo Section */}
        <div className="cover-section">
          <div className="cover-photo">
            <div className="cover-gradient"></div>
          </div>
          
          {/* Profile Info */}
          <div className="profile-info-section">
            <div className="profile-avatar large">
              {getInitials(user.name)}
            </div>
            <div className="profile-details">
              <h1 className="profile-name">{user.name}</h1>
              <p className="profile-email">{user.email}</p>
              <p className="member-since">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="profile-actions">
              <button className="action-btn primary">Edit Profile</button>
              <button className="action-btn secondary">Settings</button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="profile-nav">
          <div className="nav-tabs">
            <button 
              className={`nav-tab ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => setActiveTab('posts')}
            >
              Posts
            </button>
            <button 
              className={`nav-tab ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              About
            </button>
            <button 
              className={`nav-tab ${activeTab === 'photos' ? 'active' : ''}`}
              onClick={() => setActiveTab('photos')}
            >
              Photos
            </button>
            <button 
              className={`nav-tab ${activeTab === 'friends' ? 'active' : ''}`}
              onClick={() => setActiveTab('friends')}
            >
              Friends
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          <div className="content-left">
            {/* About Section */}
            <div className="info-card">
              <h3>About</h3>
              <div className="info-item">
                <span className="info-icon">📧</span>
                <span>{user.email}</span>
              </div>
              <div className="info-item">
                <span className="info-icon">📅</span>
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <span className="info-icon">🆔</span>
                <span>ID: {user.id}</span>
              </div>
            </div>

            {/* Friends Section */}
            <div className="info-card">
              <h3>Friends</h3>
              <div className="friends-grid">
                <div className="friend-item">
                  <div className="friend-avatar">JS</div>
                  <span>John Smith</span>
                </div>
                <div className="friend-item">
                  <div className="friend-avatar">MJ</div>
                  <span>Mary Johnson</span>
                </div>
                <div className="friend-item">
                  <div className="friend-avatar">DW</div>
                  <span>David Wilson</span>
                </div>
              </div>
            </div>
          </div>

          <div className="content-center">
            {/* Create Post */}
            <div className="create-post-card">
              <div className="create-post-header">
                <div className="profile-avatar small">
                  {getInitials(user.name)}
                </div>
                <input 
                  type="text" 
                  placeholder={`What's on your mind, ${user.name.split(' ')[0]}?`}
                  className="post-input"
                />
              </div>
              <div className="create-post-actions">
                <button className="post-action">📷 Photo</button>
                <button className="post-action">🎥 Video</button>
                <button className="post-action">😊 Feeling</button>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="posts-feed">
              {/* Sample Post 1 */}
              <div className="post-card">
                <div className="post-header">
                  <div className="profile-avatar small">
                    {getInitials(user.name)}
                  </div>
                  <div className="post-info">
                    <h4>{user.name}</h4>
                    <p className="post-time">2 hours ago</p>
                  </div>
                </div>
                <div className="post-content">
                  <p>Just joined Dream Social! Excited to connect with everyone. 🎉</p>
                </div>
                <div className="post-actions">
                  <button className="post-action-btn">👍 Like</button>
                  <button className="post-action-btn">💬 Comment</button>
                  <button className="post-action-btn">📤 Share</button>
                </div>
              </div>

              {/* Sample Post 2 */}
              <div className="post-card">
                <div className="post-header">
                  <div className="profile-avatar small">
                    {getInitials(user.name)}
                  </div>
                  <div className="post-info">
                    <h4>{user.name}</h4>
                    <p className="post-time">1 day ago</p>
                  </div>
                </div>
                <div className="post-content">
                  <p>Working on some exciting new projects! Stay tuned for updates. 💻✨</p>
                </div>
                <div className="post-actions">
                  <button className="post-action-btn">👍 Like</button>
                  <button className="post-action-btn">💬 Comment</button>
                  <button className="post-action-btn">📤 Share</button>
                </div>
              </div>
            </div>
          </div>

          <div className="content-right">
            {/* Compact Chat Widget */}
            <div className="chat-widget">
              <div className="chat-widget-header">
                <h4>💬 Chat</h4>
                <div className="online-indicator">
                  <span className="status-dot online"></span>
                  <span>3</span>
                </div>
              </div>
              
              <div className="chat-widget-messages">
                {chatMessages.slice(-3).map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`chat-widget-message ${msg.isOwn ? 'own' : 'other'}`}
                  >
                    <div className="widget-message-content">
                      <strong>{msg.user.split(' ')[0]}:</strong> {msg.message}
                    </div>
                    <div className="widget-message-time">{formatTime(msg.timestamp)}</div>
                  </div>
                ))}
              </div>
              
              <div className="chat-widget-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type message..."
                  className="widget-chat-input"
                />
                <button 
                  onClick={handleSendMessage}
                  className="widget-send-btn"
                  disabled={!newMessage.trim()}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;