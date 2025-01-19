import React, { useState, useEffect } from 'react';
import './TaskBoard.css';
import { getTasks, createTask, updateTask, deleteTask, getColumns, createColumn, updateColumn, deleteColumn } from '../services/apiService';
import { Column, Task } from '../types'; // Import Column and Task types
import Dialog from '../components/Dialog';
import Button from '../components/Button'; // Import Button component
import CustomDropdown from '../components/CustomDropdown';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'; // Import icon

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<Column[]>([]); // Use Column type
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskColumnId, setNewTaskColumnId] = useState<number>(1);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState<number | null>(null);
  const [moveTasksToColumnId, setMoveTasksToColumnId] = useState<number | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null); // State to track expanded task
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDescription, setEditTaskDescription] = useState('');

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
    setIsTaskDialogOpen(false);
  };

  const handleAddColumn = async () => {
    const newColumn = await createColumn({ title: newColumnTitle, position: columns.length });
    setColumns([...columns, newColumn.data]);
    setNewColumnTitle('');
    setIsColumnDialogOpen(false);
  };

  const handleDeleteColumn = async () => {
    if (columnToDelete !== null) {
      console.log('Attempting to delete column with ID:', columnToDelete); // Debug log

      // Check if the column exists in the state
      const columnExists = columns.some(column => column.id === columnToDelete);
      if (!columnExists) {
        console.error('Column not found in state:', columnToDelete); // Debug log
        return;
      }

      if (moveTasksToColumnId !== null) {
        const tasksToMove = tasks.filter(task => task.columnId === columnToDelete);
        for (const task of tasksToMove) {
          await updateTask(task.id, { columnId: moveTasksToColumnId });
        }
      } else {
        const tasksToDelete = tasks.filter(task => task.columnId === columnToDelete);
        for (const task of tasksToDelete) {
          console.log(`Deleting task with ID: ${task.id}`); // Debug log
          await deleteTask(task.id);
        }
      }

      try {
        await deleteColumn(columnToDelete);
        setColumns(columns.filter(column => column.id !== columnToDelete));
        setTasks(tasks.filter(task => task.columnId !== columnToDelete));
        console.log('Column deleted successfully:', columnToDelete); // Debug log

        // Reload tasks after deleting the column
        const tasksData = await getTasks();
        setTasks(tasksData.data);
      } catch (error) {
        console.error('Error deleting column:', error); // Debug log
      }

      setIsDeleteDialogOpen(false);
      setColumnToDelete(null);
      setMoveTasksToColumnId(null);
    }
  };

  const handleDoubleClick = (task: Task) => {
    setTaskToEdit(task);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description);
    setIsEditTaskDialogOpen(true);
  };

  const toggleTaskExpansion = (taskId: number) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const renderTasks = (columnId: number) => {
    return tasks
      .filter(task => task.columnId === columnId)
      .map(task => (
        <div
          key={task.id}
          className={`task ${expandedTaskId === task.id ? 'expanded' : ''}`}
          draggable
          onDragStart={(e) => handleDragStart(e, task.id, 'task')}
          onDoubleClick={() => handleDoubleClick(task)}
          onClick={() => toggleTaskExpansion(task.id)}
        >
          <h3>{task.title}</h3>
          {expandedTaskId === task.id && (
            <div className="description">
              <p>Description: {task.description}</p>
            </div>
          )}
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
        <div className="column-header">
          <h2>{column.title}</h2>
          <Button onClick={() => { setColumnToDelete(column.id); setIsDeleteDialogOpen(true); }} icon={faTrash} className="delete-btn">
          </Button>
        </div>
        {renderTasks(column.id)}
      </div>
    ));
  };

  const handleUpdateTask = async () => {
    if (taskToEdit) {
      await updateTask(taskToEdit.id, {
        title: editTaskTitle,
        description: editTaskDescription,
        columnId: taskToEdit.columnId, // Ensure columnId is included
        row: taskToEdit.row // Ensure row is included
      });
      setTasks(tasks.map(task => task.id === taskToEdit.id ? { ...task, title: editTaskTitle, description: editTaskDescription } : task));
      setIsEditTaskDialogOpen(false);
      setTaskToEdit(null);
    }
  };

  return (
    <div className="task-board">
      <div className="task-board-header">
        <div className="breadcrumb-title">Task Board</div>
        <div className="task-board-buttons">
          <Button onClick={() => setIsTaskDialogOpen(true)} icon={faPlus}>
            Add Task
          </Button>
          <Button onClick={() => setIsColumnDialogOpen(true)} icon={faPlus}>
            Add Column
          </Button>
        </div>
      </div>
      <div className='task-columns'>
        {renderColumns()}
      </div>

      <Dialog isOpen={isTaskDialogOpen} onClose={() => setIsTaskDialogOpen(false)} title="Add New Task">
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
        <CustomDropdown
          options={columns.map(column => ({ value: column.id.toString(), label: column.title }))}
          value={newTaskColumnId.toString()}
          onChange={(value) => setNewTaskColumnId(parseInt(value))}
        />
        <Button onClick={handleAddTask} icon={faPlus} className="dialog-submit-btn">
          Add Task
        </Button>
      </Dialog>

      <Dialog isOpen={isColumnDialogOpen} onClose={() => setIsColumnDialogOpen(false)} title="Add New Column">
        <input
          type="text"
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
          placeholder="New column title"
        />
        <div className='dialog-spacer'/>
        <Button onClick={handleAddColumn} icon={faPlus} className="dialog-submit-btn">
          Add Column
        </Button>
      </Dialog>

      <Dialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} title="Delete Column">
        <p>Are you sure you want to delete this column?</p>
        <p>What would you like to do with the tasks in this column?</p>
        <CustomDropdown
          options={[{ value: '', label: 'Delete tasks' }, ...columns.filter(column => column.id !== columnToDelete).map(column => ({ value: column.id.toString(), label: column.title }))]}
          value={moveTasksToColumnId?.toString() || ''}
          onChange={(value) => setMoveTasksToColumnId(value ? parseInt(value) : null)}
        />
        <Button onClick={handleDeleteColumn} icon={faTrash}>
          Confirm
        </Button>
      </Dialog>

      <Dialog isOpen={isEditTaskDialogOpen} onClose={() => setIsEditTaskDialogOpen(false)} title="Edit Task">
        <input
          type="text"
          value={editTaskTitle}
          onChange={(e) => setEditTaskTitle(e.target.value)}
          placeholder="Task title"
        />
        <input
          type="text"
          value={editTaskDescription}
          onChange={(e) => setEditTaskDescription(e.target.value)}
          placeholder="Task description"
        />
        <div className='dialog-spacer'/>

        <Button onClick={handleUpdateTask} icon={faPlus} className="dialog-submit-btn">
          Update Task
        </Button>
      </Dialog>
    </div>
  );
};

export default TaskBoard;