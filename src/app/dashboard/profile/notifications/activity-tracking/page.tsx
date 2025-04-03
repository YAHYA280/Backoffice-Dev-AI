import React from 'react';

import ActivityTrackingNotifications from "src/shared/sections/profile/notifications/activity-tracking/page";

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Fréquence des notifications',
};

export default function ActivityTrackingNotificationsPage() {
  // Use the renamed import
  return <ActivityTrackingNotifications />;
}
