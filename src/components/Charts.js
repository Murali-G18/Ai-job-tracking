import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Charts = ({ stats }) => {
  const chartData = [
    { name: 'Pending', value: stats.pending || 0, color: '#ffb347' },
    { name: 'Interviewed', value: stats.interviewed || 0, color: '#6c5ce7' },
    { name: 'Offered', value: stats.offered || 0, color: '#00b894' },
    { name: 'Rejected', value: stats.rejected || 0, color: '#e17055' }
  ].filter(item => item.value > 0);

  if (stats.total === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', background: '#fff9f0', borderRadius: '2rem' }}>
        <p>✨ No data yet. Add your first job application to see beautiful charts!</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.chartBox}>
        <h3>📊 Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {chartData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={styles.chartBox}>
        <h3>📈 Progress Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" radius={[10,10,0,0]}>
              {chartData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2rem',
    justifyContent: 'center',
    margin: '2rem 0'
  },
  chartBox: {
    flex: 1,
    minWidth: '300px',
    background: 'white',
    borderRadius: '1.5rem',
    padding: '1rem',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s',
    ':hover': { transform: 'scale(1.02)' }
  }
};

export default Charts;