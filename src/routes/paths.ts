// ----------------------------------------------------------------------

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

  // AUTH
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
  },
  authDemo: {
    split: {
      signIn: `${ROOTS.AUTH_DEMO}/split/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/split/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/split/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/split/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/split/verify`,
    },
    centered: {
      signIn: `${ROOTS.AUTH_DEMO}/centered/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/centered/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/centered/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/centered/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/centered/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    blank: `${ROOTS.DASHBOARD}/blank`,
    users: {
      root: `${ROOTS.DASHBOARD}/users`,
      accounts: `${ROOTS.DASHBOARD}/users/accounts`,
      roles: `${ROOTS.DASHBOARD}/users/roles`,
    },
    contenu_pedagogique : {
      root: `${ROOTS.DASHBOARD}/contenu-pedagogique`,
      apprentissage: `${ROOTS.DASHBOARD}/contenu-pedagogique/apprentissage`,
      challenges: `${ROOTS.DASHBOARD}/contenu-pedagogique/challenges`,
      ressourcesMultimedia: `${ROOTS.DASHBOARD}/contenu-pedagogique/ressources-multimedia`,
      ameliorations: `${ROOTS.DASHBOARD}/contenu-pedagogique/ameliorations`,
    },
    analytics : {
      root: `${ROOTS.DASHBOARD}/analytics`,
      usage_statistics: `${ROOTS.DASHBOARD}/analytics/usage-statistics`,
      logs: `${ROOTS.DASHBOARD}/analytics/logs-tracabilite`,
      users_performances: `${ROOTS.DASHBOARD}/analytics/users-performances`,
      suivi_erreurs: `${ROOTS.DASHBOARD}/analytics/suivi-erreurs`,
    },
    notifications_config : {
      root: `${ROOTS.DASHBOARD}/notifications`,
    },
    support : {
      root: `${ROOTS.DASHBOARD}/support`,
      faqs: `${ROOTS.DASHBOARD}/support/faqs`,
      chatbot: `${ROOTS.DASHBOARD}/support/chatbot`,
      tickets: `${ROOTS.DASHBOARD}/support/tickets`,
    },
    abonnements : {
      root: `${ROOTS.DASHBOARD}/abonnements`,
      suivi_facturation: `${ROOTS.DASHBOARD}/abonnements/suivi-factures`,
      gestion_abonnements: `${ROOTS.DASHBOARD}/abonnements/gestion-abonnements`,
    },
    ai : {
      root: `${ROOTS.DASHBOARD}/ai`,
      assistants_management: `${ROOTS.DASHBOARD}/ai/assistants-management`,
    }
  }
};
