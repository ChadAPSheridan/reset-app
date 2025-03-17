import React from 'react';
import { Project, User } from '../types';
import Button from './Button';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

interface ProjectProps {
  project: Project;
  users: User[];
  setProjectToDelete: (projectId: string) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  onEditClick: () => void; // New prop for handling edit click
}

const ProjectComponent: React.FC<ProjectProps> = ({
  project,
  users,
  setProjectToDelete,
  setIsDeleteDialogOpen,
  onEditClick, // Destructure the new prop
}) => {
  const renderOwner = () => {
    return users
      .filter(user => user.id === project.owner)
      .map(user => `${user.firstName} ${user.lastName}`);
  };

  return (
    <div className="project-card">
      <div className="project-header">
        <h3>{project.name}</h3>
        <Button
          className='delete-btn'
          icon={faTrash}
          onClick={() => {
            setProjectToDelete(project.id);
            setIsDeleteDialogOpen(true);
          }}
        />
      </div>
      <div className="project-info">
        <p>Owner: {renderOwner()}</p>
        <p>{project.description}</p>
      </div>
      <div className="project-actions">
        <Button
          icon={faEdit}
          onClick={onEditClick} // Handle edit click
        >
          Edit
        </Button>
      </div>
    </div>
  );
}

export default ProjectComponent;
