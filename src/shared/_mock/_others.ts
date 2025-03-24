import { _mock } from './_mock';

import type { IKanban } from '../sections/support/tickets-management/types/kanban';

// ----------------------------------------------------------------------

export const _carouselsMembers = [...Array(6)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.fullName(index),
  role: _mock.role(index),
  avatarUrl: _mock.image.portrait(index),
}));

// ----------------------------------------------------------------------

export const _faqs = [...Array(8)].map((_, index) => ({
  id: _mock.id(index),
  value: `panel${index + 1}`,
  heading: `Questions ${index + 1}`,
  detail: _mock.description(index),
}));

// ----------------------------------------------------------------------

export const _addressBooks = [...Array(24)].map((_, index) => ({
  id: _mock.id(index),
  primary: index === 0,
  name: _mock.fullName(index),
  email: _mock.email(index + 1),
  fullAddress: _mock.fullAddress(index),
  phoneNumber: _mock.phoneNumber(index),
  company: _mock.companyNames(index + 1),
  addressType: index === 0 ? 'Home' : 'Office',
}));

// ----------------------------------------------------------------------

export const _contacts = [...Array(20)].map((_, index) => {
  const status =
    (index % 2 && 'online') || (index % 3 && 'offline') || (index % 4 && 'alway') || 'busy';

  return {
    id: _mock.id(index),
    status,
    role: _mock.role(index),
    email: _mock.email(index),
    name: _mock.fullName(index),
    phoneNumber: _mock.phoneNumber(index),
    lastActivity: _mock.time(index),
    avatarUrl: _mock.image.avatar(index),
    address: _mock.fullAddress(index),
  };
});

// ----------------------------------------------------------------------

export const _notifications = [...Array(9)].map((_, index) => ({
  id: _mock.id(index),
  avatarUrl: [
    _mock.image.avatar(1),
    _mock.image.avatar(2),
    _mock.image.avatar(3),
    _mock.image.avatar(4),
    _mock.image.avatar(5),
    null,
    null,
    null,
    null,
    null,
  ][index],
  type: ['friend', 'project', 'file', 'tags', 'payment', 'order', 'chat', 'mail', 'delivery'][
    index
  ],
  category: [
    'Communication',
    'Project UI',
    'File manager',
    'File manager',
    'File manager',
    'Order',
    'Order',
    'Communication',
    'Communication',
  ][index],
  isUnRead: _mock.boolean(index),
  createdAt: _mock.time(index),
  title:
    (index === 0 && `<p><strong>Deja Brady</strong> sent you a friend request</p>`) ||
    (index === 1 &&
      `<p><strong>Jayvon Hull</strong> mentioned you in <strong><a href='#'>Minimal UI</a></strong></p>`) ||
    (index === 2 &&
      `<p><strong>Lainey Davidson</strong> added file to <strong><a href='#'>File manager</a></strong></p>`) ||
    (index === 3 &&
      `<p><strong>Angelique Morse</strong> added new tags to <strong><a href='#'>File manager<a/></strong></p>`) ||
    (index === 4 &&
      `<p><strong>Giana Brandt</strong> request a payment of <strong>$200</strong></p>`) ||
    (index === 5 && `<p>Your order is placed waiting for shipping</p>`) ||
    (index === 6 && `<p>Delivery processing your order is being shipped</p>`) ||
    (index === 7 && `<p>You have new message 5 unread messages</p>`) ||
    (index === 8 && `<p>You have new mail`) ||
    '',
}));

// ----------------------------------------------------------------------

export const _mapContact = [
  { latlng: [33, 65], address: _mock.fullAddress(1), phoneNumber: _mock.phoneNumber(1) },
  { latlng: [-12.5, 18.5], address: _mock.fullAddress(2), phoneNumber: _mock.phoneNumber(2) },
];

// ----------------------------------------------------------------------

export const _socials = [
  {
    value: 'facebook',
    name: 'Facebook',
    path: 'https://www.facebook.com/caitlyn.kerluke',
  },
  {
    value: 'instagram',
    name: 'Instagram',
    path: 'https://www.instagram.com/caitlyn.kerluke',
  },
  {
    value: 'linkedin',
    name: 'Linkedin',
    path: 'https://www.linkedin.com/caitlyn.kerluke',
  },
  {
    value: 'twitter',
    name: 'Twitter',
    path: 'https://www.twitter.com/caitlyn.kerluke',
  },
];

// ----------------------------------------------------------------------

export const _pricingPlans = [
  {
    subscription: 'basic',
    price: 0,
    caption: 'Forever',
    lists: ['3 prototypes', '3 boards', 'Up to 5 team members'],
    labelAction: 'Current plan',
  },
  {
    subscription: 'starter',
    price: 4.99,
    caption: 'Saving $24 a year',
    lists: [
      '3 prototypes',
      '3 boards',
      'Up to 5 team members',
      'Advanced security',
      'Issue escalation',
    ],
    labelAction: 'Choose starter',
  },
  {
    subscription: 'premium',
    price: 9.99,
    caption: 'Saving $124 a year',
    lists: [
      '3 prototypes',
      '3 boards',
      'Up to 5 team members',
      'Advanced security',
      'Issue escalation',
      'Issue development license',
      'Permissions & workflows',
    ],
    labelAction: 'Choose premium',
  },
];

// ----------------------------------------------------------------------

export const _testimonials = [
  {
    name: _mock.fullName(1),
    postedDate: _mock.time(1),
    ratingNumber: _mock.number.rating(1),
    avatarUrl: _mock.image.avatar(1),
    content: `Excellent Work! Thanks a lot!`,
  },
  {
    name: _mock.fullName(2),
    postedDate: _mock.time(2),
    ratingNumber: _mock.number.rating(2),
    avatarUrl: _mock.image.avatar(2),
    content: `It's a very good dashboard and we are really liking the product . We've done some things, like migrate to TS and implementing a react useContext api, to fit our job methodology but the product is one of the best in terms of design and application architecture. The team did a really good job.`,
  },
  {
    name: _mock.fullName(3),
    postedDate: _mock.time(3),
    ratingNumber: _mock.number.rating(3),
    avatarUrl: _mock.image.avatar(3),
    content: `Customer support is realy fast and helpful the desgin of this theme is looks amazing also the code is very clean and readble realy good job !`,
  },
  {
    name: _mock.fullName(4),
    postedDate: _mock.time(4),
    ratingNumber: _mock.number.rating(4),
    avatarUrl: _mock.image.avatar(4),
    content: `Amazing, really good code quality and gives you a lot of examples for implementations.`,
  },
  {
    name: _mock.fullName(5),
    postedDate: _mock.time(5),
    ratingNumber: _mock.number.rating(5),
    avatarUrl: _mock.image.avatar(5),
    content: `Got a few questions after purchasing the product. The owner responded very fast and very helpfull. Overall the code is excellent and works very good. 5/5 stars!`,
  },
  {
    name: _mock.fullName(6),
    postedDate: _mock.time(6),
    ratingNumber: _mock.number.rating(6),
    avatarUrl: _mock.image.avatar(6),
    content: `CEO of Codealy.io here. We’ve built a developer assessment platform that makes sense - tasks are based on git repositories and run in virtual machines. We automate the pain points - storing candidates code, running it and sharing test results with the whole team, remotely. Bought this template as we need to provide an awesome dashboard for our early customers. I am super happy with purchase. The code is just as good as the design. Thanks!`,
  },
];

// ----------------------------------------------------------------------

export const _SupportTicketsKanbanData: IKanban = {
  tasks: {
    'column-1': [
      {
        id: 'task-1',
        name: 'Problème de connexion à la plateforme',
        description:
          'Le parent ne parvient pas à accéder à la plateforme pour suivre les progrès de son enfant.',
        due: '2025-03-10T00:00:00.000Z',
        status: 'À faire',
        priority: 'high',
        reporter: {
          id: 'user-1',
          name: 'Chatbot',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
        },
        assignee: {
          id: 'user-2',
          name: 'Agent Sophie',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
          role: 'Support Agent',
          email: 'sophie@example.com',
          status: 'active',
          address: '123 Main St, City, Country',
          phoneNumber: '+1234567890',
          lastActivity: '2025-03-07T09:15:00.000Z',
        },
        comments: [
          {
            id: 'comment-1',
            name: 'Agent Sophie',
            createdAt: '2025-03-07T09:15:00.000Z',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
            messageType: 'text',
            message: "J'ai contacté le parent pour obtenir plus d'informations.",
          },
        ],
        labels: ['Connexion', 'Parent'],
        attachments: [
          'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-12.webp',
          'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-13.webp',
          'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-14.webp',
        ],
      },
      {
        id: 'task-2',
        name: 'Question sur le programme de mathématiques',
        description:
          'Le parent souhaite des clarifications sur le programme de mathématiques pour son enfant en CE2.',
        due: '2025-03-11T00:00:00.000Z',
        status: 'À faire',
        priority: 'medium',
        reporter: {
          id: 'user-3',
          name: 'Chatbot',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
        },
        assignee: {
          id: 'user-4',
          name: 'Agent Thomas',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
          role: 'Support Agent',
          email: 'thomas@example.com',
          status: 'active',
          address: '456 Elm St, City, Country',
          phoneNumber: '+0987654321',
          lastActivity: '2025-03-07T09:15:00.000Z',
        },
        comments: [],
        labels: ['Programme', 'Mathématiques'],
        attachments: ['https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-14.webp'],
      },
    ],
    'column-2': [
      {
        id: 'task-3',
        name: 'Problème de paiement',
        description: "Le parent rencontre une erreur lors du paiement de l'abonnement.",
        due: '2025-03-08T00:00:00.000Z',
        status: 'En cours',
        priority: 'high',
        reporter: {
          id: 'user-1',
          name: 'Chatbot',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
        },
        assignee: {
          id: 'user-5',
          name: 'Agent Claire',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
          role: 'Support Agent',
          email: 'claire@example.com',
          status: 'active',
          address: '789 Oak St, City, Country',
          phoneNumber: '+1122334455',
          lastActivity: '2025-03-08T10:20:00.000Z',
        },
        comments: [
          {
            id: 'comment-2',
            name: 'Agent Claire',
            createdAt: '2025-03-08T10:20:00.000Z',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
            messageType: 'text',
            message: "J'ai demandé des logs supplémentaires pour diagnostiquer le problème.",
          },
        ],
        labels: ['Paiement', 'Parent'],
        attachments: [],
      },
    ],
    'column-3': [
      {
        id: 'task-4',
        name: 'Demande de changement de niveau scolaire',
        description:
          'Le parent souhaite changer le niveau scolaire de son enfant après une évaluation.',
        due: '2025-03-09T00:00:00.000Z',
        status: 'Résolue',
        priority: 'medium',
        reporter: {
          id: 'user-3',
          name: 'Chatbot',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
        },
        assignee: {
          id: 'user-2',
          name: 'Agent Sophie',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
          role: 'Support Agent',
          email: 'sophie@example.com',
          status: 'active',
          address: '123 Main St, City, Country',
          phoneNumber: '+1234567890',
          lastActivity: '2025-03-09T14:05:00.000Z',
        },
        comments: [
          {
            id: 'comment-3',
            name: 'Agent Sophie',
            createdAt: '2025-03-09T14:05:00.000Z',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
            messageType: 'text',
            message: 'Le niveau scolaire a été mis à jour avec succès.',
          },
        ],
        labels: ['Niveau scolaire', 'Parent'],
        attachments: [
          'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-15.webp',
          'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-11.webp',
          'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-12.webp',
        ],
      },
    ],
    'column-4': [
      {
        id: 'task-5',
        name: 'Question sur les exercices de français',
        description:
          'Le parent demandait des explications supplémentaires sur les exercices de français pour son enfant en CM1.',
        due: '2025-03-05T00:00:00.000Z',
        status: 'Fermé',
        priority: 'low',
        reporter: {
          id: 'user-1',
          name: 'Chatbot',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
        },
        assignee: {
          id: 'user-6',
          name: 'Agent Lucas',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
          role: 'Support Agent',
          email: 'lucas@example.com',
          status: 'active',
          address: '321 Pine St, City, Country',
          phoneNumber: '+5566778899',
          lastActivity: '2025-03-07T16:30:00.000Z',
        },
        comments: [
          {
            id: 'comment-4',
            name: 'Agent Lucas',
            createdAt: '2025-03-07T16:30:00.000Z',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
            messageType: 'text',
            message: "J'ai fourni des explications détaillées au parent.",
          },
          {
            id: 'comment-5',
            name: 'Chatbot',
            createdAt: '2025-03-08T09:45:00.000Z',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
            messageType: 'text',
            message: 'Le parent a confirmé que la réponse était claire.',
          },
        ],
        labels: ['Français', 'Parent'],
        attachments: [
          'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-10.webp',
          'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-11.webp',
        ],
      },
    ],
  },
  columns: [
    {
      id: 'column-1',
      name: 'À faire',
    },
    {
      id: 'column-2',
      name: 'En cours',
    },
    {
      id: 'column-3',
      name: 'Résolue',
    },
    {
      id: 'column-4',
      name: 'Fermé',
    },
  ],
};
