// // frontend/src/pages/AiRecommendation/AiRecommendation.jsx

// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import './AiRecommendation.css'; 
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext'; 

// // --- CONSTANTS ---
// const BOT_API_URL = 'http://localhost:3001/api/gemini/chat'; 
// const DASHBOARD_API_URL = 'http://localhost:3001/api/results/dashboard';
// const ACCENT_COLOR = '#00d9a5'; 

// // --- HELPER FUNCTION: Generates YouTube Thumbnail URL ---
// const getYouTubeThumbnail = (videoId) => {
//     if (!videoId) return 'https://via.placeholder.com/400x225/2a3d54/FFFFFF?text=No+Thumbnail';
//     // 'hqdefault.jpg' provides a high-quality (480x360) image
//     return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
// };

// const ArrayWithContent = (arr) => arr && Array.isArray(arr) && arr.length > 0;

// // Helper to format the initial structured response for display
// const formatInitialResponse = (data) => {
//     let text = `**${data.summary}**\n\n**Actionable Recommendations:**\n`;
//     // Ensure data.recommendations is an array before trying to map it
//     if (ArrayWithContent(data.recommendations)) {
//         data.recommendations.forEach((rec, index) => {
//             text += `${index + 1}. ${rec}\n`;
//         });
//     }
//     return text;
// };


// // --- DUMMY DATA (RESTORED) ---
// const ARTICLES_DATA = [
//     // Slot 1: Featured (Large, Left Column Top)
//     {
//         id: 'article1',
//         type: 'Article',
//         category: 'Substance Abuse',
//         title: 'The Impact of Substance Abuse on Mental Health',
//         description: 'Explore how substance abuse profoundly affects mental well-being...',
//         image: 'https://healthkunj.com/wp-content/uploads/Drug-Addiction-Substance-Abuse.jpg',
//         link: 'https://www.mentalhealth.org.uk/explore-mental-health/a-z-topics/drugs-and-mental-health', 
//         size: 'featured', 
//     },
//     // Slot 2: Standard (Small, Left Column Bottom)
//     { id: 'article2', type: 'Article', category: 'Stress Management', title: 'Everything You Need to Know About Stress and Anxiety', description: 'A comprehensive guide...', image: 'https://cdn.sanity.io/images/eztzxh9q/production/b958749cfcc7906becea3910ebe3db54ba85704e-2119x1414.jpg?w=3840&q=75&fit=clip&auto=format', link: 'https://www.healthline.com/health/stress-and-anxiety', size: 'standard' },
//     // Slot 3: Mini 1 (Right Column Top)
//     { id: 'article3', type: 'Article', category: 'Yoga Therapy', title: 'Yoga Therapy: How It Works and Why It Is Important', description: 'Discover the therapeutic benefits of yoga for mental health...', image: 'https://images.news18.com/ibnlive/uploads/2022/04/yoga-164923092416x9.png', link: '#', size: 'mini' },
//     // Slot 4: Mini 2 (Right Column Middle)
//     { id: 'article4', type: 'Article', category: 'Self-Improvement', title: 'Best Self-Help Books That Actually Change Lives: How to Improve Yourself', description: 'A curated list...', image: 'https://cultivatewhatmatters.com/cdn/shop/articles/atomic-habits.jpg?v=1624827508', link: '#', size: 'mini' },
//     // Slot 5: Mini 3 (Right Column Bottom)
//     { id: 'article5', type: 'Article', category: 'Mental Health Symptoms', title: 'Recognising Mental Health Symptoms: Hidden Signs of Mental Health Problems', description: 'Learn to identify subtle and often overlooked signs of mental health issues...', image: 'https://mpowerminds.com/assetOLD/images/physical-symptoms.jpg', link: '#', size: 'mini' },
//     
//     // Remaining article data 
//     { id: 'article6', type: 'Article', category: 'Self-Criticism', title: 'How to Stop Being Self-Critical', description: 'Practical strategies...', image: 'https://via.placeholder.com/300x150/9C27B0/FFFFFF?text=Self-Criticism', link: '#', size: 'mini' },
// ];

// const VIDEO_CATEGORIES = [
//     'Stress Management', 'Anxiety Disorders', 'Depression', 'Self-Esteem', 
//     'Emotional Regulation', 'Mindfulness', 'Relationships', 'Substance Abuse'
// ];

// const VIDEOS_DATA = [
//     // --- Anxiety Disorders (3 Videos) ---
//     { id: 'v1', category: 'Anxiety Disorders', title: 'Understanding Generalized Anxiety Disorder (GAD)', videoId: 'QAd7IirpoU0', duration: '10 mins', expert: 'Dr. Harry Barry', expertTitle: 'Psychologist', link: 'https://www.youtube.com/watch?v=QAd7IirpoU0', },
//     { id: 'v2', category: 'Anxiety Disorders', title: 'Coping Strategies for Panic Attacks', videoId: '8Un_Ykh9y9Q', duration: '13 mins', expert: 'Dr. Harry Barry', expertTitle: 'Psychologist', link: 'https://www.youtube.com/watch?v=8Un_Ykh9y9Q', },
//     { id: 'v3', category: 'Anxiety Disorders', title: 'Effective Therapy Options for Anxiety', videoId: '4Py0xKujsuU', duration: '13 mins', expert: 'Dr. Tracy Marks', expertTitle: 'Therapist', link: 'https://www.youtube.com/watch?v=4Py0xKujsuU', },
    
//     // --- Depression (3 Videos) ---
//     { id: 'v4', category: 'Depression', title: 'Signs and Symptoms of Clinical Depression', videoId: 'N45Fsbd4KLc', duration: '21 mins', expert: 'Dr. Scott Eilers', expertTitle: 'Psychiatrist', link: 'https://www.youtube.com/watch?v=N45Fsbd4KLc', },
//     { id: 'v5', category: 'Depression', title: 'Managing Low Mood and Energy', videoId: 'sXs0Qq0EEdY', duration: '18 mins', expert: 'Dr. Scott Eilers', expertTitle: 'Psychiatrist', link: 'https://www.youtube.com/watch?v=sXs0Qq0EEdY', },
//     { id: 'v6', category: 'Depression', title: 'Finding Motivation During Depression', videoId: 'd96akWDnx0w', duration: '9 mins', expert: 'Dr. Jessica Houston', expertTitle: 'Psychologist', link: 'https://www.youtube.com/watch?v=d96akWDnx0w', },
    
//     // --- Stress Management (3 Videos) ---
//     { id: 'v7', category: 'Stress Management', title: 'Mindfulness for Daily Stress Reduction', videoId: 'fcRANlaqf9c', duration: '6 mins', expert: 'Dr. Tracy Marks', expertTitle: 'Therapist', link: 'https://www.youtube.com/watch?v=fcRANlaqf9c', },
//     { id: 'v8', category: 'Stress Management', title: 'Quick De-stressing Techniques', videoId: 'grfXR6FAsI8', duration: '3 mins', expert: 'Dr. Emma McAdam', expertTitle: 'Therapist', link: 'https://www.youtube.com/watch?v=grfXR6FAsI8', },
//     { id: 'v9', category: 'Stress Management', title: 'Time Management to Reduce Overwhelm', videoId: 'b0EdU-mTkZA', duration: '11 mins', expert: 'Dr.Luke Reinhart', expertTitle: 'Psychologist', link: 'https://www.youtube.com/watch?v=b0EdU-mTkZA', },

//     // --- Self-Esteem (2 Videos) ---
//     { id: 'v10', category: 'Self-Esteem', title: 'Building Positive Self-Confidence', videoId: 'oOWhq1BTRuU', duration: '8 mins', expert: 'Dr. Tracy Marks', expertTitle: 'Therapist', link: 'https://www.youtube.com/watch?v=oOWhq1BTRuU', },
//     { id: 'v11', category: 'Self-Esteem', title: 'Overcoming Negative Self-Talk', videoId: 'KfAAIEncDPo', duration: '21 mins', expert: 'Dr. Emma McAdam', expertTitle: 'Therapist', link: 'https://www.youtube.com/watch?v=KfAAIEncDPo', },

//     // --- Emotional Regulation (2 Videos) ---
//     { id: 'v12', category: 'Emotional Regulation', title: 'Identifying Emotional Triggers', videoId: 'l3i8SfOk5FU', duration: '7 mins', expert: 'Dr. Nicola', expertTitle: 'Psychologist', link: 'https://www.youtube.com/watch?v=l3i8SfOk5FU', },
//     { id: 'v13', category: 'Emotional Regulation', title: 'Techniques for Managing Strong Emotions', videoId: 'NtW5oWXAaTc', duration: '8 mins', expert: 'Dr. Sid Warrier', expertTitle: 'Therapist', link: 'https://www.youtube.com/watch?v=NtW5oWXAaTc', },

//     // --- Mindfulness (2 Videos) ---
//     { id: 'v14', category: 'Mindfulness', title: 'Introduction to Mindful Breathing', videoId: '7-jJqXU25wo', duration: '7 mins', expert: 'Dr. Sid Warrier', expertTitle: 'Therapist', link: 'https://www.youtube.com/watch?v=7-jJqXU25wo', },
//     { id: 'v15', category: 'Mindfulness', title: 'Simple 5-Minute Meditation', videoId: 'IdUrixeWbis', duration: '5 mins', expert: 'Dr. Alex Howard', expertTitle: 'Instructor', link: 'https://www.youtube.com/watch?v=IdUrixeWbis', },

//     // --- Relationships (2 Videos) ---
//     { id: 'v16', category: 'Relationships', title: 'Improving Communication Skills', videoId: 'LI57EB_T38c', duration: '18 mins', expert: 'Vinh Giang', expertTitle: 'Counselor', link: 'https://www.youtube.com/watch?v=LI57EB_T38c', },
//     { id: 'v17', category: 'Relationships', title: 'Setting Healthy Boundaries', videoId: '83JE0jHAvBY', duration: '29 mins', expert: 'Jay Shetty', expertTitle: 'Counselor', link: 'https://www.youtube.com/watch?v=83JE0jHAvBY', },
    
//     // --- Substance Abuse (2 Videos) ---
//     { id: 'v18', category: 'Substance Abuse', title: 'Understanding Addiction and Recovery', videoId: 'PY9DcIMGxMs', duration: '15 mins', expert: 'Johann Hari', expertTitle: 'Specialist', link: 'https://www.youtube.com/watch?v=PY9DcIMGxMs', },
//     { id: 'v19', category: 'Substance Abuse', title: 'Resources for Families Dealing with Addiction', videoId: '1qI-Qn7xass', duration: '15 mins', expert: 'Sam Fowler', expertTitle: 'Counselor', link: 'https://www.youtube.com/watch?v=1qI-Qn7xass', },
// ];


// // Helper to separate articles (unchanged)
// const getArticleLayoutSlots = (data) => {
//     return {
//         featured: data.find(a => a.size === 'featured'),
//         standard: data.find(a => a.size === 'standard'),
//         miniStack: data.filter(a => a.size === 'mini').slice(0, 3), 
//     };
// };

// const { featured, standard, miniStack } = getArticleLayoutSlots(ARTICLES_DATA);


// // Reusable ArticleCard component (unchanged)
// const ArticleCard = ({ article, className }) => (
//     <motion.a 
//         href={article.link} 
//         target="_blank" 
//         rel="noopener noreferrer" 
//         className={`article-card ${className}`} 
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 0.1 }}
//     >
//         <div className="article-image-wrapper">
//             <img src={article.image} alt={article.title} className="article-image" />
//         </div>
//         <div className="article-content">
//             <div className="article-meta">
//                 <span className="article-type">{article.type}</span>
//                 <span className="article-category">{article.category}</span>
//             </div>
//             <h3 className="article-title">{article.title}</h3>
//             {article.size === 'featured' && <p className="article-description">{article.description}</p>}
//         </div>
//     </motion.a>
// );

// // Reusable VideoCard component (unchanged)
// const VideoCard = ({ video }) => (
//     <motion.a 
//         href={video.link} 
//         target="_blank" 
//         rel="noopener noreferrer" 
//         className="video-card"
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.4, delay: 0.1 }}
//     >
//         <div className="video-thumbnail-wrapper">
//             <img src={getYouTubeThumbnail(video.videoId)} alt={video.title} className="video-thumbnail" />
//             <div className="play-icon">▶</div> 
//             <div className="video-duration">{video.duration}</div>
//         </div>
//         <div className="video-info">
//             <h4 className="video-title">{video.title}</h4>
//             <p className="video-expert">{video.expert}, {video.expertTitle}</p>
//             <div className="video-category-tag">{video.category}</div>
//         </div>
//     </motion.a>
// );


// // 🟢 FINAL CHAT INPUT BOX COMPONENT (EMBEDDED)
// function ChatInputBox({ onSubmit, isLoading, currentUser, lastResponse }) {
//     const [localInput, setLocalInput] = useState('');
    
//     // Determine placeholder text
//     const placeholderText = !currentUser 
//         ? "Please log in to ask BloomBot..." 
//         : (isLoading ? "Analyzing and generating response..." : "Ask BloomBot AI...");

//     // Determine if we should show the full response box
//     const showResponseBox = lastResponse || isLoading;

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (localInput.trim() && !isLoading && currentUser) {
//             onSubmit(localInput.trim());
//             setLocalInput('');
//         }
//     };
    
//     return (
//         <div className="ai-input-section-wrapper">
            
//             {/* 1. Response Box (Only shows if a query has been made or is loading) */}
//             {showResponseBox && (
//                 <div className="ai-response-box">
//                     <div className="response-content">
//                         {lastResponse ? (
//                             lastResponse.split('\n').map((line, i) => (
//                                 <p key={i} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }}></p>
//                             ))
//                         ) : (
//                              <p className="loading-text">Analyzing and generating response...</p>
//                         )}
//                     </div>
//                 </div>
//             )}
            
//             {/* 2. Input Bar (Fixed rectangular shape) */}
//             <form onSubmit={handleSubmit} className="ai-chat-form">
//                 <input
//                     type="text"
//                     value={localInput}
//                     onChange={(e) => setLocalInput(e.target.value)}
//                     placeholder={placeholderText}
//                     disabled={isLoading || !currentUser}
//                     className="ai-chat-input"
//                 />
//                 <button type="submit" disabled={isLoading || !currentUser} className="ai-send-btn">
//                     {isLoading ? '...' : '→'}
//                 </button>
//             </form>
//         </div>
//     );
// }


// // 🟢 AI RECOMMENDATION PAGE COMPONENT
// export default function AiRecommendation() {
//     const navigate = useNavigate();
//     const { currentUser } = useAuth();
//     const [activeVideoCategory, setActiveVideoCategory] = useState(null); 
//     const [isExpanded, setIsExpanded] = useState(false);
    
//     // State for AI Bot
//     const [botResponse, setBotResponse] = useState('');
//     const [botLoading, setBotLoading] = useState(false);


//     // 🟢 CORE LOGIC: Handles the hardcoded analysis and displays result
//     const handleBotQuery = async (userPrompt) => {
//         setBotLoading(true);
//         setBotResponse('Analyzing your query with personal data...');
        
//         try {
//             const idToken = await currentUser.getIdToken();
            
//             // 1. Fetch scores/context from MongoDB API
//             const contextResponse = await fetch(DASHBOARD_API_URL, {
//                 method: 'GET',
//                 headers: { 'Authorization': `Bearer ${idToken}` }
//             });
            
//             if (!contextResponse.ok) throw new Error("Failed to load assessment scores securely.");
//             const results = await contextResponse.json();
            
//             // Extract latest scores (needed for personalization in the prompt)
//             const latestPHQ9 = results.filter(r => r.questionnaireType === 'PHQ-9').pop()?.totalScore || 0;
//             const latestGAD7 = results.filter(r => r.questionnaireType === 'GAD-7').pop()?.totalScore || 0;

//             // 🟢 STEP 1: Get the hardcoded personalized advice based on scores
//             const adviceSet = getAdviceBasedOnScores(latestPHQ9, latestGAD7);
            
//             // 🟢 STEP 2: Construct the final output
//             const finalResponseText = `
//                 ${adviceSet.summary}
                
//                 **Your Personalized Plan**
//                 1. **Nutrition:** ${adviceSet.nutrition}
//                 2. **Brain Health/Hormones:** ${adviceSet.hormones}
//                 3. **Sleep Cycle:** ${adviceSet.sleep}
//                 4. **Overall Well-being:** ${adviceSet.overall}
                
//                 ***
                
//                 Your specific question was: "${userPrompt}"
//                 (Note: This advice is based on your assessment scores.)
//             `;
            
//             // 3. Set the final response text
//             setBotResponse(finalResponseText);

//         } catch (error) {
//             console.error("Bot Query Error:", error);
//             setBotResponse('Error: Failed to process request. Ensure scores are submitted and the backend is running.');
//         } finally {
//             setBotLoading(false);
//         }
//     };
    
//     // Filter logic (unchanged)
//     const handleCategoryClick = (category) => {
//         if (activeVideoCategory === category) {
//             setActiveVideoCategory(null);
//         } else {
//             setActiveVideoCategory(category);
//         }
//         setIsExpanded(false); 
//     };

//     let filteredVideos = activeVideoCategory
//         ? VIDEOS_DATA.filter(video => video.category === activeVideoCategory)
//         : VIDEOS_DATA; 

//     // Display 3 for consistent layout
//     const displayLimit = 3; 
//     const videosToShow = isExpanded ? filteredVideos : filteredVideos.slice(0, displayLimit);
//     const showMoreButton = filteredVideos.length > displayLimit && !isExpanded;


//     const { featured, standard, miniStack } = getArticleLayoutSlots(ARTICLES_DATA); 


//     return (
//         <div className="recommendation-page-container">
//             {/* --- Main Content --- */}
//             <motion.h1
//                 initial={{ y: -50, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//                 className="page-main-title"
//             >
//                 Personalized Wellness Insights
//             </motion.h1>
//             <motion.p
//                 initial={{ y: -30, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ duration: 0.5, delay: 0.2 }}
//                 className="page-subtitle"
//             >
//                 Explore articles and videos tailored to enhance your mental well-being.
//             </motion.p>
            
//             {/* ... (Articles Section) ... */}
//             <section className="articles-section">
//                 <motion.h2
//                     initial={{ x: -50, opacity: 0 }}
//                     animate={{ x: 0, opacity: 1 }}
//                     transition={{ duration: 0.5, delay: 0.3 }}
//                     className="section-title"
//                 >
//                     Recommended Articles
//                 </motion.h2>
                
//                 <div className="articles-balanced-container"> 
                    
//                     <div className="articles-column articles-column-left">
//                         {featured && <ArticleCard article={featured} className="featured-card" />}
//                         {standard && <ArticleCard article={standard} className="standard-card" />}
//                     </div>
//                     <div className="articles-column articles-column-right">
//                         {miniStack.map(article => (
//                             <ArticleCard key={article.id} article={article} className="mini-card" />
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* --- Videos Section (Dynamic Filtering) --- */}
//             <section className="videos-section">
//                 <motion.h2
//                     initial={{ x: -50, opacity: 0 }}
//                     animate={{ x: 0, opacity: 1 }}
//                     transition={{ duration: 0.5, delay: 0.5 }}
//                     className="section-title"
//                 >
//                     Expert-Recommended Videos
//                 </motion.h2>

//                 {/* Video Category Tags (Filtering UI) */}
//                 <motion.div
//                     initial={{ y: 20, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     transition={{ duration: 0.5, delay: 0.6 }}
//                     className="video-categories-filter"
//                 >
//                     <button
//                         className={`category-tag ${activeVideoCategory === null ? 'active' : ''}`}
//                         onClick={() => handleCategoryClick(null)} 
//                     >
//                         All Topics ({VIDEOS_DATA.length})
//                     </button>
//                     {VIDEO_CATEGORIES.map(category => (
//                         <button
//                             key={category}
//                             className={`category-tag ${activeVideoCategory === category ? 'active' : ''}`}
//                             onClick={() => handleCategoryClick(category)}
//                         >
//                             {category}
//                         </button>
//                     ))}
//                 </motion.div>

//                 {/* Filtered Videos Grid */}
//                 <div className="videos-grid">
//                     {videosToShow.length > 0 ? (
//                         videosToShow.map(video => (
//                             <VideoCard key={video.id} video={video} />
//                         ))
//                     ) : (
//                         <motion.p 
//                             className="no-videos-message"
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ delay: 0.5 }}
//                         >
//                             No videos available for this topic. Try selecting another one!
//                         </motion.p>
//                     )}
//                 </div>

//                 {/* "More Videos" Button (Conditional Visibility) */}
//                 {showMoreButton && (
//                     <div className="show-more-wrapper">
//                         <button 
//                             className="show-more-btn"
//                             onClick={() => setIsExpanded(true)}
//                         >
//                             Show More Videos ({filteredVideos.length - videosToShow.length} remaining) ↓
//                         </button>
//                     </div>
//                 )}
//             </section>
            
//             {/* 🟢 FINAL CHAT INPUT BOX RENDERED AT THE BOTTOM */}
//             <section className="ai-chat-section">
//                 <ChatInputBox 
//                     onSubmit={handleBotQuery}
//                     isLoading={botLoading}
//                     currentUser={currentUser}
//                     lastResponse={botResponse}
//                 />
//             </section>
//         </div>
//     );
// }



// frontend/src/pages/AiRecommendation/AiRecommendation.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './AiRecommendation.css'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 

// --- CONSTANTS ---
const BOT_API_URL = 'https://bloomence-99-backend.onrender.com/api/gemini/chat'; 
const DASHBOARD_API_URL = 'https://bloomence-99-backend.onrender.com/api/results/dashboard';
const ACCENT_COLOR = '#00d9a5'; 

// --- HELPER FUNCTION: Generates YouTube Thumbnail URL ---
const getYouTubeThumbnail = (videoId) => {
    if (!videoId) return 'https://via.placeholder.com/400x225/2a3d54/FFFFFF?text=No+Thumbnail';
    // 'hqdefault.jpg' provides a high-quality (480x360) image
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

const ArrayWithContent = (arr) => arr && Array.isArray(arr) && arr.length > 0;

// Helper to format the initial structured response for display
const formatInitialResponse = (data) => {
    let text = `**${data.summary}**\n\n**Actionable Recommendations:**\n`;
    text += `1. **Nutrition:** ${data.nutrition}\n`;
    text += `2. **Brain Health/Hormones:** ${data.hormones}\n`;
    text += `3. **Sleep Cycle:** ${data.sleep}\n`;
    text += `4. **Overall Well-being:** ${data.overall}\n`;
    return text;
};


// 🟢 HARDCODED RULESET (Decision Tree Logic)
const getAdviceBasedOnScores = (phq9, gad7) => {
    // --- Rule Set 1: High Severity (PHQ9 >= 15 OR GAD7 >= 15) ---
    if (phq9 >= 15 || gad7 >= 15) {
        return {
            summary: `Your recent scores (Depression: ${phq9}/27, Anxiety: ${gad7}/21) indicate a **High need for focus.**`,
            nutrition: "Focus on complex carbs and lean proteins to stabilize mood. Reduce caffeine and high sugar intake immediately.",
            hormones: "Practice light morning exposure (15 mins outside) to regulate serotonin and cortisol cycles.",
            sleep: "Establish a strict 8-hour sleep window. Implement a 60-minute digital blackout before bedtime.",
            overall: "Action step: We strongly recommend scheduling a check-in with a therapist this week."
        };
    }
    
    // --- Rule Set 2: Moderate Severity (PHQ9 >= 5 OR GAD7 >= 5) ---
    if (phq9 >= 5 || gad7 >= 5) {
        return {
            summary: `Your scores (Depression: ${phq9}/27, Anxiety: ${gad7}/21) show a **Moderate need for targeted coping strategies.**`,
            nutrition: "Increase intake of Omega-3s (walnuts, flaxseeds) and Vitamin D to support brain function.",
            hormones: "Integrate 20-30 minutes of moderate physical activity to naturally boost dopamine and endorphins.",
            sleep: "Avoid heavy meals 3 hours before sleep. Use deep breathing exercises if you wake up during the night.",
            overall: "Action step: Practice daily gratitude journaling to strengthen emotional resilience."
        };
    }

    // --- Rule Set 3: Minimal Severity (Default) ---
    return {
        summary: `Your scores are **Minimal** (Depression: ${phq9}/27, Anxiety: ${gad7}/21). You have excellent wellness stability!`,
        nutrition: "Maintain a balanced diet with a wide range of colorful fruits and vegetables for sustained energy.",
        hormones: "Continue regular exercise and social connection to keep oxytocin and serotonin levels optimal.",
        sleep: "Track sleep quality for one week to identify minor disruptions. Ensure your room is cool and dark.",
        overall: "Immediate goal: Identify one activity that brings you joy and prioritize it this week."
    };
};


// --- DUMMY DATA (RESTORED) ---
const ARTICLES_DATA = [
    // Slot 1: Featured (Large, Left Column Top)
    {
        id: 'article1',
        type: 'Article',
        category: 'Substance Abuse',
        title: 'The Impact of Substance Abuse on Mental Health',
        description: 'Explore how substance abuse profoundly affects mental well-being...',
        image: 'https://healthkunj.com/wp-content/uploads/Drug-Addiction-Substance-Abuse.jpg',
        link: 'https://www.mentalhealth.org.uk/explore-mental-health/a-z-topics/drugs-and-mental-health', 
        size: 'featured', 
    },
    // Slot 2: Standard (Small, Left Column Bottom)
    { id: 'article2', type: 'Article', category: 'Stress Management', title: 'Everything You Need to Know About Stress and Anxiety', description: 'A comprehensive guide...', image: 'https://cdn.sanity.io/images/eztzxh9q/production/b958749cfcc7906becea3910ebe3db54ba85704e-2119x1414.jpg?w=3840&q=75&fit=clip&auto=format', link: 'https://www.healthline.com/health/stress-and-anxiety', size: 'standard' },
    // Slot 3: Mini 1 (Right Column Top)
    { id: 'article3', type: 'Article', category: 'Yoga Therapy', title: 'Yoga Therapy: How It Works and Why It Is Important', description: 'Discover the therapeutic benefits of yoga for mental health...', image: 'https://images.news18.com/ibnlive/uploads/2022/04/yoga-164923092416x9.png', link: 'https://positivepsychology.com/yoga-therapy/', size: 'mini' },
    // Slot 4: Mini 2 (Right Column Middle)
    { id: 'article4', type: 'Article', category: 'Self-Improvement', title: 'Best Self-Help Books That Actually Change Lives: How to Improve Yourself', description: 'A curated list...', image: 'https://cultivatewhatmatters.com/cdn/shop/articles/atomic-habits.jpg?v=1624827508', link: 'https://notesbythalia.com/best-self-improvement-books/', size: 'mini' },
    // Slot 5: Mini 3 (Right Column Bottom)
    { id: 'article5', type: 'Article', category: 'Mental Health Symptoms', title: 'Recognising Mental Health Symptoms: Hidden Signs of Mental Health Problems', description: 'Learn to identify subtle and often overlooked signs of mental health issues...', image: 'https://mpowerminds.com/assetOLD/images/physical-symptoms.jpg', link: 'https://www.mayoclinic.org/diseases-conditions/mental-illness/symptoms-causes/syc-20374968', size: 'mini' },
    
    // Remaining article data 
    { id: 'article6', type: 'Article', category: 'Self-Criticism', title: 'How to Stop Being Self-Critical', description: 'Practical strategies...', image: 'https://via.placeholder.com/300x150/9C27B0/FFFFFF?text=Self-Criticism', link: '#', size: 'mini' },
];

const VIDEO_CATEGORIES = [
    'Stress Management', 'Anxiety Disorders', 'Depression', 'Self-Esteem', 
    'Emotional Regulation', 'Mindfulness', 'Relationships', 'Substance Abuse'
];

const VIDEOS_DATA = [
    // ... videos data
    { id: 'v1', category: 'Anxiety Disorders', title: 'Understanding Generalized Anxiety Disorder (GAD)', videoId: 'QAd7IirpoU0', duration: '10 mins', expert: 'Dr. Harry Barry', expertTitle: 'Psychologist', link: 'https://www.youtube.com/watch?v=QAd7IirpoU0', },
    { id: 'v2', category: 'Anxiety Disorders', title: 'Coping Strategies for Panic Attacks', videoId: '8Un_Ykh9y9Q', duration: '13 mins', expert: 'Dr. Harry Barry', expertTitle: 'Psychologist', link: 'https://www.youtube.com/watch?v=8Un_Ykh9y9Q', },
    { id: 'v3', category: 'Anxiety Disorders', title: 'Effective Therapy Options for Anxiety', videoId: '4Py0xKujsuU', duration: '13 mins', expert: 'Dr. Tracy Marks', expertTitle: 'Therapist', link: 'https://www.youtube.com/watch?v=4Py0xKujsuU', },
    
    // ... (rest of video data) ...
      { id: 'v4', category: 'Depression', title: 'Signs and Symptoms of Clinical Depression', videoId: 'N45Fsbd4KLc', duration: '21 mins', expert: 'Dr. Scott Eilers', expertTitle: 'Psychiatrist', link: 'https://www.youtube.com/watch?v=N45Fsbd4KLc', },
    { id: 'v5', category: 'Depression', title: 'Managing Low Mood and Energy', videoId: 'sXs0Qq0EEdY', duration: '18 mins', expert: 'Dr. Scott Eilers', expertTitle: 'Psychiatrist', link: 'https://www.youtube.com/watch?v=sXs0Qq0EEdY', },
    { id: 'v6', category: 'Depression', title: 'Finding Motivation During Depression', videoId: 'd96akWDnx0w', duration: '9 mins', expert: 'Dr. Jessica Houston', expertTitle: 'Psychologist', link: 'https://www.youtube.com/watch?v=d96akWDnx0w', },
    
    // --- Stress Management (3 Videos) ---
    { id: 'v7', category: 'Stress Management', title: 'Mindfulness for Daily Stress Reduction', videoId: 'fcRANlaqf9c', duration: '6 mins', expert: 'Dr. Tracy Marks', expertTitle: 'Therapist', link: 'https://www.youtube.com/watch?v=fcRANlaqf9c', },
    { id: 'v8', category: 'Stress Management', title: 'Quick De-stressing Techniques', videoId: 'grfXR6FAsI8', duration: '3 mins', expert: 'Dr. Emma McAdam', expertTitle: 'Therapist', link: 'https://www.youtube.com/watch?v=grfXR6FAsI8', },
    { id: 'v9', category: 'Stress Management', title: 'Time Management to Reduce Overwhelm', videoId: 'b0EdU-mTkZA', duration: '11 mins', expert: 'Dr.Luke Reinhart', expertTitle: 'Psychologist', link: 'https://www.youtube.com/watch?v=b0EdU-mTkZA', },

    // --- Self-Esteem (2 Videos) ---
    { id: 'v10', category: 'Self-Esteem', title: 'Building Positive Self-Confidence', videoId: 'oOWhq1BTRuU', duration: '8 mins', expert: 'Dr. Tracy Marks', expertTitle: 'Therapist', link: 'https://www.youtube.com/watch?v=oOWhq1BTRuU', },
    { id: 'v11', category: 'Self-Esteem', title: 'Overcoming Negative Self-Talk', videoId: 'KfAAIEncDPo', duration: '21 mins', expert: 'Dr. Emma McAdam', expertTitle: 'Therapist', link: 'https://www.youtube.com/watch?v=KfAAIEncDPo', },

    // --- Emotional Regulation (2 Videos) ---
    { id: 'v12', category: 'Emotional Regulation', title: 'Identifying Emotional Triggers', videoId: 'l3i8SfOk5FU', duration: '7 mins', expert: 'Dr. Nicola', expertTitle: 'Psychologist', link: 'https://www.youtube.com/watch?v=l3i8SfOk5FU', },
    { id: 'v13', category: 'Emotional Regulation', title: 'Techniques for Managing Strong Emotions', videoId: 'NtW5oWXAaTc', duration: '8 mins', expert: 'Dr. Sid Warrier', expertTitle: 'Therapist', link: 'https://www.youtube.com/watch?v=NtW5oWXAaTc', },

    // --- Mindfulness (2 Videos) ---
    { id: 'v14', category: 'Mindfulness', title: 'Introduction to Mindful Breathing', videoId: '7-jJqXU25wo', duration: '7 mins', expert: 'Dr. Sid Warrier', expertTitle: 'Therapist', link: 'https://www.youtube.com/watch?v=7-jJqXU25wo', },
    { id: 'v15', category: 'Mindfulness', title: 'Simple 5-Minute Meditation', videoId: 'IdUrixeWbis', duration: '5 mins', expert: 'Dr. Alex Howard', expertTitle: 'Instructor', link: 'https://www.youtube.com/watch?v=IdUrixeWbis', },

    // --- Relationships (2 Videos) ---
    { id: 'v16', category: 'Relationships', title: 'Improving Communication Skills', videoId: 'LI57EB_T38c', duration: '18 mins', expert: 'Vinh Giang', expertTitle: 'Counselor', link: 'https://www.youtube.com/watch?v=LI57EB_T38c', },
    { id: 'v17', category: 'Relationships', title: 'Setting Healthy Boundaries', videoId: '83JE0jHAvBY', duration: '29 mins', expert: 'Jay Shetty', expertTitle: 'Counselor', link: 'https://www.youtube.com/watch?v=83JE0jHAvBY', },
    
    // --- Substance Abuse (2 Videos) ---
    { id: 'v18', category: 'Substance Abuse', title: 'Understanding Addiction and Recovery', videoId: 'PY9DcIMGxMs', duration: '15 mins', expert: 'Johann Hari', expertTitle: 'Specialist', link: 'https://www.youtube.com/watch?v=PY9DcIMGxMs', },
    { id: 'v19', category: 'Substance Abuse', title: 'Resources for Families Dealing with Addiction', videoId: '1qI-Qn7xass', duration: '15 mins', expert: 'Sam Fowler', expertTitle: 'Counselor', link: 'https://www.youtube.com/watch?v=1qI-Qn7xass', },

];

const getArticleLayoutSlots = (data) => {
    return {
        featured: data.find(a => a.size === 'featured'),
        standard: data.find(a => a.size === 'standard'),
        miniStack: data.filter(a => a.size === 'mini').slice(0, 3), 
    };
};

const { featured, standard, miniStack } = getArticleLayoutSlots(ARTICLES_DATA);

// Reusable ArticleCard component (unchanged)
const ArticleCard = ({ article, className }) => (
    <motion.a 
        href={article.link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`article-card ${className}`} 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
    >
        <div className="article-image-wrapper">
            <img src={article.image} alt={article.title} className="article-image" />
        </div>
        <div className="article-content">
            <div className="article-meta">
                <span className="article-type">{article.type}</span>
                <span className="article-category">{article.category}</span>
            </div>
            <h3 className="article-title">{article.title}</h3>
            {article.size === 'featured' && <p className="article-description">{article.description}</p>}
        </div>
    </motion.a>
);

// Reusable VideoCard component (unchanged)
const VideoCard = ({ video }) => (
    <motion.a 
        href={video.link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="video-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
    >
        <div className="video-thumbnail-wrapper">
            <img src={getYouTubeThumbnail(video.videoId)} alt={video.title} className="video-thumbnail" />
            <div className="play-icon">▶</div> 
            <div className="video-duration">{video.duration}</div>
        </div>
        <div className="video-info">
            <h4 className="video-title">{video.title}</h4>
            <p className="video-expert">{video.expert}, {video.expertTitle}</p>
            <div className="video-category-tag">{video.category}</div>
        </div>
    </motion.a>
);


// 🟢 FINAL CHAT INPUT BOX COMPONENT (EMBEDDED)
function ChatInputBox({ onSubmit, isLoading, currentUser, lastResponse }) {
    const [localInput, setLocalInput] = useState('');
    
    // Determine placeholder text
    const placeholderText = !currentUser 
        ? "Please log in to ask BloomBot..." 
        : (isLoading ? "Analyzing and generating response..." : "Ask BloomBot AI...");

    // Determine if we should show the full response box
    const showResponseBox = lastResponse || isLoading;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (localInput.trim() && !isLoading && currentUser) {
            onSubmit(localInput.trim());
            setLocalInput('');
        }
    };
    
    return (
        <div className="ai-input-section-wrapper">
            
            {/* 1. Response Box (Only shows if a query has been made or is loading) */}
            {showResponseBox && (
                <div className="ai-response-box">
                    <div className="response-content">
                        {lastResponse ? (
                            lastResponse.split('\n').map((line, i) => (
                                <p key={i} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }}></p>
                            ))
                        ) : (
                             <p className="loading-text">Analyzing and generating response...</p>
                        )}
                    </div>
                </div>
            )}
            
            {/* 2. Input Bar (Fixed rectangular shape) */}
            <form onSubmit={handleSubmit} className="ai-chat-form">
                <input
                    type="text"
                    value={localInput}
                    onChange={(e) => setLocalInput(e.target.value)}
                    placeholder={placeholderText}
                    disabled={isLoading || !currentUser}
                    className="ai-chat-input"
                />
                <button type="submit" disabled={isLoading || !currentUser} className="ai-send-btn">
                    {isLoading ? '...' : '→'}
                </button>
            </form>
        </div>
    );
}


// 🟢 AI RECOMMENDATION PAGE COMPONENT
export default function AiRecommendation() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [activeVideoCategory, setActiveVideoCategory] = useState(null); 
    const [isExpanded, setIsExpanded] = useState(false);
    
    // State for AI Bot
    const [botResponse, setBotResponse] = useState('');
    const [botLoading, setBotLoading] = useState(false);


    // 🟢 CORE LOGIC: Handles the hardcoded analysis and displays result
    const handleBotQuery = async (userPrompt) => {
        setBotLoading(true);
        setBotResponse('Analyzing your query with personal data...');
        
        try {
            const idToken = await currentUser.getIdToken();
            
            // 1. Fetch scores/context from MongoDB API
            const contextResponse = await fetch(DASHBOARD_API_URL, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${idToken}` }
            });
            
            if (!contextResponse.ok) throw new Error("Failed to load assessment scores securely.");
            const results = await contextResponse.json();
            
            // Extract latest scores (needed for personalization in the prompt)
            const latestPHQ9 = results.filter(r => r.questionnaireType === 'PHQ-9').pop()?.totalScore || 0;
            const latestGAD7 = results.filter(r => r.questionnaireType === 'GAD-7').pop()?.totalScore || 0;

            // 🟢 STEP 1: Get the hardcoded personalized advice based on scores
            const adviceSet = getAdviceBasedOnScores(latestPHQ9, latestGAD7);
            
            // 🟢 STEP 2: Construct the final output
            const finalResponseText = `
                ${adviceSet.summary}
                
                **Your Personalized Plan**
                1. **Nutrition:** ${adviceSet.nutrition}
                2. **Brain Health/Hormones:** ${adviceSet.hormones}
                3. **Sleep Cycle:** ${adviceSet.sleep}
                4. **Overall Well-being:** ${adviceSet.overall}
                
                ***
                
                Your specific question was: "${userPrompt}"
                (Note: This advice is based on your assessment scores.)
            `;
            
            // 3. Set the final response text
            setBotResponse(finalResponseText);

        } catch (error) {
            console.error("Bot Query Error:", error);
            setBotResponse('Error: Failed to process request. Ensure scores are submitted and the backend is running.');
        } finally {
            setBotLoading(false);
        }
    };
    
    // Filter logic (unchanged)
    const handleCategoryClick = (category) => {
        if (activeVideoCategory === category) {
            setActiveVideoCategory(null);
        } else {
            setActiveVideoCategory(category);
        }
        setIsExpanded(false); 
    };

    let filteredVideos = activeVideoCategory
        ? VIDEOS_DATA.filter(video => video.category === activeVideoCategory)
        : VIDEOS_DATA; 

    // Display 3 for consistent layout
    const displayLimit = 3; 
    const videosToShow = isExpanded ? filteredVideos : filteredVideos.slice(0, displayLimit);
    const showMoreButton = filteredVideos.length > displayLimit && !isExpanded;


    const { featured, standard, miniStack } = getArticleLayoutSlots(ARTICLES_DATA); 


    return (
        <div className="recommendation-page-container">
            {/* --- Main Content --- */}
            <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="page-main-title"
            >
                Personalized Wellness Insights
            </motion.h1>
            <motion.p
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="page-subtitle"
            >
                Explore articles and videos tailored to enhance your mental well-being.
            </motion.p>
            
            {/* ... (Articles Section) ... */}
            <section className="articles-section">
                <motion.h2
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="section-title"
                >
                    Recommended Articles
                </motion.h2>
                
                <div className="articles-balanced-container"> 
                    
                    <div className="articles-column articles-column-left">
                        {featured && <ArticleCard article={featured} className="featured-card" />}
                        {standard && <ArticleCard article={standard} className="standard-card" />}
                    </div>
                    <div className="articles-column articles-column-right">
                        {miniStack.map(article => (
                            <ArticleCard key={article.id} article={article} className="mini-card" />
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Videos Section (Dynamic Filtering) --- */}
            <section className="videos-section">
                <motion.h2
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="section-title"
                >
                    Expert-Recommended Videos
                </motion.h2>

                {/* Video Category Tags (Filtering UI) */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="video-categories-filter"
                >
                    <button
                        className={`category-tag ${activeVideoCategory === null ? 'active' : ''}`}
                        onClick={() => handleCategoryClick(null)} 
                    >
                        All Topics ({VIDEOS_DATA.length})
                    </button>
                    {VIDEO_CATEGORIES.map(category => (
                        <button
                            key={category}
                            className={`category-tag ${activeVideoCategory === category ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(category)}
                        >
                            {category}
                        </button>
                    ))}
                </motion.div>

                {/* Filtered Videos Grid */}
                <div className="videos-grid">
                    {videosToShow.length > 0 ? (
                        videosToShow.map(video => (
                            <VideoCard key={video.id} video={video} />
                        ))
                    ) : (
                        <motion.p 
                            className="no-videos-message"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            No videos available for this topic. Try selecting another one!
                        </motion.p>
                    )}
                </div>

                {/* "More Videos" Button (Conditional Visibility) */}
                {showMoreButton && (
                    <div className="show-more-wrapper">
                        <button 
                            className="show-more-btn"
                            onClick={() => setIsExpanded(true)}
                        >
                            Show More Videos ({filteredVideos.length - videosToShow.length} remaining) ↓
                        </button>
                    </div>
                )}
            </section>
            
            {/* 🟢 FINAL CHAT INPUT BOX RENDERED AT THE BOTTOM */}
            <section className="ai-chat-section">
                <ChatInputBox 
                    onSubmit={handleBotQuery}
                    isLoading={botLoading}
                    currentUser={currentUser}
                    lastResponse={botResponse}
                />
            </section>
        </div>
    );
}
