import React, { useState, useEffect, useRef } from 'react';
import CustomDropdown from './CustomDropdown';
import Dialog from './Dialog';
import Button from './Button';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  submitLabel: string;
  onSubmit: () => void;
  cancelLabel: string;
  onCancel: () => void;
  taskTitle: string;
  setTaskTitle: (title: string) => void;
  taskDescription: string;
  setTaskDescription: (description: string) => void;
  columns: { value: string; label: string }[];
  selectedColumnId: string;
  setSelectedColumnId: (value: string) => void;
  users: { id: string; firstName: string; lastName: string }[];
  editTaskUserId: string;
  setEditTaskUserId: (value: string) => void;
  currentUser?: any;
  openDeleteTaskDialog?: () => void;
}

const TaskDialog: React.FC<TaskDialogProps> = ({
  isOpen,
  onClose,
  title,
  submitLabel,
  onSubmit,
  cancelLabel,
  onCancel,
  taskTitle,
  setTaskTitle,
  taskDescription,
  setTaskDescription,
  columns,
  selectedColumnId,
  setSelectedColumnId,
  users,
  editTaskUserId,
  setEditTaskUserId,
  currentUser,
  openDeleteTaskDialog,
}) => {
  const [newTaskColumnId, setNewTaskColumnId] = useState<string>(selectedColumnId);
  const initialAssignedUserRef = useRef<{ firstName: string; lastName: string }>({ firstName: 'Unassigned', lastName: '' });

  useEffect(() => {
    setNewTaskColumnId(selectedColumnId);
  }, [selectedColumnId]);

  useEffect(() => {
    if (isOpen) {
      const assignedUser = users.find(user => user.id === editTaskUserId) || { firstName: 'Unassigned', lastName: '' };
      initialAssignedUserRef.current = assignedUser;
    }
  }, [isOpen, editTaskUserId, users]);

  const handleColumnChange = (value: string) => {
    setNewTaskColumnId(value);
    setSelectedColumnId(value);
  };

  const assignedUser = users.find(user => user.id === editTaskUserId) || { id: null, firstName: 'Unassigned', lastName: '' };

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
      <input
        type="text"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        placeholder="Task title"
      />
      <textarea
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
        placeholder="Task description"
        rows={3}
      />
      <CustomDropdown
        options={columns}
        value={newTaskColumnId}
        onChange={handleColumnChange}
      />
      {users && setEditTaskUserId && (
        <>
          <div className='task-assignment'>
            <div className='assigned-to'>
              <p>Assigned to: </p>
              <p>{`${initialAssignedUserRef.current.firstName} ${initialAssignedUserRef.current.lastName}`}</p>
            </div>
            {currentUser?.permissionLevel === 'user' && assignedUser.id !== currentUser.id && (
              <Button
                onClick={() => {
                  setEditTaskUserId(currentUser.id);
                }}
                className="assign-btn"
              >
                Assign To Me
              </Button>
            )}
            {currentUser?.permissionLevel === 'admin' && (
              <CustomDropdown
                options={users.map(user => ({ value: user.id, label: `${user.firstName} ${user.lastName}` }))}
                value={editTaskUserId}
                onChange={(value) => setEditTaskUserId(value)}
              />
            )}
          </div>
        </>
      )}
      {openDeleteTaskDialog && (
        <Button onClick={() => openDeleteTaskDialog()} icon={faTrash} className="delete-btn dialog-delete-btn">
          Delete Task
        </Button>
      )}
    </Dialog>
  );
};

export default TaskDialog;
