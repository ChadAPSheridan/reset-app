import React, { useState } from 'react';
import './TaskBoard.css';

interface Task {
  id: number;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
}

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Task 1', status: 'todo' },
    { id: 2, title: 'Task 2', status: 'in-progress' },
    { id: 3, title: 'Task 3', status: 'done' },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState<'todo' | 'in-progress' | 'done'>('todo');

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: number) => {
    e.dataTransfer.setData('taskId', taskId.toString());
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: 'todo' | 'in-progress' | 'done') => {
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    setTasks(tasks.map(task => task.id === taskId ? { ...task, status } : task));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleAddTask = () => {
    const newTask: Task = {
      id: tasks.length + 1,
      title: newTaskTitle,
      status: newTaskStatus,
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const handleDoubleClick = (taskId: number) => {
    const newTitle = prompt('Enter new task title:');
    if (newTitle) {
      setTasks(tasks.map(task => task.id === taskId ? { ...task, title: newTitle } : task));
    }
  };

  const renderTasks = (status: 'todo' | 'in-progress' | 'done') => {
    return tasks
      .filter(task => task.status === status)
      .map(task => (
        <div
          key={task.id}
          className="task"
          draggable
          onDragStart={(e) => handleDragStart(e, task.id)}
          onDoubleClick={() => handleDoubleClick(task.id)}
        >
          {task.title}
        </div>
      ));
  };

  return (
    <div className="task-board">
      <div className="task-form">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="New task title"
        />
        <select
          value={newTaskStatus}
          onChange={(e) => setNewTaskStatus(e.target.value as 'todo' | 'in-progress' | 'done')}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <div className='task-columns'>
        <div className="column" onDrop={(e) => handleDrop(e, 'todo')} onDragOver={handleDragOver}>
          <h2>To Do</h2>
          {renderTasks('todo')}
        </div>
        <div className="column" onDrop={(e) => handleDrop(e, 'in-progress')} onDragOver={handleDragOver}>
          <h2>In Progress</h2>
          {renderTasks('in-progress')}
        </div>
        <div className="column" onDrop={(e) => handleDrop(e, 'done')} onDragOver={handleDragOver}>
          <h2>Done</h2>
          {renderTasks('done')}
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;