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
  columnId: number;
  row: number; // Add row property
  userId?: number | null; // Add userId property
}