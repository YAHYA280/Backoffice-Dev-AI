import React from 'react';

import ProfileNotifications from "src/shared/sections/profile/notifications/profile_notification/page";

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Notifications liées au profil',
};

export default function ProfileNotificationsPage() {
  // Use the renamed import
  return <ProfileNotifications />;
} 