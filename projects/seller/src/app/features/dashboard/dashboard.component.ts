import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from 'auth';
import { FinancialService } from 'api';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, MatIconModule, CurrencyPipe],
  template: `
    <h2>Dashboard</h2>
    <div class="cards-grid">
      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar>account_balance_wallet</mat-icon>
          <mat-card-title>Saldo disponível</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p class="value">{{ saldo() | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</p>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar>schedule</mat-icon>
          <mat-card-title>A liberar</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p class="value">{{ aLiberar() | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    h2 { margin: 0 0 24px; }
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
    .value { font-size: 1.75rem; font-weight: 500; margin: 8px 0 0; }
  `],
})
export class DashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private financial = inject(FinancialService);

  saldo = signal(0);
  aLiberar = signal(0);

  ngOnInit(): void {
    const contaId = this.auth.user()?.contaId;
    if (!contaId) return;
    this.financial.saldo(contaId).subscribe(res => {
      this.saldo.set(res.data.disponivel);
      this.aLiberar.set(res.data.aLiberar);
    });
  }
}
