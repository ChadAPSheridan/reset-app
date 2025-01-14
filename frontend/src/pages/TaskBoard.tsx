import React, { useState, useEffect } from 'react';
import './TaskBoard.css';
import { getTasks, createTask, updateTask, deleteTask } from '../services/apiService';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  row: number;
}

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState<'todo' | 'in-progress' | 'done'>('todo');
  const [hoveredTaskId, setHoveredTaskId] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: number) => {
    e.dataTransfer.setData('taskId', taskId.toString());
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, status: 'todo' | 'in-progress' | 'done') => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    const task = tasks.find(task => task.id === taskId);
    if (task) {
      const targetRow = tasks.filter(t => t.status === status).length;
      try {
        // Update rows of tasks in the target column that would be displaced
        const displacedTasks = tasks
          .filter(t => t.status === status && t.row >= targetRow)
          .map(t => ({ ...t, row: t.row + 1 }));

        // Update the task's status and row
        await updateTask(taskId, { status, row: targetRow });

        // Update the state
        setTasks(prevTasks => {
          const updatedTasks = prevTasks
            .filter(t => t.id !== taskId)
            .map(t => {
              if (t.status === status && t.row >= targetRow) {
                return { ...t, row: t.row + 1 };
              }
              return t;
            });
          return [...updatedTasks, { ...task, status, row: targetRow }];
        });
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleAddTask = async () => {
    const newTask = {
      title: newTaskTitle,
      description: newTaskDescription,
      status: newTaskStatus,
      row: tasks.filter(task => task.status === newTaskStatus).length // First available row in the selected status
    };
    try {
      const response = await createTask(newTask);
      console.log('Created task:', response.data); // Log the created task
      setTasks([...tasks, response.data]);
      setNewTaskTitle('');
      setNewTaskDescription('');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleDoubleClick = async (taskId: number) => {
    const newTitle = prompt('Enter new task title:');
    if (newTitle) {
      try {
        await updateTask(taskId, { title: newTitle });
        setTasks(tasks.map(task => task.id === taskId ? { ...task, title: newTitle } : task));
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  const renderTasks = (status: 'todo' | 'in-progress' | 'done') => {
    return tasks
      .filter(task => task.status === status)
      .sort((a, b) => a.row - b.row)
      .map(task => (
        <div
          key={task.id}
          className="task"
          draggable
          onDragStart={(e) => handleDragStart(e, task.id)}
          onDragEnd={handleDragEnd}
          onDoubleClick={() => handleDoubleClick(task.id)}
          onMouseEnter={() => setHoveredTaskId(task.id)}
          onMouseLeave={() => setHoveredTaskId(null)}
        >
          {task.title}
          {hoveredTaskId === task.id && !isDragging && (
            <div className="task-card">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
            </div>
          )}
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
        <input
          type="text"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          placeholder="Task description"
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