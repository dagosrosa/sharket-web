import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from 'auth';

@Component({
  selector: 'app-perfil',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatDividerModule],
  template: `
    <h2>Meu Perfil</h2>

    @if (auth.user(); as user) {
      <mat-card class="perfil-card">
        <mat-card-header>
          <div mat-card-avatar class="avatar">
            <mat-icon>person</mat-icon>
          </div>
          <mat-card-title>{{ user.nome }}</mat-card-title>
          <mat-card-subtitle>{{ user.email }}</mat-card-subtitle>
        </mat-card-header>

        <mat-divider />

        <mat-card-content class="info">
          <div class="info-row">
            <span class="label">ID da conta</span>
            <span class="value">{{ user.contaId }}</span>
          </div>
          <div class="info-row">
            <span class="label">Perfil</span>
            <span class="value">{{ user.perfil }}</span>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <button mat-stroked-button color="warn" (click)="auth.logout()">
            <mat-icon>logout</mat-icon> Sair da conta
          </button>
        </mat-card-actions>
      </mat-card>
    }
  `,
  styles: [`
    h2 { margin: 0 0 24px; }
    .perfil-card { max-width: 480px; }
    .avatar { background: var(--mat-sys-primary-container); border-radius: 50%; display: flex; align-items: center; justify-content: center; mat-icon { color: var(--mat-sys-on-primary-container); } }
    .info { padding-top: 16px; }
    .info-row { display: flex; flex-direction: column; margin-bottom: 16px; }
    .label { font-size: 0.75rem; color: var(--mat-sys-on-surface-variant); }
    .value { font-size: 0.9375rem; margin-top: 2px; }
    mat-divider { margin: 8px 0; }
  `],
})
export class PerfilComponent {
  auth = inject(AuthService);
}
