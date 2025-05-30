import {
  allModules,
  allPermissions,
  type IRoleItem,
  type Permission,
} from 'src/contexts/types/role';

const roleData: IRoleItem[] = [
  {
    id: '1',
    name: 'Admin',
    description: "Utilisateur ayant tous les droits d'administration.",
    permissions: allModules.flatMap((module) =>
      allPermissions.map((perm) => ({
        subModule: module.value,
        permissionType: perm.value as Permission['permissionType'],
      }))
    ),
    createdAt: new Date('2022-01-01T10:00:00Z'),
  },
  {
    id: '2',
    name: 'Super-admin',
    description: 'Utilisateur avec un accès complet et la possibilité de gérer les utilisateurs.',
    permissions: allModules.flatMap((module) =>
      allPermissions
        .filter((perm) => perm.value !== 'IMPORT')
        .map((perm) => ({
          subModule: module.value,
          permissionType: perm.value as Permission['permissionType'],
        }))
    ),
    createdAt: new Date('2022-02-15T09:30:00Z'),
  },
  {
    id: '3',
    name: 'Modérateur',
    description: 'Utilisateur modérant les contenus et gestion des utilisateurs.',
    permissions: [
      ...['READ', 'UPDATE', 'DELETE'].map((p) => ({
        subModule: 'Users',
        permissionType: p as Permission['permissionType'],
      })),
      ...['READ', 'DELETE'].map((p) => ({
        subModule: 'Roles',
        permissionType: p as Permission['permissionType'],
      })),
    ],
    createdAt: new Date('2022-05-20T11:00:00Z'),
  },
  {
    id: '4',
    name: 'Agent de support',
    description: "Utilisateur chargé de fournir de l'aide aux utilisateurs.",
    permissions: [
      ...['READ', 'EXPORT'].map((p) => ({
        subModule: 'FAQManagement',
        permissionType: p as Permission['permissionType'],
      })),
      ...['READ', 'CREATE', 'EXPORT', 'IMPORT'].map((p) => ({
        subModule: 'TicketManagement',
        permissionType: p as Permission['permissionType'],
      })),
    ],
    createdAt: new Date('2022-07-10T08:45:00Z'),
  },
  {
    id: '5',
    name: 'Parent',
    description: 'Utilisateur avec des droits limités à la gestion des enfants.',
    permissions: [
      ...['READ'].map((p) => ({
        subModule: 'Users',
        permissionType: p as Permission['permissionType'],
      })),
      ...['READ', 'CREATE'].map((p) => ({
        subModule: 'Accounts',
        permissionType: p as Permission['permissionType'],
      })),
    ],
    createdAt: new Date('2022-09-05T14:15:00Z'),
  },
  {
    id: '6',
    name: 'Enfant',
    description: "Utilisateur ayant accès à l'espace enfant sans droits d'édition.",
    permissions: [
      {
        subModule: 'Accounts',
        permissionType: 'READ',
      },
    ],
    createdAt: new Date('2022-12-01T16:30:00Z'),
  },
  ...Array.from({ length: 20 }, (_, i) => ({
    id: (7 + i).toString(),
    name: `Role-${7 + i}`,
    description: `Description du rôle ${7 + i}.`,
    permissions: allPermissions.slice(0, (i % allPermissions.length) + 1).map((perm) => ({
      subModule: allModules[0].value,
      permissionType: perm.value as Permission['permissionType'],
    })),
    createdAt: new Date(new Date().setDate(new Date().getDate() - (i + 1))),
  })),
];

export default roleData;
