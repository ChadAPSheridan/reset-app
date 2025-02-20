import React from 'react';
import Dialog from './Dialog';
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
  setSelectedColumnId: (ColumnId: string) => void;
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
        className="description-textarea"
      />
      <CustomDropdown
        options={columns}
        value={selectedColumnId}
        onChange={(value) => setSelectedColumnId(value)}
      />
    </Dialog>
  );
};

export default TaskDialog;
