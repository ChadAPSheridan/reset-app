import '../axiosSetup'; // Import the Axios setup
import React, { useEffect, useState, createContext, useContext } from 'react';
import { useRouter } from 'next/router';
import { User, Project } from '../types'; // Import the User type
import Dialog from '../components/Dialog';
import ProjectDialog from '../components/ProjectDialog'; // Import the ProjectDialog component
import Button from '../components/Button';
import { getUsers, getProjects, createProject, updateProject, deleteProject } from '../services/apiService';
import axiosInstance from '../axiosSetup'; // Import the Axios instance
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ProjectComponent from '../components/Project';

// Create a context for the current user's ID
const CurrentUserIdContext = createContext<string | null>(null);

const ProjectsPage = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]); // Update the type to User[]
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState(''); // New state for project description
  const [selectedProject, setSelectedProject] = useState<Project | null>(null); // Update type to include description
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false); // New state for project dialog
  const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false); // New state for project
  const [currentUserId, setCurrentUserId] = useState<string | null>(null); // State for current user's ID

  useEffect(() => {
    getProjects().then((response) => {
      console.log(response.data);
      setProjects(response.data);
    });

    getUsers().then((response) => {
      console.log(response.data);
      setUsers(response.data.map((user: any) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        permissionLevel: user.permissionLevel as "user" | "admin"
      })));
    });

    // Fetch the current user's ID
    axiosInstance.get('/api/auth/me').then((response) => {
      setCurrentUserId(response.data.id);
    });
  }, []);

  const handleCreateProject = () => {
    createProject({ name: projectName, description: projectDescription, owner: currentUserId }).then((response) => {
      setProjects([...projects, response.data]);
      setProjectName('');
      setProjectDescription(''); // Clear description after creating project
      setIsProjectDialogOpen(false); // Close dialog after creating project
    });
  };

  const handleUpdateProject = () => {
    if (selectedProject) {
      updateProject(selectedProject.id, { name: projectName, description: projectDescription }).then(() => {
        const updatedProjects = projects.map((project) => {
          if (project.id === selectedProject.id) {
            return { ...project, name: projectName, description: projectDescription };
          }
          return project;
        });
        setProjects(updatedProjects);
        setProjectName('');
        setProjectDescription(''); // Clear description after updating project
        setSelectedProject(null);
        setIsEditProjectDialogOpen(false); // Close dialog after updating project
      });
    }
  };

  const handleDeleteProject = () => {
    if (selectedProject) {
      deleteProject(selectedProject.id).then(() => {
        const updatedProjects = projects.filter((project) => project.id !== selectedProject.id);
        setProjects(updatedProjects);
        setSelectedProject(null);
        setShowDeleteDialog(false); // Close dialog after deleting project
      });
    }
  };

  const handleDeleteDialogClose = () => {
    setShowDeleteDialog(false);
  };

  const handleCreateProjectClick = () => {
    setProjectName('');
    setProjectDescription('');
    setIsProjectDialogOpen(true);
  };

  return (
    <CurrentUserIdContext.Provider value={currentUserId}>
      <div className="board-content">
        <div className="board-header">
          <div className="breadcrumb-title">
            Projects
          </div>
          <div className="board-header-buttons">
            <Button onClick={handleCreateProjectClick} icon={faPlus}>
              Create Project
            </Button>
          </div>
        </div>
        <ul className="project-cards">
          {projects.map((project) => (
            <ProjectComponent
              key={project.id}
              project={project}
              users={users}
              setProjectToDelete={(projectId: string) => {
                const project = projects.find(p => p.id === projectId);
                if (project) setSelectedProject(project);
              }}
              setIsDeleteDialogOpen={setShowDeleteDialog}
              onEditClick={() => {
                setSelectedProject(project);
                setProjectName(project.name);
                setProjectDescription(project.description || ''); // Set description when edit is clicked
                setIsEditProjectDialogOpen(true);
              }}
            />
          ))}
        </ul>

        <Dialog
          isOpen={showDeleteDialog}
          title="Delete Project"
          submitLabel="Delete"
          cancelLabel="Cancel"
          onClose={handleDeleteDialogClose}
          onSubmit={handleDeleteProject}
        >
          <p>Are you sure you want to delete this task?</p>
        </Dialog>

        <ProjectDialog
          isOpen={isProjectDialogOpen} // Use the new state for project dialog
          onClose={() => setIsProjectDialogOpen(false)}
          title="Create Project"
          submitLabel="Create"
          onSubmit={handleCreateProject}
          cancelLabel="Cancel"
          onCancel={() => setIsProjectDialogOpen(false)}
          projectName={projectName}
          setProjectName={setProjectName}
          projectDescription={projectDescription} // Pass description to dialog
          setProjectDescription={setProjectDescription} // Pass setDescription to dialog
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
        />

        <ProjectDialog
          isOpen={isEditProjectDialogOpen} // Use the new state for project dialog
          onClose={() => setIsEditProjectDialogOpen(false)}
          title="Edit Project"
          submitLabel="Update"
          onSubmit={handleUpdateProject}
          cancelLabel="Cancel"
          onCancel={() => setIsEditProjectDialogOpen(false)}
          projectName={projectName}
          setProjectName={setProjectName}
          projectDescription={projectDescription} // Pass description to dialog
          setProjectDescription={setProjectDescription} // Pass setDescription to dialog
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
        />
      </div>
    </CurrentUserIdContext.Provider>
  );
};

export default ProjectsPage;