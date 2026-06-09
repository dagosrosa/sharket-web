import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyPipe } from '@angular/common';
import { CatalogService } from 'api';
import { CheckoutStateService } from '../../services/checkout-state.service';
import { Produto } from 'models';

@Component({
  selector: 'app-produto-page',
  imports: [MatCardModule, MatButtonModule, MatProgressSpinnerModule, CurrencyPipe],
  template: `
    <div class="page">
      <div class="brand">Sharket</div>

      @if (loading()) {
        <mat-spinner diameter="48" />
      } @else if (produto(); as p) {
        <mat-card class="produto-card">
          <mat-card-header>
            <mat-card-title>{{ p.nome }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p class="descricao">{{ p.descricao }}</p>
            <p class="preco">{{ p.preco | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-flat-button (click)="comprar()">
              Comprar agora
            </button>
          </mat-card-actions>
        </mat-card>
      } @else {
        <p class="error">Produto não encontrado ou indisponível.</p>
      }
    </div>
  `,
  styles: [`
    .page { display: flex; flex-direction: column; align-items: center; min-height: 100vh; padding: 40px 16px; background: var(--mat-sys-surface-container-low); }
    .brand { font-size: 1.5rem; font-weight: 700; color: var(--mat-sys-primary); margin-bottom: 40px; }
    .produto-card { width: 100%; max-width: 480px; }
    .descricao { color: var(--mat-sys-on-surface-variant); margin: 8px 0 16px; }
    .preco { font-size: 2rem; font-weight: 600; color: var(--mat-sys-primary); margin: 0; }
    mat-card-actions { padding: 16px; button { width: 100%; } }
    .error { color: var(--mat-sys-error); }
    mat-spinner { margin: 80px auto; }
  `],
})
export class ProdutoPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private catalog = inject(CatalogService);
  private state = inject(CheckoutStateService);

  produto = signal<Produto | null>(null);
  loading = signal(true);

  private contaId = '';
  private produtoId = '';

  ngOnInit(): void {
    this.contaId = this.route.snapshot.paramMap.get('contaId')!;
    this.produtoId = this.route.snapshot.paramMap.get('produtoId')!;
    this.state.contaId.set(this.contaId);

    this.catalog.listar(this.contaId).subscribe({
      next: res => {
        const found = res.data.content.find(p => p.id === this.produtoId) ?? null;
        this.produto.set(found);
        if (found) this.state.produto.set(found);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  comprar(): void {
    this.router.navigate(['/checkout', this.contaId, this.produtoId]);
  }
}
