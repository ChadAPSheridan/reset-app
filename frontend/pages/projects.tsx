import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Button from '../components/Button';


const ProjectsPage = () => {
  interface Project {
    id: string;
    name: string;
  // const router = useRouter();
  }

  const [projects, setProjects] = useState<Project[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('auth');
        const response = await axios.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsAdmin(response.data.permissionLevel === 'admin');
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchUser();
    fetchProjects();
  }, []);

  if (!isAdmin) {
    return <p>Access denied</p>;
  }
  const handleCreateProject = async () => {
    try {
      const projectName = prompt('Enter project name:');
      const projectDescription = prompt('Enter project description:');
      const token = localStorage.getItem('auth');
      if (projectName && projectDescription) {
        const response = await axios.post('/api/projects', { name: projectName, description: projectDescription }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Project created:', response.data);
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await axios.delete(`/api/projects/${projectId}`);
      setProjects(projects.filter((project) => project.id !== projectId));
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleAssignUser = async (projectId: string, userId: string) => {
    try {
      await axios.post(`/api/projects/${projectId}/users`, { userId });
      alert('User assigned to project successfully');
    } catch (error) {
      console.error('Failed to assign user to project:', error);
    }
  };

  return (
    <div>
      <h1>Projects</h1>
      <Button onClick={handleCreateProject}>Create Project</Button>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            {project.name}
            <Button onClick={() => handleDeleteProject(project.id)}>Delete</Button>
            <Button onClick={() => handleAssignUser(project.id, 'userId')}>Assign User</Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsPage;