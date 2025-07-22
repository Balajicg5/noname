
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-card">
        <h1>Welcome to Todo App</h1>
        <p>
          Organize your life and boost your productivity with our intuitive todo application.
          Manage your tasks, set reminders, and achieve your goals with ease.
        </p>
        <div className="home-buttons">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
