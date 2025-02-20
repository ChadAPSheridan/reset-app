import React from 'react';
import { Task, User } from '../types';

interface TaskProps {
  task: Task;
  users: User[];
  expandedTaskId: number | null;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, id: number, type: 'task' | 'column') => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, ColumnId: number, targetRow?: number) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDoubleClick: (task: Task) => void;
  toggleTaskExpansion: (taskId: number) => void;
}

const TaskComponent: React.FC<TaskProps> = ({
  task,
  users,
  expandedTaskId,
  handleDragStart,
  handleDrop,
  handleDragOver,
  handleDoubleClick,
  toggleTaskExpansion,
}) => {
  const assignedUser = users.find(user => user.id === task.userId);
  const userInitials = assignedUser ? `${assignedUser.firstName.charAt(0)}${assignedUser.lastName.charAt(0)}`.toUpperCase() : '';
  const userFullName = assignedUser ? `${assignedUser.firstName} ${assignedUser.lastName}` : 'Unassigned';

  return (
    <div
      key={task.id}
      className={`task ${expandedTaskId === task.id ? 'expanded' : ''}`}
      draggable
      onDragStart={(e) => handleDragStart(e, task.id, 'task')}
      onDrop={(e) => handleDrop(e, task.ColumnId, task.row)}
      onDragOver={handleDragOver}
      onDoubleClick={() => handleDoubleClick(task)}
      onClick={() => toggleTaskExpansion(task.id)}
    >
      <div className="task-header">
        <h3>{task.title}</h3>
        {assignedUser && (
          <div className="user-icon" title={userFullName}>
            {userInitials}
          </div>
        )}
      </div>
      {expandedTaskId === task.id && (
        <div className="description">
          <p>Description: {task.description}</p>
        </div>
      )}
    </div>
  );
};

export default TaskComponent;
