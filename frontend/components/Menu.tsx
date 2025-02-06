// This file exports a React component that renders a navigation menu for the frontend application.

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faCog, faSignOutAlt, faChevronDown, faChevronUp, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import LogoutButton from './LogoutButton';
import axios from 'axios';

const Menu: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isTasksExpanded, setIsTasksExpanded] = useState(false);
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  interface Project {
    id: string;
    name: string;
  }

  const [projects, setProjects] = useState<Project[]>([]);
  const router = useRouter();

  useEffect(() => {
    const authUserString = localStorage.getItem('authUser');
    if (authUserString) {
      console.log('authUserString:', authUserString);
      try {
        const authUser = JSON.parse(authUserString);
        setCurrentUser(authUser);
      } catch (error) {
        console.error('Error parsing authUser from localStorage:', error);
      }
    }

    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
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

  const handleNavigation = async (url: string) => {
    try {
      await axios.get(url);
      router.push(url);
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className={`menu ${isCollapsed ? 'collapsed' : ''}`}>
      <Link href="/" className="logo">
        <img src="/Reset-Logo.svg" alt="Company Logo" className="w-16 h-16 mx-auto" />
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
                  <a onClick={() => handleNavigation('/tasks')}>
                    <FontAwesomeIcon icon={faTasks} />
                    {!isCollapsed && ' Go to Task Board'}
                  </a>
                </li>
              </ul>
            )}
            {isCollapsed && (
              <div className="submenu">
                <ul>
                  <li>
                    <a onClick={() => handleNavigation('/tasks')}>
                      <FontAwesomeIcon icon={faTasks} />
                      {' Go to Task Board'}
                    </a>
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
                  <a onClick={() => handleNavigation('/user-management')}>
                    <FontAwesomeIcon icon={faCog} />
                    {!isCollapsed && ' User Management'}
                  </a>
                </li>
                <li>
                  <a onClick={() => handleNavigation('/projects')}>
                    <FontAwesomeIcon icon={faCog} />
                    {!isCollapsed && ' Projects'}
                  </a>
                </li>
                {projects.map((project) => (
                  <li key={project.id} onClick={() => handleProjectClick(project.id)}>
                    {project.name}
                  </li>
                ))}
              </ul>
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