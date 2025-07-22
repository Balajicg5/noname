import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AnimatedBackground from './components/AnimatedBackground';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import './App.css';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';

function App() {
  const { loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading spinner
  }

  return (
    <Router>
      <AnimatedBackground />
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-gray-800 text-white shadow-lg"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
