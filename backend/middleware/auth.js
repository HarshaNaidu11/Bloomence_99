// backend/middleware/auth.js

const admin = require('firebase-admin');

// 🟢 CRITICAL FIX: Use forward slashes (/) to prevent escape sequence issues.
// The path must be relative: '../' (up from middleware/) + filename.
const serviceAccount = require('../ai-edu-93fe3-firebase-adminsdk-fbsvc-ddc37c78b6.json'); 

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const getAuthToken = (req, res, next) => {
    // 1. Check for the ID Token in the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Authorization header missing or malformed.' });
    }
    
    const idToken = authHeader.split('Bearer ')[1];
    
    // 2. Verify the ID Token using the Firebase Admin SDK
    admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            // Token is valid! Attach the user's UID to the request object
            req.user = { uid: decodedToken.uid };
            next(); // Proceed to the API route handler
        })
        .catch(error => {
            console.error('Error verifying token:', error.code);
            return res.status(403).send({ message: 'Invalid or expired authentication token.' });
        });
};

module.exports = getAuthToken;