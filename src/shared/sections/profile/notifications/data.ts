import { sub, formatDistanceToNow } from 'date-fns';
import { Notification, NotificationOption } from './type';

// Fonction pour formater les dates
export const fToNow = (date: Date) =>
  formatDistanceToNow(date, {
    addSuffix: true,
  });

// Notifications d'exemple
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Alerte de sécurité',
    description:
      'Une connexion a été détectée depuis un nouvel appareil (Windows, Chrome) à Paris, France.',
    createdAt: sub(new Date(), { minutes: 35 }),
    isRead: false,
    isArchived: false,
    isFavorite: false,
    type: 'alert',
  },
  {
    id: '2',
    title: 'Mise à jour du système',
    description:
      'Le système a été mis à jour vers la version 2.3.0. Consultez les nouvelles fonctionnalités.',
    createdAt: sub(new Date(), { hours: 2 }),
    isRead: true,
    isArchived: false,
    isFavorite: true,
    type: 'info',
  },
  {
    id: '3',
    title: 'Nouvel utilisateur',
    description: 'Un nouvel utilisateur a rejoint votre équipe. Bienvenue à Sarah Martin!',
    createdAt: sub(new Date(), { days: 1 }),
    isRead: false,
    isArchived: false,
    isFavorite: false,
    type: 'success',
  },
  {
    id: '4',
    title: 'Maintenance prévue',
    description:
      'Une maintenance est prévue le 15/03 à 22h00. Le système sera indisponible pendant 2 heures.',
    createdAt: sub(new Date(), { days: 2 }),
    isRead: true,
    isArchived: false,
    isFavorite: false,
    type: 'warning',
  },
  {
    id: '5',
    title: 'Rapport mensuel',
    description:
      "Votre rapport d'activité du mois de février est disponible. Cliquez pour le consulter.",
    createdAt: sub(new Date(), { days: 5 }),
    isRead: true,
    isArchived: true,
    isFavorite: false,
    type: 'info',
  },
  {
    id: '6',
    title: 'Nouveau message',
    description:
      "Vous avez reçu un nouveau message de l'administrateur concernant votre dernier projet.",
    createdAt: sub(new Date(), { days: 3 }),
    isRead: false,
    isArchived: false,
    isFavorite: true,
    type: 'info',
  },
  {
    id: '7',
    title: 'Échéance imminente',
    description:
      'Le projet "Implémentation du module de paiement" atteindra son échéance dans 3 jours.',
    createdAt: sub(new Date(), { days: 4 }),
    isRead: true,
    isArchived: false,
    isFavorite: false,
    type: 'warning',
  },
  {
    id: '8',
    title: 'Compte bloqué',
    description:
      "Le compte de l'utilisateur Thomas Durand a été temporairement bloqué après plusieurs tentatives infructueuses.",
    createdAt: sub(new Date(), { weeks: 1 }),
    isRead: true,
    isArchived: false,
    isFavorite: false,
    type: 'alert',
  },
  {
    id: '9',
    title: 'Objectif atteint',
    description:
      "Félicitations ! Votre équipe a atteint l'objectif mensuel de 200 nouveaux utilisateurs.",
    createdAt: sub(new Date(), { weeks: 1, days: 2 }),
    isRead: true,
    isArchived: true,
    isFavorite: true,
    type: 'success',
  },
  {
    id: '10',
    title: 'Mise à jour de sécurité',
    description:
      'Une mise à jour critique de sécurité a été déployée. Veuillez redémarrer votre application.',
    createdAt: sub(new Date(), { weeks: 2 }),
    isRead: false,
    isArchived: false,
    isFavorite: false,
    type: 'alert',
  },
];

// Options de notification par catégorie
export const DEFAULT_NOTIFICATION_OPTIONS: NotificationOption[] = [
  // Système
  {
    id: 'system-updates',
    title: 'Mises à jour système',
    description:
      'Recevoir des notifications lorsque des mises à jour importantes du système sont disponibles ou installées.',
    enabled: true,
    category: 'system',
  },
  {
    id: 'role-changes',
    title: 'Changements de rôle',
    description:
      'Être informé lorsque vos rôles, permissions ou accès sont modifiés dans le système.',
    enabled: true,
    category: 'system',
  },
  {
    id: 'security-alerts',
    title: 'Alertes de sécurité',
    description:
      'Recevoir des alertes en cas de problèmes de sécurité ou de tentatives de connexion suspectes.',
    enabled: true,
    category: 'system',
  },

  // Profil
  {
    id: 'profile-changes',
    title: 'Modifications du profil',
    description:
      "Recevoir une alerte lors de modifications de la photo, de l'email ou du mot de passe de votre compte.",
    enabled: true,
    category: 'profile',
  },
  {
    id: 'new-device-login',
    title: 'Connexions depuis un nouvel appareil',
    description: "Être informé lorsqu'une connexion est détectée depuis un appareil non reconnu.",
    enabled: true,
    category: 'profile',
  },

  // Activité
  {
    id: 'pending-requests',
    title: 'Demandes en attente',
    description:
      'Recevoir des notifications sur les actions administrateur ou modérateur nécessitant une validation.',
    enabled: true,
    category: 'activity',
  },

  // Canaux (ne sont pas des options à activer/désactiver directement dans cette liste)
];

// Jours de la semaine pour le sélecteur
export const WEEK_DAYS = [
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
  { value: 0, label: 'Dimanche' },
];

// Paramètres par défaut
export const DEFAULT_SETTINGS = {
  system: {
    systemUpdates: true,
    roleChanges: true,
    securityAlerts: true,
  },
  profile: {
    profileChanges: true,
    newDeviceLogin: true,
  },
  activity: {
    pendingRequests: true,
  },
  frequency: {
    type: 'realtime' as const,
    dailyTime: new Date(new Date().setHours(9, 0, 0, 0)),
    weeklyDay: 5, // Vendredi
    weeklyTime: new Date(new Date().setHours(9, 0, 0, 0)),
  },
  channels: {
    email: true,
    sms: false,
    internal: true,
  },
};
