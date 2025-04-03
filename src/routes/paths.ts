import { paramCase } from 'src/utils/change-case';

import { _id } from 'src/shared/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  docs: 'https://docs.minimals.cc',
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id: string) => `/product/${id}`,
    demo: { details: `/product/${MOCK_ID}` },
  },

  // AUTH
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
    },
    forgotPassword: `${ROOTS.AUTH}/forgot-password`,
    forgotPasswordSuccess: `${ROOTS.AUTH}/forgot-password/success`,
    newPassword: `${ROOTS.AUTH}/new-password`,
    newPasswordSuccess: `${ROOTS.AUTH}/new-password/success`,
  },
  authDemo: {
    split: {
      signIn: `${ROOTS.AUTH_DEMO}/split/sign-in`,
      resetPassword: `${ROOTS.AUTH_DEMO}/split/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/split/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/split/verify`,
    },
    centered: {
      signIn: `${ROOTS.AUTH_DEMO}/centered/sign-in`,
      resetPassword: `${ROOTS.AUTH_DEMO}/centered/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/centered/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/centered/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    blank: `${ROOTS.DASHBOARD}/blank`,
    profile: {
      root: `${ROOTS.DASHBOARD}/profile`,
      profile: `${ROOTS.DASHBOARD}/profile/profile`,
      editProfile: `${ROOTS.DASHBOARD}/profile/profile/edit/`,
      security: `${ROOTS.DASHBOARD}/profile/profile/security`,
      language: `${ROOTS.DASHBOARD}/profile/profile/languages`,
      notifications: `${ROOTS.DASHBOARD}/profile/notifications`,
      notificationSystem: `${ROOTS.DASHBOARD}/profile/notifications/system`,
      notificationFrequency: `${ROOTS.DASHBOARD}/profile/notifications/frequency`,
      notificationProfile: `${ROOTS.DASHBOARD}/profile/notifications/profile_notification`,
      notificationActivity: `${ROOTS.DASHBOARD}/profile/notifications/activity-tracking`,
      notificationChannels: `${ROOTS.DASHBOARD}/profile/notifications/channels`,
      notificationHistory: `${ROOTS.DASHBOARD}/profile/notifications/history`,
      resetPassword: `${ROOTS.DASHBOARD}/profile/profile/security/reset-password`,
    },
    users: {
      root: `${ROOTS.DASHBOARD}/users`,
      accounts: `${ROOTS.DASHBOARD}/users/accounts`,
      access_management: `${ROOTS.DASHBOARD}/users/access-management`,
      roles: `${ROOTS.DASHBOARD}/users/access-management/roles`,
      permissions: `${ROOTS.DASHBOARD}/users/access-management/permissions`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      consulter: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/consulter`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
        consulter: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/consulter`,
      },
    },
    contenu_pedagogique: {
      root: `${ROOTS.DASHBOARD}/contenu-pedagogique`,
      apprentissage: `${ROOTS.DASHBOARD}/contenu-pedagogique/apprentissage`,
      challenges: `${ROOTS.DASHBOARD}/contenu-pedagogique/challenges`,
      ressourcesMultimedia: `${ROOTS.DASHBOARD}/contenu-pedagogique/ressources-multimedia`,
      ameliorations: `${ROOTS.DASHBOARD}/contenu-pedagogique/ameliorations`,
    },
    analytics: {
      root: `${ROOTS.DASHBOARD}/analytics`,
      usage_statistics: `${ROOTS.DASHBOARD}/analytics/usage-statistics`,
      logs: `${ROOTS.DASHBOARD}/analytics/logs-tracabilite`,
      users_performances: `${ROOTS.DASHBOARD}/analytics/users-performances`,
      suivi_erreurs: `${ROOTS.DASHBOARD}/analytics/suivi-erreurs`,
    },
    notifications_config: {
      root: `${ROOTS.DASHBOARD}/notifications`,
    },
    support: {
      root: `${ROOTS.DASHBOARD}/support`,
      faqs: `${ROOTS.DASHBOARD}/support/faqs`,
      chatbot: `${ROOTS.DASHBOARD}/support/chatbot`,
      tickets: `${ROOTS.DASHBOARD}/support/tickets`,
    },
    configuration: {
      root: `${ROOTS.DASHBOARD}/configuration`,
      new: `${ROOTS.DASHBOARD}/configuration/new`,
      edit: (title: string) => `${ROOTS.DASHBOARD}/configuration/${paramCase(title)}/edit`,
      details: (title: string) => `${ROOTS.DASHBOARD}/configuration/${paramCase(title)}`,
    },
    abonnements: {
      root: `${ROOTS.DASHBOARD}/abonnements`,
      new: `${ROOTS.DASHBOARD}/abonnements/gestion-abonnements/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/abonnements/gestion-abonnements/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/abonnements/gestion-abonnements/${id}/edit`,
      suivi_facturation: `${ROOTS.DASHBOARD}/abonnements/suivi-factures`,
      gestion_abonnements: `${ROOTS.DASHBOARD}/abonnements/gestion-abonnements`,
    },
    ai: {
      root: `${ROOTS.DASHBOARD}/ai`,
      assistants_management: `${ROOTS.DASHBOARD}/ai/assistants-management`,
    },
    moderation : {
      root: `${ROOTS.DASHBOARD}/moderation`,
    },
  },
};
