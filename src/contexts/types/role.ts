export interface IModulePermission {
  module: string;
  permissions: string[];
}

export interface IRoleItem {
  id: string;
  name: string;
  description: string;
  modulePermissions: IModulePermission[];
  createdAt: Date;
}

export interface IRoleTableFilters {
  name: string;
  description: string;
  modulePermissions: IModulePermission[];
  createdAt: Date;
}
