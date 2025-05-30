import { AuditActionType, AuditEntityType, type AuditEvent } from 'src/contexts/types/audit';

export const fieldTranslations = {
  // Champs de base de données
  name: 'nom',
  email: 'email',
  description: 'description',
  price: 'prix',
  category: 'catégorie',
  quantity: 'quantité',
  date: 'date',
  status: 'statut',
};
// Fonction simple de traduction
export function getFieldTranslation(englishWord: string): string {
  if (englishWord in fieldTranslations) {
    return fieldTranslations[englishWord as keyof typeof fieldTranslations];
  }
  return englishWord;
}

export const mockAuditEvents: AuditEvent[] = [
  {
    id: 'audit-001',
    entityType: AuditEntityType.PAYMENT,
    entityId: 'prod-123',
    actionType: AuditActionType.UPDATE,
    userId: 'user-456',
    userName: 'Sophie Martin',
    timestamp: new Date('2025-04-23T14:32:45'),
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    changes: [
      {
        fieldName: 'price',
        oldValue: 149.99,
        newValue: 129.99,
        fieldType: 'number',
      },
      {
        fieldName: 'stock',
        oldValue: 25,
        newValue: 100,
        fieldType: 'number',
      },
      {
        fieldName: 'description',
        oldValue: 'Laptop ordinateur portable 15 pouces',
        newValue: 'Laptop ordinateur portable 15 pouces - Édition Spéciale',
        fieldType: 'string',
      },
    ],
  },
  {
    id: 'audit-002',
    entityType: AuditEntityType.USER,
    entityId: 'user-789',
    actionType: AuditActionType.CREATE,
    userId: 'user-456',
    userName: 'Sophie Martin',
    timestamp: new Date('2025-04-23T10:15:22'),
    changes: [
      {
        fieldName: 'email',
        oldValue: null,
        newValue: 'nouveau@exemple.fr',
        fieldType: 'string',
      },
      {
        fieldName: 'role',
        oldValue: null,
        newValue: 'ADMIN',
        fieldType: 'enum',
      },
      {
        fieldName: 'active',
        oldValue: null,
        newValue: true,
        fieldType: 'boolean',
      },
    ],
  },
  {
    id: 'audit-003',
    entityType: AuditEntityType.DOCUMENT,
    entityId: 'order-456',
    actionType: AuditActionType.UPDATE,
    userId: 'user-123',
    userName: 'Thomas Dubois',
    timestamp: new Date('2025-04-22T16:45:12'),
    changes: [
      {
        fieldName: 'status',
        oldValue: 'PENDING',
        newValue: 'SHIPPED',
        fieldType: 'enum',
      },
      {
        fieldName: 'trackingNumber',
        oldValue: null,
        newValue: 'TR-123456789',
        fieldType: 'string',
      },
    ],
  },
  {
    id: 'audit-004',
    entityType: AuditEntityType.NOTIFICATION,
    entityId: 'prod-456',
    actionType: AuditActionType.DELETE,
    userId: 'user-456',
    userName: 'Sophie Martin',
    timestamp: new Date('2025-04-22T11:23:45'),
    changes: [], // Pas de changements détaillés pour une suppression
  },
  {
    id: 'audit-005',
    entityType: AuditEntityType.CONFIGURATION,
    entityId: 'global-settings',
    actionType: AuditActionType.CONFIGURATION,
    userId: 'user-001',
    userName: 'Admin Système',
    timestamp: new Date('2025-04-21T09:10:05'),
    changes: [
      {
        fieldName: 'maintenanceMode',
        oldValue: false,
        newValue: true,
        fieldType: 'boolean',
      },
      {
        fieldName: 'maintenanceMessage',
        oldValue: '',
        newValue: 'Maintenance prévue de 22h à 23h',
        fieldType: 'string',
      },
    ],
  },
  {
    id: 'audit-006',
    entityType: AuditEntityType.PAYMENT,
    entityId: 'pay-123',
    actionType: AuditActionType.CREATE,
    userId: 'user-456',
    userName: 'Sophie Martin',
    timestamp: new Date('2025-04-23T15:42:12'),
    changes: [
      {
        fieldName: 'amount',
        oldValue: null,
        newValue: 299.99,
        fieldType: 'number',
      },
      {
        fieldName: 'method',
        oldValue: null,
        newValue: 'CREDIT_CARD',
        fieldType: 'enum',
      },
    ],
  },
  {
    id: 'audit-007',
    entityType: AuditEntityType.PAYMENT,
    entityId: 'pay-124',
    actionType: AuditActionType.UPDATE,
    userId: 'user-123',
    userName: 'Thomas Dubois',
    timestamp: new Date('2025-04-22T09:12:45'),
    changes: [
      {
        fieldName: 'status',
        oldValue: 'PENDING',
        newValue: 'COMPLETED',
        fieldType: 'enum',
      },
      {
        fieldName: 'reference',
        oldValue: null,
        newValue: 'REF-987654321',
        fieldType: 'string',
      },
    ],
  },
];
