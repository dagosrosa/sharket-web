const GATEWAY = 'https://api.sharket.com';

export const environment = {
  production: true,
  // Prod: todos os serviços via API Gateway
  api: {
    iamUrl: GATEWAY,
    catalogUrl: GATEWAY,
    commerceUrl: GATEWAY,
    financialUrl: GATEWAY,
    subscriptionUrl: GATEWAY,
  },
};
