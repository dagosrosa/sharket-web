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
  selector: 'app-pixels',
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
      <h2>Pixels de Rastreamento</h2>
    </div>

    <mat-card>
      <mat-card-header>
        <mat-card-title>IDs dos Pixels</mat-card-title>
        <mat-card-subtitle>Configure os pixels para rastrear conversões nas suas campanhas de tráfego pago</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <form [formGroup]="form" class="form">

          <mat-form-field appearance="outline">
            <mat-label>Facebook Pixel ID</mat-label>
            <input matInput formControlName="facebookPixelId" placeholder="Ex: 123456789012345" />
            <mat-hint>Gerenciador de Eventos do Facebook → Pixels</mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Google Ads / GA4 ID</mat-label>
            <input matInput formControlName="googleAdsId" placeholder="Ex: AW-123456789 ou G-XXXXXXXXXX" />
            <mat-hint>Google Ads: ID de conversão — GA4: ID da propriedade</mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>TikTok Pixel ID</mat-label>
            <input matInput formControlName="tiktokPixelId" placeholder="Ex: XXXXXXXXXXXXXXXX" />
            <mat-hint>TikTok Ads Manager → Ativos → Eventos → Pixel</mat-hint>
          </mat-form-field>

        </form>
      </mat-card-content>

      <mat-card-actions align="end">
        <button mat-flat-button (click)="salvar()" [disabled]="loading()">
          @if (loading()) { <mat-spinner diameter="18" /> } @else { Salvar }
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .page-header { margin-bottom: 16px; h2 { margin: 0; } }
    .form { display: flex; flex-direction: column; gap: 8px; padding-top: 8px; }
    mat-form-field { width: 100%; }
    mat-card { max-width: 600px; }
  `],
})
export class PixelsComponent implements OnInit {
  private auth    = inject(AuthService);
  private catalog = inject(CatalogService);
  private snack   = inject(MatSnackBar);

  loading = signal(false);

  form = new FormGroup({
    facebookPixelId: new FormControl('', { nonNullable: true }),
    googleAdsId:     new FormControl('', { nonNullable: true }),
    tiktokPixelId:   new FormControl('', { nonNullable: true }),
  });

  ngOnInit(): void {
    const contaId = this.auth.user()?.contaId;
    if (!contaId) return;
    this.catalog.getPixelConfig(contaId).subscribe(res => {
      if (res.data) {
        this.form.patchValue({
          facebookPixelId: res.data.facebookPixelId ?? '',
          googleAdsId:     res.data.googleAdsId     ?? '',
          tiktokPixelId:   res.data.tiktokPixelId   ?? '',
        });
      }
    });
  }

  salvar(): void {
    const contaId = this.auth.user()?.contaId;
    if (!contaId) return;
    const { facebookPixelId, googleAdsId, tiktokPixelId } = this.form.getRawValue();
    this.loading.set(true);
    this.catalog.savePixelConfig({ facebookPixelId, googleAdsId, tiktokPixelId }, contaId).subscribe({
      next: () => {
        this.snack.open('Pixels salvos com sucesso!', 'OK', { duration: 3000 });
        this.loading.set(false);
      },
      error: () => {
        this.snack.open('Erro ao salvar. Tente novamente.', 'OK', { duration: 3000 });
        this.loading.set(false);
      },
    });
  }
}
