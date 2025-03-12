export type IRoleItem = {
  id: string;
  name: string;
  description: string;
  permissionLevel: string[];
  createdAt: Date;
};

export interface IRoleTableFilters {
  name: string;
  description: string;
  permissionLevel: string[];
  createdAt: Date;
}
