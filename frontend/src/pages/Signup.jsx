import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { authAPI } from '../api';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    
    console.log('Attempting signup with:', { name: formData.name, email: formData.email });
    
    try {
      const response = await authAPI.register(formData);
      console.log('Signup response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.user._id || response.data.user.id);
        localStorage.setItem('userName', response.data.user.email || formData.email);
        
        console.log('✅ Saved to localStorage:', {
          token: 'set',
          userId: response.data.user._id || response.data.user.id,
          userName: response.data.user.email || formData.email
        });
        
        setFormData({ name: '', email: '', password: '' });
        
        alert('✅ Account created successfully! Redirecting to dashboard...');
        
        // Redirect to dashboard after successful signup
        setTimeout(() => {
          navigate('/dashboard');
          window.location.reload(); // Reload to update Navbar
        }, 500);
      }
    } catch (err) {
      console.error('Signup error:', err);
      console.error('Error response:', err.response?.data);
      
      if (err.response?.status === 400) {
        setError('❌ ' + (err.response?.data?.message || 'This email is already registered. Please login instead.'));
      } else if (err.code === 'ERR_NETWORK') {
        setError('❌ Cannot connect to server. Backend might not be running.');
      } else {
        setError(err.response?.data?.message || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Side - Blue Gradient with Quote */}
      <div className="auth-left">
        <div className="auth-illustration">🚀</div>
        <div className="auth-quote">
          <h2>Join IdeaShare Today!</h2>
          <p>
            Create your account and start sharing your innovative ideas with a 
            community of creators, dreamers, and innovators. Your next big idea 
            starts here!
          </p>
        </div>
      </div>

      {/* Right Side - White Form Card */}
      <div className="auth-right">
        <div className="auth-form-card">
          <h2>Sign Up</h2>
          <p className="subtitle">Create your account to get started</p>
          
          {error && <div className="error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
                minLength="6"
              />
            </div>
            
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? '🔄 Creating Account...' : '🚀 Sign Up'}
            </button>
          </form>
          
          <div className="auth-switch">
            Already have an account?
            <a href="/login">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
