import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';
import { PlatformService } from 'api';
import { AplicativoOAuth } from 'models';

@Component({
  selector: 'app-oauth',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    DatePipe,
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <h2>OAuth Apps</h2>
        <button mat-flat-button (click)="showForm.set(!showForm())">
          <mat-icon>{{ showForm() ? 'close' : 'add' }}</mat-icon>
          {{ showForm() ? 'Cancelar' : 'Registrar app' }}
        </button>
      </div>

      @if (showForm()) {
        <mat-card class="form-card">
          <mat-card-content>
            <form [formGroup]="form" (ngSubmit)="registrar()" class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Nome do app</mat-label>
                <input matInput formControlName="nome" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>ID da conta (contaId)</mat-label>
                <input matInput formControlName="contaId" />
              </mat-form-field>

              <div class="form-actions">
                <button mat-flat-button type="submit" [disabled]="form.invalid || saving()">
                  {{ saving() ? 'Registrando...' : 'Registrar' }}
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      }

      @if (newClientSecret()) {
        <mat-card class="secret-card">
          <mat-card-content>
            <p><strong>App registrado!</strong> Guarde o client secret abaixo — não será exibido novamente.</p>
            <code class="secret">{{ newClientSecret() }}</code>
          </mat-card-content>
        </mat-card>
      }

      @if (loading()) {
        <mat-spinner diameter="48" />
      } @else {
        <mat-card>
          <table mat-table [dataSource]="apps()" class="full-table">
            <ng-container matColumnDef="nome">
              <th mat-header-cell *matHeaderCellDef>Nome</th>
              <td mat-cell *matCellDef="let a">{{ a.nome }}</td>
            </ng-container>
            <ng-container matColumnDef="clientId">
              <th mat-header-cell *matHeaderCellDef>Client ID</th>
              <td mat-cell *matCellDef="let a"><code>{{ a.clientId }}</code></td>
            </ng-container>
            <ng-container matColumnDef="contaId">
              <th mat-header-cell *matHeaderCellDef>Conta</th>
              <td mat-cell *matCellDef="let a">{{ a.contaId }}</td>
            </ng-container>
            <ng-container matColumnDef="criadoEm">
              <th mat-header-cell *matHeaderCellDef>Criado em</th>
              <td mat-cell *matCellDef="let a">{{ a.criadoEm | date:'dd/MM/yyyy' }}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="colunas"></tr>
            <tr mat-row *matRowDef="let row; columns: colunas;"></tr>
          </table>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .page { h2 { margin: 0; } }
    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
    .form-card, .secret-card { margin-bottom: 24px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .form-actions { grid-column: 1 / -1; display: flex; justify-content: flex-end; }
    .secret-card { background: var(--mat-sys-tertiary-container); }
    .secret { display: block; margin-top: 8px; padding: 12px; background: var(--mat-sys-surface); border-radius: 4px; word-break: break-all; }
    .full-table { width: 100%; }
    mat-spinner { margin: 40px auto; }
    code { font-family: monospace; font-size: 0.8rem; }
  `],
})
export class OAuthComponent implements OnInit {
  private platform = inject(PlatformService);
  private fb = inject(FormBuilder);

  colunas = ['nome', 'clientId', 'contaId', 'criadoEm'];
  apps = signal<AplicativoOAuth[]>([]);
  loading = signal(true);
  saving = signal(false);
  showForm = signal(false);
  newClientSecret = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    contaId: ['', Validators.required],
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.loading.set(true);
    this.platform.listarApps().subscribe({
      next: res => { this.apps.set(res.data.content); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  registrar(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    this.newClientSecret.set(null);
    const { nome, contaId } = this.form.getRawValue();
    this.platform.registrarApp({ nome, contaId }).subscribe({
      next: res => {
        this.saving.set(false);
        this.showForm.set(false);
        this.form.reset();
        if (res.data.clientSecret) this.newClientSecret.set(res.data.clientSecret);
        this.carregar();
      },
      error: () => this.saving.set(false),
    });
  }
}
