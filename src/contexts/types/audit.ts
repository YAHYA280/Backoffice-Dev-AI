import type { IDatePickerControl } from './common';

export type IAuditFilters = {
  userName: string;
  actionType: string;
  entityType: string;
  entityId: string;
  startDate?: IDatePickerControl;
  endDate?: IDatePickerControl;
};

export interface AuditEvent {
  id: string;
  entityType: AuditEntityType;
  entityId: string;
  actionType: AuditActionType;
  userId: string;
  userName: string;
  timestamp: Date;
  userAgent?: string;
  changes: AuditChange[];
}

export enum AuditEntityType {
  USER = 'User',
  PAYMENT = 'Payment',
  DOCUMENT = 'document',
  NOTIFICATION = 'notification',
  CONFIGURATION = 'Configuration',
}

export function getLabelAuditEntityType(type: AuditEntityType): string {
  switch (type) {
    case AuditEntityType.USER:
      return 'Utilisateur';
    case AuditEntityType.PAYMENT:
      return 'Paiement';
    case AuditEntityType.DOCUMENT:
      return 'Document';
    case AuditEntityType.NOTIFICATION:
      return 'Notification';
    case AuditEntityType.CONFIGURATION:
      return 'Paramètres';
    default:
      return type;
  }
}

export enum AuditActionType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  EXPORT = 'EXPORT',
  PERMISSION_CHANGE = 'PERMISSION_CHANGE',
  CONFIGURATION = 'CONFIGURATION',
}

export interface AuditChange {
  fieldName: string;
  oldValue: any;
  newValue: any;
  fieldType: 'string' | 'number' | 'boolean' | 'enum' | string; // utile pour le formatage)
}
