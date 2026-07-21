import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token') || getCookie('session_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : undefined;
}

export default api;

export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  googleAuth: (data: any) => api.post('/auth/google', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  changePassword: (data: any) => api.put('/auth/change-password', data),
};

export const campaignApi = {
  getAll: (params?: any) => api.get('/campaigns', { params }),
  getFeatured: () => api.get('/campaigns/featured'),
  getCategories: () => api.get('/campaigns/categories'),
  getById: (id: string) => api.get(`/campaigns/${id}`),
  getMyCampaigns: (params?: any) => api.get('/campaigns/my', { params }),
  create: (data: any) => api.post('/campaigns', data),
  update: (id: string, data: any) => api.put(`/campaigns/${id}`, data),
  delete: (id: string) => api.delete(`/campaigns/${id}`),
};

export const contributionApi = {
  create: (data: any) => api.post('/contributions', data),
  getMyContributions: (params?: any) => api.get('/contributions/my', { params }),
  getCreatorContributions: (params?: any) => api.get('/contributions/creator', { params }),
  getCampaignContributions: (campaignId: string, params?: any) =>
    api.get(`/contributions/campaign/${campaignId}`, { params }),
  approve: (id: string) => api.put(`/contributions/${id}/approve`),
  reject: (id: string) => api.put(`/contributions/${id}/reject`),
};

export const paymentApi = {
  getPackages: () => api.get('/payments/packages'),
  getHistory: (params?: any) => api.get('/payments/history', { params }),
  createCheckoutSession: (data: any) => api.post('/payments/create-checkout-session', data),
  verifySession: (sessionId: string) => api.get('/payments/verify', { params: { session_id: sessionId } }),
};

export const withdrawalApi = {
  getMyWithdrawals: (params?: any) => api.get('/withdrawals/my', { params }),
  request: (data: any) => api.post('/withdrawals', data),
};

export const reportApi = {
  create: (data: any) => api.post('/reports', data),
};

export const aiApi = {
  chat: (data: any) => api.post('/ai/chat', data),
};

export const notificationApi = {
  getAll: (params?: any) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id: string) => api.delete(`/notifications/${id}`),
  clearAll: () => api.delete('/notifications'),
};

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAnalytics: () => api.get('/admin/analytics'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  updateUserRole: (id: string, role: string) => api.put(`/admin/users/${id}/role`, { role }),
  toggleUserStatus: (id: string, action: string) => api.put(`/admin/users/${id}/status`, { action }),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  getCampaigns: (params?: any) => api.get('/admin/campaigns', { params }),
  approveCampaign: (id: string) => api.put(`/admin/campaigns/${id}/approve`),
  rejectCampaign: (id: string, reason?: string) => api.put(`/admin/campaigns/${id}/reject`, { reason }),
  getWithdrawals: (params?: any) => api.get('/admin/withdrawals', { params }),
  getPendingWithdrawals: () => api.get('/admin/withdrawals/pending'),
  approveWithdrawal: (id: string) => api.put(`/admin/withdrawals/${id}/approve`),
  rejectWithdrawal: (id: string, reason?: string) => api.put(`/admin/withdrawals/${id}/reject`, { reason }),
  getReports: (params?: any) => api.get('/admin/reports', { params }),
  reviewReport: (id: string) => api.put(`/admin/reports/${id}/review`),
  dismissReport: (id: string) => api.put(`/admin/reports/${id}/dismiss`),
  resolveReport: (id: string) => api.put(`/admin/reports/${id}/resolve`),
  suspendCampaign: (id: string, reason?: string) => api.put(`/admin/reports/${id}/suspend`, { reason }),
  getPayments: (params?: any) => api.get('/admin/payments', { params }),
};

export const dashboardApi = {
  getSupporterStats: () => api.get('/dashboard/supporter'),
  getCreatorStats: () => api.get('/dashboard/creator'),
  getCreatorAnalytics: () => api.get('/dashboard/creator/analytics'),
};
