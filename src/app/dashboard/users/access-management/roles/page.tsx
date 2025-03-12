import { UserRoleListView } from "src/shared/sections/users-management/roles-management/view/user-role-list-view";

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Utilisateurs: Gestion des Rôles',
};

export default function RolesPage() {
  return <UserRoleListView />;
}
