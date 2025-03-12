import type { IDateValue, ISocialLink, IDatePickerControl } from './common';

export type IUserItem = {
    id: string;
    firstName: string;
    lastName: string;
    city: string;
    role: string;
    email: string;
    state: string;
    status: string;
    address: string;
    country: string;
    zipCode: string;
    company: string;
    avatarUrl: string;
    phoneNumber: string;
    dureRestante:number;
    isVerified: boolean;
    createdAt: string | null;
    lastLogin: string | null;
    birthDate: string | null;
    motif : string;
    duree : number;
    reason : string;
};


export type IUserTableFilters = {
name: string;
email:string;
role: string[];
statut : string[];
createdAt: IDatePickerControl;
lastLogin: IDatePickerControl;
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
