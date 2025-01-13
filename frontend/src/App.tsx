import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TaskBoard from './pages/TaskBoard';
import LoginPage from './pages/LoginPage';
import UserManagement from './pages/UserManagement';
import Menu from './components/Menu';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem('auth');
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Menu />
        <div className="content">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
            <Route path="/tasks" element={<PrivateRoute element={<TaskBoard />} />} />
            <Route path="/user-management" element={<PrivateRoute element={<UserManagement />} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;