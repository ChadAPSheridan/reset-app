import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/apiService';
import Dialog from '../components/Dialog';
import Button from '../components/Button';
import { faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [permissionLevel, setPermissionLevel] = useState('user');
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getUsers();
      const authUserString = localStorage.getItem('authUser');
      if (authUserString) {
        const authUser = JSON.parse(authUserString);
        setCurrentUser(authUser);
        if (authUser.permissionLevel === 'admin') {
          setUsers(response.data);
        } else {
          setUsers(response.data.filter((user: any) => user.id === authUser.id));
        }
      } else {
        console.error('No authUser found in localStorage');
      }
    };
    fetchUsers();
  }, []);

  const validateInput = () => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!usernameRegex.test(username)) {
      setError('Username must be 3-20 characters long and can only contain letters, numbers, and underscores.');
      return false;
    }

    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long and contain at least one letter, one number, and one special character.');
      return false;
    }

    setError(null);
    return true;
  };

  const handleAddUser = async () => {
    if (!validateInput()) return;

    await createUser({ firstName, lastName, username, password, permissionLevel });
    const response = await getUsers();
    setUsers(response.data);
    setIsDialogOpen(false);
    setFirstName('');
    setLastName('');
    setUsername('');
    setPassword('');
    setPermissionLevel('user');
  };

  const handleEditUser = async () => {
    if (editUserId !== null && validateInput()) {
      await updateUser(editUserId, { firstName, lastName, username, password, permissionLevel });
      const response = await getUsers();
      setUsers(response.data);
      setIsEditDialogOpen(false);
      setEditUserId(null);
      setFirstName('');
      setLastName('');
      setUsername('');
      setPassword('');
      setPermissionLevel('user');
    }
  };

  const handleDeleteUser = async () => {
    if (deleteUserId !== null) {
      await deleteUser(deleteUserId);
      const response = await getUsers();
      setUsers(response.data);
      setIsDeleteDialogOpen(false);
      setDeleteUserId(null);
    }
  };

  const openEditDialog = (user: any) => {
    setEditUserId(user.id);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setUsername(user.username);
    setPassword('');
    setPermissionLevel(user.permissionLevel || 'user');
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (userId: number) => {
    setDeleteUserId(userId);
    setIsDeleteDialogOpen(true);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="user-management">
      <h1>User Management</h1>
      {currentUser?.permissionLevel === 'admin' && (
        <Button onClick={() => setIsDialogOpen(true)} icon={faPlus} className="add-user-btn">
          Add User
        </Button>
      )}
      <ul className="user-list">
        {users.map(user => (
          <li key={user.id} className="user-item">
            <div className="user-info">
              <div className="user-icon">{getInitials(user.firstName, user.lastName)}</div>
              <div className="user-details">
                <span className="user-name">{user.firstName} {user.lastName}</span>
                <span className="user-username">{user.username}</span>
              </div>
            </div>
            <div className="user-perms">
              <span className="user-permission">{user.permissionLevel}</span>
            </div>
            <div className="user-actions">
              <Button onClick={() => openEditDialog(user)} icon={faEdit} className="edit-btn">
                Edit
              </Button>
              {currentUser?.permissionLevel === 'admin' && (
                <Button onClick={() => openDeleteDialog(user.id)} icon={faTrash} className="delete-btn">
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Add User"
        submitLabel="Add User"
        onSubmit={handleAddUser}
        cancelLabel="Cancel"
        onCancel={() => setIsDialogOpen(false)}
      >
        <div className="dialog-content">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="dialog-input"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            className="dialog-input"
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="dialog-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="dialog-input"
          />
          <select
            value={permissionLevel}
            onChange={(e) => setPermissionLevel(e.target.value)}
            className="dialog-select"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {error && <p className="error">{error}</p>}
      </Dialog>

      <Dialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        title="Edit User"
        submitLabel="Update User"
        onSubmit={handleEditUser}
        cancelLabel="Cancel"
        onCancel={() => setIsEditDialogOpen(false)}
      >
        <div className="dialog-content">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="dialog-input"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            className="dialog-input"
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="dialog-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="dialog-input"
          />
          <select
            value={permissionLevel}
            onChange={(e) => setPermissionLevel(e.target.value)}
            className="dialog-select"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {error && <p className="error">{error}</p>}
      </Dialog>

      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Delete User"
        submitLabel="Confirm"
        onSubmit={handleDeleteUser}
        cancelLabel="Cancel"
        onCancel={() => setIsDeleteDialogOpen(false)}
      >
        <div className="dialog-content">
          <p>Are you sure you want to delete this user?</p>
        </div>
      </Dialog>
    </div>
  );
};

export default UserManagement;