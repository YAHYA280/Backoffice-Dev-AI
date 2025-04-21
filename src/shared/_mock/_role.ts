import type { IRoleItem } from "src/contexts/types/role";

export const allModules = [
  { label: 'Acceuil', value: 'Acceuil' },
  { label: "Statistiques d'usage ", value: "Statistiques d'usage " },
  { label: 'Performances ', value: 'Performances ' },
  { label: 'Suivi des erreurs ', value: 'Suivi des erreurs ' },
  { label: 'Logs', value: 'Logs' },
  { label: 'Utilisateurs', value: 'Utilisateurs' },
  { label: 'Comptes', value: 'Comptes' },
  { label: 'Rôles', value: 'Rôles' },
  { label: 'Permissions', value: 'Permissions' },
  { label: "Gestion d'apprentissage ", value: "Gestion d'apprentissage " },
  { label: 'Gestion des challenges ', value: 'Gestion des challenges ' },
  { label: 'Ressources multimedias ', value: 'Ressources multimedias ' },
  { label: 'Gestion des ameliorations', value: 'Gestion des ameliorations' },
  { label: 'Gestion des plans ', value: 'Gestion des plans ' },
  { label: 'Suivi & Facturation', value: 'Suivi & Facturation' },
  { label: 'Notifications', value: 'Notifications' },
  { label: 'Gestion des FAQs ', value: 'Gestion des FAQs ' },
  { label: 'Gestion des tickets ', value: 'Gestion des tickets ' },
  { label: 'Configuration du chatbot', value: 'Configuration du chatbot' },
  { label: 'Configurations', value: 'Configurations' },
  { label: 'Tableau de bord', value: 'Tableau de bord' },
  { label: 'Gestion des assistants', value: 'Gestion des assistants' },
  { label: 'Moderation et signalement', value: 'Moderation et signalement' },
];

export const allPermissions = [
  { label: 'Administration', value: 'Administration' },
  { label: 'Lecture', value: 'Lecture' },
  { label: 'Écriture', value: 'Écriture' },
  { label: 'Suppression', value: 'Suppression' },
  { label: 'Export', value: 'Export' },
  { label: 'Import', value: 'Import' },
];

const roleData: IRoleItem[] = [
  {
    id: '1',
    name: 'Admin',
    description: "Utilisateur ayant tous les droits d'administration.",
    modulePermissions: allModules.map((module) => ({
      module: module.value,
      permissions: allPermissions.map((perm) => perm.value),
    })),
    createdAt: new Date('2022-01-01T10:00:00Z'),
  },
  {
    id: '2',
    name: 'Super-admin',
    description: 'Utilisateur avec un accès complet et la possibilité de gérer les utilisateurs.',
    modulePermissions: allModules.map((module) => ({
      module: module.value,
      permissions: allPermissions.filter((perm) => perm.value !== 'Import').map((perm) => perm.value),
    })),
    createdAt: new Date('2022-02-15T09:30:00Z'),
  },
  {
    id: '3',
    name: 'Modérateur',
    description: 'Utilisateur modérant les contenus et gestion des utilisateurs.',
    modulePermissions: [
      { module: 'Utilisateurs', permissions: ['Lecture', 'Écriture', 'Suppression'] },
      { module: 'Rôles', permissions: ['Lecture', 'Suppression'] },
    ],
    createdAt: new Date('2022-05-20T11:00:00Z'),
  },
  {
    id: '4',
    name: 'Agent de support',
    description: "Utilisateur chargé de fournir de l'aide aux utilisateurs.",
    modulePermissions: [
      { module: 'Gestion des FAQs ', permissions: ['Lecture', 'Export'] },
      { module: 'Gestion des tickets ', permissions: ['Lecture', 'Écriture', 'Export', 'Import'] },
    ],
    createdAt: new Date('2022-07-10T08:45:00Z'),
  },
  {
    id: '5',
    name: 'Parent',
    description: 'Utilisateur avec des droits limités à la gestion des enfants.',
    modulePermissions: [
      { module: 'Utilisateurs', permissions: ['Lecture'] },
      { module: 'Comptes', permissions: ['Lecture', 'Écriture'] },
    ],
    createdAt: new Date('2022-09-05T14:15:00Z'),
  },
  {
    id: '6',
    name: 'Enfant',
    description: "Utilisateur ayant accès à l'espace enfant sans droits d'édition.",
    modulePermissions: [
      { module: 'Comptes', permissions: ['Lecture'] },
    ],
    createdAt: new Date('2022-12-01T16:30:00Z'),
  },
  ...Array.from({ length: 20 }, (_, i) => ({
    id: (7 + i).toString(),
    name: `Role-${7 + i}`,
    description: `Description du rôle ${7 + i}.`,
    modulePermissions: [
      {
        module: allModules[0].value,
        permissions: allPermissions.slice(0, (i % allPermissions.length) + 1).map((perm) => perm.value),
      },
    ],
    createdAt: new Date(new Date().setDate(new Date().getDate() - (i + 1))),
  })),
];

export default roleData;