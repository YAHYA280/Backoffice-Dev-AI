import { _mock } from './_mock';

export const NOTIFICATION_TYPE_OPTIONS = [
  { label: 'Information', value: 'information' },
  { label: 'Promotionnel', value: 'promotional' },
  { label: 'Rappel', value: 'reminder' },
  { label: 'Alerte', value: 'alert' },
];

export const NOTIFICATION_STATUS_OPTIONS = [
  { label: 'Envoyée', value: 'sent' },
  { label: 'En attente', value: 'pending' },
  { label: 'Échouée', value: 'failed' },
];

export const NOTIFICATION_CHANNEL_OPTIONS = [
  { label: 'Email', value: 'email' },
  { label: 'SMS', value: 'sms' },
  { label: 'Push', value: 'push' },
];

const SUBSCRIBER_GROUPS = [
  { id: _mock.id(1), name: 'Tous les utilisateurs', count: 1250 },
  { id: _mock.id(2), name: 'Utilisateurs Premium', count: 478 },
  { id: _mock.id(3), name: 'Abonnés Newsletter', count: 892 },
  { id: _mock.id(4), name: 'Jean Dupont', count: 1 },
];

export const _notifications = [...Array(15)].map((_, index) => {
  const type = NOTIFICATION_TYPE_OPTIONS[index % NOTIFICATION_TYPE_OPTIONS.length].value;
  const status = NOTIFICATION_STATUS_OPTIONS[index % NOTIFICATION_STATUS_OPTIONS.length].value;
  
  // Generate title based on type
  let title = '';
  switch(type) {
    case 'information':
      title = index % 2 === 0 ? 'Mise à jour de l\'application' : 'Nouveaux articles disponibles';
      break;
    case 'promotional':
      title = 'Promotion exclusive';
      break;
    case 'reminder':
      title = 'Rappel de rendez-vous';
      break;
    case 'alert':
      title = 'Alerte de sécurité';
      break;
    default:
      title = 'Notification';
      break;
  }
  
  // Generate channels array based on index
  let channel = [];
  if (index % 3 === 0) {
    channel = ['email', 'push'];
  } else if (index % 3 === 1) {
    channel = ['email', 'sms'];
  } else {
    channel = ['sms'];
  }

  return {
    id: _mock.id(index),
    title,
    type,
    status,
    recipients: SUBSCRIBER_GROUPS[index % SUBSCRIBER_GROUPS.length],
    content: `Notification contenu ${index + 1}`,
    sentDate: _mock.time(index),
    channel,
    createdAt: _mock.time(index - 2),
    updatedAt: _mock.time(index),
  };
});