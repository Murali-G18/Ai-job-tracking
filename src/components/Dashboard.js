import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Charts from './Charts';

const Dashboard = ({ token, user, setToken }) => {
  const [applications, setApplications] = useState(user?.applications || []);
  const [newApp, setNewApp] = useState({ jobTitle: '', company: '', status: 'pending' });
  const [stats, setStats] = useState({ total: 0, pending: 0, interviewed: 0, offered: 0, rejected: 0 });

  useEffect(() => {
    fetchStats();
  }, [applications]);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/applications/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addApplication = async () => {
    if (!newApp.jobTitle || !newApp.company) return alert('Please fill job title and company');
    try {
      const { data } = await axios.post('http://localhost:5000/api/applications', newApp, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(data);
      setNewApp({ jobTitle: '', company: '', status: 'pending' });
    } catch (err) {
      alert('Error adding application');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h1 style={styles.logoText}>🎯 JobTrack AI</h1>
        <div>
          <span style={styles.userName}>👋 {user?.name || 'User'}</span>
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.mainContent}>
        {/* Add application card */}
        <div style={styles.addCard}>
          <h3>✨ Add New Application</h3>
          <div style={styles.addForm}>
            <input
              placeholder="Job Title"
              value={newApp.jobTitle}
              onChange={(e) => setNewApp({ ...newApp, jobTitle: e.target.value })}
              style={styles.input}
            />
            <input
              placeholder="Company"
              value={newApp.company}
              onChange={(e) => setNewApp({ ...newApp, company: e.target.value })}
              style={styles.input}
            />
            <select
              value={newApp.status}
              onChange={(e) => setNewApp({ ...newApp, status: e.target.value })}
              style={styles.select}
            >
              <option value="pending">⏳ Pending</option>
              <option value="interviewed">🎤 Interviewed</option>
              <option value="offered">🏆 Offered</option>
              <option value="rejected">❌ Rejected</option>
            </select>
            <button onClick={addApplication} style={styles.addBtn}>+ Add</button>
          </div>
        </div>

        {/* Stats mini cards */}
        <div style={styles.statsRow}>
          <div style={{...styles.statMini, background: '#ffb347'}}><span>📊 Total</span><strong>{stats.total}</strong></div>
          <div style={{...styles.statMini, background: '#ffd966'}}><span>⏳ Pending</span><strong>{stats.pending}</strong></div>
          <div style={{...styles.statMini, background: '#6c5ce7'}}><span>🎤 Interviewed</span><strong>{stats.interviewed}</strong></div>
          <div style={{...styles.statMini, background: '#00b894'}}><span>🏆 Offered</span><strong>{stats.offered}</strong></div>
          <div style={{...styles.statMini, background: '#e17055'}}><span>❌ Rejected</span><strong>{stats.rejected}</strong></div>
        </div>

        {/* Charts */}
        <Charts stats={stats} />

        {/* Application list */}
        <div style={styles.listSection}>
          <h3>📋 Your Applications</h3>
          <div style={styles.grid}>
            {applications.length === 0 && <p style={styles.empty}>No applications yet. Add one!</p>}
            {applications.map((app, idx) => (
              <div key={idx} style={styles.card}>
                <div style={styles.cardTitle}>{app.jobTitle}</div>
                <div style={styles.cardCompany}>{app.company}</div>
                <div style={{...styles.statusBadge, backgroundColor: getStatusColor(app.status)}}>
                  {app.status.toUpperCase()}
                </div>
                <div style={styles.date}>{new Date(app.date).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch(status) {
    case 'offered': return '#00b894';
    case 'interviewed': return '#6c5ce7';
    case 'rejected': return '#e17055';
    default: return '#ffb347';
  }
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(145deg, #f9f3e6 0%, #ffe6f0 100%)',
    fontFamily: 'Poppins, sans-serif'
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
  },
  logoText: {
    margin: 0,
    background: 'linear-gradient(135deg, #ff8c00, #ff2e00)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent'
  },
  userName: {
    marginRight: '1rem',
    fontWeight: 'bold'
  },
  logoutBtn: {
    background: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 18px',
    borderRadius: '40px',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  mainContent: {
    padding: '2rem',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  addCard: {
    background: 'white',
    borderRadius: '2rem',
    padding: '1.5rem',
    marginBottom: '2rem',
    boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
    transition: 'transform 0.3s',
    ':hover': { transform: 'translateY(-3px)' }
  },
  addForm: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    marginTop: '1rem'
  },
  input: {
    flex: 1,
    padding: '0.8rem 1rem',
    borderRadius: '40px',
    border: '1px solid #ddd',
    outline: 'none',
    transition: '0.2s'
  },
  select: {
    padding: '0.8rem 1rem',
    borderRadius: '40px',
    border: '1px solid #ddd'
  },
  addBtn: {
    background: 'linear-gradient(90deg, #00b4db, #0083b0)',
    color: 'white',
    border: 'none',
    padding: '0.8rem 1.8rem',
    borderRadius: '40px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  statsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '2rem',
    justifyContent: 'center'
  },
  statMini: {
    flex: 1,
    minWidth: '100px',
    padding: '1rem',
    borderRadius: '1.5rem',
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    boxShadow: '0 5px 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    ':hover': { transform: 'scale(1.05)' }
  },
  listSection: {
    background: 'rgba(255,255,255,0.7)',
    borderRadius: '2rem',
    padding: '1.5rem',
    marginTop: '2rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '1rem',
    marginTop: '1rem'
  },
  card: {
    background: 'white',
    padding: '1rem',
    borderRadius: '1.2rem',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    transition: 'all 0.3s',
    ':hover': {
      transform: 'translateY(-5px) rotate(1deg)',
      boxShadow: '0 15px 30px rgba(0,0,0,0.15)'
    }
  },
  cardTitle: { fontSize: '1.2rem', fontWeight: 'bold' },
  cardCompany: { color: '#666', marginBottom: '0.5rem' },
  statusBadge: {
    display: 'inline-block',
    padding: '0.2rem 0.6rem',
    borderRadius: '40px',
    color: 'white',
    fontSize: '0.7rem',
    fontWeight: 'bold'
  },
  date: { fontSize: '0.7rem', color: '#999', marginTop: '0.5rem' },
  empty: { textAlign: 'center', padding: '2rem', color: '#888' }
};

export default Dashboard;