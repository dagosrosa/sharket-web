import { Routes } from '@angular/router';
import { authGuard } from 'auth';

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
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'pedidos',
        loadComponent: () =>
          import('./features/pedidos/pedidos.component').then(m => m.PedidosComponent),
      },
      {
        path: 'pedidos/:id',
        loadComponent: () =>
          import('./features/pedidos/detalhe/pedido-detalhe.component').then(
            m => m.PedidoDetalheComponent
          ),
      },
      {
        path: 'assinaturas',
        loadComponent: () =>
          import('./features/assinaturas/assinaturas.component').then(m => m.AssinaturasComponent),
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./features/perfil/perfil.component').then(m => m.PerfilComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'app/dashboard' },
];
