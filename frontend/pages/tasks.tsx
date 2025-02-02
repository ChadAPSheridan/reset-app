import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask, getColumns, createColumn, updateColumn, deleteColumn, getUsers } from '../services/apiService';
import { Column, Task } from '../types';
import Dialog from '../components/Dialog';
import Button from '../components/Button';
import CustomDropdown from '../components/CustomDropdown';
import { faPlus, faTrash, faSync } from '@fortawesome/free-solid-svg-icons';

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
  const [users, setUsers] = useState<any[]>([]);
  const [editTaskUserId, setEditTaskUserId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const tasksData = await getTasks();
      setTasks(tasksData.data);
      const columnsData = await getColumns();
      setColumns(columnsData.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getUsers();
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const authUserString = localStorage.getItem('authUser');
    if (authUserString) {
      const authUser = JSON.parse(authUserString);
      setCurrentUser(authUser);
    }
  }, []);

  useEffect(() => {
    if (taskToEdit) {
      setEditTaskUserId(taskToEdit.userId || null);
    }
  }, [taskToEdit]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number, type: 'task' | 'column') => {
    e.stopPropagation();
    e.dataTransfer.setData('id', id.toString());
    e.dataTransfer.setData('type', type);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, columnId: number, targetRow?: number) => {
    e.preventDefault();
    e.stopPropagation();
    const id = parseInt(e.dataTransfer.getData('id'));
    const type = e.dataTransfer.getData('type');

    if (type === 'task') {
      const task = tasks.find(task => task.id === id);
      if (task && (task.columnId !== columnId || task.row !== targetRow)) {
        if (targetRow === undefined) {
          targetRow = tasks.filter(task => task.columnId === columnId).length + 1;
        }

        await updateTask(id, { columnId, row: targetRow });
        const updatedTasks = await getTasks();
        setTasks(updatedTasks.data);

        const freshStartColumn = columns.find(col => col.title === 'Fresh Start');
        if (freshStartColumn) {
          const freshStartTasks = updatedTasks.data.filter((task: Task) => task.columnId === freshStartColumn.id);
          if (freshStartTasks.length === 0) {
            await deleteColumn(freshStartColumn.id);
            const updatedColumns = await getColumns();
            setColumns(updatedColumns.data);
          }
        }
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
  };

  const handleAddTask = async () => {
    const newTask = await createTask({ title: newTaskTitle, description: newTaskDescription, columnId: newTaskColumnId });
    setTasks([...tasks, newTask.data]);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setIsTaskDialogOpen(false);
  };

  const handleAddColumn = async () => {
    const newColumn = await createColumn({ title: newColumnTitle, description: newColumnDescription, position: columns.length });
    setColumns([...columns, newColumn.data]);
    setNewColumnTitle('');
    setNewColumnDescription('');
    setIsColumnDialogOpen(false);
  };

  const handleDeleteColumn = async () => {
    if (columnToDelete !== null) {
      const columnExists = columns.some(column => column.id === columnToDelete);
      if (!columnExists) {
        console.error('Column not found in state:', columnToDelete);
        return;
      }
      if (moveTasksToColumnId !== 'disabled') {
        const targetColumnId = parseInt(moveTasksToColumnId, 10);
        const tasksToMove = tasks.filter(task => task.columnId === columnToDelete);

        const highestRow = tasks
          .filter(task => task.columnId === targetColumnId)
          .reduce((max, task) => (task.row > max ? task.row : max), 0);

        for (let i = 0; i < tasksToMove.length; i++) {
          const task = tasksToMove[i];
          await updateTask(task.id, { columnId: targetColumnId, row: highestRow + 1 + i });
        }
      } else {
        const tasksToDelete = tasks.filter(task => task.columnId === columnToDelete);
        for (const task of tasksToDelete) {
          await deleteTask(task.id);
        }
      }

      try {
        await deleteColumn(columnToDelete);
        setColumns(columns.filter(column => column.id !== columnToDelete));
        setTasks(tasks.filter(task => task.columnId !== columnToDelete));

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
      .sort((a, b) => a.row - b.row)
      .map((task, index) => {
        const assignedUser = users.find(user => user.id === task.userId);
        const userInitials = assignedUser ? `${assignedUser.firstName.charAt(0)}${assignedUser.lastName.charAt(0)}`.toUpperCase() : '';
        const userFullName = assignedUser ? `${assignedUser.firstName} ${assignedUser.lastName}` : 'Unassigned';

        return (
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
      });
  };

  const renderColumns = () => {
    const sortedColumns = [...columns].sort((a, b) => a.position - b.position);

    return sortedColumns.map(column => (
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
      setIsEditTaskDialogOpen(false);
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
        columnId: taskToEdit.columnId,
        row: taskToEdit.row,
        userId: editTaskUserId,
      });
      const updatedTasks = await getTasks();
      setTasks(updatedTasks.data);
      setIsEditTaskDialogOpen(false);
    }
  };

  const handleFreshStart = async () => {
    const freshStartColumn = await createColumn({ title: 'Fresh Start', description: 'Tasks for the new sprint', position: columns.length });

    const updatedTasks = tasks.map(async (task) => {
      if (task.columnId !== columns.find(col => col.title === 'Done')?.id) {
        await updateTask(task.id, { columnId: freshStartColumn.data.id });
      }
    });

    await Promise.all(updatedTasks);

    const doneColumnId = columns.find(col => col.title === 'Done')?.id;
    if (doneColumnId) {
      const tasksToDelete = tasks.filter(task => task.columnId === doneColumnId);
      const deleteTasks = tasksToDelete.map(task => deleteTask(task.id));
      await Promise.all(deleteTasks);
    }

    const tasksData = await getTasks();
    setTasks(tasksData.data);
    const columnsData = await getColumns();
    setColumns(columnsData.data);
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
          <Button onClick={handleFreshStart} icon={faSync}>
            Fresh Start
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
          setMoveTasksToColumnId(columnToDelete?.toString() || 'disabled');
          setIsSubmitDisabled(true);
        }}
        title="Delete Column"
        submitLabel="Confirm"
        submitDisabled={isSubmitDisabled}
        onSubmit={handleDeleteColumn}
        cancelLabel="Cancel"
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setMoveTasksToColumnId(columnToDelete?.toString() || 'disabled');
          setIsSubmitDisabled(true);
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
        <p>Assigned to: </p>
        {taskToEdit?.userId ? (
          <CustomDropdown
            options={users.map(user => ({ value: user.id.toString(), label: `${user.firstName} ${user.lastName}` }))}
            value={editTaskUserId?.toString() || ''}
            onChange={(value) => setEditTaskUserId(parseInt(value))}
            disabled={currentUser?.permissionLevel !== 'admin'}
          />
        ) : (
          <>
            {currentUser?.permissionLevel === 'user' && (
              <Button
                onClick={() => {
                  setEditTaskUserId(currentUser.id);
                  setTaskToEdit(taskToEdit ? { ...taskToEdit, userId: currentUser.id } : null);
                }}
                className="assign-btn"
              >
                {editTaskUserId === currentUser.id ? `Assigned to ${currentUser.firstName} ${currentUser.lastName}` : 'Assign To Me'}
              </Button>
            )}
            {currentUser?.permissionLevel === 'admin' && (
              <CustomDropdown
                options={users.map(user => ({ value: user.id.toString(), label: `${user.firstName} ${user.lastName}` }))}
                value={editTaskUserId?.toString() || ''}
                onChange={(value) => setEditTaskUserId(parseInt(value))}
              />
            )}
          </>
        )}
        <Button onClick={() => openDeleteTaskDialog(taskToEdit!)} icon={faTrash} className="delete-btn dialog-delete-btn">
        </Button>
      </Dialog>
    </div>
  );
};

export default TaskBoard;