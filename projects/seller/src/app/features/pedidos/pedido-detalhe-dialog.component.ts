import { Component, inject, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Pedido, MetodoPagamento, StatusPedido } from 'models';
import { InformarRastreioDialogComponent } from './informar-rastreio-dialog.component';

const STATUS_CONFIG: Record<StatusPedido, { label: string; css: string }> = {
  PENDENTE:             { label: 'Pendente',             css: 'status-pendente' },
  AGUARDANDO_PAGAMENTO: { label: 'Aguard. Pagamento',    css: 'status-aguardando' },
  APROVADO:             { label: 'Aprovado',             css: 'status-aprovado' },
  CANCELADO:            { label: 'Cancelado',            css: 'status-cancelado' },
  REEMBOLSADO:          { label: 'Reembolsado',          css: 'status-reembolsado' },
  EXPIRADO:             { label: 'Expirado',             css: 'status-expirado' },
};

const METODO_LABEL: Record<MetodoPagamento, string> = {
  CARTAO_CREDITO:  'Cartao de Credito',
  PIX:             'PIX',
  BOLETO:          'Boleto',
  BOLETO_PARCELADO:'Boleto Parcelado',
};

@Component({
  selector: 'app-pedido-detalhe-dialog',
  imports: [MatDialogModule, MatButtonModule, MatChipsModule, MatIconModule, CurrencyPipe, DatePipe],
  template: `
    <h2 mat-dialog-title>Detalhes do Pedido</h2>

    <mat-dialog-content>
      <div class="section">
        <span class="label">ID</span>
        <span class="value mono">{{ pedido.id }}</span>
      </div>

      <div class="section">
        <span class="label">Status</span>
        <mat-chip [class]="statusConfig.css">{{ statusConfig.label }}</mat-chip>
      </div>

      <div class="section">
        <span class="label">Data</span>
        <span class="value">{{ pedido.criadoEm | date:'dd/MM/yyyy HH:mm' }}</span>
      </div>

      <hr />

      <h3 class="subsection-title">Comprador</h3>

      <div class="section">
        <span class="label">Nome</span>
        <span class="value">{{ pedido.cliente.nome }}</span>
      </div>
      <div class="section">
        <span class="label">Email</span>
        <span class="value">{{ pedido.cliente.email }}</span>
      </div>
      <div class="section">
        <span class="label">Documento</span>
        <span class="value">{{ pedido.cliente.documento }}</span>
      </div>

      <hr />

      <h3 class="subsection-title">Pagamento</h3>

      <div class="section">
        <span class="label">Metodo</span>
        <span class="value">{{ metodoLabel }}</span>
      </div>
      <div class="section">
        <span class="label">Valor</span>
        <span class="value valor">{{ pedido.valor | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</span>
      </div>
      @if (pedido.parcelas > 1) {
        <div class="section">
          <span class="label">Parcelas</span>
          <span class="value">{{ pedido.parcelas }}x</span>
        </div>
      }
      @if (pedido.referenciaGateway) {
        <div class="section">
          <span class="label">Ref. Gateway</span>
          <span class="value mono small">{{ pedido.referenciaGateway }}</span>
        </div>
      }

      <hr />

      <h3 class="subsection-title">Produto</h3>

      <div class="section">
        <span class="label">ID</span>
        <span class="value mono small">{{ pedido.produtoId }}</span>
      </div>
      <div class="section">
        <span class="label">Tipo</span>
        <span class="value">{{ pedido.tipoProduto }}</span>
      </div>
      @if (pedido.ofertaId) {
        <div class="section">
          <span class="label">Oferta ID</span>
          <span class="value mono small">{{ pedido.ofertaId }}</span>
        </div>
      }

      @if (pedido.tipoProduto === 'FISICO') {
        <hr />
        <h3 class="subsection-title">Envio</h3>

        @if (pedido.codigoRastreio) {
          <div class="section">
            <span class="label">Rastreio</span>
            <span class="value mono">{{ pedido.codigoRastreio }}</span>
          </div>
        } @else {
          <div class="section">
            <span class="label">Rastreio</span>
            <span class="value hint">Nao informado</span>
          </div>
        }
      }

      @if (pedido.tipoProduto !== 'FISICO' && pedido.urlDownload) {
        <hr />
        <h3 class="subsection-title">Entrega Digital</h3>
        <div class="section">
          <span class="label">URL Download</span>
          <a [href]="pedido.urlDownload" target="_blank" class="value link">{{ pedido.urlDownload }}</a>
        </div>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      @if (pedido.tipoProduto === 'FISICO' && pedido.status === 'APROVADO') {
        <button mat-button color="primary" (click)="informarRastreio()">
          <mat-icon>local_shipping</mat-icon>
          Informar Rastreio
        </button>
      }
      <button mat-button mat-dialog-close>Fechar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content { display: flex; flex-direction: column; gap: 6px; min-width: 400px; padding-top: 8px; }
    .section { display: flex; align-items: baseline; gap: 12px; min-height: 28px; }
    .label { font-size: 0.78rem; color: var(--mat-sys-on-surface-variant); min-width: 110px; flex-shrink: 0; }
    .value { font-size: 0.9rem; }
    .hint { font-style: italic; color: var(--mat-sys-on-surface-variant); }
    .mono { font-family: monospace; font-size: 0.8rem; word-break: break-all; }
    .small { font-size: 0.78rem; }
    .valor { font-weight: 600; font-size: 1.1rem; color: var(--mat-sys-primary); }
    .link { font-size: 0.8rem; word-break: break-all; color: var(--mat-sys-primary); }
    .subsection-title { font-size: 0.85rem; font-weight: 600; margin: 4px 0 2px; color: var(--mat-sys-on-surface-variant); text-transform: uppercase; letter-spacing: 0.05em; }
    hr { border: none; border-top: 1px solid var(--mat-sys-outline-variant); margin: 6px 0; }

    mat-chip.status-aprovado    { --mdc-chip-label-text-color: #1b5e20; background: #e8f5e9; }
    mat-chip.status-pendente    { --mdc-chip-label-text-color: #616161; background: #f5f5f5; }
    mat-chip.status-aguardando  { --mdc-chip-label-text-color: #e65100; background: #fff3e0; }
    mat-chip.status-cancelado   { --mdc-chip-label-text-color: #b71c1c; background: #ffebee; }
    mat-chip.status-reembolsado { --mdc-chip-label-text-color: #4a148c; background: #f3e5f5; }
    mat-chip.status-expirado    { --mdc-chip-label-text-color: #757575; background: #eeeeee; }
  `],
})
export class PedidoDetalheDialogComponent {
  private dialog = inject(MatDialog);
  private ref    = inject(MatDialogRef<PedidoDetalheDialogComponent>);

  pedido: Pedido;
  statusConfig: { label: string; css: string };
  metodoLabel: string;

  constructor(@Inject(MAT_DIALOG_DATA) data: Pedido) {
    this.pedido = data;
    this.statusConfig = STATUS_CONFIG[data.status] ?? { label: data.status, css: 'status-pendente' };
    this.metodoLabel = METODO_LABEL[data.metodo] ?? data.metodo;
  }

  informarRastreio(): void {
    const dialogRef = this.dialog.open(InformarRastreioDialogComponent, {
      data: this.pedido,
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(codigoRastreio => {
      if (codigoRastreio) {
        this.pedido = { ...this.pedido, codigoRastreio };
        this.ref.close(this.pedido);
      }
    });
  }
}
