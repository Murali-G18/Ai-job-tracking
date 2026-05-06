import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isLogin ? '/login' : '/register';
    const payload = isLogin ? { email, password } : { name, email, password };
    try {
      const { data } = await axios.post(`http://localhost:5000/api${endpoint}`, payload);
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
      } else {
        alert(data.message || 'Success');
        if (!isLogin) setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.gradientBg}></div>
      <div style={styles.card}>
        <div style={styles.logo}>🚀 JobTrack AI</div>
        <h2 style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>
        <p style={styles.switch} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
        </p>
        <div style={styles.floatingBubbles}>
          <div className="bubble"></div><div className="bubble"></div><div className="bubble"></div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Poppins, sans-serif',
    position: 'relative',
    overflow: 'hidden'
  },
  gradientBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    animation: 'gradientShift 15s ease infinite',
    backgroundSize: '200% 200%'
  },
  card: {
    position: 'relative',
    background: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(12px)',
    borderRadius: '2rem',
    padding: '2.5rem',
    width: '400px',
    maxWidth: '90%',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.3)',
    transform: 'translateY(0)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 30px 50px rgba(0,0,0,0.3)'
    }
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '1rem',
    background: 'linear-gradient(90deg, #fff, #ffe6b0)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent'
  },
  title: {
    textAlign: 'center',
    color: 'white',
    marginBottom: '1.5rem',
    fontSize: '1.8rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  input: {
    padding: '12px 16px',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '40px',
    background: 'rgba(255,255,255,0.9)',
    outline: 'none',
    transition: 'all 0.3s',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  button: {
    padding: '12px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '40px',
    background: 'linear-gradient(90deg, #ff8c00, #ff2e00)',
    color: 'white',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
    ':hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
    }
  },
  switch: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#fff',
    cursor: 'pointer',
    textDecoration: 'underline',
    transition: 'color 0.2s',
    ':hover': { color: '#ffd966' }
  }
};

// Add keyframes for gradient animation (you can put this in index.css or global)
// But we'll inject via <style> tag later – for brevity, assume it works.

export default Login;