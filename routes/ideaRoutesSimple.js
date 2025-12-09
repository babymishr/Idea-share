const express = require('express');
const router = express.Router();

// In-memory idea storage (temporary - for testing without MongoDB)
const ideas = [];

// Get all ideas
router.get('/', async (req, res) => {
  try {
    // Sort by creation date (newest first)
    const sortedIdeas = [...ideas].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json(sortedIdeas);
  } catch (error) {
    console.error('Get ideas error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single idea
router.get('/:id', async (req, res) => {
  try {
    const idea = ideas.find(i => i._id === req.params.id);
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }
    res.json(idea);
  } catch (error) {
    console.error('Get idea error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create idea
router.post('/', async (req, res) => {
  try {
    const { title, description, category, author, authorEmail } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    
    // Extract email from author or use authorEmail field
    let userEmail = authorEmail;
    if (!userEmail && typeof author === 'object') {
      userEmail = author.email;
    }
    if (!userEmail) {
      userEmail = author; // Fallback if author is just the email string
    }
    
    const idea = {
      _id: Date.now().toString(),
      title,
      description,
      category: category || 'Other',
      author: {
        _id: Date.now().toString(),
        name: userEmail ? userEmail.split('@')[0] : 'User',
        email: userEmail || 'user@example.com'
      },
      likes: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    ideas.push(idea);
    console.log('✅ Idea created:', idea.title, 'by', idea.author.email);
    
    res.status(201).json(idea);
  } catch (error) {
    console.error('Create idea error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update idea
router.put('/:id', async (req, res) => {
  try {
    const ideaIndex = ideas.findIndex(i => i._id === req.params.id);
    
    if (ideaIndex === -1) {
      return res.status(404).json({ message: 'Idea not found' });
    }
    
    ideas[ideaIndex] = {
      ...ideas[ideaIndex],
      ...req.body,
      updatedAt: new Date()
    };
    
    res.json(ideas[ideaIndex]);
  } catch (error) {
    console.error('Update idea error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete idea
router.delete('/:id', async (req, res) => {
  try {
    const ideaIndex = ideas.findIndex(i => i._id === req.params.id);
    
    if (ideaIndex === -1) {
      return res.status(404).json({ message: 'Idea not found' });
    }
    
    ideas.splice(ideaIndex, 1);
    res.json({ message: 'Idea deleted' });
  } catch (error) {
    console.error('Delete idea error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all ideas (for debugging)
router.get('/debug/all', (req, res) => {
  res.json({ count: ideas.length, ideas });
});

// Like/Unlike idea
router.post('/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const idea = ideas.find(i => i._id === req.params.id);
    
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }
    
    // Check if user already liked
    const likeIndex = idea.likes.findIndex(like => like === userId);
    
    if (likeIndex > -1) {
      // Unlike
      idea.likes.splice(likeIndex, 1);
      res.json({ message: 'Idea unliked', likes: idea.likes.length });
    } else {
      // Like
      idea.likes.push(userId);
      res.json({ message: 'Idea liked', likes: idea.likes.length });
    }
  } catch (error) {
    console.error('Like idea error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add comment
router.post('/:id/comment', async (req, res) => {
  try {
    const { userId, userName, text } = req.body;
    const idea = ideas.find(i => i._id === req.params.id);
    
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    
    const comment = {
      _id: Date.now().toString(),
      userId,
      userName: userName || 'Anonymous',
      text: text.trim(),
      createdAt: new Date()
    };
    
    idea.comments.push(comment);
    res.status(201).json({ message: 'Comment added', comment, comments: idea.comments });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete comment
router.delete('/:id/comment/:commentId', async (req, res) => {
  try {
    const idea = ideas.find(i => i._id === req.params.id);
    
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }
    
    const commentIndex = idea.comments.findIndex(c => c._id === req.params.commentId);
    
    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    idea.comments.splice(commentIndex, 1);
    res.json({ message: 'Comment deleted', comments: idea.comments });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
