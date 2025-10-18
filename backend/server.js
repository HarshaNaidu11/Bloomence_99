// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- Import Routes and Middleware ---
const resultsRoutes = require('./routes/results');
const geminiRoutes = require('./routes/gemini');
const checkAuth = require('./middleware/auth');

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully.'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// --- Middleware ---
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(bodyParser.json());
app.use(express.json());

// --- Routes ---
// Secure routes with auth
app.use('/api/results', checkAuth, resultsRoutes);
app.use('/api/gemini', checkAuth, geminiRoutes);

// Basic test route
app.get('/', (req, res) => {
    if (mongoose.connection.readyState === 1) {
        res.status(200).send('Backend is running and MongoDB is READY.');
    } else {
        res.status(503).send('Backend is running, but MongoDB connection failed.');
    }
});

// --- Start Server ---
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
