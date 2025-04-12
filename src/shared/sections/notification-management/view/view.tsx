'use client';

import { DashboardContent } from 'src/shared/layouts/dashboard';

import { NotificationContent } from '../notification-list-content';

export function NotificationsView() {
  return (

    <DashboardContent maxWidth="xl">
      <NotificationContent />
    </DashboardContent>
  );
}