import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AuthService } from 'auth';
import { SubscriptionService } from 'api';
import { Assinatura } from 'models';

@Component({
  selector: 'app-assinaturas',
  imports: [MatTableModule, MatChipsModule, CurrencyPipe, DatePipe],
  template: `
    <h2>Assinaturas</h2>
    <mat-table [dataSource]="assinaturas()">
      <ng-container matColumnDef="comprador">
        <mat-header-cell *matHeaderCellDef>Comprador</mat-header-cell>
        <mat-cell *matCellDef="let a">{{ a.compradorEmail }}</mat-cell>
      </ng-container>
      <ng-container matColumnDef="produto">
        <mat-header-cell *matHeaderCellDef>Produto</mat-header-cell>
        <mat-cell *matCellDef="let a">{{ a.nomeProduto }}</mat-cell>
      </ng-container>
      <ng-container matColumnDef="valor">
        <mat-header-cell *matHeaderCellDef>Valor</mat-header-cell>
        <mat-cell *matCellDef="let a">{{ a.valorCobrado | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</mat-cell>
      </ng-container>
      <ng-container matColumnDef="periodicidade">
        <mat-header-cell *matHeaderCellDef>Periodicidade</mat-header-cell>
        <mat-cell *matCellDef="let a">{{ a.periodicidade }}</mat-cell>
      </ng-container>
      <ng-container matColumnDef="status">
        <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
        <mat-cell *matCellDef="let a"><mat-chip>{{ a.status }}</mat-chip></mat-cell>
      </ng-container>
      <ng-container matColumnDef="proxima">
        <mat-header-cell *matHeaderCellDef>Próxima cobrança</mat-header-cell>
        <mat-cell *matCellDef="let a">{{ a.dataProximaCobranca | date:'dd/MM/yyyy' }}</mat-cell>
      </ng-container>

      <mat-header-row *matHeaderRowDef="colunas"></mat-header-row>
      <mat-row *matRowDef="let row; columns: colunas"></mat-row>
    </mat-table>
  `,
  styles: [`h2 { margin: 0 0 16px; } mat-table { width: 100%; }`],
})
export class AssinaturasComponent implements OnInit {
  private auth = inject(AuthService);
  private subscription = inject(SubscriptionService);

  assinaturas = signal<Assinatura[]>([]);
  colunas = ['comprador', 'produto', 'valor', 'periodicidade', 'status', 'proxima'];

  ngOnInit(): void {
    const contaId = this.auth.user()?.contaId;
    if (!contaId) return;
    this.subscription.listar(contaId).subscribe(res => this.assinaturas.set(res.data.content));
  }
}
