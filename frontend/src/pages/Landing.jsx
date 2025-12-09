import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

function Landing() {
  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-left">
            <h1>Turn Your Ideas Into Reality</h1>
            <p>Share, Learn and Build Together with students from around the world</p>
            <div className="hero-buttons">
              <Link to="/signup" className="btn btn-primary">Get Started</Link>
              <Link to="/dashboard" className="btn btn-secondary">Explore Ideas</Link>
            </div>
          </div>
          <div className="hero-right">
            <svg className="hero-illustration" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
              {/* Simple collaboration illustration */}
              <circle cx="250" cy="250" r="200" fill="#EFF6FF" />
              <circle cx="200" cy="220" r="60" fill="#1E3A8A" opacity="0.8" />
              <circle cx="300" cy="220" r="60" fill="#10B981" opacity="0.8" />
              <circle cx="250" cy="300" r="60" fill="#3B82F6" opacity="0.8" />
              <path d="M 250 250 L 200 220 M 250 250 L 300 220 M 250 250 L 250 300" stroke="#64748B" strokeWidth="4" />
              <circle cx="250" cy="250" r="15" fill="#F59E0B" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose IdeaShare?</h2>
        <p className="features-subtitle">
          The perfect platform for students to showcase creativity and collaborate
        </p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>Share Ideas</h3>
            <p>Post your creative ideas and innovative solutions. Get feedback from peers and mentors to refine your concepts.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Collaborate</h3>
            <p>Connect with like-minded students. Work together on interesting projects and build something amazing.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Build Together</h3>
            <p>Turn ideas into reality. Access resources, find team members, and bring your vision to life.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Track Progress</h3>
            <p>Monitor your idea's journey. See engagement through likes, comments, and community feedback.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Get Discovered</h3>
            <p>Stand out with trending ideas. Showcase your creativity to potential collaborators and recruiters.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌟</div>
            <h3>Learn & Grow</h3>
            <p>Explore innovative solutions. Learn from others' ideas and improve your problem-solving skills.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About IdeaShare</h4>
            <p>A platform where students turn ideas into reality through collaboration and innovation.</p>
            <div className="social-icons">
              <div className="social-icon">
                <span>f</span>
              </div>
              <div className="social-icon">
                <span>𝕏</span>
              </div>
              <div className="social-icon">
                <span>in</span>
              </div>
              <div className="social-icon">
                <span>ig</span>
              </div>
            </div>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <Link to="/dashboard">Explore Ideas</Link>
            <Link to="/add-idea">Add New Idea</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <a href="mailto:support@ideashare.com">support@ideashare.com</a>
            <a href="tel:+1234567890">+1 (234) 567-890</a>
            <p>Made with ❤️ for students</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 IdeaShare. All rights reserved. Built for Hackathon.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
