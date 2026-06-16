const GATEWAY = 'https://gateway-service.yellowmushroom-6c4bca83.brazilsouth.azurecontainerapps.io';

export const environment = {
  production: true,
  api: {
    iamUrl: GATEWAY,
    catalogUrl: GATEWAY,
    commerceUrl: GATEWAY,
    financialUrl: GATEWAY,
    subscriptionUrl: GATEWAY,
  },
};
