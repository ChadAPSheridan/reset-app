import React, { useState, useEffect } from 'react';
import CustomDropdown from './CustomDropdown';

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
    console.log('New task column in useEffect:', newTaskColumnId); // Debugging log
  }, [selectedColumnId]);

  const handleColumnChange = (value: string) => {
    console.log('Value:', value); // Debugging log
    setNewTaskColumnId(value);
    console.log('New task column:', newTaskColumnId); // Debugging log
    setSelectedColumnId(value);
    console.log('Selected column:', selectedColumnId); // Debugging log
  };

  if (!isOpen) return null;

  return (
    <div className="dialog">
      <div className="dialog-content">
        <h2>{title}</h2>
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
        <div className="dialog-actions">
          <button onClick={onSubmit}>{submitLabel}</button>
          <button onClick={onCancel}>{cancelLabel}</button>
        </div>
      </div>
    </div>
  );
};

export default TaskDialog;
