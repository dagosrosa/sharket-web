import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlatformService } from 'api';
import { FeatureFlag } from 'models';

@Component({
  selector: 'app-feature-flags',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatListModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <h2>Feature Flags</h2>
        <button mat-flat-button (click)="showForm.set(!showForm())">
          <mat-icon>{{ showForm() ? 'close' : 'add' }}</mat-icon>
          {{ showForm() ? 'Cancelar' : 'Nova flag' }}
        </button>
      </div>

      @if (showForm()) {
        <mat-card class="form-card">
          <mat-card-content>
            <form [formGroup]="form" (ngSubmit)="criar()" class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Chave (ex: CHECKOUT_PIX)</mat-label>
                <input matInput formControlName="chave" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Descrição</mat-label>
                <input matInput formControlName="descricao" />
              </mat-form-field>
              <button mat-flat-button type="submit" [disabled]="form.invalid || saving()">
                {{ saving() ? 'Criando...' : 'Criar' }}
              </button>
            </form>
          </mat-card-content>
        </mat-card>
      }

      @if (loading()) {
        <mat-spinner diameter="48" />
      } @else {
        <mat-card>
          <mat-list>
            @for (flag of flags(); track flag.chave) {
              <mat-list-item>
                <mat-icon matListItemIcon>{{ flag.ativo ? 'toggle_on' : 'toggle_off' }}</mat-icon>
                <span matListItemTitle>{{ flag.chave }}</span>
                <span matListItemLine>{{ flag.descricao }}</span>
                <mat-slide-toggle
                  matListItemMeta
                  [checked]="flag.ativo"
                  (change)="toggle(flag)"
                />
              </mat-list-item>
              <mat-divider />
            } @empty {
              <mat-list-item>
                <span matListItemTitle>Nenhuma feature flag cadastrada</span>
              </mat-list-item>
            }
          </mat-list>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .page { h2 { margin: 0; } }
    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
    .form-card { margin-bottom: 24px; }
    .form-row { display: flex; gap: 8px; align-items: flex-start; }
    .form-row mat-form-field { flex: 1; }
    mat-spinner { margin: 40px auto; }
  `],
})
export class FeatureFlagsComponent implements OnInit {
  private platform = inject(PlatformService);
  private fb = inject(FormBuilder);

  flags = signal<FeatureFlag[]>([]);
  loading = signal(true);
  saving = signal(false);
  showForm = signal(false);

  form = this.fb.nonNullable.group({
    chave: ['', Validators.required],
    descricao: ['', Validators.required],
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.loading.set(true);
    this.platform.listarFlags().subscribe({
      next: res => { this.flags.set(res.data.content); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  toggle(flag: FeatureFlag): void {
    this.platform.toggleFlag(flag.id).subscribe({
      next: () => this.carregar(),
    });
  }

  criar(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    const { chave, descricao } = this.form.getRawValue();
    this.platform.criarFlag({ chave, descricao }).subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.form.reset();
        this.carregar();
      },
      error: () => this.saving.set(false),
    });
  }
}
