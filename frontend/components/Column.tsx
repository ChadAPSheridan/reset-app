import React from 'react';
import { Column, Task, User } from '../types';
import TaskComponent from './Task';
import Button from './Button';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface ColumnProps {
  column: Column;
  tasks: Task[];
  users: User[];
  expandedTaskId: number | null;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, id: number, type: 'task' | 'column') => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, columnId: number, targetRow?: number) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDoubleClick: (task: Task) => void;
  toggleTaskExpansion: (taskId: number) => void;
  setColumnToDelete: (columnId: number) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
}

const ColumnComponent: React.FC<ColumnProps> = ({
  column,
  tasks,
  users,
  expandedTaskId,
  handleDragStart,
  handleDrop,
  handleDragOver,
  handleDoubleClick,
  toggleTaskExpansion,
  setColumnToDelete,
  setIsDeleteDialogOpen,
}) => {
  const renderTasks = () => {
    return tasks
      .filter(task => task.ColumnId === column.id)
      .sort((a, b) => a.row - b.row)
      .map(task => (
        <TaskComponent
          key={task.id}
          task={task}
          users={users}
          expandedTaskId={expandedTaskId}
          handleDragStart={handleDragStart}
          handleDrop={handleDrop}
          handleDragOver={handleDragOver}
          handleDoubleClick={handleDoubleClick}
          toggleTaskExpansion={toggleTaskExpansion}
        />
      ));
  };

  return (
    <div
      key={column.id}
      className={`column ${column.title === 'Fresh Start' ? 'fresh-start' : ''}`}
      draggable
      onDragStart={(e) => handleDragStart(e, column.id, 'column')}
      onDrop={(e) => handleDrop(e, column.id)}
      onDragOver={handleDragOver}
      data-column-id={column.id}
    >
      <div className="column-header">
        <h2>{column.title}</h2>
        <Button onClick={() => { setColumnToDelete(column.id); setIsDeleteDialogOpen(true); }} icon={faTrash} className="delete-btn">
        </Button>
      </div>
      {renderTasks()}
    </div>
  );
};

export default ColumnComponent;
