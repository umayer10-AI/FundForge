export type UserRole = 'supporter' | 'creator' | 'admin';
export type CampaignStatus = 'pending' | 'approved' | 'rejected' | 'suspended' | 'completed';

export interface User {
  _id: string;
  name: string;
  email: string;
  photo?: string;
  role: UserRole;
  credits: number;
  provider: string;
  emailVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
}

export interface Campaign {
  _id: string;
  title: string;
  story: string;
  category: string;
  goal: number;
  minimumContribution: number;
  deadline: string;
  reward?: string;
  image?: string;
  creatorId: string;
  creatorName: string;
  creatorEmail: string;
  raisedAmount: number;
  totalSupporters: number;
  status: CampaignStatus;
  rejectionReason?: string;
  createdAt: string;
}

export interface Contribution {
  _id: string;
  campaignId: string;
  campaignTitle: string;
  supporterId: string;
  supporterName: string;
  supporterEmail: string;
  creatorId: string;
  creatorEmail: string;
  amount: number;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Withdrawal {
  _id: string;
  creatorId: string;
  creatorEmail: string;
  credits: number;
  amount: number;
  paymentMethod: string;
  accountNumber: string;
  remarks?: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  approvedAt?: string;
}

export interface Payment {
  _id: string;
  userId: string;
  email: string;
  packageName: string;
  credits: number;
  price: number;
  currency: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  icon: string;
  toEmail: string;
  fromEmail: string;
  actionRoute?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Report {
  _id: string;
  campaignId: string;
  campaignTitle: string;
  reportedBy: string;
  reporterEmail: string;
  reason: string;
  description?: string;
  status: string;
  createdAt: string;
}

export interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  name: string;
  popular?: boolean;
  save?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  message: string;
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
