// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
// Render automatically sets a PORT variable. It's good practice to use it.
const PORT = process.env.PORT || 3001; 

// --- Import Routes and Middleware ---
const resultsRoutes = require('./routes/results');
const geminiRoutes = require('./routes/gemini'); 
const checkAuth = require('./middleware/auth'); 

// ✅ FIX: Get MongoDB Atlas URI from the secure environment variable on Render
const mongoURI = process.env.MONGO_URI;

// --- Middleware ---
// ⚠️ WARNING: Change origin to your deployed frontend URL (e.g., https://your-frontend.vercel.app)
// For now, use the deployed Render URL (e.g., https://your-backend.onrender.com) for development
// or keep it to 'http://localhost:5173' for local testing.
app.use(cors({ origin: 'http://localhost:5173' })); 
app.use(bodyParser.json());
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(mongoURI)
    .then(() => {
        console.log('MongoDB connected successfully.');
    })
    .catch(err => {
        console.error('MongoDB connection error. Is MONGO_URI set correctly on Render?', err);
    });

// --- Routes ---
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

// --- Server Start ---
// Render will automatically look for the PORT variable
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});