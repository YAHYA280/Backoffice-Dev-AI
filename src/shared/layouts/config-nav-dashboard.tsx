import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faHome,
  faBell,
  faUsers,
  faRobot,
  faHeadset,
  faEuroSign,
  faChartLine,
  faChartSimple,
  faGraduationCap
} from '@fortawesome/free-solid-svg-icons';

import { paths } from 'src/routes/paths';


// ----------------------------------------------------------------------

const ICONS = {
  dashboard: <FontAwesomeIcon icon={faHome} />,
  analytics: <FontAwesomeIcon icon={faChartSimple} />,
  user: <FontAwesomeIcon icon={faUsers} />,
  course: <FontAwesomeIcon icon={faGraduationCap} />,
  invoice: <FontAwesomeIcon icon={faEuroSign} />,
  tour: <FontAwesomeIcon icon={faBell} />,
  support: <FontAwesomeIcon icon={faHeadset} />,
  kanban: <FontAwesomeIcon icon={faRobot} />,
  settings: <FontAwesomeIcon icon={faCog} />,
  assistants: <FontAwesomeIcon icon={faRobot} />,
  aiBoard: <FontAwesomeIcon icon={faChartLine} />,
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
            title: "Performances",
            path: paths.dashboard.analytics.users_performances,
          },
          {
            title: "Suivi des erreurs",
            path: paths.dashboard.analytics.suivi_erreurs,
          },
          {
            title: "Logs",
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
            title: "Comptes",
            path: paths.dashboard.users.accounts,
          },
          {
            title: "Roles et permissions",
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
            title: "Gestion des challenges",
            path: paths.dashboard.contenu_pedagogique.challenges,
          },
          {
            title: "Ressources multimedias",
            path: paths.dashboard.contenu_pedagogique.ressourcesMultimedia,
          },
          {
            title: "Gestion des ameliorations",
            path: paths.dashboard.contenu_pedagogique.ameliorations,
          },
        ],
      },
      {
        title: 'Abonnements',
        path: paths.dashboard.abonnements.root,
        icon: ICONS.invoice,
        children: [
          {
            title: "Gestion des plans",
            path: paths.dashboard.abonnements.gestion_abonnements,
          },
          {
            title: "Suivi & Facturation",
            path: paths.dashboard.abonnements.suivi_facturation,
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
            title: "Gestion des FAQs",
            path: paths.dashboard.support.faqs,
          },
          {
            title: "Gestion des tickets",
            path: paths.dashboard.support.tickets,
          },
          {
            title: "Configuration du chatbot",
            path: paths.dashboard.support.chatbot,
          },
        ],
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
      },
      {
        title: 'Gestion des assistants',
        path: paths.dashboard.ai.assistants_management,
        icon: ICONS.assistants,
      },
    ],
  },
];

