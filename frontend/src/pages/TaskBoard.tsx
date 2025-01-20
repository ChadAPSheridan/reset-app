import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask, getColumns, createColumn, updateColumn, deleteColumn } from '../services/apiService';
import { Column, Task } from '../types';
import Dialog from '../components/Dialog';
import Button from '../components/Button';
import CustomDropdown from '../components/CustomDropdown';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskColumnId, setNewTaskColumnId] = useState<number>(1);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [newColumnDescription, setNewColumnDescription] = useState('');
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState<number | null>(null);
  const [moveTasksToColumnId, setMoveTasksToColumnId] = useState<string | 'disabled'>('disabled');
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDescription, setEditTaskDescription] = useState('');
  const [isDeleteTaskDialogOpen, setIsDeleteTaskDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);


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
    e.stopPropagation();
    e.dataTransfer.setData('id', id.toString());
    e.dataTransfer.setData('type', type);
    console.log(`Drag started for ${type} ID:`, id);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, columnId: number, targetRow?: number) => {
    e.preventDefault();
    e.stopPropagation();
    const id = parseInt(e.dataTransfer.getData('id'));
    const type = e.dataTransfer.getData('type');

    if (type === 'task') {
      const task = tasks.find(task => task.id === id);
      if (task && (task.columnId !== columnId || task.row !== targetRow)) {
        console.log(`Moving task with ID ${id} to column with ID ${columnId} at row ${targetRow}`);
        // if targetRow is undefined, set it to the last row of the target column
        if (targetRow === undefined) {
          targetRow = tasks.filter(task => task.columnId === columnId).length + 1;
        }


        await updateTask(id, { columnId, row: targetRow });
        const updatedTasks = await getTasks();
        setTasks(updatedTasks.data);
      }
    } else if (type === 'column') {
      const draggedColumn = columns.find(col => col.id === id);
      const targetColumn = columns.find(col => col.id === columnId);

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

        await updateColumn(draggedColumn.id, { position: targetColumn.position });

        // Update positions of other columns in the backend
        for (const col of updatedColumns) {
          if (col.id !== draggedColumn.id) {
            await updateColumn(col.id, { position: col.position });
          }
        }
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log('Drag over column ID:', e.currentTarget.dataset.columnId);
  };

  const handleAddTask = async () => {
    const newTask = await createTask({ title: newTaskTitle, description: newTaskDescription, columnId: newTaskColumnId });
    setTasks([...tasks, newTask.data]);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setIsTaskDialogOpen(false);
  };

  const handleAddColumn = async () => {
    const newColumn = await createColumn({ title: newColumnTitle, description: newColumnDescription,position: columns.length });
    setColumns([...columns, newColumn.data]);
    setNewColumnTitle('');
    setNewColumnDescription('');
    setIsColumnDialogOpen(false);
  };

  const handleDeleteColumn = async () => {
    if (columnToDelete !== null) {
      console.log('Attempting to delete column with ID:', columnToDelete);

      // Check if the column exists in the state
      const columnExists = columns.some(column => column.id === columnToDelete);
      if (!columnExists) {
        console.error('Column not found in state:', columnToDelete);
        return;
      }
      console.log('Value of moveTasksToColumnId:', moveTasksToColumnId);
      if (moveTasksToColumnId !== 'disabled') {
        const targetColumnId = parseInt(moveTasksToColumnId, 10);
        const tasksToMove = tasks.filter(task => task.columnId === columnToDelete);

        // Find the highest row in the target column
        const highestRow = tasks
          .filter(task => task.columnId === targetColumnId)
          .reduce((max, task) => (task.row > max ? task.row : max), 0);

        // Move tasks to the target column starting with the highest row + 1
        for (let i = 0; i < tasksToMove.length; i++) {
          const task = tasksToMove[i];
          console.log(`Moving task with ID ${task.id} to column with ID ${targetColumnId} at row ${highestRow + 1 + i}`);
          await updateTask(task.id, { columnId: targetColumnId, row: highestRow + 1 + i });
        }
      } else {
        const tasksToDelete = tasks.filter(task => task.columnId === columnToDelete);
        for (const task of tasksToDelete) {
          console.log(`Deleting task with ID: ${task.id}`);
          await deleteTask(task.id);
        }
      }

      try {
        await deleteColumn(columnToDelete);
        setColumns(columns.filter(column => column.id !== columnToDelete));
        setTasks(tasks.filter(task => task.columnId !== columnToDelete));
        console.log('Column deleted successfully:', columnToDelete);

        // Reload tasks after deleting the column
        const tasksData = await getTasks();
        setTasks(tasksData.data);
      } catch (error) {
        console.error('Error deleting column:', error);
      }

      setIsDeleteDialogOpen(false);
      setColumnToDelete(null);
      setMoveTasksToColumnId('disabled');
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
      .sort((a, b) => a.row - b.row) // Ensure tasks are sorted by row
      .map((task, index) => (
        <div
          key={task.id}
          className={`task ${expandedTaskId === task.id ? 'expanded' : ''}`}
          draggable
          onDragStart={(e) => handleDragStart(e, task.id, 'task')}
          onDrop={(e) => handleDrop(e, columnId, index)}
          onDragOver={handleDragOver}
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
        data-column-id={column.id}
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

  const handleDeleteTask = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete.id);
      setTasks(tasks.filter(task => task.id !== taskToDelete.id));
      setIsDeleteTaskDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const openDeleteTaskDialog = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteTaskDialogOpen(true);
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

      <Dialog
        isOpen={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        title="Add New Task"
        submitLabel="Add Task"
        onSubmit={handleAddTask}
        cancelLabel="Cancel"
        onCancel={() => setIsTaskDialogOpen(false)}
      >
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="New task title"
        />
        <textarea
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          placeholder="New task description"
          rows={3}
          className="description-textarea"
        />
        <CustomDropdown
          options={columns.map(column => ({ value: column.id.toString(), label: column.title }))}
          value={newTaskColumnId.toString()}
          onChange={(value) => setNewTaskColumnId(parseInt(value))}
        />
      </Dialog>

      <Dialog
        isOpen={isColumnDialogOpen}
        onClose={() => setIsColumnDialogOpen(false)}
        title="Add New Column"
        submitLabel="Add Column"
        onSubmit={handleAddColumn}
        cancelLabel="Cancel"
        onCancel={() => setIsColumnDialogOpen(false)}
      >
        <input
          type="text"
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
          placeholder="New column title"
        />
        <textarea
          value={newColumnDescription}
          placeholder="New column description"
          onChange={(e) => setNewColumnDescription(e.target.value)}
          rows={3}
          className="description-textarea"
        />
      </Dialog>

      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setMoveTasksToColumnId(columnToDelete?.toString() || 'disabled'); // Reset to the first option
          setIsSubmitDisabled(true); // Reset submit button state

        }}
        title="Delete Column"
        submitLabel="Confirm"
        submitDisabled={isSubmitDisabled}
        onSubmit={handleDeleteColumn}
        cancelLabel="Cancel"
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setMoveTasksToColumnId(columnToDelete?.toString() || 'disabled'); // Reset to the first option
          setIsSubmitDisabled(true); // Reset submit button state
        }}
      >
        <span className='warning'>This will permanently delete this column and its tasks unless you move them to another column.</span>
        <span className='danger'>This Cannot Be Undone!</span>
        <div className="dropdown-container">
          <p>Action for tasks:</p>
          <CustomDropdown
            options={[{ value: columnToDelete?.toString() || 'disabled', label: 'Select One' }, { value: '', label: 'Delete tasks' }, ...columns.filter(column => column.id !== columnToDelete).map(column => ({ value: column.id.toString(), label: column.title }))]}
            value={moveTasksToColumnId?.toString() || ''}
            onChange={(value) => {
              setMoveTasksToColumnId(value ? parseInt(value).toString() : 'disabled');
              setIsSubmitDisabled(value === columnToDelete?.toString() || value === '-1');
            }}
          />
        </div>
      </Dialog>

      <Dialog
        isOpen={isEditTaskDialogOpen}
        onClose={() => setIsEditTaskDialogOpen(false)}
        title="Edit Task"
        submitLabel="Update Task"
        onSubmit={handleUpdateTask}
        cancelLabel="Cancel"
        onCancel={() => setIsEditTaskDialogOpen(false)}
      >
        <input
          type="text"
          value={editTaskTitle}
          onChange={(e) => setEditTaskTitle(e.target.value)}
          placeholder="Task title"
        />
        <textarea
          value={editTaskDescription}
          onChange={(e) => setEditTaskDescription(e.target.value)}
          placeholder="Task description"
          rows={3}
          className="description-textarea"
        />
        <Button onClick={() => openDeleteTaskDialog(taskToEdit!)} icon={faTrash} className="delete-btn dialog-delete-btn">
        </Button>
      </Dialog>

      <Dialog
        isOpen={isDeleteTaskDialogOpen}
        onClose={() => setIsDeleteTaskDialogOpen(false)}
        title="Delete Task"
        submitLabel="Confirm"
        onSubmit={handleDeleteTask}
        cancelLabel="Cancel"
        onCancel={() => setIsDeleteTaskDialogOpen(false)}
      >
        <div className="dialog-content">
          <p>Are you sure you want to delete this task?</p>
        </div>
      </Dialog>
    </div>
  );
};

export default TaskBoard;