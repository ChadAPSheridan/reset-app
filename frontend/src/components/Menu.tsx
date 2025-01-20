import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faCog, faSignOutAlt, faChevronDown, faChevronUp, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import LogoutButton from './LogoutButton';

const Menu: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isTasksExpanded, setIsTasksExpanded] = useState(false);
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const authUserString = localStorage.getItem('authUser');
    if (authUserString) {
      const authUser = JSON.parse(authUserString);
      setCurrentUser(authUser);
    }
  }, []);

  const toggleMenu = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleTasks = () => {
    setIsTasksExpanded(!isTasksExpanded);
  };

  const toggleConfig = () => {
    setIsConfigExpanded(!isConfigExpanded);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className={`menu ${isCollapsed ? 'collapsed' : ''}`}>
      <Link to="/" className="logo">
        <img src="/logo.png" alt="Company Logo" className="logo-image" />
      </Link>
      <hr className="menu-separator" />
      <button onClick={toggleMenu} className="toggle-btn">
        <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} />
      </button>
      <div className="menu-content">
        <div className="menu-sections">
          <div className="menu-section">
            <h2 onClick={toggleTasks}>
              <FontAwesomeIcon icon={faTasks} className="menu-icon" />
              {!isCollapsed && ' Tasks'}
              <FontAwesomeIcon icon={isTasksExpanded ? faChevronUp : faChevronDown} className="chevron" />
            </h2>
            {isTasksExpanded && (
              <ul>
                <li>
                  <Link to="/tasks">
                    <FontAwesomeIcon icon={faTasks} />
                    {!isCollapsed && ' Go to Task Board'}
                  </Link>
                </li>
              </ul>
            )}
            {isCollapsed && (
              <div className="submenu">
                <ul>
                  <li>
                    <Link to="/tasks">
                      <FontAwesomeIcon icon={faTasks} />
                      {' Go to Task Board'}
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="menu-section">
            <h2 onClick={toggleConfig}>
              <FontAwesomeIcon icon={faCog} className="menu-icon" />
              {!isCollapsed && ' Config'}
              <FontAwesomeIcon icon={isConfigExpanded ? faChevronUp : faChevronDown} className="chevron" />
            </h2>
            {isConfigExpanded && (
              <ul>
                <li>
                  <Link to="/user-management">
                    <FontAwesomeIcon icon={faCog} />
                    {!isCollapsed && ' User Management'}
                  </Link>
                </li>
              </ul>
            )}
            {isCollapsed && (
              <div className="submenu">
                <ul>
                  <li>
                    <Link to="/user-management">
                      <FontAwesomeIcon icon={faCog} />
                      {' User Management'}
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="logout-container">
          <hr className="logout-separator" />
          <div className="logout-section">
            <div className="user-info">
              {currentUser && (
                <>
                  <div className="user-icon">{getInitials(currentUser.firstName, currentUser.lastName)}</div>
                  <div className="user-details">
                    <span className="username">{currentUser.firstName} {currentUser.lastName}</span>
                    <span className="user-role">{currentUser.permissionLevel}</span>
                  </div>
                </>
              )}
            </div>
            <div className='logout-btn-container'>
            <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;