// frontend/src/pages/Dashboard/Dashboard.jsx

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { motion } from 'framer-motion';
import './Dashboard.css';

// --- MOCK DATA ---

// 1. Data for the Score Tracking Bar Chart
const mockScoreData = [
  { date: 'Oct 1', PHQ9: 5, GAD7: 7 },
  { date: 'Oct 8', PHQ9: 10, GAD7: 4 },
  { date: 'Oct 15', PHQ9: 3, GAD7: 12 },
  { date: 'Oct 22', PHQ9: 8, GAD7: 9 },
  { date: 'Oct 29', PHQ9: 6, GAD7: 5 },
];

// 2. Data for the Parameter Pie Chart
const mockParameterData = [
  { name: 'Depression (PHQ-9)', value: 35 },
  { name: 'Anxiety (GAD-7)', value: 25 },
  { name: 'Lack of Sleep', value: 15 },
  { name: 'Overthinking/Rumination', value: 25 },
];
const PIE_COLORS = ['#0d47a1', '#00c853', '#FF9800', '#B71C1C'];

// --- PHQ-9 LEGEND DATA ---
const phq9Legend = `
0-4: Minimal or None | 5-9: Mild | 10-14: Moderate | 15-19: Moderately Severe | 20-27: Severe
`;


const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`Date: ${label}`}</p>
        <p className="intro" style={{ color: payload[0].color }}>{`PHQ-9 Score: ${payload[0].value}`}</p>
        <p className="intro" style={{ color: payload[1].color }}>{`GAD-7 Score: ${payload[1].value}`}</p>
      </div>
    );
  }
  return null;
};

// Component for the Legend Box
const LegendBox = () => (
    <div className="legend-box">
        <h4>PHQ-9 Score Interpretation (Depression Severity)</h4>
        <div className="legend-content">
            {phq9Legend.split('|').map((item, index) => (
                <p key={index} className="legend-item">{item.trim()}</p>
            ))}
        </div>
    </div>
);


export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Your Wellness Dashboard
      </motion.h1>

      <div className="top-section">
        
        {/* 1. TOP LEFT: Legend Box */}
        <LegendBox />

        {/* 2. TOP RIGHT: Parameter Pie Chart */}
        <motion.div 
          className="chart-card pie-chart-card"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3>Areas of Focus (Simulated)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockParameterData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {mockParameterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ paddingLeft: '15px' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

      </div>
      
      {/* 3. BOTTOM: Score Tracking Bar Chart */}
      <motion.div 
        className="chart-card bar-chart-card"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3>PHQ-9 & GAD-7 Score Progression</h3>
        <p className="chart-subtitle">Lower scores indicate better mental health.</p>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={mockScoreData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="date" stroke="#666" />
            <YAxis domain={[0, 27]} stroke="#666" label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="PHQ9" fill="#0d47a1" name="Depression (PHQ-9)" radius={[10, 10, 0, 0]} />
            <Bar dataKey="GAD7" fill="#00c853" name="Anxiety (GAD-7)" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

    </div>
  );
}