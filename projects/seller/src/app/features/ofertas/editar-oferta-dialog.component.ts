import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from 'auth';
import { CatalogService } from 'api';
import { Oferta, TipoOferta } from 'models';

@Component({
  selector: 'app-editar-oferta-dialog',
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
    <h2 mat-dialog-title>Editar Oferta</h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="form">

        <mat-form-field appearance="outline">
          <mat-label>Nome da oferta</mat-label>
          <input matInput formControlName="nome" />
          @if (form.controls.nome.hasError('required')) {
            <mat-error>Nome obrigatorio</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Valor (R$)</mat-label>
          <input matInput type="number" step="0.01" formControlName="valor" />
          @if (form.controls.valor.hasError('min')) {
            <mat-error>Valor deve ser maior que zero</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Tipo</mat-label>
          <mat-select formControlName="tipo">
            <mat-option value="UNICA">Pagamento unico</mat-option>
            <mat-option value="PARCELADA">Parcelado</mat-option>
            <mat-option value="RECORRENTE">Recorrente</mat-option>
          </mat-select>
        </mat-form-field>

        @if (form.controls.tipo.value === 'PARCELADA') {
          <mat-form-field appearance="outline">
            <mat-label>Max. parcelas</mat-label>
            <input matInput type="number" min="2" max="12" formControlName="maxParcelas" />
          </mat-form-field>
        }

        @if (erro()) {
          <p class="erro">{{ erro() }}</p>
        }
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button [disabled]="form.invalid || salvando()" (click)="salvar()">
        @if (salvando()) { <mat-spinner diameter="18" /> } @else { Salvar }
      </button>
    </mat-dialog-actions>
  `,
  styles: [`.form { display: flex; flex-direction: column; gap: 4px; min-width: 360px; padding-top: 8px; } .erro { color: var(--mat-sys-error); font-size: 0.8rem; }`],
})
export class EditarOfertaDialogComponent {
  private fb      = inject(FormBuilder);
  private auth    = inject(AuthService);
  private catalog = inject(CatalogService);
  private ref     = inject(MatDialogRef<EditarOfertaDialogComponent>);
  private oferta  = inject<Oferta>(MAT_DIALOG_DATA);

  salvando = signal(false);
  erro     = signal('');

  form = this.fb.nonNullable.group({
    nome:        [this.oferta.nome,        [Validators.required, Validators.minLength(2)]],
    valor:       [this.oferta.valor,       [Validators.required, Validators.min(0.01)]],
    tipo:        [this.oferta.tipo as TipoOferta, Validators.required],
    maxParcelas: [this.oferta.maxParcelas],
  });

  salvar(): void {
    if (this.form.invalid) return;
    const contaId = this.auth.user()?.contaId;
    if (!contaId) return;

    this.salvando.set(true);
    const { nome, valor, tipo, maxParcelas } = this.form.getRawValue();

    this.catalog.atualizarOferta(this.oferta.id, { nome, valor, tipo, maxParcelas }, contaId).subscribe({
      next: () => this.ref.close({ ...this.oferta, nome, valor, tipo, maxParcelas }),
      error: () => {
        this.erro.set('Nao foi possivel atualizar a oferta.');
        this.salvando.set(false);
      },
    });
  }
}
