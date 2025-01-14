import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <h1>Welcome to Reset App</h1>
      <p>A minimalist, Kanban-style project management tool.</p>
      <Link to="/tasks" className="btn">
        Go to Task Board
      </Link>
    </div>
  );
};

export default HomePage;