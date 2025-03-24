import type { IDateValue } from './common';

export type ICGUCard = {
  id: string;
  title: string;
  description: string;
  content: string;
  version: string;
  publishDate: IDateValue;
  expirationDate?: IDateValue;
  active: boolean;
  author: { name: string; avatarUrl?: string | File };
  lastModifiedAt: IDateValue;
};

export type ICGUFilters = {
  title?: string;
  publishDate?: IDateValue;
  version?: string;
  active?: boolean;
  authorName?: string;
  expirationDate?: IDateValue;
  lastModifiedAt?: IDateValue;
};
