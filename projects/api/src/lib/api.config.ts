import { InjectionToken } from '@angular/core';

export interface SharketApiConfig {
  iamUrl: string;
  catalogUrl: string;
  commerceUrl: string;
  paymentUrl: string;
  financialUrl: string;
  subscriptionUrl: string;
}

export const SHARKET_API_CONFIG = new InjectionToken<SharketApiConfig>('SHARKET_API_CONFIG', {
  factory: () => ({
    iamUrl: 'http://localhost:8000',
    catalogUrl: 'http://localhost:8000',
    commerceUrl: 'http://localhost:8000',
    paymentUrl: 'http://localhost:8000',
    financialUrl: 'http://localhost:8000',
    subscriptionUrl: 'http://localhost:8000',
  }),
});
