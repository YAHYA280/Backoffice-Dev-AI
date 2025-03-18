import { UserPermissionListView } from "src/shared/sections/users-management/permissions-management/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Utilisateurs: Gestion des Rôles',
};

export default function RolesPage() {
  return <UserPermissionListView />;
}
