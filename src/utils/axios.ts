import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.site.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  amelioration: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    signIn: '/api/auth/sign-in',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  role: {
    list: '/api/user-management/roles',
    add: '/api/user-management/roles',
    edit: '/api/user-management/roles/id',
    details: '/api/user-management/roles/id',
    isAssigned: '/api/user-management/roles/id/is-assigned',
  },
  user: {
    list: '/api/user-management/users',
  },
  admin: {
    add: '/api/user-management/admins',
    delete: '/api/user-management/admins/id/soft-delete',
    block: '/api/user-management/admins/id/block',
    suspend: '/api/user-management/admins/id/suspend',
    reactivate: '/api/user-management/admins/id/reactivate',
  },
  parent: {
    add: '/api/user-management/parents',
    delete: '/api/user-management/parents/id/soft-delete',
    block: '/api/user-management/parents/id/block',
    suspend: '/api/user-management/parents/id/suspend',
    reactivate: '/api/user-management/parents/id/reactivate',
  },
  child: {
    add: '/api/user-management/children',
    delete: '/api/user-management/children/id/soft-delete',
    deleteByParent: '/api/user-management/children/parent/id/soft-delete',
    blockByParent: '/api/user-management/children/parent/id/block',
    suspendByParent: '/api/user-management/children/parent/id/suspend',
    details: '/api/user-management/children/id',
    block: '/api/user-management/children/id/block',
    suspend: '/api/user-management/children/id/suspend',
    reactivate: '/api/user-management/children/id/reactivate',
  },
};
