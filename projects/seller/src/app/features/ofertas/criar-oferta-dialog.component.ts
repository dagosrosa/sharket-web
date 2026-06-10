import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from 'auth';
import { CatalogService } from 'api';
import { Produto, TipoOferta } from 'models';
import { signal } from '@angular/core';

@Component({
  selector: 'app-criar-oferta-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>Nova Oferta</h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline">
          <mat-label>Produto</mat-label>
          <mat-select formControlName="produtoId">
            @for (p of produtos(); track p.id) {
              <mat-option [value]="p.id">{{ p.nome }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Nome da oferta</mat-label>
          <input matInput formControlName="nome" placeholder="Ex: Plano Basico" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Valor (R$)</mat-label>
          <input matInput type="number" step="0.01" formControlName="valor" />
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
        {{ salvando() ? 'Salvando...' : 'Criar oferta' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`.form { display: flex; flex-direction: column; gap: 4px; min-width: 360px; padding-top: 8px; } .erro { color: var(--mat-sys-error); font-size: 0.8rem; }`],
})
export class CriarOfertaDialogComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private catalog = inject(CatalogService);
  private ref    = inject(MatDialogRef<CriarOfertaDialogComponent>);

  produtos = signal<Produto[]>([]);
  salvando = signal(false);
  erro     = signal('');

  form = this.fb.nonNullable.group({
    produtoId:   ['', Validators.required],
    nome:        ['', [Validators.required, Validators.minLength(2)]],
    valor:       [0, [Validators.required, Validators.min(0.01)]],
    tipo:        ['UNICA' as TipoOferta, Validators.required],
    maxParcelas: [1],
  });

  constructor() {
    const contaId = this.auth.user()?.contaId;
    if (contaId) {
      this.catalog.listar(contaId).subscribe(res => this.produtos.set(res.data));
    }
  }

  salvar(): void {
    if (this.form.invalid) return;
    const contaId = this.auth.user()?.contaId;
    if (!contaId) return;

    this.salvando.set(true);
    const { produtoId, nome, valor, tipo, maxParcelas } = this.form.getRawValue();

    this.catalog.criarOferta({ produtoId, nome, valor, tipo, maxParcelas }, contaId).subscribe({
      next: res => this.ref.close(res.data),
      error: () => {
        this.erro.set('Nao foi possivel criar a oferta.');
        this.salvando.set(false);
      },
    });
  }
}
