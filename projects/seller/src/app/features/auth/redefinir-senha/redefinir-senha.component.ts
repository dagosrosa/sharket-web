import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IamService } from 'api';

@Component({
  selector: 'app-redefinir-senha',
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Sharket</mat-card-title>
          <mat-card-subtitle>Redefinir senha</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          @if (!concluido()) {
            <form [formGroup]="form" (ngSubmit)="redefinir()">
              <p class="info-text">Cole o token recebido no email e escolha uma nova senha.</p>

              <mat-form-field appearance="outline">
                <mat-label>Token</mat-label>
                <input matInput formControlName="token" autocomplete="off" />
                @if (form.controls.token.hasError('required')) {
                  <mat-error>Token obrigatório</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Nova senha</mat-label>
                <input matInput formControlName="novaSenha"
                  [type]="hideSenha() ? 'password' : 'text'"
                  autocomplete="new-password" />
                <button mat-icon-button matSuffix type="button" (click)="hideSenha.set(!hideSenha())">
                  <mat-icon>{{ hideSenha() ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                @if (form.controls.novaSenha.hasError('minlength')) {
                  <mat-error>Mínimo de 6 caracteres</mat-error>
                }
              </mat-form-field>

              @if (erro()) {
                <p class="error-msg">{{ erro() }}</p>
              }

              <button mat-flat-button type="submit" [disabled]="loading() || form.invalid">
                {{ loading() ? 'Salvando...' : 'Redefinir senha' }}
              </button>
            </form>
          } @else {
            <div class="success-block">
              <p>Senha redefinida com sucesso!</p>
              <a routerLink="/login" mat-flat-button>Ir para o login</a>
            </div>
          }

          @if (!concluido()) {
            <a routerLink="/login" class="back-link">Voltar ao login</a>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: var(--mat-sys-surface-variant); }
    .login-card { width: 100%; max-width: 400px; padding: 16px; }
    form { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }
    .info-text { font-size: 0.875rem; color: var(--mat-sys-on-surface-variant); margin: 0; }
    .error-msg { color: var(--mat-sys-error); font-size: 0.875rem; margin: 0; }
    .success-block { padding: 16px 0; display: flex; flex-direction: column; gap: 16px; }
    .back-link { display: block; margin-top: 16px; font-size: 0.875rem; text-align: center; color: var(--mat-sys-primary); text-decoration: none; }
    .back-link:hover { text-decoration: underline; }
  `],
})
export class RedefinirSenhaComponent {
  private fb     = inject(FormBuilder);
  private iam    = inject(IamService);
  private router = inject(Router);

  form      = this.fb.nonNullable.group({
    token:    ['', Validators.required],
    novaSenha:['', [Validators.required, Validators.minLength(6)]],
  });
  loading   = signal(false);
  erro      = signal('');
  hideSenha = signal(true);
  concluido = signal(false);

  redefinir(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.erro.set('');

    const { token, novaSenha } = this.form.getRawValue();
    this.iam.redefinirSenha(token, novaSenha).subscribe({
      next: () => { this.concluido.set(true); this.loading.set(false); },
      error: () => { this.erro.set('Token inválido ou expirado.'); this.loading.set(false); },
    });
  }
}
