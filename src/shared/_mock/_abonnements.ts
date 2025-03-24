import { _mock } from './_mock';

// ----------------------------------------------------------------------
export const ABONNEMENT_DETAILS_TABS = [
  { label: "Contenu d'abonnement", value: 'content' },
  { label: 'Abonnés', value: 'subscribers' },
];

export const ABONNEMENT_TYPES_OPTIONS = [
  { label: 'Standard', value: 'Standard' },
  { label: 'Premium', value: 'Premium' },
];

export const ABONNEMENT_PUBLISH_OPTIONS = [
  { value: 'Brouillon', label: 'Brouillon' },
  { value: 'Publié', label: 'Publié' },
  { value: 'Archivé', label: 'Archivé' },
];

export const ABONNEMENT_INTERVALS_OPTIONS = [
  { value: 'monthly', label: 'Mensuel' },
  { value: 'yearly', label: 'Annuel' },
];

export const ABONNEMENT_SORT_OPTIONS = [
  { label: 'Plus récent', value: 'latest' },
  { label: 'Plus populaire', value: 'popular' },
  { label: 'Plus ancien', value: 'oldest' },
];

export const ABONNEMENT_FEATURES_OPTIONS = [
  { label: 'Accès aux vidéos', value: 'acces_videos' },
  { label: 'Support prioritaire', value: 'support_prioritaire' },
  { label: 'Téléchargement de ressources', value: 'telechargement_ressources' },
  { label: 'Accès aux webinaires exclusifs', value: 'acces_webinaires_exclusifs' },
  { label: 'Accès à un chatbot éducatif', value: 'acces_chatbot_educatif' },
  {
    label: "Accès à un chatbot d'accompagnement personnalisé",
    value: 'acces_chatbot_personnalise',
  },
  { label: 'Accès à des formations premium', value: 'acces_formations_premium' },
  { label: 'Assistance technique 24/7', value: 'assistance_technique_24_7' },
  { label: 'Accès à des événements en direct', value: 'acces_evenements_direct' },
  {
    label: 'Mises à jour et nouvelles fonctionnalités',
    value: 'mises_a_jour_nouvelles_fonctionnalites',
  },
  { label: 'Accès à des forums de discussion privés', value: 'acces_forums_prives' },
  {
    label: 'Personnalisation des outils et ressources',
    value: 'personnalisation_outils_ressources',
  },
  { label: 'Accès à des guides et tutoriels détaillés', value: 'acces_guides_tutoriels' },
  { label: "Réseautage avec des experts de l'industrie", value: 'reseautage_experts' },
];

const SUBSCRIBERS = [...Array(12)].map((_, index) => ({
  id: _mock.id(index),
  role: _mock.role(index),
  name: _mock.fullName(index),
  avatarUrl: _mock.image.avatar(index),
}));

const _promoDetails = {
  discountPercentage: 10,
  validUntil: '2025-12-31',
};

const _abonnementItems = [...Array(12)].map((_, index) => {
  const planType = ABONNEMENT_TYPES_OPTIONS[index % ABONNEMENT_TYPES_OPTIONS.length].label;
  const planPublish = ABONNEMENT_PUBLISH_OPTIONS[index % ABONNEMENT_PUBLISH_OPTIONS.length].label;
  const features = ABONNEMENT_FEATURES_OPTIONS.slice(0, 3).map((option) => option.label);
  const price = {
    amount: (index + 1) * 10,
    interval: ABONNEMENT_INTERVALS_OPTIONS[index % ABONNEMENT_INTERVALS_OPTIONS.length].label,
  };
  const hasExpiration = index % 2 === 0; // Un abonnement sur deux a une date d'expiration

  return {
    id: _mock.id(index),
    title: `Abonnement ${planType} ${index}`,
    shortDescription: `Courte description du plan ${planType}.`,
    fullDescription: `Description complète du plan ${planType}, incluant toutes les fonctionnalités et avantages.`,
    type: planType,
    publish: planPublish,
    totalSubscribers: _mock.number.nativeL(index),
    subscribers: SUBSCRIBERS,
    price,
    duration: 12,
    features,
    promoDetails: _promoDetails,
    createdAt: _mock.time(index),
    updatedAt: _mock.time(index + 1),
    archivedAt: planPublish === 'Archivé' ? _mock.time(index + 2) : undefined,
    expiredAt: hasExpiration ? _mock.time(index + 5) : undefined,
  };
});

export const abonnementItems = _abonnementItems;
