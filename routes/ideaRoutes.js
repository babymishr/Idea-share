const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea');

// Get all ideas
router.get('/', async (req, res) => {
  try {
    const ideas = await Idea.find().sort({ createdAt: -1 });
    
    // Transform ideas to match frontend format
    const formattedIdeas = ideas.map(idea => ({
      _id: idea._id.toString(),
      title: idea.title,
      description: idea.description,
      category: idea.category,
      author: idea.author,
      likes: idea.likes || [],
      comments: idea.comments || [],
      createdAt: idea.createdAt,
      updatedAt: idea.updatedAt
    }));
    
    res.json(formattedIdeas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single idea
router.get('/:id', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id)
      .populate('author')
      .populate('comments');
    res.json(idea);
  } catch (error) {
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
      userEmail = author;
    }
    
    const idea = new Idea({
      title,
      description,
      category: category || 'Other',
      author: {
        _id: Date.now().toString(),
        name: userEmail ? userEmail.split('@')[0] : 'User',
        email: userEmail || 'user@example.com'
      },
      likes: [],
      comments: []
    });
    
    await idea.save();
    console.log('✅ Idea created in MongoDB:', idea.title, 'by', idea.author.email);
    
    res.status(201).json(idea);
  } catch (error) {
    console.error('Create idea error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update idea
router.put('/:id', async (req, res) => {
  try {
    const idea = await Idea.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(idea);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete idea
router.delete('/:id', async (req, res) => {
  try {
    await Idea.findByIdAndDelete(req.params.id);
    res.json({ message: 'Idea deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like/Unlike idea
router.post('/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const idea = await Idea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }
    
    const likeIndex = idea.likes.indexOf(userId);
    
    if (likeIndex > -1) {
      // Unlike
      idea.likes.splice(likeIndex, 1);
    } else {
      // Like
      idea.likes.push(userId);
    }
    
    await idea.save();
    console.log('✅ Idea liked/unliked:', idea.title, 'Total likes:', idea.likes.length);
    
    res.json(idea);
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add comment to idea
router.post('/:id/comment', async (req, res) => {
  try {
    const { text, author } = req.body;
    const idea = await Idea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }
    
    const comment = {
      text,
      author: {
        name: author.name || author.email?.split('@')[0] || 'User',
        email: author.email || author
      },
      createdAt: new Date()
    };
    
    idea.comments.push(comment);
    await idea.save();
    console.log('✅ Comment added to idea:', idea.title);
    
    res.json(idea);
  } catch (error) {
    console.error('Comment error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
