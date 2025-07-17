import { SimulationInputs, SimulationResults } from '../types';

export const calculateRevenue = (inputs: SimulationInputs): SimulationResults => {
  const grossRevenue = inputs.monthlyVisitors * (inputs.conversionRate / 100) * inputs.averageCartValue;
  const totalCosts = inputs.storeinoFees + inputs.otherCosts;
  const netRevenue = grossRevenue - totalCosts;
  const profitMargin = grossRevenue > 0 ? (netRevenue / grossRevenue) * 100 : 0;
  
  return {
    grossRevenue,
    netRevenue,
    profitMargin,
    monthlyProfit: netRevenue
  };
};

export const formatCurrency = (amount: number, currency: string = 'MAD'): string => {
  // Format with proper thousand separators and currency symbol
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.abs(amount));
  
  const sign = amount < 0 ? '-' : '';
  return `${sign}${formatted} ${currency}`;
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// Generate 12 months of projected data with growth
export const generateRevenueProjection = (results: SimulationResults, months: number = 12) => {
  return Array.from({ length: months }, (_, index) => {
    const month = index + 1;
    const growthFactor = 1 + (month * 0.05); // 5% growth per month
    return {
      month: `Month ${month}`,
      grossRevenue: Math.round(results.grossRevenue * growthFactor),
      netRevenue: Math.round(results.netRevenue * growthFactor),
      profit: Math.round(results.monthlyProfit * growthFactor)
    };
  });
};