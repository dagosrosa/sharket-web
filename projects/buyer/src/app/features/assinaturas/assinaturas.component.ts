import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AuthService } from 'auth';
import { SubscriptionService } from 'api';
import { Assinatura, Periodicidade, StatusAssinatura } from 'models';

const PERIODICIDADE_LABEL: Record<Periodicidade, string> = {
  MENSAL: 'Mensal',
  TRIMESTRAL: 'Trimestral',
  SEMESTRAL: 'Semestral',
  ANUAL: 'Anual',
};

@Component({
  selector: 'app-assinaturas',
  imports: [MatTableModule, MatChipsModule, MatButtonModule, MatIconModule, MatDialogModule, CurrencyPipe, DatePipe],
  template: `
    <h2>Minhas Assinaturas</h2>

    @if (assinaturas().length === 0) {
      <p class="empty">Nenhuma assinatura encontrada.</p>
    } @else {
      <mat-table [dataSource]="assinaturas()">
        <ng-container matColumnDef="produto">
          <mat-header-cell *matHeaderCellDef>Produto</mat-header-cell>
          <mat-cell *matCellDef="let a">{{ a.nomeProduto }}</mat-cell>
        </ng-container>
        <ng-container matColumnDef="valor">
          <mat-header-cell *matHeaderCellDef>Valor</mat-header-cell>
          <mat-cell *matCellDef="let a">{{ a.valorCobrado | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</mat-cell>
        </ng-container>
        <ng-container matColumnDef="periodicidade">
          <mat-header-cell *matHeaderCellDef>Cobrança</mat-header-cell>
          <mat-cell *matCellDef="let a">{{ periodicidadeLabel(a.periodicidade) }}</mat-cell>
        </ng-container>
        <ng-container matColumnDef="proxima">
          <mat-header-cell *matHeaderCellDef>Próxima cobrança</mat-header-cell>
          <mat-cell *matCellDef="let a">{{ a.dataProximaCobranca | date:'dd/MM/yyyy' }}</mat-cell>
        </ng-container>
        <ng-container matColumnDef="status">
          <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
          <mat-cell *matCellDef="let a">
            <mat-chip [class]="'status-' + a.status.toLowerCase()">{{ a.status }}</mat-chip>
          </mat-cell>
        </ng-container>
        <ng-container matColumnDef="acoes">
          <mat-header-cell *matHeaderCellDef></mat-header-cell>
          <mat-cell *matCellDef="let a">
            @if (a.status === 'ATIVA') {
              <button mat-stroked-button color="warn" (click)="cancelar(a)">Cancelar</button>
            }
          </mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="colunas"></mat-header-row>
        <mat-row *matRowDef="let row; columns: colunas"></mat-row>
      </mat-table>
    }
  `,
  styles: [`
    h2 { margin: 0 0 16px; }
    mat-table { width: 100%; }
    .empty { color: var(--mat-sys-on-surface-variant); margin-top: 32px; text-align: center; }
  `],
})
export class AssinaturasComponent implements OnInit {
  private auth = inject(AuthService);
  private subscriptionSvc = inject(SubscriptionService);

  assinaturas = signal<Assinatura[]>([]);
  colunas = ['produto', 'valor', 'periodicidade', 'proxima', 'status', 'acoes'];

  periodicidadeLabel = (p: Periodicidade) => PERIODICIDADE_LABEL[p] ?? p;

  ngOnInit(): void {
    this.carregar();
  }

  cancelar(assinatura: Assinatura): void {
    if (!confirm(`Cancelar assinatura de "${assinatura.nomeProduto}"?`)) return;
    const contaId = this.auth.user()?.contaId;
    if (!contaId) return;
    this.subscriptionSvc.cancelar(assinatura.id, contaId).subscribe(() => this.carregar());
  }

  private carregar(): void {
    const contaId = this.auth.user()?.contaId;
    if (!contaId) return;
    this.subscriptionSvc.listar(contaId).subscribe(res => this.assinaturas.set(res.data.content));
  }
}
