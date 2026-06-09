import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IamService } from 'api';
import { AuthService } from 'auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="page">
      <mat-card class="card">
        <mat-card-header>
          <mat-card-title>Sharket Admin</mat-card-title>
          <mat-card-subtitle>Acesso restrito a administradores</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="login()">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" autocomplete="email" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Senha</mat-label>
              <input matInput formControlName="senha" [type]="showPass() ? 'text' : 'password'" autocomplete="current-password" />
              <button mat-icon-button matSuffix type="button" (click)="showPass.set(!showPass())">
                <mat-icon>{{ showPass() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>

            @if (error()) {
              <p class="error">{{ error() }}</p>
            }

            <button mat-flat-button type="submit" [disabled]="form.invalid || loading()">
              {{ loading() ? 'Entrando...' : 'Entrar' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: var(--mat-sys-surface-container-low); }
    .card { width: 100%; max-width: 400px; }
    mat-card-header { margin-bottom: 16px; }
    form { display: flex; flex-direction: column; gap: 8px; }
    mat-form-field { width: 100%; }
    .error { color: var(--mat-sys-error); font-size: 0.875rem; margin: 0; }
    button[type=submit] { margin-top: 8px; }
  `],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private iam = inject(IamService);
  private auth = inject(AuthService);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required],
  });

  loading = signal(false);
  error = signal('');
  showPass = signal(false);

  login(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    const { email, senha } = this.form.getRawValue();
    this.iam.login({ email, senha }).subscribe({
      next: res => {
        const perfil = res.data.usuario.perfil;
        if (perfil !== 'MASTER' && perfil !== 'ADMIN') {
          this.error.set('Acesso negado. Perfil sem permissão de administrador.');
          this.loading.set(false);
          return;
        }
        this.auth.setSession(res.data);
        this.router.navigate(['/app/dashboard']);
      },
      error: () => {
        this.error.set('Email ou senha inválidos.');
        this.loading.set(false);
      },
    });
  }
}
