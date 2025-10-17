// backend/routes/results.js

const express = require('express');
const Result = require('../models/Result'); 
const router = express.Router();

// Route to save a new questionnaire result
// POST /api/results/save
router.post('/save', async (req, res) => {
    // 🟢 CRITICAL: Get the verified UID from the middleware
    const firebaseUid = req.user.uid; 
    
    // Destructure data from the request body
    const { questionnaireType, totalScore, userName, userEmail } = req.body; 

    // Basic Validation Check
    if (!questionnaireType || totalScore === undefined || !userEmail) {
        return res.status(400).json({ message: 'Missing essential data (score, type, or user email).' });
    }

    try {
        const newResult = new Result({
            firebaseUid, 
            questionnaireType,
            totalScore,
            userName: userName, 
            userEmail: userEmail,
            createdAt: new Date()
        });

        await newResult.save();
        res.status(201).json({ 
            message: 'Result saved successfully!',
            id: newResult._id 
        });

    } catch (err) {
        console.error("Error saving result:", err);
        res.status(500).json({ message: 'Error saving result to database.' });
    }
});

// Route to fetch a user's dashboard data
// GET /api/results/dashboard
router.get('/dashboard', async (req, res) => {
    // 🟢 CRITICAL: Fetch data using the authenticated user's UID
    const firebaseUid = req.user.uid; 

    try {
        const results = await Result.find({ firebaseUid: firebaseUid })
                                    .sort({ createdAt: 1 }) // Order by date chronologically
                                    .exec();
        
        res.status(200).json(results);

    } catch (err) {
        console.error("Error fetching dashboard data:", err);
        res.status(500).json({ message: 'Error fetching results from database.' });
    }
});

module.exports = router;