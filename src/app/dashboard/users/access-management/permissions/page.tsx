import { UserPermissionListView } from "src/shared/sections/users-management/permissions-management/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Utilisateurs: Gestion des permissions',
};

export default function PermissionsPage() {
  return <UserPermissionListView />;
}
