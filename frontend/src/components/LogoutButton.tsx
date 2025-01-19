import React from 'react';
import { useNavigate } from 'react-router-dom';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Button from './Button';

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/login');
  };

  return (
    <Button onClick={handleLogout} icon={faSignOutAlt} className="logout-btn">
      Logout
    </Button>
  );
};

export default LogoutButton;