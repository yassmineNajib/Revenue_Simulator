export interface SimulationInputs {
  monthlyVisitors: number;
  conversionRate: number;
  averageCartValue: number;
  storeinoFees: number;
  otherCosts: number;
}

export interface SimulationResults {
  grossRevenue: number;
  netRevenue: number;
  profitMargin: number;
  monthlyProfit: number;
}

export interface StoreinoPlans {
  [key: string]: {
    name: string;
    price: number;
    features: string[];
  };
}

export interface MerchantData {
  id: string;
  name: string;
  email: string;
  storeUrl: string;
  plan: string;
  metrics: {
    monthlyVisitors: number;
    conversionRate: number;
    averageCartValue: number;
    totalOrders: number;
    totalRevenue: number;
    customerCount: number;
    averageOrderFrequency: number;
    customerLifespan: number;
  };
  lastUpdated: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  merchant: MerchantData | null;
  loading: boolean;
  error: string | null;
}

export type Language = 'en' | 'fr';