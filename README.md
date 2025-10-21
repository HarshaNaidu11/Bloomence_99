BLOOMENCE: Personalized Digital Wellness Assistant 🧠(https://bloomenceee.onrender.com)
Bloomence is a modern web application designed to help users track, understand, and improve their mental health using standardized clinical assessments (PHQ-9 and GAD-7) combined with personalized, AI-driven recommendations.

The application uses a secure hybrid architecture, separating Firebase for authentication from a robust Node.js/MongoDB backend for scalable data storage.
✨ Features
1.Secure User Authentication: Firebase handles quick and secure sign-up/login (Email/Password & Google OAuth).
2.Protected Routes: Sensitive sections (Dashboard, Questionnaires) are inaccessible until the user is logged in.
3.Dual Clinical Assessment: Users complete the PHQ-9 (Depression) and GAD-7 (Anxiety) sequentially in a clean, responsive card format.
4.Dynamic Data Pipeline: Assessment scores are securely transmitted from the frontend to the Node.js backend using Firebase ID Tokens and stored in MongoDB.
5.Personalized Dashboard: Visualizes historical scores (Bar Chart) and current mental state (Metric Cards, Pie Chart) using live data filtered by the unique user ID.
6.AI Wellness Coach (BloomBot): An interactive, embedded AI bot that generates tailored nutritional, sleep, and hormonal advice based on the user's latest PHQ-9/GAD-7 scores.
7.Engaging UI: Includes modern design elements like smooth animations (Framer Motion, LightRays), dynamic charts (Recharts), and a clean, dark-themed aesthetic.

🛠️ Tech Stack & Architecture
<img width="874" height="505" alt="image" src="https://github.com/user-attachments/assets/92d0f812-927e-4a8b-83f9-c4fb7b031ddd" />

🚀Getting Started (Local Development)
Follow these steps to get both the frontend and backend running locally.
Prerequisites:-
Node.js (v18+)
npm or yarn
A MongoDB Atlas Cluster with a user configured (for database access).
A Firebase Project with Authentication enabled (Google provider recommended).
A Gemini API Key and a Firebase Admin SDK JSON Key.

1. Backend Setup (backend directory)
Navigate to the backend folder:
<img width="828" height="77" alt="image" src="https://github.com/user-attachments/assets/03ea4a42-0141-4732-81c2-d49a76b41263" />

Install dependencies:
<img width="825" height="70" alt="image" src="https://github.com/user-attachments/assets/9c7b56fc-af73-4e90-8a8a-2754d579e7df" />

Configure Environment Variables: Create a file named .env in the backend directory:

# backend/.env

# 🛑 Your Gemini API Key
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# 🛑 Your MongoDB Connection String (Replace credentials and db name)
MONGO_URI="mongodb+srv://<user>:<password>@<cluster-url>/bloomenceDB?retryWrites=true&w=majority"

# IMPORTANT: The Firebase Admin SDK must be read from the environment
FIREBASE_SERVICE_ACCOUNT_CREDENTIALS="PASTE_YOUR_FULL_ESCAPED_JSON_STRING_HERE"
(Note: Ensure the JSON content is correctly escaped for the FIREBASE_SERVICE_ACCOUNT_CREDENTIALS variable if using .env locally).

Start the backend server:
<img width="827" height="134" alt="image" src="https://github.com/user-attachments/assets/b6e054c6-a980-4d31-9888-1c4099456ecf" />

(Verify "MongoDB connected successfully" and "Server running on port 3001" appears.)

2. Frontend Setup (frontend directory)
Navigate to the frontend folder:
<img width="847" height="83" alt="image" src="https://github.com/user-attachments/assets/7827378d-7b5f-42ea-8237-449c4774a37a" />
Install dependencies (including recharts, framer-motion, ogl):
<img width="860" height="80" alt="image" src="https://github.com/user-attachments/assets/6427846f-cb3f-4e9a-bbfa-18f79259a046" />
Ensure your src/firebaseConfig.js contains your public Firebase client keys.
Start the frontend application:
<img width="873" height="63" alt="image" src="https://github.com/user-attachments/assets/6795b845-713d-4168-b17d-85e3206b2bf9" />
Open http://localhost:5173 in your browser.

✅ Deployment Checklist
If deploying to a static host (Render, Vercel), ensure these steps are completed:
Frontend Root: Set the Root Directory to frontend.
Frontend Build: Set the Publish Directory to dist.
Backend Secrets: Define all environment variables (GEMINI_API_KEY, FIREBASE_SERVICE_ACCOUNT_CREDENTIALS) directly in the Render dashboard for the backend service.
Authorized Domain: Add your deployed URL (https://bloomenceee.onrender.com) to your Firebase Authorized Domains list (Firebase Console > Authentication > Settings).


