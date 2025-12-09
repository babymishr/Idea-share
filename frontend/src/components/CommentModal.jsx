import React, { useState } from 'react';
import './CommentModal.css';

function CommentModal({ idea, onClose, onAddComment }) {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    await onAddComment(idea._id, comment);
    setLoading(false);
    setComment('');
  };

  const formatTimeAgo = (date) => {
    if (!date) return 'Just now';
    const now = new Date();
    const commentDate = new Date(date);
    const diffInMs = now - commentDate;
    const diffInMins = Math.floor(diffInMs / 60000);
    
    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInMins < 1440) return `${Math.floor(diffInMins / 60)}h ago`;
    return `${Math.floor(diffInMins / 1440)}d ago`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>💬 Comments</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-idea-preview">
          <h4>{idea.title}</h4>
          <p>{idea.description.substring(0, 100)}...</p>
        </div>

        <div className="comments-list">
          {idea.comments && idea.comments.length > 0 ? (
            idea.comments.map((comment) => (
              <div key={comment._id} className="comment-item">
                <div className="comment-avatar">
                  {(comment.userName || 'U')[0].toUpperCase()}
                </div>
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-author">{comment.userName || 'Anonymous'}</span>
                    <span className="comment-time">{formatTimeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-comments">
              <p>🤔 No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment..."
            rows="3"
            maxLength="300"
            disabled={loading}
          />
          <div className="comment-form-actions">
            <span className="char-count">{comment.length}/300</span>
            <button type="submit" disabled={loading || !comment.trim()}>
              {loading ? '🔄 Posting...' : '📤 Post Comment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CommentModal;
