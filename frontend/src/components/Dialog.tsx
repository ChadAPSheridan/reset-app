import React from 'react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  submitLabel?: string;
  onSubmit?: () => void;
  cancelLabel?: string;
  onCancel?: () => void;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, children, submitLabel, onSubmit, cancelLabel, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <h2>{title}</h2>
        <button onClick={onClose} className="close-btn">x</button>
        {children}
        <div className="dialog-actions">
          {submitLabel && onSubmit && (
            <button onClick={onSubmit} className="dialog-submit-btn">
              {submitLabel}
            </button>
          )}
          {cancelLabel && onCancel && (
            <button onClick={onCancel} className="dialog-cancel-btn">
              {cancelLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dialog;