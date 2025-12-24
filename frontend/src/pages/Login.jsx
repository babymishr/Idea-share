import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { authAPI } from '../api';

function Login() {
  const [formData, setFormData] = useState({
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
    
    console.log('Attempting login with:', { email: formData.email });
    
    try {
      const response = await authAPI.login(formData);
      console.log('Login response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.user._id || response.data.user.id);
        localStorage.setItem('userName', response.data.user.email || formData.email);
        
        console.log('✅ Saved to localStorage:', {
          token: 'set',
          userId: response.data.user._id || response.data.user.id,
          userName: response.data.user.email || formData.email
        });
        
        setFormData({ email: '', password: '' });
        // Redirect to dashboard after successful login
        setTimeout(() => {
          navigate('/dashboard');
          window.location.reload(); // Reload to update Navbar
        }, 500);
      }
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      
      if (err.response?.status === 400) {
        setError('❌ Invalid email or password. Please check your credentials or sign up first.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('❌ Cannot connect to server. Backend might not be running.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Side - Blue Gradient with Quote */}
      <div className="auth-left">
        <div className="auth-illustration">💡</div>
        <div className="auth-quote">
          <h2>Welcome Back!</h2>
          <p>
            Login to share your brilliant ideas, connect with innovators, 
            and turn your vision into reality. Let's create something amazing together!
          </p>
        </div>
      </div>

      {/* Right Side - White Form Card */}
      <div className="auth-right">
        <div className="auth-form-card">
          <h2>Login</h2>
          <p className="subtitle">Enter your credentials to access your account</p>
          
          {error && <div className="error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? '🔄 Logging in...' : '🚀 Login'}
            </button>
          </form>
          
          <div className="auth-switch">
            Don't have an account?
            <a href="/signup">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
