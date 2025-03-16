import React, { useState, useEffect } from 'react';
import CustomDropdown from './CustomDropdown';
import Dialog from './Dialog';

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
}) => {
  const [newTaskColumnId, setNewTaskColumnId] = useState<string>(selectedColumnId);

  useEffect(() => {
    setNewTaskColumnId(selectedColumnId);
  }, [selectedColumnId]);

  const handleColumnChange = (value: string) => {
    setNewTaskColumnId(value);
    setSelectedColumnId(value);
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
    </Dialog>
  );
};

export default TaskDialog;
