import type { ICGUCard } from 'src/contexts/types/configuration';

export const CGU_STATUS_OPTIONS = [
  { value: 'published', label: 'Publié' },
  { value: 'draft', label: 'Brouillon' },
];

export const _CGUData: ICGUCard[] = [
  {
    id: '1',
    title: "Conditions Générales d'Utilisation - Service A",
    description: "Les conditions générales d'utilisation pour le service A.",
    content:
      "Les conditions d'utilisation pour le service A sont les suivantes... [contenu détaillé]",
    version: '1.0',
    publishDate: '2025-03-01T00:00:00Z',
    expirationDate: '2026-03-01T00:00:00Z',
    active: true,
    author: {
      name: 'Entreprise X',
      avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
    },
    lastModifiedAt: '2025-03-10T00:00:00Z',
  },
  {
    id: '2',
    title: "Conditions Générales d'Utilisation - Service B",
    description: "Les conditions générales d'utilisation pour le service B.",
    content:
      "Les conditions d'utilisation pour le service B sont les suivantes... [contenu détaillé]",
    version: '2.0',
    publishDate: '2025-02-15T00:00:00Z',
    expirationDate: '2027-02-15T00:00:00Z',
    active: true,
    author: {
      name: 'Entreprise Y',
      avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
    },
    lastModifiedAt: '2025-03-05T00:00:00Z',
  },
  {
    id: '3',
    title: "Conditions Générales d'Utilisation - Service C",
    description: "Les conditions générales d'utilisation pour le service C.",
    content:
      "Les conditions d'utilisation pour le service C sont les suivantes... [contenu détaillé]",
    version: '1.2',
    publishDate: '2024-12-01T00:00:00Z',
    expirationDate: '2025-12-01T00:00:00Z',
    active: false,
    author: {
      name: 'Entreprise Z',
      avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
    },
    lastModifiedAt: '2024-12-10T00:00:00Z',
  },
  {
    id: '4',
    title: "Conditions Générales d'Utilisation - Service D",
    description: "Les conditions générales d'utilisation pour le service D.",
    content:
      "Les conditions d'utilisation pour le service D sont les suivantes... [contenu détaillé]",
    version: '1.5',
    publishDate: '2025-01-10T00:00:00Z',
    expirationDate: '2026-01-10T00:00:00Z',
    active: true,
    author: {
      name: 'Entreprise W',
      avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
    },
    lastModifiedAt: '2025-03-15T00:00:00Z',
  },
  {
    id: '5',
    title: "Conditions Générales d'Utilisation - Service E",
    description: "Les conditions générales d'utilisation pour le service E.",
    content:
      "Les conditions d'utilisation pour le service E sont les suivantes... [contenu détaillé]",
    version: '3.0',
    publishDate: '2025-03-05T00:00:00Z',
    expirationDate: '2027-03-05T00:00:00Z',
    active: true,
    author: {
      name: 'Entreprise V',
      avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
    },
    lastModifiedAt: '2025-03-17T00:00:00Z',
  },
  {
    id: '6',
    title: "Conditions Générales d'Utilisation - Service F",
    description: "Les conditions générales d'utilisation pour le service F.",
    content:
      "Les conditions d'utilisation pour le service F sont les suivantes... [contenu détaillé]",
    version: '1.1',
    publishDate: '2024-11-20T00:00:00Z',
    expirationDate: '2025-11-20T00:00:00Z',
    active: false,
    author: {
      name: 'Entreprise U',
      avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
    },
    lastModifiedAt: '2024-12-01T00:00:00Z',
  },
];
