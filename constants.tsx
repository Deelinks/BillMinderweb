
import React from 'react';
import { 
  CreditCard, 
  Home, 
  Zap, 
  FileText, 
  Users, 
  BarChart3, 
  ShieldCheck,
  Smartphone
} from 'lucide-react';

export const ADMIN_EMAIL = 'asksham4me2@gmail.com';
export const FREE_BILL_LIMIT = 5;

export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  rent: <Home className="w-4 h-4" />,
  utilities: <Zap className="w-4 h-4" />,
  subscription: <CreditCard className="w-4 h-4" />,
  loan: <Smartphone className="w-4 h-4" />,
  insurance: <ShieldCheck className="w-4 h-4" />,
  other: <FileText className="w-4 h-4" />,
};

export const RECURRENCE_OPTIONS = [
  { value: 'one-time', label: 'One-time' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'termly', label: 'Termly (4 Months)' },
  { value: 'yearly', label: 'Yearly' },
];

export const CATEGORY_OPTIONS = [
  { value: 'rent', label: 'Rent' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'subscription', label: 'Subscription' },
  { value: 'loan', label: 'Loan' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'other', label: 'Other' },
];

export const CURRENCY_OPTIONS = [
  { value: 'USD', symbol: '$', label: 'USD - US Dollar' },
  { value: 'EUR', symbol: '€', label: 'EUR - Euro' },
  { value: 'GBP', symbol: '£', label: 'GBP - British Pound' },
  { value: 'NGN', symbol: '₦', label: 'NGN - Nigerian Naira' },
  { value: 'INR', symbol: '₹', label: 'INR - Indian Rupee' },
  { value: 'CAD', symbol: 'CA$', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', symbol: 'A$', label: 'AUD - Australian Dollar' },
  { value: 'JPY', symbol: '¥', label: 'JPY - Japanese Yen' },
];

export const getCurrencySymbol = (code: string) => {
  return CURRENCY_OPTIONS.find(c => c.value === code)?.symbol || code;
};
