import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AddIdea.css';
import { ideasAPI } from '../api';
import Toast from '../components/Toast';

function EditIdea() {
  const { id } = useParams();
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
      return;
    }

    // Load idea data from localStorage (set in Dashboard)
    const editingIdea = localStorage.getItem('editingIdea');
    if (editingIdea) {
      const idea = JSON.parse(editingIdea);
      setFormData({
        title: idea.title,
        description: idea.description,
        category: idea.category || '',
      });
    } else {
      // Fallback: fetch from API
      const fetchIdeaData = async () => {
        try {
          const response = await ideasAPI.getById(id);
          const idea = response.data;
          setFormData({
            title: idea.title,
            description: idea.description,
            category: idea.category || '',
          });
        } catch (err) {
          console.error('Error fetching idea:', err);
          setError('Failed to load idea');
        }
      };
      fetchIdeaData();
    }
  }, [navigate, id]);

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
      console.log('Updating idea with data:', formData);

      const response = await ideasAPI.update(id, formData);

      console.log('✅ Idea updated successfully:', response.data);
      setSuccess(true);
      setToast({ message: 'Idea updated successfully!', type: 'success' });
      
      // Clear editing data
      localStorage.removeItem('editingIdea');

      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('❌ Error updating idea:', err);
      console.error('Error response:', err.response?.data);
      
      if (err.code === 'ERR_NETWORK') {
        setError('❌ Cannot connect to server. Backend might not be running.');
      } else {
        setError(err.response?.data?.message || err.response?.data?.error || 'Failed to update idea. Please try again.');
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
          <h1>✏️ Edit Your Idea</h1>
          <p>Update your innovative concept</p>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">✅ Your idea has been updated successfully! Redirecting...</div>}

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
              {loading ? '🔄 Updating...' : '✅ Update Idea'}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => {
                localStorage.removeItem('editingIdea');
                navigate('/dashboard');
              }}
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

export default EditIdea;
