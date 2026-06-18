import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from 'auth';
import { CatalogService } from 'api';

@Component({
  selector: 'app-aparencia',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="page-header">
      <h2>Aparência do Checkout</h2>
    </div>

    <div class="layout">
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>Identidade Visual</mat-card-title>
          <mat-card-subtitle>Personaliza como seu checkout aparece para os compradores</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" class="form">

            <mat-form-field appearance="outline">
              <mat-label>Nome de exibição</mat-label>
              <input matInput formControlName="nomeExibicao" placeholder="Ex: Minha Empresa" />
              <mat-hint>Aparece no topo da página de checkout</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>URL do logo</mat-label>
              <input matInput formControlName="logoUrl" placeholder="https://meusite.com/logo.png" />
              <mat-hint>Substitui o nome de exibição quando preenchido</mat-hint>
            </mat-form-field>

            <div class="cor-field">
              <label class="cor-label">Cor primária</label>
              <div class="cor-input-row">
                <input type="color" [value]="form.controls.corPrimaria.value || '#6750A4'"
                  (input)="onCorChange($event)" class="color-picker" />
                <mat-form-field appearance="outline" class="cor-hex">
                  <mat-label>Hex</mat-label>
                  <input matInput formControlName="corPrimaria" placeholder="#6750A4" maxlength="7" />
                </mat-form-field>
              </div>
              <span class="cor-hint">Cor dos botões e destaques no checkout</span>
            </div>

          </form>
        </mat-card-content>

        <mat-card-actions align="end">
          <button mat-flat-button (click)="salvar()" [disabled]="loading()">
            @if (loading()) { <mat-spinner diameter="18" /> } @else { Salvar }
          </button>
        </mat-card-actions>
      </mat-card>

      <mat-card class="preview-card">
        <mat-card-header>
          <mat-card-title>Pré-visualização</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="preview" [style.--preview-primary]="form.controls.corPrimaria.value || '#6750A4'">
            <div class="preview-header">
              @if (form.controls.logoUrl.value) {
                <img [src]="form.controls.logoUrl.value" class="preview-logo" alt="Logo" />
              } @else {
                <span class="preview-brand">{{ form.controls.nomeExibicao.value || 'Seu Negócio' }}</span>
              }
            </div>
            <div class="preview-produto">Nome do Produto</div>
            <div class="preview-preco">R$ 97,00</div>
            <button class="preview-btn">Comprar agora</button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 16px; h2 { margin: 0; } }
    .layout { display: grid; gap: 24px; }
    @media (min-width: 960px) { .layout { grid-template-columns: 1fr 1fr; } }

    .form { display: flex; flex-direction: column; gap: 8px; padding-top: 8px; }
    mat-form-field { width: 100%; }

    .cor-field { display: flex; flex-direction: column; gap: 4px; }
    .cor-label { font-size: 0.85rem; color: var(--mat-sys-on-surface-variant); }
    .cor-input-row { display: flex; align-items: center; gap: 12px; }
    .color-picker { width: 48px; height: 48px; border: none; border-radius: 8px; padding: 2px; cursor: pointer; background: none; }
    .cor-hex { width: 140px; }
    .cor-hint { font-size: 0.75rem; color: var(--mat-sys-on-surface-variant); }

    .preview { padding: 24px; border: 1px solid var(--mat-sys-outline-variant); border-radius: 12px; display: flex; flex-direction: column; gap: 12px; }
    .preview-header { display: flex; align-items: center; }
    .preview-brand { font-size: 1.1rem; font-weight: 700; color: var(--preview-primary); }
    .preview-logo { max-height: 48px; max-width: 160px; object-fit: contain; }
    .preview-produto { font-size: 0.9rem; color: var(--mat-sys-on-surface-variant); }
    .preview-preco { font-size: 1.5rem; font-weight: 700; color: var(--mat-sys-on-surface); }
    .preview-btn { background: var(--preview-primary); color: #fff; border: none; padding: 12px 24px; border-radius: 8px; font-size: 0.95rem; font-weight: 500; cursor: default; width: 100%; }
  `],
})
export class AparenciaComponent implements OnInit {
  private auth    = inject(AuthService);
  private catalog = inject(CatalogService);
  private snack   = inject(MatSnackBar);

  loading = signal(false);

  form = new FormGroup({
    nomeExibicao: new FormControl('', { nonNullable: true }),
    logoUrl:      new FormControl('', { nonNullable: true }),
    corPrimaria:  new FormControl('', { nonNullable: true }),
  });

  ngOnInit(): void {
    const contaId = this.auth.user()?.contaId;
    if (!contaId) return;
    this.catalog.getCheckoutConfig(contaId).subscribe(res => {
      if (res.data) {
        this.form.patchValue({
          nomeExibicao: res.data.nomeExibicao ?? '',
          logoUrl:      res.data.logoUrl      ?? '',
          corPrimaria:  res.data.corPrimaria  ?? '',
        });
      }
    });
  }

  onCorChange(event: Event): void {
    const hex = (event.target as HTMLInputElement).value;
    this.form.controls.corPrimaria.setValue(hex);
  }

  salvar(): void {
    const contaId = this.auth.user()?.contaId;
    if (!contaId) return;
    const { nomeExibicao, logoUrl, corPrimaria } = this.form.getRawValue();
    this.loading.set(true);
    this.catalog.saveCheckoutConfig({ nomeExibicao, logoUrl, corPrimaria }, contaId).subscribe({
      next: () => {
        this.snack.open('Aparência salva com sucesso!', 'OK', { duration: 3000 });
        this.loading.set(false);
      },
      error: () => {
        this.snack.open('Erro ao salvar. Tente novamente.', 'OK', { duration: 3000 });
        this.loading.set(false);
      },
    });
  }
}
