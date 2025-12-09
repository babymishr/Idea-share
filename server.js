const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (if available)
connectDB().catch(err => {
  console.log('⚠️  MongoDB not connected - using in-memory storage');
});

// Routes - MongoDB enabled routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/ideas', require('./routes/ideaRoutes'));

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'IdeaShare API is running!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
});
