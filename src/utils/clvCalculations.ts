import { CLVInputs, CLVResults } from '../types';

export const calculateCLV = (inputs: CLVInputs): CLVResults => {
  const { averageOrderValue, purchaseFrequency, customerLifespan, customerAcquisitionCost, churnRate } = inputs;
  
  // Basic CLV calculation
  const basicCLV = averageOrderValue * purchaseFrequency * customerLifespan;
  
  // Churn-adjusted CLV calculation using geometric series
  // CLV = AOV * Frequency * (1 - (1 - churnRate/100)^lifespan) / (churnRate/100)
  const monthlyChurnRate = churnRate / 100;
  let churnAdjustedCLV = basicCLV;
  
  if (monthlyChurnRate > 0 && monthlyChurnRate < 1) {
    const retentionRate = 1 - monthlyChurnRate;
    const discountFactor = (1 - Math.pow(retentionRate, customerLifespan)) / monthlyChurnRate;
    churnAdjustedCLV = averageOrderValue * purchaseFrequency * discountFactor;
  }
  
  // Net CLV calculations
  const netCLV = basicCLV - customerAcquisitionCost;
  const netChurnAdjustedCLV = churnAdjustedCLV - customerAcquisitionCost;
  
  // Additional metrics
  const totalRevenue = churnAdjustedCLV;
  const profitMargin = totalRevenue > 0 ? (netChurnAdjustedCLV / totalRevenue) * 100 : 0;
  const paybackPeriod = averageOrderValue * purchaseFrequency > 0 
    ? customerAcquisitionCost / (averageOrderValue * purchaseFrequency) 
    : 0;
  const roi = customerAcquisitionCost > 0 ? ((netChurnAdjustedCLV / customerAcquisitionCost) * 100) : 0;
  
  return {
    basicCLV,
    churnAdjustedCLV,
    netCLV,
    netChurnAdjustedCLV,
    totalRevenue,
    profitMargin,
    paybackPeriod,
    roi
  };
};

export const generateRevenueOverTime = (inputs: CLVInputs, months: number = 24) => {
  const { averageOrderValue, purchaseFrequency, churnRate } = inputs;
  const monthlyChurnRate = churnRate / 100;
  const retentionRate = 1 - monthlyChurnRate;
  
  return Array.from({ length: months }, (_, index) => {
    const month = index + 1;
    const survivingCustomers = Math.pow(retentionRate, month - 1);
    const monthlyRevenue = averageOrderValue * purchaseFrequency * survivingCustomers;
    const cumulativeRevenue = Array.from({ length: month }, (_, i) => {
      const survivalRate = Math.pow(retentionRate, i);
      return averageOrderValue * purchaseFrequency * survivalRate;
    }).reduce((sum, revenue) => sum + revenue, 0);
    
    return {
      month,
      monthlyRevenue: Math.round(monthlyRevenue),
      cumulativeRevenue: Math.round(cumulativeRevenue),
      survivingCustomers: Math.round(survivingCustomers * 100) / 100
    };
  });
};

export const formatCurrency = (amount: number, currency: string = 'MAD'): string => {
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

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value);
};