import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { IamService } from 'api';

@Component({
  selector: 'app-recuperar-senha',
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Sharket</mat-card-title>
          <mat-card-subtitle>Recuperar senha</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          @if (!enviado()) {
            <form [formGroup]="form" (ngSubmit)="enviar()">
              <p class="info-text">Informe seu email e enviaremos as instruções de recuperação.</p>

              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" type="email" autocomplete="email" />
                @if (form.controls.email.hasError('email')) {
                  <mat-error>Email inválido</mat-error>
                }
              </mat-form-field>

              @if (erro()) {
                <p class="error-msg">{{ erro() }}</p>
              }

              <button mat-flat-button type="submit" [disabled]="loading() || form.invalid">
                {{ loading() ? 'Enviando...' : 'Enviar instruções' }}
              </button>
            </form>
          } @else {
            <div class="success-block">
              <p>Se o email estiver cadastrado, você receberá as instruções em breve.</p>
              <p class="hint">Verifique também a pasta de spam.</p>
            </div>
          }

          <a routerLink="/login" class="back-link">Voltar ao login</a>
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
    .success-block { padding: 16px 0; }
    .hint { font-size: 0.8rem; color: var(--mat-sys-on-surface-variant); }
    .back-link { display: block; margin-top: 16px; font-size: 0.875rem; text-align: center; color: var(--mat-sys-primary); text-decoration: none; }
    .back-link:hover { text-decoration: underline; }
  `],
})
export class RecuperarSenhaComponent {
  private fb  = inject(FormBuilder);
  private iam = inject(IamService);

  form    = this.fb.nonNullable.group({ email: ['', [Validators.required, Validators.email]] });
  loading = signal(false);
  erro    = signal('');
  enviado = signal(false);

  enviar(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.erro.set('');

    this.iam.recuperarSenha(this.form.getRawValue().email).subscribe({
      next: () => { this.enviado.set(true); this.loading.set(false); },
      error: () => { this.erro.set('Erro ao processar. Tente novamente.'); this.loading.set(false); },
    });
  }
}
