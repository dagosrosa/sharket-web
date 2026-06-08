import { InjectionToken } from '@angular/core';

export interface SharketApiConfig {
  iamUrl: string;
  catalogUrl: string;
  commerceUrl: string;
  financialUrl: string;
  subscriptionUrl: string;
}

export const SHARKET_API_CONFIG = new InjectionToken<SharketApiConfig>('SHARKET_API_CONFIG', {
  factory: () => ({
    iamUrl: 'http://localhost:8080',
    catalogUrl: 'http://localhost:8081',
    commerceUrl: 'http://localhost:8082',
    financialUrl: 'http://localhost:8085',
    subscriptionUrl: 'http://localhost:8084',
  }),
});
