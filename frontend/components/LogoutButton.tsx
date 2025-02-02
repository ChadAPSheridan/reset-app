import React from 'react';
import { useRouter } from 'next/router';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Button from './Button';

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('authUser');
    router.push('/login');
  };

  return (
    <Button onClick={handleLogout} icon={faSignOutAlt} className="logout-btn">
      Logout
    </Button>
  );
};

export default LogoutButton;