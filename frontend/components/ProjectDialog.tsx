import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Dialog from './Dialog';
import Button from './Button';
import { getProjects, createProject, updateProject, deleteProject, getUsers } from '../services/apiService';
import axiosInstance from '../axiosSetup'; // Import the Axios instance
import { faPlus, faTrash, faSync } from '@fortawesome/free-solid-svg-icons';
import ProjectUserManagementDialog from './ProjectUserManagementDialog'; // Import the new dialog

interface ProjectsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    submitLabel: string;
    onSubmit: () => void;
    cancelLabel: string;
    onCancel: () => void;
    projectName: string;
    setProjectName: (name: string) => void;
    projectDescription: string;
    setProjectDescription: (description: string) => void;
    selectedProject: { id: string; name: string; owner: string } | null;
    setSelectedProject: (project: { id: string; name: string; owner: string } | null) => void;
}

const ProjectsDialog: React.FC<ProjectsDialogProps> = ({
    isOpen,
    onClose,
    title,
    submitLabel,
    onSubmit,
    cancelLabel,
    onCancel,
    projectName,
    setProjectName,
    projectDescription,
    setProjectDescription,
    selectedProject,
    setSelectedProject,
}) => {
    const router = useRouter();
    const [projects, setProjects] = useState<{ id: string; name: string; owner: string }[]>([]);
    const [users, setUsers] = useState<{ id: string; firstName: string; lastName: string }[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [isUserManagementDialogOpen, setIsUserManagementDialogOpen] = useState(false); // State for user management dialog
    const [newProjectId, setNewProjectId] = useState<string | null>(null); // State for new project ID

    useEffect(() => {
        getProjects().then((response) => {
            console.log(response.data);
            setProjects(response.data);
        });

        getUsers().then((response) => {
            console.log(response.data);
            setUsers(response.data);
        });
    }, []);

    const handleUserSelection = (userId: string) => {
        setSelectedUsers((prevSelectedUsers) =>
            prevSelectedUsers.includes(userId)
                ? prevSelectedUsers.filter((id) => id !== userId)
                : [...prevSelectedUsers, userId]
        );
    };

    const handleCreateProject = () => {
        createProject({ name: projectName, description: projectDescription }).then((response) => {
            setProjects([...projects, response.data]);
            setProjectName('');
            setProjectDescription(''); // Clear description after creating project
            setNewProjectId(response.data.id); // Set new project ID
            setTimeout(() => setIsUserManagementDialogOpen(true), 0); // Open user management dialog
            onClose(); // Close dialog after creating project

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
                onClose();
            });
        }
    };

    const handleDeleteProject = () => {
        if (selectedProject) {
            deleteProject(selectedProject.id).then(() => {
                const updatedProjects = projects.filter((project) => project.id !== selectedProject.id);
                setProjects(updatedProjects);
                setSelectedProject(null);
                onClose();
            });
        }
    };

    useEffect(() => {
        if (title === 'Create Project') {
            setProjectName('');
            setProjectDescription('');
        }
    }, [title]);

    return (
        <>
            <Dialog 
                isOpen={isOpen} 
                onClose={onClose} 
                title={title}
                submitLabel={submitLabel}
                onSubmit={onSubmit}
                cancelLabel={cancelLabel}
                onCancel={onCancel}
            >
                <div>
                    <label>Project Name</label>
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                    />
                    <textarea
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        placeholder="Project Description"
                    ></textarea>
                    {selectedProject && title !== 'Create Project' && (
                        <Button onClick={() => setIsUserManagementDialogOpen(true)}>
                            Manage Users
                        </Button>
                    )}
                </div>
            </Dialog>

            {isUserManagementDialogOpen && newProjectId && (
                <ProjectUserManagementDialog
                    isOpen={isUserManagementDialogOpen}
                    onClose={() => setIsUserManagementDialogOpen(false)}
                    projectId={newProjectId}
                />
            )}

            {selectedProject && (
                <ProjectUserManagementDialog
                    isOpen={isUserManagementDialogOpen}
                    onClose={() => setIsUserManagementDialogOpen(false)}
                    projectId={selectedProject.id}
                />
            )}
        </>
    );
};

export default ProjectsDialog;
