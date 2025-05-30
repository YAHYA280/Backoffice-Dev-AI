import type { IDateValue} from 'src/contexts/types/common'


// ----------------------------------------------------------------------

export type IFileFilters = {
  name: string;
  size:string;
  type: string[];
  startDate: IDateValue;
  endDate: IDateValue;
};

export type IFileShared = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  permission: string;
};

export type IFolderManager = {
  id: string;
  name: string;
  parentId: string | null
  size: number;
  type: string;
  url: string;
  tags: string[];
  totalFiles?: number;
  isFavorited: boolean;
  createdAt: IDateValue;
  modifiedAt: IDateValue;
};

export type IFileManager = {
  id: string;
  name: string;
  parentId: string | null
  size: number;
  type: string;
  url: string;
  tags: string[];
  isFavorited: boolean;
  createdAt: IDateValue;
  modifiedAt: IDateValue;
};

export type FileDetail = IFileManager & {
  description: string;
  niveau: string;
  matiere: string;
  chapitre: string;
  exercice: string;
};

export type IFile = IFileManager | IFolderManager;
