import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CurrencyPipe, DatePipe, SlicePipe } from '@angular/common';
import { AuthService } from 'auth';
import { CommerceService } from 'api';
import { Pedido, StatusPedido } from 'models';
import { PedidoDetalheDialogComponent } from './pedido-detalhe-dialog.component';

const STATUS_CSS: Record<StatusPedido, string> = {
  PENDENTE:             'status-pendente',
  AGUARDANDO_PAGAMENTO: 'status-aguardando',
  APROVADO:             'status-aprovado',
  CANCELADO:            'status-cancelado',
  REEMBOLSADO:          'status-reembolsado',
  EXPIRADO:             'status-expirado',
};

const STATUS_LABEL: Record<StatusPedido, string> = {
  PENDENTE:             'Pendente',
  AGUARDANDO_PAGAMENTO: 'Aguard. Pgto',
  APROVADO:             'Aprovado',
  CANCELADO:            'Cancelado',
  REEMBOLSADO:          'Reembolsado',
  EXPIRADO:             'Expirado',
};

@Component({
  selector: 'app-pedidos',
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatTooltipModule, CurrencyPipe, DatePipe, SlicePipe],
  template: `
    <div class="page-header">
      <h2>Pedidos</h2>
    </div>

    <mat-table [dataSource]="pedidos()">
      <ng-container matColumnDef="id">
        <mat-header-cell *matHeaderCellDef>ID</mat-header-cell>
        <mat-cell *matCellDef="let p" class="mono">{{ p.id | slice:0:8 }}...</mat-cell>
      </ng-container>

      <ng-container matColumnDef="comprador">
        <mat-header-cell *matHeaderCellDef>Comprador</mat-header-cell>
        <mat-cell *matCellDef="let p">{{ p.cliente.email }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="total">
        <mat-header-cell *matHeaderCellDef>Valor</mat-header-cell>
        <mat-cell *matCellDef="let p">{{ p.valor | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="status">
        <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
        <mat-cell *matCellDef="let p">
          <mat-chip [class]="statusCss(p.status)">{{ statusLabel(p.status) }}</mat-chip>
        </mat-cell>
      </ng-container>

      <ng-container matColumnDef="data">
        <mat-header-cell *matHeaderCellDef>Data</mat-header-cell>
        <mat-cell *matCellDef="let p">{{ p.criadoEm | date:'dd/MM/yyyy' }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="acoes">
        <mat-header-cell *matHeaderCellDef></mat-header-cell>
        <mat-cell *matCellDef="let p">
          <button mat-icon-button matTooltip="Ver detalhes" (click)="verDetalhe(p)">
            <mat-icon>open_in_new</mat-icon>
          </button>
        </mat-cell>
      </ng-container>

      <mat-header-row *matHeaderRowDef="colunas"></mat-header-row>
      <mat-row *matRowDef="let row; columns: colunas" class="clickable" (click)="verDetalhe(row)"></mat-row>
    </mat-table>
  `,
  styles: [`
    .page-header { display: flex; align-items: center; margin-bottom: 16px; }
    h2 { margin: 0; }
    mat-table { width: 100%; }
    .mono { font-family: monospace; font-size: 0.85rem; }
    .clickable { cursor: pointer; }
    .clickable:hover { background: var(--mat-sys-surface-variant); }

    mat-chip.status-aprovado    { --mdc-chip-label-text-color: #1b5e20; background: #e8f5e9; }
    mat-chip.status-pendente    { --mdc-chip-label-text-color: #616161; background: #f5f5f5; }
    mat-chip.status-aguardando  { --mdc-chip-label-text-color: #e65100; background: #fff3e0; }
    mat-chip.status-cancelado   { --mdc-chip-label-text-color: #b71c1c; background: #ffebee; }
    mat-chip.status-reembolsado { --mdc-chip-label-text-color: #4a148c; background: #f3e5f5; }
    mat-chip.status-expirado    { --mdc-chip-label-text-color: #757575; background: #eeeeee; }
  `],
})
export class PedidosComponent implements OnInit {
  private auth = inject(AuthService);
  private commerce = inject(CommerceService);
  private dialog = inject(MatDialog);

  pedidos = signal<Pedido[]>([]);
  colunas = ['id', 'comprador', 'total', 'status', 'data', 'acoes'];

  statusCss  = (s: StatusPedido) => STATUS_CSS[s]  ?? 'status-pendente';
  statusLabel = (s: StatusPedido) => STATUS_LABEL[s] ?? s;

  ngOnInit(): void {
    const contaId = this.auth.user()?.contaId;
    if (!contaId) return;
    this.commerce.listar(contaId).subscribe(res => this.pedidos.set(res.data));
  }

  verDetalhe(pedido: Pedido): void {
    this.dialog.open(PedidoDetalheDialogComponent, {
      data: pedido,
      width: '480px',
    });
  }
}
