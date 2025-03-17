import React, { useState, useEffect } from 'react';
import Dialog from './Dialog';
import Button from './Button';
import { getUsers, updateProjectUsers, getProject } from '../services/apiService';

interface ProjectUserManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

const ProjectUserManagementDialog: React.FC<ProjectUserManagementDialogProps> = ({
  isOpen,
  onClose,
  projectId,
}) => {
  const [users, setUsers] = useState<{ id: string; firstName: string; lastName: string }[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    getUsers().then((response) => {
      console.log(response.data);
      setUsers(response.data);
    });

    getProject(projectId).then((response) => {
      console.log(response.data);
      const assignedUsers = response.data.map((user: any) => user.UserId);
      setSelectedUsers(assignedUsers);
    });
  }, [projectId]);

  const handleUserSelection = (userId: string) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  const handleUpdateUsers = () => {
    updateProjectUsers(projectId, selectedUsers).then(() => {
      console.log(`Project ${projectId} users updated`);
      onClose();
    });
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Project Users"
      submitLabel="Update"
      onSubmit={handleUpdateUsers}
      cancelLabel="Cancel"
      onCancel={onClose}
    >
      <div>
        <label>Assign/Remove Users</label>
        <div>
          {users.map((user) => (
            <div key={user.id} className="user-toggle">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleUserSelection(user.id)}
                />
                <span className="slider round"></span>
              </label>
              <span className="user-name">
                {user.firstName} {user.lastName}
              </span>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        
      `}</style>
    </Dialog>
  );
};

export default ProjectUserManagementDialog;
