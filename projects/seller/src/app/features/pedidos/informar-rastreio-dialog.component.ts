import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SlicePipe } from '@angular/common';
import { AuthService } from 'auth';
import { CommerceService } from 'api';
import { Pedido } from 'models';

@Component({
  selector: 'app-informar-rastreio-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    SlicePipe,
  ],
  template: `
    <h2 mat-dialog-title>Informar Codigo de Rastreio</h2>

    <mat-dialog-content>
      <p class="info">Informe o codigo de rastreio para o pedido <strong>{{ pedido.id | slice:0:8 }}...</strong></p>
      <p class="info">O comprador <strong>{{ pedido.cliente.nome }}</strong> sera notificado por email.</p>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Codigo de Rastreio</mat-label>
        <input matInput [formControl]="codigoCtrl" placeholder="BR123456789BR" />
        @if (codigoCtrl.hasError('required')) {
          <mat-error>Codigo de rastreio obrigatorio</mat-error>
        }
      </mat-form-field>

      @if (erro()) {
        <p class="erro">{{ erro() }}</p>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button (click)="confirmar()" [disabled]="loading()">
        @if (loading()) { <mat-spinner diameter="18" /> } @else { Confirmar }
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content { display: flex; flex-direction: column; gap: 8px; padding-top: 8px; }
    .info { margin: 0; font-size: 0.9rem; }
    .full-width { width: 100%; margin-top: 8px; }
    .erro { color: var(--mat-sys-error); font-size: 0.85rem; margin: 0; }
  `],
})
export class InformarRastreioDialogComponent {
  private auth    = inject(AuthService);
  private commerce = inject(CommerceService);
  private ref     = inject(MatDialogRef<InformarRastreioDialogComponent>);
  pedido          = inject<Pedido>(MAT_DIALOG_DATA);

  codigoCtrl = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  loading = signal(false);
  erro    = signal('');

  confirmar(): void {
    if (this.codigoCtrl.invalid) { this.codigoCtrl.markAsTouched(); return; }
    const contaId = this.auth.user()?.contaId;
    if (!contaId) return;

    const codigo = this.codigoCtrl.value;
    this.loading.set(true);
    this.erro.set('');

    this.commerce.informarRastreio(this.pedido.id, contaId, codigo).subscribe({
      next: () => this.ref.close(codigo),
      error: () => {
        this.erro.set('Nao foi possivel registrar o rastreio. Tente novamente.');
        this.loading.set(false);
      },
    });
  }
}
