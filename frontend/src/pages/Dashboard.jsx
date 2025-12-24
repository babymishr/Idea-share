import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Dashboard.css';
import { ideasAPI } from '../api';
import CommentModal from '../components/CommentModal';
import Toast from '../components/Toast';

function Dashboard() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('all');
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchIdeas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchIdeas = async () => {
    try {
      const response = await ideasAPI.getAll();
      const fetchedIdeas = response.data || [];
      setIdeas(fetchedIdeas);
      
      // Debug: Log to check author format
      console.log('Current user email:', getUserEmail());
      if (fetchedIdeas.length > 0) {
        console.log('Sample idea author:', fetchedIdeas[0].author);
      }
    } catch (err) {
      console.error('Error fetching ideas:', err);
      setError('Failed to load ideas');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (ideaId) => {
    try {
      const userId = localStorage.getItem('userId');
      await ideasAPI.like(ideaId, { userId });
      // Refresh ideas to get updated like count
      fetchIdeas();
      setToast({ message: 'Idea liked successfully!', type: 'success' });
    } catch (err) {
      console.error('Error liking idea:', err);
      setToast({ message: 'Failed to like idea', type: 'error' });
    }
  };

  const handleDelete = async (ideaId) => {
    console.log('Delete clicked for idea:', ideaId);
    
    if (!window.confirm('Are you sure you want to delete this idea?')) {
      return;
    }
    
    try {
      await ideasAPI.delete(ideaId);
      setIdeas(ideas.filter(idea => idea._id !== ideaId));
      setToast({ message: 'Idea deleted successfully!', type: 'success' });
    } catch (err) {
      console.error('Error deleting idea:', err);
      setToast({ message: 'Failed to delete idea', type: 'error' });
    }
  };

  const handleEdit = (idea) => {
    console.log('Edit clicked for idea:', idea);
    // Store idea in localStorage for editing
    localStorage.setItem('editingIdea', JSON.stringify(idea));
    navigate('/edit-idea/' + idea._id);
  };

  const handleComment = async (ideaId, commentText) => {
    try {
      const userId = localStorage.getItem('userId');
      const userName = localStorage.getItem('userName');
      
      await ideasAPI.comment(ideaId, {
        userId,
        userName,
        text: commentText
      });
      
      // Refresh ideas to show new comment
      await fetchIdeas();
      
      // Update selected idea for modal
      const updatedIdea = ideas.find(i => i._id === ideaId);
      if (updatedIdea) {
        setSelectedIdea(updatedIdea);
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment');
    }
  };

  const openCommentModal = (idea) => {
    setSelectedIdea(idea);
  };

  const closeCommentModal = () => {
    setSelectedIdea(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const getUserEmail = () => {
    return localStorage.getItem('userName') || 'User';
  };

  const isMyIdea = (idea) => {
    const userEmail = getUserEmail();
    
    // Debug logging
    console.log('Checking isMyIdea:', {
      userEmail,
      ideaAuthor: idea.author,
      authorEmail: idea.author?.email,
      authorType: typeof idea.author
    });
    
    // Check both author.email and author object string format
    if (idea.author?.email) {
      const match = idea.author.email === userEmail;
      console.log('Author email match:', match);
      return match;
    }
    // Fallback: check if author is a string (email)
    if (typeof idea.author === 'string') {
      const match = idea.author === userEmail;
      console.log('Author string match:', match);
      return match;
    }
    
    console.log('No match found, returning false');
    return false;
  };

  const filterIdeas = () => {
    if (activeSection === 'my') {
      return ideas.filter(idea => isMyIdea(idea));
    }
    return ideas;
  };

  const getTrendingIdeas = () => {
    return [...ideas]
      .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
      .slice(0, 5);
  };

  const formatTimeAgo = (date) => {
    if (!date) return 'Just now';
    const now = new Date();
    const ideaDate = new Date(date);
    const diffInMs = now - ideaDate;
    const diffInMins = Math.floor(diffInMs / 60000);
    
    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInMins < 1440) return `${Math.floor(diffInMins / 60)}h ago`;
    return `${Math.floor(diffInMins / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-feed">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading ideas...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredIdeas = filterIdeas();
  const trendingIdeas = getTrendingIdeas();

  return (
    <div className="dashboard">
      {/* Left Sidebar */}
      <aside className="dashboard-sidebar">
        <nav>
          <ul className="sidebar-menu">
            <li className="sidebar-item">
              <button
                className={`sidebar-link ${activeSection === 'all' ? 'active' : ''}`}
                onClick={() => setActiveSection('all')}
              >
                <span className="sidebar-icon"></span>
                All Ideas
              </button>
            </li>
            <li className="sidebar-item">
              <button
                className={`sidebar-link ${activeSection === 'my' ? 'active' : ''}`}
                onClick={() => setActiveSection('my')}
              >
                <span className="sidebar-icon"></span>
                My Ideas
              </button>
            </li>
            <li className="sidebar-item">
              <Link to="/add-idea" className="sidebar-link">
                <span className="sidebar-icon"></span>
                Add New Idea
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="/profile" className="sidebar-link">
                <span className="sidebar-icon"></span>
                Profile
              </Link>
            </li>
            <li className="sidebar-item">
              <button className="sidebar-link" onClick={handleLogout}>
                <span className="sidebar-icon"></span>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Center Feed */}
      <main className="dashboard-feed">
        <div className="dashboard-header">
          <h1>{activeSection === 'my' ? 'My Ideas' : 'All Ideas'}</h1>
          <Link to="/add-idea" className="btn-primary">
            + Add New Idea
          </Link>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="ideas-grid">
          {filteredIdeas.length === 0 ? (
            <div className="no-ideas">
              {activeSection === 'my' 
                ? ' You haven\'t created any ideas yet. Click "Add New Idea" to get started!' 
                : ' No ideas yet. Be the first to share!'}
            </div>
          ) : (
            filteredIdeas.map((idea) => (
              <article key={idea._id} className="idea-card">
                <div className="idea-author-info">
                  <div className="author-avatar">
                    {(idea.author?.name || idea.author?.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="author-name">
                    {idea.author?.name || idea.author?.email || 'Anonymous'}
                  </span>
                </div>
                
                <div className="idea-header">
                  <h3>{idea.title}</h3>
                  {idea.category && <span className="category">{idea.category}</span>}
                </div>
                
                <p className="idea-description">{idea.description}</p>
                
                <div className="idea-meta">
                  <span className="idea-time">{formatTimeAgo(idea.createdAt)}</span>
                  <div className="idea-actions">
                    <button 
                      className="btn-action btn-like"
                      onClick={() => handleLike(idea._id)}
                      title="Like this idea"
                    >
                      👍 like {idea.likes?.length || 0}
                    </button>
                    <button 
                      className="btn-action btn-comment"
                      onClick={() => openCommentModal(idea)}
                      title="View comments"
                    >
                      Comments {idea.comments?.length || 0}
                    </button>
                    <button 
                      className={`btn-action btn-edit ${!isMyIdea(idea) ? 'disabled' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (isMyIdea(idea)) {
                          handleEdit(idea);
                        } else {
                          setToast({ message: 'Only the author can edit this idea', type: 'warning' });
                        }
                      }}
                      title={isMyIdea(idea) ? "Edit this idea" : "Only author can edit"}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className={`btn-action btn-delete ${!isMyIdea(idea) ? 'disabled' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (isMyIdea(idea)) {
                          handleDelete(idea._id);
                        } else {
                          setToast({ message: 'Only the author can delete this idea', type: 'warning' });
                        }
                      }}
                      title={isMyIdea(idea) ? "Delete this idea" : "Only author can delete"}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="dashboard-right">
        <section className="trending-section">
          <h3> Trending Ideas</h3>
          {trendingIdeas.length > 0 ? (
            trendingIdeas.map((idea) => (
              <div key={idea._id} className="trending-item">
                <div className="trending-title">{idea.title}</div>
                <div className="trending-count">
                  👍 {idea.likes?.length || 0} likes
                </div>
              </div>
            ))
          ) : (
            <p style={{ fontSize: '13px', color: '#94A3B8' }}>No trending ideas yet</p>
          )}
        </section>

        <section className="contributors-section">
          <h3>⭐ Top Contributors</h3>
          <div className="contributor-item">
            <div className="trending-title">{getUserEmail()}</div>
            <div className="trending-count">
              {ideas.filter(i => i.author?.email === getUserEmail()).length} ideas
            </div>
          </div>
        </section>
      </aside>

      {/* Comment Modal */}
      {selectedIdea && (
        <CommentModal
          idea={selectedIdea}
          onClose={closeCommentModal}
          onAddComment={handleComment}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default Dashboard;
