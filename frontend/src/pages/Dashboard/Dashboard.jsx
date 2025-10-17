// frontend/src/pages/Dashboard/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext'; 
import { useNavigate } from 'react-router-dom'; 
import './Dashboard.css';

// --- CONSTANTS ---
const ACCENT_COLOR = '#4285F4'; // Blue
const WARNING_COLOR = '#FF9800'; // Orange
const SUCCESS_COLOR = '#00c853'; // Green
const DANGER_COLOR = '#B71C1C'; // Red
const PIE_COLORS = [ACCENT_COLOR, SUCCESS_COLOR, WARNING_COLOR, DANGER_COLOR];

const TARGET_COLORS = {
    stress: DANGER_COLOR, 
    sleep: ACCENT_COLOR, 
    emotionalStability: SUCCESS_COLOR, 
    selfEsteem: '#6A1B9A',
};


// --- PHQ-9 LEGEND DATA (Unchanged) ---
const phq9Legend = [
    { range: '0-4', severity: 'Minimal or None' },
    { range: '5-9', severity: 'Mild' },
    { range: '10-14', severity: 'Moderate' },
    { range: '15-19', severity: 'Moderately Severe' },
    { range: '20-27', severity: 'Severe' },
];


// --- DATA PROCESSING FUNCTIONS (Unchanged) ---
const formatDashboardData = (results) => {
    // ... (logic from previous step) ...
    if (!results || results.length === 0) return { barData: [], pieData: [], metrics: null, wellnessTargets: [] };

    // Grouping and processing history data
    const barChartMap = results.reduce((acc, res) => {
        const dateKey = new Date(res.createdAt).toISOString().split('T')[0];
        const entry = acc[dateKey] || { 
            date: new Date(res.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
            PHQ9: 0, 
            GAD7: 0 
        };
        if (res.questionnaireType === 'PHQ-9') {
            entry.PHQ9 = res.totalScore;
        } else if (res.questionnaireType === 'GAD-7') {
            entry.GAD7 = res.totalScore;
        }
        acc[dateKey] = entry;
        return acc;
    }, {});
    const barData = Object.values(barChartMap).sort((a, b) => new Date(a.date) - new Date(b.date));
    const latestPHQ9 = results.filter(r => r.questionnaireType === 'PHQ-9').pop();
    const latestGAD7 = results.filter(r => r.questionnaireType === 'GAD-7').pop();
    const latestTotal = (latestPHQ9?.totalScore || 0) + (latestGAD7?.totalScore || 0);
    const pieData = latestTotal > 0 ? [
        { name: 'Depression (PHQ-9)', value: latestPHQ9?.totalScore || 0, color: PIE_COLORS[0] },
        { name: 'Anxiety (GAD-7)', value: latestGAD7?.totalScore || 0, color: PIE_COLORS[1] },
    ].filter(item => item.value > 0) : [];
    const getSeverityColor = (score, maxScore) => {
        if (score >= maxScore * 0.75) return DANGER_COLOR;
        if (score >= maxScore * 0.55) return WARNING_COLOR;
        if (score >= maxScore * 0.35) return ACCENT_COLOR;
        return SUCCESS_COLOR;
    };
    const getTrend = (dataKey) => {
        const history = barData.filter(d => d[dataKey] > 0); 
        if (history.length < 2) return null; 
        const latest = history[history.length - 1][dataKey];
        const previous = history[history.length - 2][dataKey];
        return previous - latest; 
    };

    const metrics = {
        latestPHQ9Score: latestPHQ9?.totalScore || 'N/A',
        latestGAD7Score: latestGAD7?.totalScore || 'N/A',
        latestPHQ9Color: getSeverityColor(latestPHQ9?.totalScore || 0, 27),
        latestGAD7Color: getSeverityColor(latestGAD7?.totalScore || 0, 21),
        completionDate: latestPHQ9?.createdAt || latestGAD7?.createdAt 
                        ? new Date(latestPHQ9?.createdAt || latestGAD7?.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : 'N/A',
        totalAssessments: barData.length,
        phq9Trend: getTrend('PHQ9'),
        gad7Trend: getTrend('GAD7'),
    };
    const phq9Score = latestPHQ9?.totalScore || 0;
    const gad7Score = latestGAD7?.totalScore || 0;
    const normalizedPHQ9 = phq9Score / 27; 
    const normalizedGAD7 = gad7Score / 21;
    let stress = Math.min(10, Math.round(((normalizedPHQ9 + normalizedGAD7) / 2) * 10));
    stress = Math.max(0, stress);
    let lackOfSleep = Math.min(10, Math.round((normalizedPHQ9 * 5) + (normalizedGAD7 * 5)));
    lackOfSleep = Math.max(0, lackOfSleep);
    let emotionalStability = Math.min(100, Math.round(100 - (((normalizedPHQ9 + normalizedGAD7) / 2) * 100)));
    emotionalStability = Math.max(0, emotionalStability);
    let selfEsteem = Math.min(100, Math.round(100 - (normalizedPHQ9 * 100 * 0.7 + normalizedGAD7 * 100 * 0.3)));
    selfEsteem = Math.max(0, selfEsteem);

    const wellnessTargets = [
        { name: 'Stress Level', value: stress, max: 10, unit: '/10', percentage: stress * 10, color: TARGET_COLORS.stress }, 
        { name: 'Lack of Sleep', value: lackOfSleep, max: 10, unit: '/10', percentage: lackOfSleep * 10, color: TARGET_COLORS.sleep },
        { name: 'Emotional Stability', value: emotionalStability, max: 100, unit: '%', percentage: emotionalStability, color: TARGET_COLORS.emotionalStability },
        { name: 'Self-Esteem', value: selfEsteem, max: 100, unit: '%', percentage: selfEsteem, color: TARGET_COLORS.selfEsteem },
    ];

    return { barData, pieData, metrics, wellnessTargets };
};


// --- RECHARTS COMPONENTS (Unchanged) ---

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`Date: ${label}`}</p>
        {payload.map((p, index) => (
            <p key={index} style={{ color: p.color }}>{`${p.name}: ${p.value}`}</p>
        ))}
      </div>
    );
  }
  return null;
};

const MetricsCard = ({ title, score, color, unit, trend }) => {
    let trendMessage = 'No Previous Data'; 
    let trendColor = '#a0a8b4'; 

    if (trend !== null && trend !== undefined) {
        if (trend === 0) {
            trendMessage = 'No Change';
            trendColor = '#a0a8b4'; 
        } else if (trend > 0) { 
            trendMessage = `Score Down ${trend} pts`;
            trendColor = SUCCESS_COLOR; 
        } else { 
            trendMessage = `Score Up ${Math.abs(trend)} pts`;
            trendColor = DANGER_COLOR; 
        }
    }
    if (title === "Total Assessments" || title === "Last Checked") {
        trendMessage = ''; 
        trendColor = '#a0a8b4';
    }


    return (
        <motion.div 
            className="metric-card" 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <div className="metric-header">
                <span className="metric-title">{title}</span>
                <span className="metric-score" style={{ color: color }}>{score} {unit}</span>
            </div>
            <div className="metric-footer">
                <span className="metric-trend" style={{ color: trendColor }}>
                    {trendMessage}
                </span>
            </div>
        </motion.div>
    );
};

const WellnessTargetCard = ({ title, percentage, color, delay }) => (
    <motion.div 
        className="wellness-target-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: delay }}
    >
        <div className="target-progress-header">
            <span className="target-percentage" style={{ color: color }}>{percentage}%</span>
            <div className="target-progress-bar-container">
                <div 
                    className="target-progress-bar" 
                    style={{ width: `${percentage}%`, backgroundColor: color }}
                ></div>
            </div>
        </div>
        <div className="target-title">{title}</div>
    </motion.div>
);


export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();
  const [data, setData] = useState({ barData: [], pieData: [], metrics: {}, wellnessTargets: [] }); 
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !currentUser) {
      setDataLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      setDataLoading(true);
      try {
        const idToken = await currentUser.getIdToken();

        const response = await fetch('http://localhost:3001/api/results/dashboard', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch user data from API.');
        }

        const rawResults = await response.json();
        
        setData(formatDashboardData(rawResults));

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser, authLoading]); 

  
  if (authLoading || dataLoading) {
    return (
        <div className="dashboard-container" style={{ textAlign: 'center', paddingTop: '100px' }}>
            <motion.h1 
                initial={{ scale: 0.8 }} 
                animate={{ scale: 1 }} 
                transition={{ repeat: Infinity, duration: 0.8, repeatType: "reverse" }}
            >
                Loading Your Personalized Dashboard...
            </motion.h1>
        </div>
    );
  }
  
  const hasData = data.barData.length > 0;
  const metrics = data.metrics;

  return (
    <div className="dashboard-container">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Your Wellness Dashboard
      </motion.h1>
      
      {/* --- METRICS ROW (Matching Professional UI Example) --- */}
      <div className="metrics-row">
        <MetricsCard 
            title="Depression (PHQ-9)" 
            score={metrics.latestPHQ9Score} 
            unit="/ 27" 
            color={metrics.latestPHQ9Color} 
            trend={metrics.phq9Trend} 
        />
        <MetricsCard 
            title="Anxiety (GAD-7)" 
            score={metrics.latestGAD7Score} 
            unit="/ 21" 
            color={metrics.latestGAD7Color} 
            trend={metrics.gad7Trend} 
        />
        <MetricsCard 
            title="Total Assessments" 
            score={metrics.totalAssessments} 
            unit="" 
            color={ACCENT_COLOR} 
        />
        <MetricsCard 
            title="Last Checked" 
            score={metrics.completionDate} 
            unit="" 
            color={SUCCESS_COLOR} 
        />
      </div>

      {/* --- MAIN CHART SECTION (Legend + Pie Chart + Bar Chart) --- */}
      {hasData ? (
        <div className="charts-area">
          <div className="charts-row">
            
            {/* 1. TOP LEFT: Legend Box (Interpretation) */}
            <motion.div className="chart-card legend-box-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <h4>PHQ-9 & GAD-7 Score Interpretation (Severity)</h4>
                <div className="legend-content">
                    {phq9Legend.map((item, index) => (
                        <p key={index} className="legend-item">
                            <span style={{ fontWeight: 'bold' }}>{item.range}:</span> {item.severity}
                        </p>
                    ))}
                </div>
            </motion.div>

            {/* 2. TOP RIGHT: Pie Chart (Area Distribution) */}
            <motion.div 
              className="chart-card pie-chart-card"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3>Current Score Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    labelLine={false}
                    label={({ name, percent, value }) => value > 0 ? `${(percent * 100).toFixed(0)}%` : ''}
                  >
                    {data.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} /> 
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ paddingLeft: '15px' }} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

          </div>
          
          {/* 3. MIDDLE: Score Tracking Bar Chart (History) */}
          <motion.div 
            className="chart-card bar-chart-card full-width-chart"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3>PHQ-9 & GAD-7 Score Progression History</h3>
            <p className="chart-subtitle">Tracking scores over time. Lower scores indicate better mental health.</p>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={data.barData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#a0a8b4" />
                <YAxis domain={[0, 27]} stroke="#a0a8b4" label={{ value: 'Score', angle: -90, position: 'insideLeft', fill: '#f0f8ff' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="PHQ9" fill={PIE_COLORS[0]} name="Depression (PHQ-9)" radius={[5, 5, 0, 0]} />
                <Bar dataKey="GAD7" fill={PIE_COLORS[1]} name="Anxiety (GAD-7)" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* 4. BOTTOM: Wellness Target Cards (Below Bar Graph) */}
          <motion.div 
            className="wellness-target-section"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h2>Wellness Overview</h2>
            <div className="wellness-target-cards-row">
                {data.wellnessTargets.map((target, index) => (
                    <WellnessTargetCard
                        key={target.name}
                        title={target.name}
                        percentage={target.percentage}
                        color={target.color}
                        delay={0.7 + (index * 0.1)}
                    />
                ))}
            </div>
          </motion.div>

          {/* 🟢 NEW: Recommendation Button Wrapper */}
          <motion.div
            className="recommendation-button-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <button 
              className="btn-primary dashboard-action-btn" // 🟢 NEW CLASS ADDED
              onClick={() => navigate('/ai-recommendation')}
              style={{ backgroundColor: TARGET_COLORS.emotionalStability, color: '#0d1a26' }} // 🟢 Used a bright color with dark text
            >
              Continue to Personalized Recommendations →
            </button>
          </motion.div>


        </div>
      ) : (
        <motion.div
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             style={{ textAlign: 'center', padding: '50px', backgroundColor: '#1c2b3a', borderRadius: '12px', marginTop: '50px' }}
        >
            <h2>Welcome!</h2>
            <p style={{ color: '#a0a8b4', fontSize: '1.1rem', margin: '15px 0' }}>
                Start your wellness journey by completing your first questionnaire.
            </p>
            <button 
                onClick={() => navigate('/questionnaires')}
                style={{ padding: '10px 20px', backgroundColor: SUCCESS_COLOR, color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
                Go to Questionnaires
            </button>
        </motion.div>
      )}
    </div>
  );
}