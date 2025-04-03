import React from 'react';

import FrequencyNotifications from "src/shared/sections/profile/notifications/frequency/page";

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Fréquence des notifications',
};

export default function FrequencyNotificationsPage() {
  // Use the renamed import
  return <FrequencyNotifications />;
}
