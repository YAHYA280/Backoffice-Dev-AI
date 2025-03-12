import type { UniqueIdentifier } from '@dnd-kit/core';

import type { IDateValue } from './common';

// ----------------------------------------------------------------------

export type IAmeliorationFilters = {
  assignee: string[];
  type: string;
  exercice: string;
  niveau: string;
  matiere: string;
  source: string;
  aiAssistant: string;
};

export type IKanbanComment = {
  id: string;
  name: string;
  message: string;
  avatarUrl: string;
  messageType: 'image' | 'text';
  createdAt: IDateValue;
};

export type IKanbanAssignee = {
  id: string;
  name: string;
  role: string;
  email: string;
  status: string;
  address: string;
  avatarUrl: string;
  phoneNumber: string;
  lastActivity: IDateValue;
};

export type IKanbanTask = {
  id: UniqueIdentifier;
  name: string;
  type?: string;
  source?: string;
  status: string;
  priority: string;
  labels: string[];
  description?: string;
  attachments?: string[];
  comments: IKanbanComment[];
  niveau?: string,
  matiere?: string,
  exercice?: string[],
  assignee: IKanbanAssignee[];
  due?: [IDateValue, IDateValue];
  reporter: {
    id: string;
    name: string;
    avatarUrl: string;
  };
};

export type IKanbanColumn = {
  id: UniqueIdentifier;
  name: string;
};

export type IKanban = {
  tasks: Record<UniqueIdentifier, IKanbanTask[]>;
  columns: IKanbanColumn[];
};
