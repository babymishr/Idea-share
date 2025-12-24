import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddIdea.css';
import { ideasAPI } from '../api';
import Toast from '../components/Toast';

function AddIdea() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const author = localStorage.getItem('userId');
      const userName = localStorage.getItem('userName');
      
      if (!author) {
        setError('❌ User not found. Please login again.');
        navigate('/login');
        return;
      }

      console.log('Creating idea with data:', { ...formData, author });

      const response = await ideasAPI.create({
        ...formData,
        author: {
          email: userName,
          name: userName
        },
        authorEmail: userName, // Send email separately for backend compatibility
      });

      console.log('✅ Idea created successfully:', response.data);
      setSuccess(true);
      setFormData({ title: '', description: '', category: '' });
      setToast({ message: 'Idea created successfully!', type: 'success' });
    
      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('❌ Error creating idea:', err);
      console.error('Error response:', err.response?.data);
      
      if (err.code === 'ERR_NETWORK') {
        setError('❌ Cannot connect to server. Backend might not be running.');
      } else {
        setError(err.response?.data?.message || err.response?.data?.error || 'Failed to create idea. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const descriptionLength = formData.description.length;
  const maxLength = 500;

  return (
    <div className="add-idea-container">
      <div className="add-idea-card">
        <div className="add-idea-header">
          <h1>💡 Share Your Brilliant Idea</h1>
          <p>Tell the world about your innovative concept</p>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">✅ Your idea has been shared successfully! Redirecting...</div>}

        <form onSubmit={handleSubmit} className="idea-form">
          <div className="form-group">
            <label htmlFor="title">Idea Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Give your idea a catchy title..."
              required
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              <option value="Technology">💻 Technology</option>
              <option value="Business">💼 Business</option>
              <option value="Education">📚 Education</option>
              <option value="Health">🏥 Health</option>
              <option value="Entertainment">🎮 Entertainment</option>
              <option value="Social">🤝 Social</option>
              <option value="Environment">🌱 Environment</option>
              <option value="Other">🌟 Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your idea in detail. What problem does it solve? What makes it unique?"
              required
              maxLength={maxLength}
            />
            <div className={`char-count ${descriptionLength > maxLength - 50 ? 'warning' : ''}`}>
              {descriptionLength}/{maxLength} characters
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit-idea" disabled={loading}>
              {loading ? '🔄 Sharing...' : '🚀 Share Idea'}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="idea-tips">
          <h4>💡 Tips for a great idea post:</h4>
          <ul>
            <li>Be clear and concise in your title</li>
            <li>Explain the problem your idea solves</li>
            <li>Describe what makes your idea unique</li>
            <li>Choose the most appropriate category</li>
          </ul>
        </div>
      </div>

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

export default AddIdea;
