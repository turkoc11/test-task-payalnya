export type ID = number;
export type ProjectStatus = 'active'|'on_hold'|'archived';
export type TaskStatus = 'todo'|'in_progress'|'done';

export interface Project {
  id: ID;
  name: string;
  description?: string;
  status: ProjectStatus;
  createdAt: string;
}

export interface Task {
  id: ID;
  projectId: ID;
  title: string;
  assignee?: string;
  status: TaskStatus;
  dueDate?: string;
  order: number;
}
