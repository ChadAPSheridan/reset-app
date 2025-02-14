import '../axiosSetup'; // Import the Axios setup
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Dialog from '../components/Dialog';
import Button from '../components/Button';
import { getUsers } from '../services/apiService';
import axiosInstance from '../axiosSetup'; // Import the Axios instance


const ProjectsPage = () => {
  interface Project {
    id: string;
    name: string;
    description: string;
    users: string[];
  }

  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectUsers, setNewProjectUsers] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const authUserString = localStorage.getItem('authUser');
      if (authUserString) {
        const authUser = JSON.parse(authUserString);
        try {
          const response = await axiosInstance.get('/api/auth/me');
          setIsAdmin(response.data.permissionLevel === 'admin');
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      } else {
        console.error('No authUser found in localStorage');
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get('/api/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUser();
    fetchProjects();
    fetchUsers();
  }, []);

  if (!isAdmin) {
    return <p>Access denied</p>;
  }

  const handleCreateProject = async () => {
    try {
      if (newProjectTitle && newProjectDescription) {
        const response = await axiosInstance.post('/api/projects', {
          name: newProjectTitle,
          description: newProjectDescription,
          users: newProjectUsers,
        });
        console.log('Project created:', response.data);
        setProjects([...projects, response.data]);
        setIsProjectDialogOpen(false);
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await axiosInstance.delete(`/api/projects/${projectId}`);
      setProjects(projects.filter((project) => project.id !== projectId));
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleAssignUser = async (projectId: string, userId: string) => {
    try {
      await axiosInstance.post(`/api/projects/${projectId}/users`, { userId });
      alert('User assigned to project successfully');
    } catch (error) {
      console.error('Failed to assign user to project:', error);
    }
  };
  
  const handleRemoveUser = async (projectId: string, userId: string) => {
    try {
      await axiosInstance.delete(`/api/projects/${projectId}/users/${userId}`);
      alert('User removed from project successfully');
    } catch (error) {
      console.error('Failed to remove user from project:', error);
    }
  };

  const handleUserCheckboxChange = (userId: string) => {
    setNewProjectUsers(prevUsers =>
      prevUsers.includes(userId)
        ? prevUsers.filter(id => id !== userId)
        : [...prevUsers, userId]
    );
  };

  return (
    <div className="board-content">
      <div className="board-header">
        <div className="breadcrumb-title">Projects</div>
        <div className="board-header-buttons">
          <Button onClick={() => setIsProjectDialogOpen(true)}>Create Project</Button>
        </div>
      </div>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            {project.name}
            <Button onClick={() => handleDeleteProject(project.id)}>Delete</Button>
            <Button onClick={() => handleAssignUser(project.id, 'userId')}>Assign User</Button>
          </li>
        ))}
      </ul>

      <Dialog
        isOpen={isProjectDialogOpen}
        onClose={() => setIsProjectDialogOpen(false)}
        title="Add New Project"
        submitLabel="Add Project"
        onSubmit={handleCreateProject}
        cancelLabel="Cancel"
        onCancel={() => setIsProjectDialogOpen(false)}
      >
        <input
          type="text"
          value={newProjectTitle}
          onChange={(e) => setNewProjectTitle(e.target.value)}
          placeholder="New Project Title"
        />
        <textarea
          value={newProjectDescription}
          onChange={(e) => setNewProjectDescription(e.target.value)}
          placeholder="New Project Description"
          rows={3}
          className="description-textarea"
        />
        <div>
          <h3>Assign Users</h3>
          {users.map(user => (
            <div className="user-select" key={user.id}>
              <input
                type="checkbox"
                checked={newProjectUsers.includes(user.id)}
                onChange={() => handleUserCheckboxChange(user.id)}
              />
              <label>{user.firstName} {user.lastName} ({user.permissionLevel})</label>
            </div>
          ))}
        </div>
      </Dialog>
    </div>
  );
};

export default ProjectsPage;