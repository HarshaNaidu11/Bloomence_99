// backend/middleware/auth.js

const admin = require('firebase-admin');
require('dotenv').config();

// ✅ Load Firebase credentials from environment path
const serviceAccount = require(process.env.FIREBASE_CREDENTIALS_PATH);

// Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const getAuthToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Authorization header missing or malformed.' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            req.user = { uid: decodedToken.uid };
            next();
        })
        .catch(error => {
            console.error('Error verifying token:', error.code);
            return res.status(403).send({ message: 'Invalid or expired authentication token.' });
        });
};

module.exports = getAuthToken;
