import type { Dayjs } from 'dayjs';

// ----------------------------------------------------------------------

export type IPaymentCard = {
  id: string;
  cardType: string;
  primary?: boolean;
  cardNumber: string;
};

export type IAddressItem = {
  id?: string;
  name: string;
  company?: string;
  primary?: boolean;
  fullAddress: string;
  phoneNumber?: string;
  addressType?: string;
};

export type IDateValue = string | number | null;

export type IDatePickerControl = Dayjs | null;

export type ISocialLink = {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
};

export type IAbonnementSubscribers = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type ISubject = {
  id: string;
  name: string;
  isSelected: boolean;
};

export type UpgradeType = 'interval' | 'questions';

export interface UpgradeBase {
  id: string;
  type: UpgradeType;
  cost: number;
  date: string;
}

export interface ChildSpecificUpgrade extends UpgradeBase {
  type: 'questions';
  childId: string;
  additional_questions: number;
}

export interface GlobalUpgrade extends UpgradeBase {
  type: 'interval';
  interval: string;
}

export type Upgrade = UpgradeBase | ChildSpecificUpgrade | GlobalUpgrade;
