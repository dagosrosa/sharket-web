import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PercentPipe } from '@angular/common';
import { PlatformService } from 'api';
import { Plano } from 'models';

@Component({
  selector: 'app-planos',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    PercentPipe,
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <h2>Planos</h2>
        <button mat-flat-button (click)="showForm.set(!showForm())">
          <mat-icon>{{ showForm() ? 'close' : 'add' }}</mat-icon>
          {{ showForm() ? 'Cancelar' : 'Novo plano' }}
        </button>
      </div>

      @if (showForm()) {
        <mat-card class="form-card">
          <mat-card-content>
            <form [formGroup]="form" (ngSubmit)="criar()" class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Nome</mat-label>
                <input matInput formControlName="nome" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Taxa percentual (%)</mat-label>
                <input matInput formControlName="taxaPercentual" type="number" step="0.1" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Taxa fixa (R$)</mat-label>
                <input matInput formControlName="taxaFixa" type="number" step="0.01" />
              </mat-form-field>

              <div class="form-actions">
                <button mat-flat-button type="submit" [disabled]="form.invalid || saving()">
                  {{ saving() ? 'Salvando...' : 'Criar plano' }}
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      }

      @if (loading()) {
        <mat-spinner diameter="48" />
      } @else {
        <mat-card>
          <table mat-table [dataSource]="planos()" class="full-table">
            <ng-container matColumnDef="nome">
              <th mat-header-cell *matHeaderCellDef>Nome</th>
              <td mat-cell *matCellDef="let p">{{ p.nome }}</td>
            </ng-container>
            <ng-container matColumnDef="taxaPercentual">
              <th mat-header-cell *matHeaderCellDef>Taxa %</th>
              <td mat-cell *matCellDef="let p">{{ p.taxaPercentual / 100 | percent:'1.1-2' }}</td>
            </ng-container>
            <ng-container matColumnDef="taxaFixa">
              <th mat-header-cell *matHeaderCellDef>Taxa fixa</th>
              <td mat-cell *matCellDef="let p">R$ {{ p.taxaFixa.toFixed(2) }}</td>
            </ng-container>
            <ng-container matColumnDef="ativo">
              <th mat-header-cell *matHeaderCellDef>Ativo</th>
              <td mat-cell *matCellDef="let p">
                <mat-icon [style.color]="p.ativo ? 'var(--mat-sys-primary)' : 'var(--mat-sys-outline)'">
                  {{ p.ativo ? 'check_circle' : 'cancel' }}
                </mat-icon>
              </td>
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
    .form-card { margin-bottom: 24px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .form-actions { grid-column: 1 / -1; display: flex; justify-content: flex-end; }
    .full-table { width: 100%; }
    mat-spinner { margin: 40px auto; }
  `],
})
export class PlanosComponent implements OnInit {
  private platform = inject(PlatformService);
  private fb = inject(FormBuilder);

  colunas = ['nome', 'taxaPercentual', 'taxaFixa', 'ativo'];
  planos = signal<Plano[]>([]);
  loading = signal(true);
  saving = signal(false);
  showForm = signal(false);

  form = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    taxaPercentual: [0, [Validators.required, Validators.min(0)]],
    taxaFixa: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.loading.set(true);
    this.platform.listarPlanos().subscribe({
      next: res => { this.planos.set(res.data.content); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  criar(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    this.platform.criarPlano(this.form.getRawValue()).subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.form.reset({ taxaPercentual: 0, taxaFixa: 0 });
        this.carregar();
      },
      error: () => this.saving.set(false),
    });
  }
}
