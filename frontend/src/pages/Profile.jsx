import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ideasAPI } from '../api';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    totalIdeas: 0,
    totalLikes: 0,
    totalComments: 0
  });
  const [joinedDate, setJoinedDate] = useState('');

  const fetchUserStats = async (email) => {
    try {
      const response = await ideasAPI.getAll();
      const allIdeas = response.data || [];
      
      // Filter user's ideas
      const userIdeas = allIdeas.filter(idea => 
        idea.author?.email === email || idea.author === email
      );
      
      // Calculate stats
      const totalIdeas = userIdeas.length;
      const totalLikes = userIdeas.reduce((sum, idea) => sum + (idea.likes?.length || 0), 0);
      const totalComments = userIdeas.reduce((sum, idea) => sum + (idea.comments?.length || 0), 0);
      
      setStats({
        totalIdeas,
        totalLikes,
        totalComments
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Get user info from localStorage
    const email = localStorage.getItem('userName') || 'user@example.com';
    
    setUserEmail(email);
    setUserName(email.split('@')[0]); // Extract name from email
    
    // Set joined date
    setJoinedDate(new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));

    // Fetch user's actual stats
    fetchUserStats(email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleEditProfile = () => {
    alert('Edit profile feature coming soon!');
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <button className="btn-back" onClick={handleBack}>
          ← Back to Dashboard
        </button>

        <div className="profile-header">
          <div className="profile-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
          <h1 className="profile-name">{userName}</h1>
          <p className="profile-email">{userEmail}</p>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <div className="stat-number">{stats.totalIdeas}</div>
            <div className="stat-label">Ideas Posted</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.totalLikes}</div>
            <div className="stat-label">Likes Received</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.totalComments}</div>
            <div className="stat-label">Comments</div>
          </div>
        </div>

        <div className="profile-info">
          <div className="info-item">
            <span className="info-label">📧 Email:</span>
            <span className="info-value">{userEmail}</span>
          </div>
          <div className="info-item">
            <span className="info-label">📅 Joined:</span>
            <span className="info-value">{joinedDate}</span>
          </div>
          <div className="info-item">
            <span className="info-label">🏆 Status:</span>
            <span className="info-value">Active Member</span>
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn-edit123" onClick={handleEditProfile}>
            ✏️ Edit Profile
          </button>
          <button className="btn-logout" onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}>
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
