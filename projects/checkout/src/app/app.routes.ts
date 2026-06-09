import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'erro', pathMatch: 'full' },
  {
    path: 'loja/:contaId/:produtoId',
    loadComponent: () =>
      import('./features/produto/produto-page.component').then(m => m.ProdutoPageComponent),
  },
  {
    path: 'checkout/:contaId/:produtoId',
    loadComponent: () =>
      import('./features/checkout/checkout-page.component').then(m => m.CheckoutPageComponent),
  },
  {
    path: 'sucesso',
    loadComponent: () =>
      import('./features/sucesso/sucesso.component').then(m => m.SucessoComponent),
  },
  {
    path: 'erro',
    loadComponent: () =>
      import('./features/erro/erro.component').then(m => m.ErroComponent),
  },
  { path: '**', redirectTo: 'erro' },
];
