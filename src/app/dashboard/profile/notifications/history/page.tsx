import React from 'react';

import NotificationHistory from "src/shared/sections/profile/notifications/history/page";

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Fréquence des notifications',
};

export default function NotificationHistoryPage() {
  // Use the renamed import
  return <NotificationHistory />;
}
