// backend/middleware/auth.js

const admin = require('firebase-admin');

// --- FIREBASE ADMIN SDK INITIALIZATION (CRITICAL FOR DEPLOYMENT) ---

// Get the JSON string content from the environment variable set on Render.
// IMPORTANT: This key MUST hold the full JSON content, not a file path.
const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY; 

let serviceAccount;

// 1. Check for the existence of the environment variable
if (!serviceAccountString) {
    console.error("FATAL ERROR: FIREBASE_SERVICE_ACCOUNT_KEY is missing from the environment.");
    // Throw an error to stop execution since Firebase Auth cannot function without credentials
    throw new Error("Missing Firebase Service Account Key.");
}

// 2. Safely attempt to parse the JSON string into an object
try {
    serviceAccount = JSON.parse(serviceAccountString);
} catch (e) {
    console.error("FATAL ERROR: Failed to parse Firebase Service Account JSON. Check the value in Render for extra characters or malformed JSON.", e);
    // Throw an error to stop deployment if the JSON is malformed
    throw new Error("Invalid Firebase Service Account JSON format in environment variable.");
}

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// -------------------------------------------------------------------


const getAuthToken = (req, res, next) => {
    // 1. Check for the ID Token in the Authorization header
    const authHeader = req.headers.authorization;
    
    // Check if the header exists and is in the "Bearer <token>" format
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
            // Handle specific Firebase errors (e.g., token expired, revoked, invalid)
            console.error('Error verifying token:', error.code);
            return res.status(403).send({ message: 'Invalid or expired authentication token.' });
        });
};

module.exports = getAuthToken;