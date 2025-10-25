import React, { useState, useEffect } from 'react';
import './Profile.css';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfileData {
  name: string;
  email: string;
  bio: string;
  phone: string;
  location: string;
  website: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    bio: '',
    phone: '',
    location: '',
    website: ''
  });
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setProfileData({
        name: parsedUser.name,
        email: parsedUser.email,
        bio: 'Passionate developer and tech enthusiast 💻',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        website: 'https://example.com'
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Update user in localStorage
    if (user) {
      const updatedUser = {
        ...user,
        name: profileData.name,
        email: profileData.email,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    // Reset to original data
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        bio: 'Passionate developer and tech enthusiast 💻',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        website: 'https://example.com'
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="header-content">
          <h1 className="logo">Dream Social</h1>
          <div className="header-actions">
            <button className="header-btn" onClick={() => window.location.href = '/newsfeed'}>
              🏠 Home
            </button>
            <button className="header-btn logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        <div className="profile-sidebar">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-avatar-large">
              {getInitials(user.name)}
            </div>
            <h2>{user.name}</h2>
            <p className="profile-email">{user.email}</p>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-value">1.2K</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat">
                <span className="stat-value">856</span>
                <span className="stat-label">Following</span>
              </div>
              <div className="stat">
                <span className="stat-value">234</span>
                <span className="stat-label">Posts</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="profile-menu">
            <button 
              className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="menu-icon">👤</span>
              Profile Information
            </button>
            <button 
              className={`menu-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <span className="menu-icon">🔒</span>
              Security & Privacy
            </button>
            <button 
              className={`menu-item ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <span className="menu-icon">🔔</span>
              Notifications
            </button>
            <button 
              className={`menu-item ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              <span className="menu-icon">⚙️</span>
              Preferences
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {activeTab === 'profile' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Profile Information</h2>
                {!isEditing ? (
                  <button className="edit-btn" onClick={() => setIsEditing(true)}>
                    ✏️ Edit Profile
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button className="save-btn" onClick={handleSave}>
                      ✓ Save
                    </button>
                    <button className="cancel-btn" onClick={handleCancel}>
                      ✕ Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="form-input"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Website</label>
                  <input
                    type="url"
                    name="website"
                    value={profileData.website}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="form-input"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="form-textarea"
                    rows={4}
                  />
                </div>
              </div>

              <div className="info-box">
                <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                <p><strong>Last updated:</strong> {new Date(user.updatedAt).toLocaleDateString()}</p>
                <p><strong>User ID:</strong> {user.id}</p>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Security & Privacy</h2>
              </div>

              <div className="security-options">
                <div className="security-item">
                  <div className="security-info">
                    <h3>Change Password</h3>
                    <p>Update your password regularly to keep your account secure</p>
                  </div>
                  <button className="action-button">Change Password</button>
                </div>

                <div className="security-item">
                  <div className="security-info">
                    <h3>Two-Factor Authentication</h3>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                  <button className="action-button">Enable 2FA</button>
                </div>

                <div className="security-item">
                  <div className="security-info">
                    <h3>Active Sessions</h3>
                    <p>Manage devices where you're currently logged in</p>
                  </div>
                  <button className="action-button">View Sessions</button>
                </div>

                <div className="security-item">
                  <div className="security-info">
                    <h3>Privacy Settings</h3>
                    <p>Control who can see your profile and posts</p>
                  </div>
                  <button className="action-button">Manage Privacy</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Notification Preferences</h2>
              </div>

              <div className="notification-options">
                <div className="notification-item">
                  <div className="notification-info">
                    <h3>Email Notifications</h3>
                    <p>Receive updates via email</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h3>Push Notifications</h3>
                    <p>Get notified on your device</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h3>Comment Notifications</h3>
                    <p>When someone comments on your post</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h3>Follow Notifications</h3>
                    <p>When someone follows you</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Preferences</h2>
              </div>

              <div className="preference-options">
                <div className="preference-item">
                  <label>Language</label>
                  <select className="form-select">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>

                <div className="preference-item">
                  <label>Theme</label>
                  <select className="form-select">
                    <option>Light</option>
                    <option>Dark</option>
                    <option>Auto</option>
                  </select>
                </div>

                <div className="preference-item">
                  <label>Time Zone</label>
                  <select className="form-select">
                    <option>Pacific Time (PT)</option>
                    <option>Eastern Time (ET)</option>
                    <option>Central Time (CT)</option>
                    <option>Mountain Time (MT)</option>
                  </select>
                </div>

                <div className="danger-zone">
                  <h3>Danger Zone</h3>
                  <div className="danger-actions">
                    <button className="danger-btn">Delete Account</button>
                    <p className="danger-text">Once you delete your account, there is no going back. Please be certain.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;