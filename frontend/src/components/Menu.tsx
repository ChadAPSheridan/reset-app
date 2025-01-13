import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faCog, faSignOutAlt, faChevronDown, faChevronUp, faBars } from '@fortawesome/free-solid-svg-icons';
import LogoutButton from './LogoutButton';

const Menu: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isTasksExpanded, setIsTasksExpanded] = useState(false);
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);

  const toggleMenu = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleTasks = () => {
    setIsTasksExpanded(!isTasksExpanded);
  };

  const toggleConfig = () => {
    setIsConfigExpanded(!isConfigExpanded);
  };

  return (
    <div className={`menu ${isCollapsed ? 'collapsed' : ''}`}>
      <Link to="/" className="logo">
        {!isCollapsed && <h1>Company Logo</h1>}
      </Link>
      <hr className="menu-separator" />
      <button onClick={toggleMenu} className="toggle-btn">
        <FontAwesomeIcon icon={faBars} />
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
              <img src="path/to/profile-pic.jpg" alt="Profile" className="profile-pic" />
              <span className="username">Username</span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;