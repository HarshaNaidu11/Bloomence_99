// backend/routes/gemini.js

const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const Result = require('../models/Result'); // 🟢 FIX: Ensure Result model is imported
const router = express.Router();
require('dotenv').config();

// Initialize the GoogleGenAI instance using the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 
const conversationHistory = new Map();

// --- Helper Function: Fetch scores securely ---
// This function relies on the fact that the request has ALREADY passed checkAuth 
const fetchScoresForBot = async (uid) => {
    try {
        const results = await Result.find({ firebaseUid: uid })
                                    .sort({ createdAt: -1 }) // Get latest results first
                                    .limit(20)
                                    .exec();
        // Extract latest PHQ9 and GAD7 scores
        const latestPHQ9Score = results.find(r => r.questionnaireType === 'PHQ-9')?.totalScore || 0;
        const latestGAD7Score = results.find(r => r.questionnaireType === 'GAD-7')?.totalScore || 0;

        return { latestPHQ9Score, latestGAD7Score };
    } catch (e) {
        console.error("DB Fetch Error:", e);
        return { latestPHQ9Score: 0, latestGAD7Score: 0 };
    }
}


// Route to handle chat interactions
// POST /api/gemini/chat
router.post('/chat', async (req, res) => {
    // 🟢 CRITICAL: This is the ONLY way to get the UID securely
    const firebaseUid = req.user.uid; 
    const userName = req.user.displayName || 'Friend'; // Assuming displayName is available from token
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ message: 'Prompt is required.' });
    }

    // 1. Check if this is the initial session (user's first message to the bot)
    if (prompt.includes('PHQ-9 (Depression):')) {
         // This is the initial personalization request. Fetch live data.
         const { latestPHQ9Score, latestGAD7Score } = await fetchScoresForBot(firebaseUid);
         
         // 2. Overwrite the prompt with the *actual* score data for Gemini
         req.body.prompt = `
             Generate a response for a user named ${userName} who just opened the wellness bot. 
             Their latest assessment results are: PHQ-9 (Depression): ${latestPHQ9Score}/27 and GAD-7 (Anxiety): ${latestGAD7Score}/21.
             Provide a compassionate summary, and a list of 5 suggestions covering: Nutrition, Brain Health, Sleep Cycle, Overall Condition Improvement.
             The response MUST be a single, structured JSON object with keys: "summary" and "recommendations" (an array of 5 strings).
         `;
    }

    // 3. Execute Gemini call with context
    let history = conversationHistory.get(firebaseUid) || [];
    history.push({ role: 'user', parts: [{ text: req.body.prompt }] });

    try {
        const systemInstruction = "You are BloomBot, an expert wellness coach. Your responses must be kind and non-judgmental. Do NOT provide medical diagnoses. Maintain conversation history.";

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", 
            contents: [{ role: 'system', parts: [{ text: systemInstruction }] }, ...history], 
        });
        
        const botResponseText = response.text.trim();
        
        history.push({ role: 'model', parts: [{ text: botResponseText }] });
        conversationHistory.set(firebaseUid, history);

        res.status(200).json({ response: botResponseText });
        
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ response: "I'm sorry, I encountered an error connecting to the AI service." });
    }
});

module.exports = router;