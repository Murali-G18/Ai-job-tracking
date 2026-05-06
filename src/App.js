import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  if (!token) {
    return <Login setToken={setToken} setUser={setUser} />;
  }

  return <Dashboard token={token} user={user} setToken={setToken} />;
}

export default App;