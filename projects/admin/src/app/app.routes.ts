import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'app/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'app',
    loadComponent: () =>
      import('./features/shell/shell.component').then(m => m.ShellComponent),
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'planos',
        loadComponent: () =>
          import('./features/planos/planos.component').then(m => m.PlanosComponent),
      },
      {
        path: 'feature-flags',
        loadComponent: () =>
          import('./features/feature-flags/feature-flags.component').then(
            m => m.FeatureFlagsComponent
          ),
      },
      {
        path: 'oauth',
        loadComponent: () =>
          import('./features/oauth/oauth.component').then(m => m.OAuthComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'app/dashboard' },
];
