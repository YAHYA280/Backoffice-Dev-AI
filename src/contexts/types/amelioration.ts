import type { UniqueIdentifier } from '@dnd-kit/core';

import type { IDateValue } from './common';

// ----------------------------------------------------------------------

export type IAmeliorationComment = {
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

export type IAmeliorationItem = {
    id: number;
    titre: string;
    description: string;
    matiere: string;
    niveau: string;
    assistantAi: string;
    createdBy: string;
    assignedTo: string;
    createdAt: IDateValue;
    status: string;
    priority: string;
    labels: string[];
    attachments: string[];
    category: string;
    type: string;
    comments: IAmeliorationComment[];
    assignee: IKanbanAssignee[];
    due: [IDateValue, IDateValue];
    reporter: {
        id: string;
        name: string;
        avatarUrl: string;
    };
};

export type IAmeliorationColumn = {
    id: UniqueIdentifier;
    name: string;
};

export type IAmelioration = {
  tasks: Record<UniqueIdentifier, IAmeliorationItem[]>;
  columns: IAmeliorationColumn[];
};