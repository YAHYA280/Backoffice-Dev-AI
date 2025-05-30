import { _STATUS_OPTIONS } from 'src/shared/_mock/assets';

import type { IAbonnementItem } from './abonnement';
import type { ISubject, IDateValue, ISocialLink } from './common';

export type Role = string;

export interface BaseUser {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  email: string;
  role: Role;
  state: string;
  status: string;
  address: string;
  country: string;
  zipCode: string;
  company: string;
  avatarUrl: string;
  phoneNumber: string;
  dureRestante: number;
  isVerified: boolean;
  createdAt: IDateValue;
  lastLogin: IDateValue;
  birthDate: IDateValue;
  motif: string;
  duree: number;
  reason: string;
}
export interface PurchasedSubscription extends IAbonnementItem {
  interval: string;
}
export interface ParentUser extends BaseUser {
  role: 'Parent';
  subscription?: PurchasedSubscription;
  children: ChildUser[];
}

export interface ChildUser extends BaseUser {
  role: 'Enfant';
  parentId: string;
  subjects: ISubject[];
  daily_question_limit?: number;
}
export type IUserItem = ParentUser | ChildUser;

export type IUserTableFilters = {
  name: string;
  email: string;
  role: string[];
  statut: string[];
  createdAt: IDateValue;
  lastLogin: IDateValue;
};

export type IUserProfileCover = {
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
};

export type IUserProfile = {
  id: string;
  role: string;
  quote: string;
  email: string;
  school: string;
  country: string;
  company: string;
  totalFollowers: number;
  totalFollowing: number;
  socialLinks: ISocialLink;
};

export type IUserProfileFollower = {
  id: string;
  name: string;
  country: string;
  avatarUrl: string;
};

export type IUserProfileGallery = {
  id: string;
  title: string;
  imageUrl: string;
  postedAt: IDateValue;
};

export type IUserProfileFriend = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type IUserProfilePost = {
  id: string;
  media: string;
  message: string;
  createdAt: IDateValue;
  personLikes: { name: string; avatarUrl: string }[];
  comments: {
    id: string;
    message: string;
    createdAt: IDateValue;
    author: { id: string; name: string; avatarUrl: string };
  }[];
};

export type IUserCard = {
  id: string;
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
  totalPosts: number;
  totalFollowers: number;
  totalFollowing: number;
};

export type IUserContact = {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
  address: string;
  avatarUrl: string;
  phoneNumber: string;
  lastActivity: string;
};

export type IUserAccount = {
  city: string;
  email: string;
  state: string;
  about: string;
  address: string;
  zipCode: string;
  isPublic: boolean;
  displayName: string;
  phoneNumber: string;
  country: string | null;
  photoURL: File | string | null;
};

export function mapRoleToUserType(role: string): string {
  switch (role) {
    case 'Enfant':
      return 'CHILD';
    case 'Parent':
      return 'PARENT';
    case 'Admin':
      return 'ADMIN';
    default:
      return role;
  }
}
export function mapUserTypeToRole(userType: string): string {
  switch (userType) {
    case 'CHILD':
      return 'Enfant';
    case 'PARENT':
      return 'Parent';
    case 'ADMIN':
      return 'Admin';
    default:
      return userType;
  }
}
export const getStatusValue = (label: string): string | undefined =>
  _STATUS_OPTIONS.find((option) => option.label === label)?.value;

export const getStatusLabel = (value: string): string | undefined =>
  _STATUS_OPTIONS.find((option) => option.value === value)?.label;
