import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyPipe, DatePipe, SlicePipe } from '@angular/common';
import { CommerceService } from 'api';
import { Pedido } from 'models';

@Component({
  selector: 'app-pedido-detalhe',
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    CurrencyPipe,
    DatePipe,
    SlicePipe,
  ],
  template: `
    <div class="page-header">
      <a mat-icon-button routerLink="/app/pedidos">
        <mat-icon>arrow_back</mat-icon>
      </a>
      <h2>Pedido #{{ pedido()?.id | slice:0:8 }}</h2>
    </div>

    @if (!pedido()) {
      <mat-spinner diameter="48" style="margin: 80px auto;" />
    } @else if (pedido(); as p) {
      <div class="grid">

        <mat-card>
          <mat-card-header><mat-card-title>Resumo</mat-card-title></mat-card-header>
          <mat-card-content class="rows">
            <div class="row">
              <span class="label">Status</span>
              <mat-chip>{{ p.status }}</mat-chip>
            </div>
            <div class="row">
              <span class="label">Valor</span>
              <strong>{{ p.valor | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong>
            </div>
            @if (p.parcelas > 1) {
              <div class="row">
                <span class="label">Parcelas</span>
                <span>{{ p.parcelas }}x</span>
              </div>
            }
            <div class="row">
              <span class="label">Método</span>
              <span>{{ p.metodo }}</span>
            </div>
            <div class="row">
              <span class="label">Data</span>
              <span>{{ p.criadoEm | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
            @if (p.referenciaGateway) {
              <div class="row">
                <span class="label">Ref. gateway</span>
                <span class="mono">{{ p.referenciaGateway }}</span>
              </div>
            }
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header><mat-card-title>Comprador</mat-card-title></mat-card-header>
          <mat-card-content class="rows">
            <div class="row">
              <span class="label">Nome</span>
              <span>{{ p.cliente.nome }}</span>
            </div>
            <div class="row">
              <span class="label">Email</span>
              <span>{{ p.cliente.email }}</span>
            </div>
            <div class="row">
              <span class="label">CPF</span>
              <span>{{ p.cliente.documento }}</span>
            </div>
          </mat-card-content>
        </mat-card>

        @if (p.tipoProduto !== 'FISICO' && p.urlDownload) {
          <mat-card class="entrega-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>download</mat-icon>
              <mat-card-title>Download do Produto</mat-card-title>
              <mat-card-subtitle>Seu acesso esta disponivel</mat-card-subtitle>
            </mat-card-header>
            <mat-card-actions>
              <a mat-flat-button color="primary" [href]="p.urlDownload" target="_blank">
                <mat-icon>download</mat-icon>
                Baixar agora
              </a>
            </mat-card-actions>
          </mat-card>
        }

        @if (p.tipoProduto === 'FISICO') {
          <mat-card>
            <mat-card-header><mat-card-title>Envio</mat-card-title></mat-card-header>
            <mat-card-content class="rows">
              @if (p.codigoRastreio) {
                <div class="row">
                  <span class="label">Codigo de rastreio</span>
                  <span class="mono rastreio">{{ p.codigoRastreio }}</span>
                </div>
                <p class="rastreio-hint">Use este codigo para rastrear seu pedido nos Correios ou na transportadora informada pelo vendedor.</p>
              } @else {
                <p class="rastreio-hint">Seu pedido ainda nao foi despachado. Voce recebera um email quando o codigo de rastreio estiver disponivel.</p>
              }
            </mat-card-content>
          </mat-card>
        }

      </div>
    }
  `,
  styles: [`
    .page-header { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; h2 { margin: 0; } }
    .grid { display: grid; gap: 16px; }
    .rows { display: flex; flex-direction: column; gap: 12px; padding-top: 8px; }
    .row { display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; }
    .label { color: var(--mat-sys-on-surface-variant); font-size: 0.8rem; }
    .mono { font-family: monospace; font-size: 0.8rem; }
    .rastreio { font-size: 1rem; font-weight: 600; letter-spacing: 0.05em; }
    .rastreio-hint { font-size: 0.85rem; color: var(--mat-sys-on-surface-variant); margin: 4px 0 0; }
    .entrega-card mat-card-actions { padding: 16px; a { width: 100%; justify-content: center; } }
    @media (min-width: 640px) { .grid { grid-template-columns: 1fr 1fr; } }
  `],
})
export class PedidoDetalheComponent implements OnInit {
  private route    = inject(ActivatedRoute);
  private commerce = inject(CommerceService);

  pedido = signal<Pedido | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.commerce.buscarMinhaCompra(id).subscribe(res => this.pedido.set(res.data));
  }
}
