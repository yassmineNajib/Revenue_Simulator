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

export type Language = 'en' | 'fr';