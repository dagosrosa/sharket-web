import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DatePipe, SlicePipe } from '@angular/common';
import { AuthService } from 'auth';
import { CommerceService } from 'api';
import { Pedido, StatusPedido } from 'models';

const STATUS_LABEL: Record<StatusPedido, string> = {
  CRIADO: 'Criado',
  AGUARDANDO_PAGAMENTO: 'Aguardando pagamento',
  PAGO: 'Pago',
  EM_PROCESSAMENTO: 'Em processamento',
  ENVIADO: 'Enviado',
  ENTREGUE: 'Entregue',
  CANCELADO: 'Cancelado',
  REEMBOLSADO: 'Reembolsado',
};

@Component({
  selector: 'app-pedidos',
  imports: [MatTableModule, MatChipsModule, MatButtonModule, MatIconModule, CurrencyPipe, DatePipe, SlicePipe],
  template: `
    <h2>Meus Pedidos</h2>

    @if (pedidos().length === 0) {
      <p class="empty">Nenhum pedido encontrado.</p>
    } @else {
      <mat-table [dataSource]="pedidos()">
        <ng-container matColumnDef="id">
          <mat-header-cell *matHeaderCellDef>Pedido</mat-header-cell>
          <mat-cell *matCellDef="let p">#{{ p.id | slice:0:8 }}</mat-cell>
        </ng-container>
        <ng-container matColumnDef="total">
          <mat-header-cell *matHeaderCellDef>Total</mat-header-cell>
          <mat-cell *matCellDef="let p">{{ p.total | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</mat-cell>
        </ng-container>
        <ng-container matColumnDef="status">
          <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
          <mat-cell *matCellDef="let p">
            <mat-chip [class]="'status-' + p.status.toLowerCase()">{{ statusLabel(p.status) }}</mat-chip>
          </mat-cell>
        </ng-container>
        <ng-container matColumnDef="data">
          <mat-header-cell *matHeaderCellDef>Data</mat-header-cell>
          <mat-cell *matCellDef="let p">{{ p.criadoEm | date:'dd/MM/yyyy' }}</mat-cell>
        </ng-container>
        <ng-container matColumnDef="acoes">
          <mat-header-cell *matHeaderCellDef></mat-header-cell>
          <mat-cell *matCellDef="let p">
            <button mat-icon-button (click)="verDetalhe(p.id)" title="Ver detalhes">
              <mat-icon>chevron_right</mat-icon>
            </button>
          </mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="colunas"></mat-header-row>
        <mat-row *matRowDef="let row; columns: colunas" class="clickable-row" (click)="verDetalhe(row.id)"></mat-row>
      </mat-table>
    }
  `,
  styles: [`
    h2 { margin: 0 0 16px; }
    mat-table { width: 100%; }
    .empty { color: var(--mat-sys-on-surface-variant); margin-top: 32px; text-align: center; }
    .clickable-row { cursor: pointer; }
    .clickable-row:hover { background: var(--mat-sys-surface-container); }
  `],
})
export class PedidosComponent implements OnInit {
  private auth = inject(AuthService);
  private commerce = inject(CommerceService);
  private router = inject(Router);

  pedidos = signal<Pedido[]>([]);
  colunas = ['id', 'total', 'status', 'data', 'acoes'];

  statusLabel = (status: StatusPedido) => STATUS_LABEL[status] ?? status;

  ngOnInit(): void {
    const contaId = this.auth.user()?.contaId;
    if (!contaId) return;
    this.commerce.listar(contaId).subscribe(res => this.pedidos.set(res.data.content));
  }

  verDetalhe(id: string): void {
    this.router.navigate(['/app/pedidos', id]);
  }
}
