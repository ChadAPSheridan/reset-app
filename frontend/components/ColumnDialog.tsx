import React from 'react';
import Dialog from './Dialog';

interface ColumnDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  submitLabel: string;
  onSubmit: () => void;
  cancelLabel: string;
  onCancel: () => void;
  columnTitle: string;
  setColumnTitle: (title: string) => void;
  columnDescription: string;
  setColumnDescription: (description: string) => void;
}

const ColumnDialog: React.FC<ColumnDialogProps> = ({
  isOpen,
  onClose,
  title,
  submitLabel,
  onSubmit,
  cancelLabel,
  onCancel,
  columnTitle,
  setColumnTitle,
  columnDescription,
  setColumnDescription,
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
        value={columnTitle}
        onChange={(e) => setColumnTitle(e.target.value)}
        placeholder="New column title"
      />
      <textarea
        value={columnDescription}
        onChange={(e) => setColumnDescription(e.target.value)}
        placeholder="New column description"
        rows={3}
        className="description-textarea"
      />
    </Dialog>
  );
};

export default ColumnDialog;
