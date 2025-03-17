import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Dialog from './Dialog';
import Button from './Button';
import { getProjects, createProject, updateProject, deleteProject } from '../services/apiService';
import axiosInstance from '../axiosSetup'; // Import the Axios instance
import { faPlus, faTrash, faSync } from '@fortawesome/free-solid-svg-icons';

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

    useEffect(() => {
        getProjects().then((response) => {
            console.log(response.data);
            setProjects(response.data);
        });
    }, []);

    const handleCreateProject = () => {
        createProject({ name: projectName }).then((response) => {
            setProjects([...projects, response.data]);
            setProjectName('');
            onClose(); // Close dialog after creating project
        });
    };

    const handleUpdateProject = () => {
        if (selectedProject) {
            updateProject(selectedProject.id, { name: projectName }).then(() => {
                const updatedProjects = projects.map((project) => {
                    if (project.id === selectedProject.id) {
                        return { ...project, name: projectName };
                    }
                    return project;
                });
                setProjects(updatedProjects);
                setProjectName('');
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

    return (
        <Dialog 
            isOpen={isOpen} 
            onClose={onClose} 
            title={title}
            submitLabel={submitLabel}
            onSubmit={onSubmit}
            cancelLabel={cancelLabel}
            onCancel={onCancel}
            >
            <div >
                <label >Project Name</label>
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
            </div>
            
        </Dialog>
    );
};

export default ProjectsDialog;
