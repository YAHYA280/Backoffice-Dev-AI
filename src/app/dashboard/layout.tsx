import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/shared/layouts/dashboard';

import { Snackbar } from 'src/shared/components/snackbar';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  if (CONFIG.auth.skip) {
    return (
      <>
        <Snackbar />
        <DashboardLayout>{children}</DashboardLayout>
      </>
    );
  }

  return (
    <>
      <Snackbar />
      <AuthGuard>
        <DashboardLayout>{children}</DashboardLayout>
      </AuthGuard>
    </>
  );
}
