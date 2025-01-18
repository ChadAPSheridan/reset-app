import React, { useState, useEffect } from 'react';
import './TaskBoard.css';
import { getTasks, createTask, updateTask, getColumns, createColumn, updateColumn } from '../services/apiService';
import { Column } from '../types'; // Import Column type

interface Task {
  id: number;
  title: string;
  description: string;
  columnId: number;
}

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<Column[]>([]); // Use Column type
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskColumnId, setNewTaskColumnId] = useState<number>(1);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [draggedColumnId, setDraggedColumnId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const tasksData = await getTasks();
      setTasks(tasksData.data);
      const columnsData = await getColumns();
      setColumns(columnsData.data);
    };
    fetchData();
  }, []);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number, type: 'task' | 'column') => {
    e.stopPropagation(); // Prevent event from propagating to the column
    e.dataTransfer.setData('id', id.toString());
    e.dataTransfer.setData('type', type);
    console.log(`Drag started for ${type} ID:`, id); // Debug log
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, columnId: number) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Prevent event from propagating to the column
    const id = parseInt(e.dataTransfer.getData('id'));
    const type = e.dataTransfer.getData('type');

    if (type === 'task') {
      const task = tasks.find(task => task.id === id);
      console.log('Task ID:', id); // Debug log
      console.log('Task:', task); // Debug log
      console.log('Task.columnId:', task?.columnId); // Debug log
      console.log('Column ID:', columnId); // Debug log

      if (task && task.columnId !== columnId) {
        await updateTask(id, { columnId });
        setTasks(tasks.map(task => task.id === id ? { ...task, columnId } : task));
        console.log('Task updated:', id, 'to column:', columnId); // Debug log
      }
    } else if (type === 'column') {
      const draggedColumn = columns.find(col => col.id === id);
      const targetColumn = columns.find(col => col.id === columnId);

      console.log('Dragged Column ID:', id); // Debug log
      console.log('Target Column ID:', columnId); // Debug log

      if (draggedColumn && targetColumn) {
        const updatedColumns = columns.map(col => {
          if (col.id === draggedColumn.id) {
            return { ...col, position: targetColumn.position };
          } else if (col.position >= targetColumn.position && col.position < draggedColumn.position) {
            return { ...col, position: col.position + 1 };
          } else if (col.position <= targetColumn.position && col.position > draggedColumn.position) {
            return { ...col, position: col.position - 1 };
          }
          return col;
        });

        setColumns(updatedColumns);

        console.log('Updating column:', draggedColumn.id, { position: targetColumn.position }); // Debug log
        await updateColumn(draggedColumn.id, { position: targetColumn.position });

        // Update positions of other columns in the backend
        for (const col of updatedColumns) {
          if (col.id !== draggedColumn.id) {
            console.log('Updating other column:', col.id, { position: col.position }); // Debug log
            await updateColumn(col.id, { position: col.position });
          }
        }
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log('Drag over column ID:', e.currentTarget.dataset.columnId); // Debug log
  };

  const handleAddTask = async () => {
    const newTask = await createTask({ title: newTaskTitle, description: newTaskDescription, columnId: newTaskColumnId });
    setTasks([...tasks, newTask.data]);
    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  const handleAddColumn = async () => {
    const newColumn = await createColumn({ title: newColumnTitle, position: columns.length });
    setColumns([...columns, newColumn.data]);
    setNewColumnTitle('');
  };

  const handleDoubleClick = (taskId: number) => {
    const newTitle = prompt('Enter new task title:');
    if (newTitle) {
      setTasks(tasks.map(task => task.id === taskId ? { ...task, title: newTitle } : task));
    }
  };

  const renderTasks = (columnId: number) => {
    return tasks
      .filter(task => task.columnId === columnId)
      .map(task => (
        <div
          key={task.id}
          className="task"
          draggable
          onDragStart={(e) => handleDragStart(e, task.id, 'task')}
          onDoubleClick={() => handleDoubleClick(task.id)}
        >
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </div>
      ));
  };

  const renderColumns = () => {
    // Sort columns by position
    const sortedColumns = [...columns].sort((a, b) => a.position - b.position);

    return sortedColumns.map(column => (
      <div
        key={column.id}
        className="column"
        draggable
        onDragStart={(e) => handleDragStart(e, column.id, 'column')}
        onDrop={(e) => handleDrop(e, column.id)}
        onDragOver={handleDragOver}
        data-column-id={column.id} // Add data attribute for debugging
      >
        <h2>{column.title}</h2>
        {renderTasks(column.id)}
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
          placeholder="New task description"
        />
        <select
          value={newTaskColumnId}
          onChange={(e) => setNewTaskColumnId(parseInt(e.target.value))}
        >
          {columns.map(column => (
            <option key={column.id} value={column.id}>
              {column.title}
            </option>
          ))}
        </select>
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <div className="column-form">
        <input
          type="text"
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
          placeholder="New column title"
        />
        <button onClick={handleAddColumn}>Add Column</button>
      </div>
      <div className='task-columns'>
        {renderColumns()}
      </div>
    </div>
  );
};

export default TaskBoard;