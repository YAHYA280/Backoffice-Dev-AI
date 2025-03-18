// ----------------------------------------------------------------------

export type IAbonnementFilters = {
  types: string[];
  publishOptions: string;
  features: string[];
};

export type IAbonnementPrice = {
  amount: number;
  interval: string;
};

export type IPromoDetails = {
  discountPercentage?: number;
  validUntil?: string;
};
export type IAbonnementSubscribers = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};
export type IAbonnementItem = {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  type: string;
  publish: string;
  totalSubscribers: number;
  price: IAbonnementPrice;
  duration: number;
  features: string[];
  promoDetails?: IPromoDetails;
  subscribers: IAbonnementSubscribers[];
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  expiredAt?: string;
};
