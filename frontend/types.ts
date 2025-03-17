export interface Column {
  id: string;
  title: string;
  description?: string;
  position: number; // Add position property
}

export interface Task {
  id: string;
  title: string;
  description: string;
  ColumnId: string;
  row: number; // Add row property
  UserId?: string | null; // Add userId property
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  permissionLevel: 'user' | 'admin'; // Add permissionLevel property
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  owner: string;
}