import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

interface LogoutButtonProps {
  hideText?: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ hideText }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="logout-btn">
      <FontAwesomeIcon icon={faSignOutAlt} />
      {!hideText && <span> Logout</span>}
    </button>
  );
};

export default LogoutButton;