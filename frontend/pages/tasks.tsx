import '../axiosSetup';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getTasks, createTask, updateTask, deleteTask, getColumns, createColumn, updateColumn, deleteColumn, getUsers } from '../services/apiService';
import { Column, Task } from '../types';
import Dialog from '../components/Dialog';
import Button from '../components/Button';
import CustomDropdown from '../components/CustomDropdown';
import { faPlus, faTrash, faSync } from '@fortawesome/free-solid-svg-icons';
import TaskComponent from '../components/Task';
import ColumnComponent from '../components/Column';
import TaskDialog from '../components/TaskDialog';
import axiosInstance from '../axiosSetup';
import ColumnDialog from '../components/ColumnDialog';

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskColumnId, setNewTaskColumnId] = useState<string>('');
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [newColumnDescription, setNewColumnDescription] = useState('');
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState<string>('');
  const [moveTasksToColumnId, setMoveTasksToColumnId] = useState<string | 'disabled'>('disabled');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDescription, setEditTaskDescription] = useState('');
  const [isDeleteTaskDialogOpen, setIsDeleteTaskDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [editTaskUserId, setEditTaskUserId] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  // const [projectName, setProjectName] = useState<string>(''); // Add state for project name
  const router = useRouter();
  const { projectId, projectName } = router.query; // Extract projectId and projectName from query parameters

  // console.log(projectId, projectName); // Log projectId and projectName

  useEffect(() => {
    const fetchData = async () => {
      if (projectId) {
        const columnsData = await getColumns(projectId);
        setColumns(columnsData.data);
        const tasksData = await getTasks(projectId);
        setTasks(tasksData.data);
      }
    };
    fetchData();
  }, [projectId]);

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
      setEditTaskUserId(taskToEdit.UserId || '');
    }
  }, [taskToEdit]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string, type: 'task' | 'column') => {
    e.stopPropagation();
    e.dataTransfer.setData('id', id.toString());
    e.dataTransfer.setData('type', type);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, ColumnId: string, targetRow?: number) => {
    e.preventDefault();
    e.stopPropagation();
    const id = e.dataTransfer.getData('id');
    const type = e.dataTransfer.getData('type');

    if (type === 'task') {
      const task = tasks.find(task => task.id === id);
      if (task && (task.ColumnId !== ColumnId || task.row !== targetRow)) {
        if (targetRow === undefined) {
          targetRow = tasks.filter(task => task.ColumnId === ColumnId).length + 1;
        }

        await updateTask(id, { ColumnId, row: targetRow });
        const updatedTasks = await getTasks(projectId as string);
        setTasks(updatedTasks.data);
      }
    } else if (type === 'column') {
      const draggedColumn = columns.find(col => col.id === id);
      const targetColumn = columns.find(col => col.id === ColumnId);

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
    // Check if the ColumnId exists
    const columnExists = columns.some(column => column.id === newTaskColumnId);
    if (!columnExists) {
      console.error('Column does not exist:', newTaskColumnId);
      return;
    }

    try {
      const newTask = await createTask({
        title: newTaskTitle,
        description: newTaskDescription,
        ColumnId: newTaskColumnId,
        ProjectId: projectId
      });
      setTasks([...tasks, newTask.data]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskColumnId(''); // Reset column selection
      setEditTaskUserId(''); // Reset user assignment
      setIsTaskDialogOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleAddColumn = async () => {
    const newColumn = await createColumn({ title: newColumnTitle, description: newColumnDescription, position: columns.length, projectId });
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
        const targetColumnId = moveTasksToColumnId;
        const tasksToMove = tasks.filter(task => task.ColumnId === columnToDelete);

        const highestRow = tasks
          .filter(task => task.ColumnId === targetColumnId)
          .reduce((max, task) => (task.row > max ? task.row : max), 0);

        for (let i = 0; i < tasksToMove.length; i++) {
          const task = tasksToMove[i];
          await updateTask(task.id, { ColumnId: targetColumnId, row: highestRow + 1 + i });
        }
      } else {
        const tasksToDelete = tasks.filter(task => task.ColumnId === columnToDelete);
        for (const task of tasksToDelete) {
          await deleteTask(task.id);
        }
      }

      try {
        await deleteColumn(columnToDelete);
        setColumns(columns.filter(column => column.id !== columnToDelete));
        setTasks(tasks.filter(task => task.ColumnId !== columnToDelete));

        const tasksData = await getTasks(projectId as string);
        setTasks(tasksData.data);
      } catch (error) {
        console.error('Error deleting column:', error);
      }
    }
  };

  const handleDoubleClick = (task: Task) => {
    setTaskToEdit(task);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description);
    setIsEditTaskDialogOpen(true);
  };

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const renderColumns = () => {
    const sortedColumns = [...columns].sort((a, b) => a.position - b.position);

    return sortedColumns.map(column => (
      <ColumnComponent
        key={column.id}
        column={column}
        tasks={tasks}
        users={users}
        expandedTaskId={expandedTaskId || ''}
        handleDragStart={handleDragStart}
        handleDrop={handleDrop}
        handleDragOver={handleDragOver}
        handleDoubleClick={handleDoubleClick}
        toggleTaskExpansion={toggleTaskExpansion}
        setColumnToDelete={setColumnToDelete}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
      />
    ));
  };

  const handleDeleteTask = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete.id);
      setTasks(tasks.filter(task => task.id !== taskToDelete.id));
      setIsDeleteTaskDialogOpen(false);
      setIsEditTaskDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const openDeleteTaskDialog = () => {
    if (taskToEdit) {
    console.log('Opening delete task dialog:', taskToEdit.id);
    setTaskToDelete(taskToEdit);
    setIsDeleteTaskDialogOpen(true);
    }
  };

  const handleUpdateTask = async () => {
    if (taskToEdit) {
      console.log('Updating task:', taskToEdit.id);
      await updateTask(taskToEdit.id, {
        title: editTaskTitle,
        description: editTaskDescription,
        ColumnId: taskToEdit.ColumnId,
        row: taskToEdit.row,
        UserId: editTaskUserId,
      });
      const updatedTasks = await getTasks(projectId as string);
      setTasks(updatedTasks.data);
      setIsEditTaskDialogOpen(false);
    }
  };

  const handleFreshStart = async () => {
    const freshStartColumn = await createColumn({ title: 'Fresh Start', description: 'Tasks for the new sprint', position: columns.length, projectId });

    const updatedTasks = tasks.map(async (task) => {
      if (task.ColumnId !== columns.find(col => col.title === 'Done')?.id) {
        await updateTask(task.id, { ColumnId: freshStartColumn.data.id });
      }
    });

    await Promise.all(updatedTasks);

    const doneColumnId = columns.find(col => col.title === 'Done')?.id;
    if (doneColumnId) {
      const tasksToDelete = tasks.filter(task => task.ColumnId === doneColumnId);
      const deleteTasks = tasksToDelete.map(task => deleteTask(task.id));
      await Promise.all(deleteTasks);
    }

    const tasksData = await getTasks(projectId as string);
    setTasks(tasksData.data);
    const columnsData = await getColumns(projectId as string);
    setColumns(columnsData.data);
  };

  return (
    <div className="board-content">
      <div className="board-header">
        <div className="breadcrumb-title">
          {projectName ? `${projectName} - Task Board` : 'Task Board'} {/* Display project name if available */}
        </div>
        <div className="board-header-buttons">
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

      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        title="Add New Task"
        submitLabel="Add Task"
        onSubmit={handleAddTask}
        cancelLabel="Cancel"
        onCancel={() => setIsTaskDialogOpen(false)}
        taskTitle={newTaskTitle}
        setTaskTitle={setNewTaskTitle}
        taskDescription={newTaskDescription}
        setTaskDescription={setNewTaskDescription}
        columns={columns.map(column => ({ value: column.id.toString(), label: column.title }))}
        selectedColumnId={newTaskColumnId.toString()}
        setSelectedColumnId={(value) => setNewTaskColumnId(value)}
        users={users}
        editTaskUserId={editTaskUserId}
        setEditTaskUserId={setEditTaskUserId}
        currentUser={currentUser}
      />

      <TaskDialog
        isOpen={isEditTaskDialogOpen}
        onClose={() => setIsEditTaskDialogOpen(false)}
        title="Edit Task"
        submitLabel="Update Task"
        onSubmit={handleUpdateTask}
        cancelLabel="Cancel"
        onCancel={() => setIsEditTaskDialogOpen(false)}
        taskTitle={editTaskTitle}
        setTaskTitle={setEditTaskTitle}
        taskDescription={editTaskDescription}
        setTaskDescription={setEditTaskDescription}
        columns={columns.map(column => ({ value: column.id.toString(), label: column.title }))}
        selectedColumnId={taskToEdit?.ColumnId || ''}
        setSelectedColumnId={(value) => setTaskToEdit(taskToEdit ? { ...taskToEdit, ColumnId: value } : null)}
        users={users}
        editTaskUserId={editTaskUserId}
        setEditTaskUserId={setEditTaskUserId}
        currentUser={currentUser}
        openDeleteTaskDialog={openDeleteTaskDialog}
      />

      <Dialog
        isOpen={isDeleteTaskDialogOpen}
        onClose={() => setIsDeleteTaskDialogOpen(false)}
        title="Delete Task"
        submitLabel="Delete"
        onSubmit={handleDeleteTask}
        cancelLabel="Cancel"
        onCancel={() => setIsDeleteTaskDialogOpen(false)}
      >
        <p>Are you sure you want to delete this task?</p>
      </Dialog>

      <ColumnDialog
        isOpen={isColumnDialogOpen}
        onClose={() => setIsColumnDialogOpen(false)}
        title="Add New Column"
        submitLabel="Add Column"
        onSubmit={handleAddColumn}
        cancelLabel="Cancel"
        onCancel={() => setIsColumnDialogOpen(false)}
        columnTitle={newColumnTitle}
        setColumnTitle={setNewColumnTitle}
        columnDescription={newColumnDescription}
        setColumnDescription={setNewColumnDescription}
      />

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
        onCancel={() => setIsDeleteDialogOpen(false)}
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
    </div>
  );
};

export default TaskBoard;