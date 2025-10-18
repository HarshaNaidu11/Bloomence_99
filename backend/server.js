// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = 3001; 

// --- Import Routes and Middleware ---
const resultsRoutes = require('./routes/results');
const geminiRoutes = require('./routes/gemini'); 
const checkAuth = require('./middleware/auth'); 

// 🛑 IMPORTANT: MongoDB Atlas URI (Your credentials must be here)
const mongoURI = 'mongodb+srv://harshavardhannaidu1111_db_user:NsHVISOMkLt1q74F@cluster0.z7gyrvm.mongodb.net/bloomenceDB?retryWrites=true&w=majority&appName=Cluster0';

// --- Middleware ---
app.use(cors({ origin: 'http://localhost:5173' })); 
app.use(bodyParser.json());
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(mongoURI)
    .then(() => {
        console.log('MongoDB connected successfully.');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// --- Routes ---
// 🟢 CRITICAL: Apply checkAuth middleware to ALL sensitive routes
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
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});