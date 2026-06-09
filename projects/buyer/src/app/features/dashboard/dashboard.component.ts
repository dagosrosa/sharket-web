import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from 'auth';
import { CommerceService, SubscriptionService } from 'api';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <h2>Olá, {{ auth.user()?.nome?.split(' ')?.[0] }}!</h2>

    <div class="cards-grid">
      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar>receipt_long</mat-icon>
          <mat-card-title>Pedidos</mat-card-title>
          <mat-card-subtitle>Total realizados</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p class="value">{{ totalPedidos() }}</p>
        </mat-card-content>
        <mat-card-actions>
          <a mat-button routerLink="/app/pedidos">Ver todos</a>
        </mat-card-actions>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar>autorenew</mat-icon>
          <mat-card-title>Assinaturas</mat-card-title>
          <mat-card-subtitle>Ativas</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p class="value">{{ assinaturasAtivas() }}</p>
        </mat-card-content>
        <mat-card-actions>
          <a mat-button routerLink="/app/assinaturas">Gerenciar</a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    h2 { margin: 0 0 24px; }
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
    .value { font-size: 2.5rem; font-weight: 500; margin: 8px 0 0; }
  `],
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);
  private commerce = inject(CommerceService);
  private subscription = inject(SubscriptionService);

  totalPedidos = signal(0);
  assinaturasAtivas = signal(0);

  ngOnInit(): void {
    const contaId = this.auth.user()?.contaId;
    if (!contaId) return;
    this.commerce.listar(contaId, 0, 1).subscribe(
      res => this.totalPedidos.set(res.data.totalElements)
    );
    this.subscription.listar(contaId, 0, 100).subscribe(res => {
      const ativas = res.data.content.filter(a => a.status === 'ATIVA').length;
      this.assinaturasAtivas.set(ativas);
    });
  }
}
