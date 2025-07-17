import { StoreinoPlans } from '../types';

export const storeinoPlans: StoreinoPlans = {
  free: {
    name: 'Free plan',
    price: 0,
    features: ['Online store', 'Unlimited products', '0.2% order fee']
  },
  startup: {
    name: 'Startup',
    price: 169,
    features: ['Online store', 'Unlimited orders', 'Unlimited products', 'Three users']
  },
  business: {
    name: 'Business',
    price: 890,
    features: ['All professional features', 'VIP Support', 'Android and iOS application', 'Free domain name']
  },
  pro: {
    name: 'Pro',
    price: 390,
    features: ['All startup features', 'Multilanguages store', 'Multiple templates', 'Stock management']
  }
};