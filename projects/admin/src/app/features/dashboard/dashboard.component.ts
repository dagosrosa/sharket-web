import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PlatformService } from 'api';

interface MetricCard {
  icon: string;
  label: string;
  value: number | string;
}

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="page">
      <h2>Dashboard</h2>

      @if (loading()) {
        <mat-spinner diameter="48" />
      } @else {
        <div class="metrics-grid">
          @for (m of metrics(); track m.label) {
            <mat-card class="metric-card">
              <mat-card-content>
                <mat-icon class="metric-icon">{{ m.icon }}</mat-icon>
                <div class="metric-value">{{ m.value }}</div>
                <div class="metric-label">{{ m.label }}</div>
              </mat-card-content>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page { h2 { margin: 0 0 24px; } }
    .metrics-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
    .metric-card mat-card-content { display: flex; flex-direction: column; align-items: center; padding: 24px; gap: 8px; }
    .metric-icon { font-size: 2rem; width: 2rem; height: 2rem; color: var(--mat-sys-primary); }
    .metric-value { font-size: 2rem; font-weight: 700; color: var(--mat-sys-on-surface); }
    .metric-label { font-size: 0.875rem; color: var(--mat-sys-on-surface-variant); }
    mat-spinner { margin: 40px auto; }
  `],
})
export class DashboardComponent implements OnInit {
  private platform = inject(PlatformService);

  loading = signal(true);
  metrics = signal<MetricCard[]>([]);

  ngOnInit(): void {
    Promise.all([
      this.platform.listarPlanos().toPromise(),
      this.platform.listarFlags().toPromise(),
      this.platform.listarApps().toPromise(),
    ]).then(([planos, flags, apps]) => {
      this.metrics.set([
        { icon: 'sell', label: 'Planos ativos', value: planos?.data?.content?.length ?? 0 },
        { icon: 'toggle_on', label: 'Feature flags', value: flags?.data?.content?.length ?? 0 },
        { icon: 'apps', label: 'OAuth Apps', value: apps?.data?.content?.length ?? 0 },
      ]);
      this.loading.set(false);
    }).catch(() => this.loading.set(false));
  }
}
