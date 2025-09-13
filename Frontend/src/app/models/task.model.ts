export interface Task {
  _id?: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  users: string[];
  projectId: string;
  dueDate: string;
  createdby: string;
  filepath?: string;
  comments?: Comment[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Comment {
  _id?: string;
  content: string;
  author: string;
  createdAt: Date;
}
