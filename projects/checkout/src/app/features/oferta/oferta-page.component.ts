import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyPipe } from '@angular/common';
import { CatalogService } from 'api';
import { CheckoutStateService } from '../../services/checkout-state.service';
import { OfertaPublica, Produto } from 'models';

@Component({
  selector: 'app-oferta-page',
  imports: [MatCardModule, MatButtonModule, MatProgressSpinnerModule, CurrencyPipe],
  template: `
    <div class="page">
      <div class="brand">Sharket</div>

      @if (loading()) {
        <mat-spinner diameter="48" />
      } @else if (oferta(); as o) {
        <mat-card class="oferta-card">
          <mat-card-header>
            @if (state.branding()?.logoUrl) {
              <img [src]="state.branding()!.logoUrl!" class="seller-logo" alt="Logo" />
            }
            <mat-card-subtitle>{{ state.branding()?.nomeExibicao || o.nomeProduto }}</mat-card-subtitle>
            <mat-card-title>{{ o.nomeOferta }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p class="preco">{{ o.valor | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</p>
            @if (o.tipo === 'PARCELADA' && o.maxParcelas > 1) {
              <p class="parcelas">em ate {{ o.maxParcelas }}x sem juros</p>
            }
          </mat-card-content>
          <mat-card-actions>
            <button mat-flat-button (click)="comprar()">Comprar agora</button>
          </mat-card-actions>
        </mat-card>
      } @else {
        <p class="error">Oferta nao encontrada ou indisponivel.</p>
      }
    </div>
  `,
  styles: [`
    .page { display: flex; flex-direction: column; align-items: center; min-height: 100vh; padding: 40px 16px; background: var(--mat-sys-surface-container-low); }
    .brand { font-size: 1.5rem; font-weight: 700; color: var(--mat-sys-primary); margin-bottom: 40px; }
    .oferta-card { width: 100%; max-width: 480px; }
    .seller-logo { max-height: 56px; max-width: 180px; object-fit: contain; margin-bottom: 8px; }
    .preco { font-size: 2rem; font-weight: 600; color: var(--mat-sys-primary); margin: 16px 0 4px; }
    .parcelas { font-size: 0.9rem; color: var(--mat-sys-on-surface-variant); margin: 0; }
    mat-card-actions { padding: 16px; button { width: 100%; } }
    .error { color: var(--mat-sys-error); }
    mat-spinner { margin: 80px auto; }
  `],
})
export class OfertaPageComponent implements OnInit {
  private route   = inject(ActivatedRoute);
  private router  = inject(Router);
  private catalog = inject(CatalogService);
  state = inject(CheckoutStateService);

  oferta  = signal<OfertaPublica | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const ofertaId = this.route.snapshot.paramMap.get('ofertaId')!;
    this.catalog.buscarOfertaPublica(ofertaId).subscribe({
      next: res => {
        this.oferta.set(res.data);
        this.state.ofertaId.set(res.data.id);
        this.state.tipoProduto.set(res.data.tipoProduto);
        this.state.urlDownload.set(res.data.urlDownload);
        this.state.branding.set({
          nomeExibicao: res.data.nomeExibicao,
          logoUrl: res.data.logoUrl,
          corPrimaria: res.data.corPrimaria,
        });
        this.state.produto.set({
          id: res.data.produtoId,
          nome: res.data.nomeProduto,
          preco: res.data.valor,
        } as Produto);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  comprar(): void {
    this.router.navigate(['/checkout-oferta']);
  }
}
