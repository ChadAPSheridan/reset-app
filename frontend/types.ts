export interface Column {
  id: number;
  title: string;
  description?: string;
  position: number; // Add position property
}

export interface Task {
  id: number;
  title: string;
  description: string;
  ColumnId: number;
  row: number; // Add row property
  userId?: number | null; // Add userId property
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  permissionLevel: 'user' | 'admin'; // Add permissionLevel property
}