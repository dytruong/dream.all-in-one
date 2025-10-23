import React, { useState, useEffect } from 'react';
import './Dashboard.css';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
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
            {/* Activity Log */}
            <div className="info-card">
              <h3>Recent Activity</h3>
              <div className="activity-item">
                <span className="activity-icon">🔐</span>
                <div className="activity-content">
                  <p>Logged in successfully</p>
                  <small>Just now</small>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-icon">👤</span>
                <div className="activity-content">
                  <p>Profile accessed</p>
                  <small>5 minutes ago</small>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-icon">✅</span>
                <div className="activity-content">
                  <p>Account verified</p>
                  <small>1 hour ago</small>
                </div>
              </div>
            </div>

            {/* Online Friends */}
            <div className="info-card">
              <h3>Online Friends</h3>
              <div className="online-friends">
                <div className="online-friend">
                  <div className="friend-avatar online">JS</div>
                  <span>John Smith</span>
                </div>
                <div className="online-friend">
                  <div className="friend-avatar online">MJ</div>
                  <span>Mary Johnson</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;