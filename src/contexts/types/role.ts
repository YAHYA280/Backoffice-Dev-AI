export interface IRoleItem {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: Date;
}

export interface IRoleTableFilters {
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: Date;
}

export type PermissionType = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'IMPORT' | 'EXPORT';

export type Permission = {
  subModule: string;
  permissionType: PermissionType;
};

export const allModules = [
  { label: 'Acceuil', value: 'Home' },
  { label: "Statistiques d'usage", value: 'UsageStatistics' },
  { label: 'Performances', value: 'Performance' },
  { label: 'Suivi des erreurs', value: 'ErrorTracking' },
  { label: 'Logs', value: 'Logs' },
  { label: 'Utilisateurs', value: 'Users' },
  { label: 'Comptes', value: 'Accounts' },
  { label: 'Rôles', value: 'Roles' },
  { label: 'Permissions', value: 'Permissions' },
  { label: "Gestion d'apprentissage", value: 'LearningManagement' },
  { label: 'Gestion des challenges', value: 'ChallengeManagement' },
  { label: 'Ressources multimedias', value: 'MultimediaResources' },
  { label: 'Gestion des améliorations', value: 'ImprovementsManagement' },
  { label: 'Gestion des plans', value: 'PlanManagement' },
  { label: 'Suivi & Facturation', value: 'TrackingBilling' },
  { label: 'Notifications', value: 'Notifications' },
  { label: 'Gestion des FAQs', value: 'FAQManagement' },
  { label: 'Gestion des tickets', value: 'TicketManagement' },
  { label: 'Configuration du chatbot', value: 'ChatbotConfiguration' },
  { label: 'Configurations', value: 'Settings' },
  { label: 'Tableau de bord', value: 'Dashboard' },
  { label: 'Gestion des assistants', value: 'AssistantManagement' },
  { label: 'Modération et signalement', value: 'ModerationReporting' },
];
export const allPermissions = [
  { label: 'Lecture', value: 'READ' },
  { label: 'Ajout', value: 'CREATE' },
  { label: 'Modification', value: 'UPDATE' },
  { label: 'Suppression', value: 'DELETE' },
  { label: 'Export', value: 'EXPORT' },
  { label: 'Import', value: 'IMPORT' },
];
export function getSubModuleLabelByValue(value: string): string {
  const module = allModules.find((mod) => mod.value === value);
  return module?.label ?? value;
}
export function getPermissionTypeLabelByValue(value: string): string {
  const permission = allPermissions.find((mod) => mod.value === value);
  return permission?.label ?? value;
}
