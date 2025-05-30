import type { IRoleItem } from 'src/contexts/types/role';

import axios from 'axios';

import { endpoints } from 'src/utils/axios';

import { GATEWAY_API_URL } from 'src/config-global';

export interface UserRequest {
  lastName: string;
  firstName: string;
  email: string;
  birthDate: string;
  phoneNumber: string;
}

export interface AdminRequest extends UserRequest {
  roleIds: string[];
}

export interface ChildRequest extends UserRequest {
  parentId: string;
}

export interface ParentRequest extends UserRequest {}

export interface IUserItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  role: string;
  status: string;
  lastLogin: string | null;
  createdAt: Date;
}
interface UsersApiResponse {
  users: IUserItem[];
  total: number;
  statusCounts: Record<string, number>;
}

interface SuspensionRequest {
  reason: string;
  suspensionEnd: string;
}

const transformDate = (dateArray: number[]): Date => {
  if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 6) {
    return new Date();
  }

  return new Date(
    dateArray[0],
    dateArray[1] - 1,
    dateArray[2],
    dateArray[3],
    dateArray[4],
    dateArray[5]
  );
};

export const roleService = {
  async getAllRoles(): Promise<IRoleItem[]> {
    try {
      const response = await axios({
        method: 'get',
        url: `${GATEWAY_API_URL}${endpoints.role.list}`,
        headers: { 'Content-Type': 'application/json' },
      });

      return response.data.content.map(
        (roleItem: any): IRoleItem => ({
          id: roleItem.id,
          name: roleItem.name,
          description: roleItem.description,
          permissions: roleItem.permissions,
          createdAt: transformDate(roleItem.createdAt),
        })
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des rôles:', error);
      throw error;
    }
  },
};
export const userService = {
  async getAllUsers(
    filters: {
      page?: number;
      size?: number;
      sortBy?: string;
      sortDirection?: string;
      nameSearch?: string;
      emailSearch?: string;
      statusSearch?: string;
      dateSearch?: string;
      lastLoginSearch?: string;
      roleSearch?: string;
    } = {}
  ): Promise<UsersApiResponse> {
    try {
      const response = await axios.get(`${GATEWAY_API_URL}${endpoints.user.list}`, {
        headers: { 'Content-Type': 'application/json' },
        params: {
          page: filters.page ?? 0,
          size: filters.size ?? 10,
          sortBy: filters.sortBy ?? 'createdAt',
          sortDirection: filters.sortDirection ?? 'desc',
          nameSearch: filters.nameSearch,
          emailSearch: filters.emailSearch,
          statusSearch: filters.statusSearch,
          dateSearch: filters.dateSearch,
          lastLoginSearch: filters.lastLoginSearch,
          roleSearch: filters.roleSearch,
        },
      });

      return {
        users: response.data.users.map(
          (user: any): IUserItem => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userType: user.userType,
            status: user.status,
            role: user.userType,
            lastLogin: user.lastLogin,
            createdAt: transformDate(user.createdAt),
          })
        ),
        total: response.data.total,
        statusCounts: response.data.statusCounts,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  },

  async addParent(parentRequest: ParentRequest, imageFile?: File): Promise<ParentRequest[]> {
    try {
      const formData = new FormData();
      formData.append('saveUserRequest', JSON.stringify(parentRequest));
      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      const response = await axios.post(`${GATEWAY_API_URL}${endpoints.parent.add}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la creation du parent:', error);
      throw error;
    }
  },
  async addAdmin(adminRequest: AdminRequest, imageFile?: File): Promise<AdminRequest> {
    try {
      const formData = new FormData();
      formData.append('saveUserRequest', JSON.stringify(adminRequest));
      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      const response = await axios.post(`${GATEWAY_API_URL}${endpoints.admin.add}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la creation du admin:', error);
      throw error;
    }
  },
  async addChild(childRequest: ChildRequest, imageFile?: File): Promise<ChildRequest> {
    try {
      const formData = new FormData();
      formData.append('saveUserRequest', JSON.stringify(childRequest));

      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      const response = await axios.post(`${GATEWAY_API_URL}${endpoints.child.add}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la creation du enfant:', error);
      throw error;
    }
  },
  deleteChild: async (childId: string) => {
    try {
      await axios({
        method: 'PATCH',
        url: `${GATEWAY_API_URL}${endpoints.child.delete.replace('id', childId)}`,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'enfant", error);
      throw error;
    }
  },
  deleteChildrenByParent: async (parentId: string) => {
    try {
      await axios({
        method: 'PATCH',
        url: `${GATEWAY_API_URL}${endpoints.child.deleteByParent.replace('id', parentId)}`,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Erreur lors de la suppression des enfants du parent', error);
      throw error;
    }
  },
  suspendChildrenByParent: async (parentId: string, suspensionEnd: string) => {
    try {
      await axios.patch(
        `${GATEWAY_API_URL}${endpoints.child.suspendByParent.replace('id', parentId)}`,
        {
          suspensionEnd,
        }
      );
    } catch (error) {
      console.error('Erreur lors de la suppression des enfants du parent', error);
      throw error;
    }
  },
  blockChildrenByParent: async (parentId: string) => {
    try {
      await axios.patch(
        `${GATEWAY_API_URL}${endpoints.child.blockByParent.replace('id', parentId)}`
      );
    } catch (error) {
      console.error('Erreur lors de la suppression des enfants du parent', error);
      throw error;
    }
  },
  async blockChild(id: string, reason: string): Promise<void> {
    try {
      await axios.patch(`${GATEWAY_API_URL}${endpoints.child.block.replace('id', id)}`, reason, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    } catch (error) {
      console.error("Erreur lors du blockage de l'admin", error);
      throw error;
    }
  },

  async suspendChild(id: string, suspensionRequest: SuspensionRequest): Promise<void> {
    try {
      await axios.patch(
        `${GATEWAY_API_URL}${endpoints.child.suspend.replace('id', id)}`,
        suspensionRequest
      );
    } catch (error) {
      console.error("Erreur lors de la suspension de l'administrateur", error);
      throw error;
    }
  },
  reactivateChild: async (parentId: string) => {
    try {
      await axios({
        method: 'PATCH',
        url: `${GATEWAY_API_URL}${endpoints.child.reactivate.replace('id', parentId)}`,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du parent', error);
      throw error;
    }
  },
  deleteAdmin: async (adminId: string) => {
    console.log('i am here in delete admin', adminId);

    try {
      await axios({
        method: 'PATCH',
        url: `${GATEWAY_API_URL}${endpoints.admin.delete.replace('id', adminId)}`,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'admin", error);
      throw error;
    }
  },
  async blockAdmin(id: string, reason: string): Promise<void> {
    try {
      await axios.patch(`${GATEWAY_API_URL}${endpoints.admin.block.replace('id', id)}`, reason, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    } catch (error) {
      console.error("Erreur lors du blockage de l'admin", error);
      throw error;
    }
  },

  async suspendAdmin(id: string, suspensionRequest: SuspensionRequest): Promise<void> {
    try {
      await axios.patch(
        `${GATEWAY_API_URL}${endpoints.admin.suspend.replace('id', id)}`,
        suspensionRequest
      );
    } catch (error) {
      console.error("Erreur lors de la suspension de l'administrateur", error);
      throw error;
    }
  },
  reactivateAdmin: async (parentId: string) => {
    try {
      await axios({
        method: 'PATCH',
        url: `${GATEWAY_API_URL}${endpoints.admin.reactivate.replace('id', parentId)}`,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du parent', error);
      throw error;
    }
  },
  deleteParent: async (parentId: string) => {
    try {
      await axios({
        method: 'PATCH',
        url: `${GATEWAY_API_URL}${endpoints.parent.delete.replace('id', parentId)}`,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du parent', error);
      throw error;
    }
  },
  reactivateParent: async (parentId: string) => {
    try {
      await axios({
        method: 'PATCH',
        url: `${GATEWAY_API_URL}${endpoints.parent.reactivate.replace('id', parentId)}`,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du parent', error);
      throw error;
    }
  },
  async blockParent(id: string, reason: string): Promise<void> {
    try {
      await axios.patch(`${GATEWAY_API_URL}${endpoints.parent.block.replace('id', id)}`, reason, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    } catch (error) {
      console.error("Erreur lors du blockage de l'admin", error);
      throw error;
    }
  },

  async suspendParent(id: string, suspensionRequest: SuspensionRequest): Promise<void> {
    try {
      await axios.patch(
        `${GATEWAY_API_URL}${endpoints.parent.suspend.replace('id', id)}`,
        suspensionRequest
      );
    } catch (error) {
      console.error("Erreur lors de la suspension de l'administrateur", error);
      throw error;
    }
  },
};

export const apiService = {
  role: roleService,
  user: userService,
};

export default apiService;
