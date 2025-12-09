const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Idea = require('../models/Idea');

// Add comment
router.post('/', async (req, res) => {
  try {
    const { text, author, idea } = req.body;
    const comment = new Comment({ text, author, idea });
    await comment.save();
    
    // Add comment to idea
    await Idea.findByIdAndUpdate(idea, {
      $push: { comments: comment._id },
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get comments for idea
router.get('/idea/:ideaId', async (req, res) => {
  try {
    const comments = await Comment.find({ idea: req.params.ideaId })
      .populate('author', 'name avatar');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete comment
router.delete('/:id', async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
