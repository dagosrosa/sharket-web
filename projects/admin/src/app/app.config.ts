import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localePtBr from '@angular/common/locales/pt';
import { jwtInterceptor } from 'auth';
import { SHARKET_API_CONFIG } from 'api';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

registerLocaleData(localePtBr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    { provide: SHARKET_API_CONFIG, useValue: environment.api },
  ],
};
