import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from 'auth';
import { CatalogService } from 'api';
import { TipoProduto } from 'models';

const TIPOS: { value: TipoProduto; label: string }[] = [
  { value: 'CURSO_ONLINE', label: 'Curso Online' },
  { value: 'EBOOK',        label: 'E-book' },
  { value: 'MENTORIA',     label: 'Mentoria' },
  { value: 'SERVICO',      label: 'Servico' },
  { value: 'EVENTO',       label: 'Evento' },
  { value: 'ASSINATURA',   label: 'Assinatura' },
  { value: 'FISICO',       label: 'Produto Fisico' },
];

@Component({
  selector: 'app-criar-produto-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <h2 mat-dialog-title>Novo Produto</h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="form">

        <mat-form-field appearance="outline">
          <mat-label>Nome</mat-label>
          <input matInput formControlName="nome" placeholder="Ex: Curso de Marketing Digital" />
          @if (form.controls.nome.hasError('required')) {
            <mat-error>Nome obrigatorio</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Tipo</mat-label>
          <mat-select formControlName="tipo">
            @for (t of tipos; track t.value) {
              <mat-option [value]="t.value">{{ t.label }}</mat-option>
            }
          </mat-select>
          @if (form.controls.tipo.hasError('required')) {
            <mat-error>Tipo obrigatorio</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Preco (R$)</mat-label>
          <input matInput type="number" formControlName="preco" min="0.01" step="0.01" />
          @if (form.controls.preco.hasError('required')) {
            <mat-error>Preco obrigatorio</mat-error>
          }
          @if (form.controls.preco.hasError('min')) {
            <mat-error>Preco deve ser maior que zero</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Descricao (opcional)</mat-label>
          <textarea matInput formControlName="descricao" rows="3"></textarea>
        </mat-form-field>

        @if (erro()) {
          <p class="erro">{{ erro() }}</p>
        }
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button (click)="salvar()" [disabled]="loading()">
        @if (loading()) { <mat-spinner diameter="18" /> } @else { Salvar }
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form { display: flex; flex-direction: column; gap: 4px; min-width: 360px; padding-top: 8px; }
    mat-form-field { width: 100%; }
    .erro { color: var(--mat-sys-error); font-size: 0.85rem; margin: 0; }
  `],
})
export class CriarProdutoDialogComponent {
  private auth = inject(AuthService);
  private catalog = inject(CatalogService);
  private dialogRef = inject(MatDialogRef<CriarProdutoDialogComponent>);

  tipos = TIPOS;
  loading = signal(false);
  erro = signal('');

  form = new FormGroup({
    nome:      new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    tipo:      new FormControl<TipoProduto | null>(null, [Validators.required]),
    preco:     new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    descricao: new FormControl('', { nonNullable: true }),
  });

  salvar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const contaId = this.auth.user()?.contaId;
    if (!contaId) return;

    const { nome, tipo, preco, descricao } = this.form.getRawValue();
    this.loading.set(true);
    this.erro.set('');

    this.catalog.criar({
      nome,
      tipo: tipo!,
      preco: preco!,
      descricao: descricao || undefined,
      periodoReembolsoDias: 7,
    }, contaId).subscribe({
      next: res => this.dialogRef.close(res.data),
      error: () => {
        this.erro.set('Nao foi possivel criar o produto. Tente novamente.');
        this.loading.set(false);
      },
    });
  }
}
