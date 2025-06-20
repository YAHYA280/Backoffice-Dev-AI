import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faHome,
  faBell,
  faUsers,
  faRobot,
  faHeadset,
  faBoxOpen,
  faEuroSign,
  faChartLine,
  faChartSimple,
  faGraduationCap,
  faClipboardList,
} from '@fortawesome/free-solid-svg-icons';

import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

const ICONS = {
  dashboard: <FontAwesomeIcon icon={faHome} />,
  analytics: <FontAwesomeIcon icon={faChartSimple} />,
  user: <FontAwesomeIcon icon={faUsers} />,
  course: <FontAwesomeIcon icon={faGraduationCap} />,
  invoice: <FontAwesomeIcon icon={faEuroSign} />,
  box: <FontAwesomeIcon icon={faBoxOpen} />,
  tour: <FontAwesomeIcon icon={faBell} />,
  support: <FontAwesomeIcon icon={faHeadset} />,
  kanban: <FontAwesomeIcon icon={faRobot} />,
  settings: <FontAwesomeIcon icon={faCog} />,
  assistants: <FontAwesomeIcon icon={faRobot} />,
  aiBoard: <FontAwesomeIcon icon={faChartLine} />,
  audit: <FontAwesomeIcon icon={faClipboardList} />,
};

export const navData = [
  {
    subheader: 'Apercu',
    items: [
      {
        title: 'Accueil',
        path: paths.dashboard.blank,
        icon: ICONS.dashboard,
      },
      {
        title: 'Analytiques',
        path: paths.dashboard.analytics.root,
        icon: ICONS.analytics,
        children: [
          {
            title: "Statistiques d'usage",
            path: paths.dashboard.analytics.usage_statistics,
          },
          {
            title: 'Performances des utilisateurs',
            path: paths.dashboard.analytics.users_performances,
          },
          {
            title: 'Suivi des erreurs',
            path: paths.dashboard.analytics.suivi_erreurs,
          },
          {
            title: 'Logs et Traçabilité',
            path: paths.dashboard.analytics.logs,
          },
        ],
      },
    ],
  },
  {
    subheader: 'Gestion',
    items: [
      {
        title: 'Utilisateurs',
        path: paths.dashboard.users.root,
        icon: ICONS.user,
        children: [
          {
            title: 'Comptes',
            path: paths.dashboard.users.accounts,
          },
          {
            title: 'Gestion rôles et permissions',
            path: paths.dashboard.users.roles,
          },
        ],
      },
      {
        title: 'Contenu pédagogique',
        path: paths.dashboard.contenu_pedagogique.root,
        icon: ICONS.course,
        children: [
          {
            title: "Gestion d'apprentissage",
            path: paths.dashboard.contenu_pedagogique.apprentissage,
          },
          {
            title: 'Gestion des challenges',
            path: paths.dashboard.contenu_pedagogique.challenges,
          },
          {
            title: 'Ressources multimedias',
            path: paths.dashboard.contenu_pedagogique.ressourcesMultimedia,
          },
          {
            title: 'Gestion des ameliorations',
            path: paths.dashboard.contenu_pedagogique.ameliorations,
          },
        ],
      },
      {
        title: 'Abonnements',
        path: paths.dashboard.abonnements.root,
        icon: ICONS.box,
      },
      {
        title: 'Paiements',
        path: paths.dashboard.paiements.root,
        icon: ICONS.invoice,
        children: [
          {
            title: 'Suivi & Facturation',
            path: paths.dashboard.paiements.suivi_facturation,
          },
          {
            title: 'Configuration des paiements',
            path: paths.dashboard.paiements.payment_configuration,
          },
        ],
      },
      {
        title: 'Notifications',
        path: paths.dashboard.notifications_config.root,
        icon: ICONS.tour,
      },
      {
        title: 'Support',
        path: paths.dashboard.support.root,
        icon: ICONS.support,
        children: [
          {
            title: 'Gestion des FAQs',
            path: paths.dashboard.support.faqs,
          },
          {
            title: 'Gestion des tickets',
            path: paths.dashboard.support.tickets,
          },
          {
            title: 'Configuration du chatbot',
            path: paths.dashboard.support.chatbot,
          },
        ],
      },
      {
        title: 'Configuration',
        path: paths.dashboard.configuration.root,
        icon: ICONS.settings,
      },
    ],
  },
  {
    subheader: 'Assistant IA',
    items: [
      {
        title: 'Tableau de bord',
        path: paths.dashboard.ai.root,
        icon: ICONS.aiBoard,
        children: [
          {
            title: 'Correction',
            path: paths.dashboard.ai.correction,
          },
          {
            title: 'Taux',
            path: paths.dashboard.ai.taux,
          },
          {
            title: 'Performance',
            path: paths.dashboard.ai.performance,
          },
        ],
      },
      {
        title: 'Gestion des assistants',
        path: paths.dashboard.ai.assistants_management,
        icon: ICONS.assistants,
      },
      {
        title: 'Moderation et signalement',
        path: paths.dashboard.moderation.root,
        icon: ICONS.kanban,
      },
    ],
  },
  {
    subheader: 'Audits',
    items: [
      {
        title: 'Audits',
        path: paths.dashboard.audit,
        icon: ICONS.audit,
      },
    ],
  },
];
