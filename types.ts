
export type UserRole = 'user' | 'admin';
export type SubscriptionTier = 'free' | 'premium';
export type RecurrenceType = 'one-time' | 'weekly' | 'monthly' | 'termly' | 'yearly';
export type BillCategory = 'rent' | 'utilities' | 'subscription' | 'loan' | 'insurance' | 'other';
export type ReminderType = '7-day' | '3-day' | 'due-date';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  tier: SubscriptionTier;
  createdAt: string;
  lastLoginAt: string;
  isActive: boolean;
  adminSlug?: string; // Secret slug generated for the admin
}

export interface Bill {
  id: string;
  userId: string;
  name: string;
  category: BillCategory;
  amount: number;
  currency: string;
  dueDate: string;
  recurrence: RecurrenceType;
  isPaid: boolean;
  remindersSent: ReminderType[]; // Track multiple reminder stages
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  timestamp: string;
  details: string;
}

export interface AppState {
  users: User[];
  bills: Bill[];
  logs: AuditLog[];
  systemMaintenance: boolean;
  limits: {
    freeBillLimit: number;
  };
}
