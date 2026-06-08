import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AuthService } from 'auth';
import { FinancialService } from 'api';
import { Lancamento, Saldo, Saque } from 'models';

@Component({
  selector: 'app-financeiro',
  imports: [MatCardModule, MatTableModule, MatButtonModule, CurrencyPipe, DatePipe],
  template: `
    <h2>Financeiro</h2>

    <div class="saldo-cards">
      <mat-card>
        <mat-card-header><mat-card-title>Disponível</mat-card-title></mat-card-header>
        <mat-card-content>
          <p class="value">{{ saldo().disponivel | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</p>
        </mat-card-content>
      </mat-card>
      <mat-card>
        <mat-card-header><mat-card-title>A liberar</mat-card-title></mat-card-header>
        <mat-card-content>
          <p class="value">{{ saldo().aLiberar | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</p>
        </mat-card-content>
      </mat-card>
    </div>

    <h3>Lançamentos recentes</h3>
    <mat-table [dataSource]="lancamentos()">
      <ng-container matColumnDef="tipo">
        <mat-header-cell *matHeaderCellDef>Tipo</mat-header-cell>
        <mat-cell *matCellDef="let l">{{ l.tipo }}</mat-cell>
      </ng-container>
      <ng-container matColumnDef="valor">
        <mat-header-cell *matHeaderCellDef>Valor</mat-header-cell>
        <mat-cell *matCellDef="let l">{{ l.valor | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</mat-cell>
      </ng-container>
      <ng-container matColumnDef="descricao">
        <mat-header-cell *matHeaderCellDef>Descrição</mat-header-cell>
        <mat-cell *matCellDef="let l">{{ l.descricao }}</mat-cell>
      </ng-container>
      <ng-container matColumnDef="data">
        <mat-header-cell *matHeaderCellDef>Data</mat-header-cell>
        <mat-cell *matCellDef="let l">{{ l.criadoEm | date:'dd/MM/yyyy' }}</mat-cell>
      </ng-container>

      <mat-header-row *matHeaderRowDef="colunas"></mat-header-row>
      <mat-row *matRowDef="let row; columns: colunas"></mat-row>
    </mat-table>
  `,
  styles: [`
    h2, h3 { margin: 0 0 16px; }
    .saldo-cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 32px; }
    .value { font-size: 1.75rem; font-weight: 500; margin: 8px 0 0; }
    mat-table { width: 100%; }
  `],
})
export class FinanceiroComponent implements OnInit {
  private auth = inject(AuthService);
  private financial = inject(FinancialService);

  saldo = signal<Saldo>({ disponivel: 0, aLiberar: 0 });
  lancamentos = signal<Lancamento[]>([]);
  saques = signal<Saque[]>([]);
  colunas = ['tipo', 'valor', 'descricao', 'data'];

  ngOnInit(): void {
    const contaId = this.auth.user()?.contaId;
    if (!contaId) return;
    this.financial.saldo(contaId).subscribe(res => this.saldo.set(res.data));
    this.financial.lancamentos(contaId).subscribe(res => this.lancamentos.set(res.data.content));
  }
}
