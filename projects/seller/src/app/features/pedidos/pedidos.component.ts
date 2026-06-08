import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { CurrencyPipe, DatePipe, SlicePipe } from '@angular/common';
import { AuthService } from 'auth';
import { CommerceService } from 'api';
import { Pedido } from 'models';

@Component({
  selector: 'app-pedidos',
  imports: [MatTableModule, MatChipsModule, CurrencyPipe, DatePipe, SlicePipe],
  template: `
    <h2>Pedidos</h2>
    <mat-table [dataSource]="pedidos()">
      <ng-container matColumnDef="id">
        <mat-header-cell *matHeaderCellDef>ID</mat-header-cell>
        <mat-cell *matCellDef="let p">{{ p.id | slice:0:8 }}...</mat-cell>
      </ng-container>
      <ng-container matColumnDef="comprador">
        <mat-header-cell *matHeaderCellDef>Comprador</mat-header-cell>
        <mat-cell *matCellDef="let p">{{ p.compradorEmail }}</mat-cell>
      </ng-container>
      <ng-container matColumnDef="total">
        <mat-header-cell *matHeaderCellDef>Total</mat-header-cell>
        <mat-cell *matCellDef="let p">{{ p.total | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</mat-cell>
      </ng-container>
      <ng-container matColumnDef="status">
        <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
        <mat-cell *matCellDef="let p"><mat-chip>{{ p.status }}</mat-chip></mat-cell>
      </ng-container>
      <ng-container matColumnDef="data">
        <mat-header-cell *matHeaderCellDef>Data</mat-header-cell>
        <mat-cell *matCellDef="let p">{{ p.criadoEm | date:'dd/MM/yyyy' }}</mat-cell>
      </ng-container>

      <mat-header-row *matHeaderRowDef="colunas"></mat-header-row>
      <mat-row *matRowDef="let row; columns: colunas"></mat-row>
    </mat-table>
  `,
  styles: [`h2 { margin: 0 0 16px; } mat-table { width: 100%; }`],
})
export class PedidosComponent implements OnInit {
  private auth = inject(AuthService);
  private commerce = inject(CommerceService);

  pedidos = signal<Pedido[]>([]);
  colunas = ['id', 'comprador', 'total', 'status', 'data'];

  ngOnInit(): void {
    const contaId = this.auth.user()?.contaId;
    if (!contaId) return;
    this.commerce.listar(contaId).subscribe(res => this.pedidos.set(res.data.content));
  }
}
