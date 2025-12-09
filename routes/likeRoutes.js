const express = require('express');
const router = express.Router();
const Like = require('../models/Like');
const Idea = require('../models/Idea');

// Like an idea
router.post('/', async (req, res) => {
  try {
    const { user, idea } = req.body;
    
    // Check if already liked
    const existingLike = await Like.findOne({ user, idea });
    if (existingLike) {
      return res.status(400).json({ message: 'Already liked' });
    }

    const like = new Like({ user, idea });
    await like.save();

    // Add user to idea's likes array
    await Idea.findByIdAndUpdate(idea, {
      $push: { likes: user },
    });

    res.status(201).json(like);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unlike an idea
router.delete('/:id', async (req, res) => {
  try {
    const like = await Like.findByIdAndDelete(req.params.id);
    
    // Remove user from idea's likes array
    await Idea.findByIdAndUpdate(like.idea, {
      $pull: { likes: like.user },
    });

    res.json({ message: 'Unliked' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
