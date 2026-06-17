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
    path: 'cadastro',
    loadComponent: () =>
      import('./features/auth/cadastro/cadastro.component').then(m => m.CadastroComponent),
  },
  {
    path: 'recuperar-senha',
    loadComponent: () =>
      import('./features/auth/recuperar-senha/recuperar-senha.component').then(m => m.RecuperarSenhaComponent),
  },
  {
    path: 'redefinir-senha',
    loadComponent: () =>
      import('./features/auth/redefinir-senha/redefinir-senha.component').then(m => m.RedefinirSenhaComponent),
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
        path: 'produtos',
        loadComponent: () =>
          import('./features/produtos/produtos.component').then(m => m.ProdutosComponent),
      },
      {
        path: 'pedidos',
        loadComponent: () =>
          import('./features/pedidos/pedidos.component').then(m => m.PedidosComponent),
      },
      {
        path: 'financeiro',
        loadComponent: () =>
          import('./features/financeiro/financeiro.component').then(m => m.FinanceiroComponent),
      },
      {
        path: 'assinaturas',
        loadComponent: () =>
          import('./features/assinaturas/assinaturas.component').then(m => m.AssinaturasComponent),
      },
      {
        path: 'relatorios',
        loadComponent: () =>
          import('./features/relatorios/relatorios.component').then(m => m.RelatoriosComponent),
      },
      {
        path: 'ofertas',
        loadComponent: () =>
          import('./features/ofertas/ofertas.component').then(m => m.OfertasComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'app/dashboard' },
];
