export interface IRoleItem {
  id: string;
  name: string;
  description: string;
  permissionLevel: string[];
  createdAt: Date;
}

export const allPermissions = [
  'Administration', 'Lecture', 'Écriture', 'Suppression', 'Export', 'Import'
];

const roleData: IRoleItem[] = [
  {
    id: '1',
    name: 'Admin',
    description: "Utilisateur ayant tous les droits d'administration.",
    permissionLevel: ['Administration', 'Lecture', 'Écriture', 'Suppression', 'Export', 'Import'],
    createdAt: new Date('2022-01-01T10:00:00Z'),
  },
  {
    id: '2',
    name: 'Super-admin',
    description: 'Utilisateur avec un accès complet et la possibilité de gérer les utilisateurs.',
    permissionLevel: ['Administration', 'Lecture', 'Écriture', 'Suppression', 'Export'],
    createdAt: new Date('2022-02-15T09:30:00Z'),
  },
  {
    id: '3',
    name: 'Modérateur',
    description: 'Utilisateur modérant les contenus et gestion des utilisateurs.',
    permissionLevel: ['Lecture', 'Écriture', 'Suppression'],
    createdAt: new Date('2022-05-20T11:00:00Z'),
  },
  {
    id: '4',
    name: 'Agent de support',
    description: "Utilisateur chargé de fournir de l'aide aux utilisateurs.",
    permissionLevel: ['Lecture', 'Suppression'],
    createdAt: new Date('2022-07-10T08:45:00Z'),
  },
  {
    id: '5',
    name: 'Parent',
    description: 'Utilisateur avec des droits limités à la gestion des enfants.',
    permissionLevel: ['Lecture', 'Écriture'],
    createdAt: new Date('2022-09-05T14:15:00Z'),
  },
  {
    id: '6',
    name: 'Enfant',
    description: "Utilisateur ayant accès à l'espace enfant sans droits d'édition.",
    permissionLevel: ['Lecture'],
    createdAt: new Date('2022-12-01T16:30:00Z'),
  }, 
  ...Array.from({ length: 20 }, (_, i) => ({
    id: (7 + i).toString(),
    name: `Role-${7 + i}`,
    description: `Description du rôle ${7 + i}.`,
    permissionLevel: ['Lecture', 'Écriture'].slice(0, (i % 5) + 1),
    createdAt: new Date(new Date().setDate(new Date().getDate() - (i + 1)))
  })),
];



export default roleData;
