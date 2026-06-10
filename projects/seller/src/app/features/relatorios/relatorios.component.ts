import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CurrencyPipe, PercentPipe, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'auth';
import { CommerceService } from 'api';
import { ResumoRelatorio, VendaDiaria } from 'models';

@Component({
  selector: 'app-relatorios',
  imports: [MatCardModule, MatIconModule, MatButtonToggleModule, CurrencyPipe, PercentPipe, SlicePipe, FormsModule],
  template: `
    <div class="page-header">
      <h2>Relatórios</h2>
      <mat-button-toggle-group [(ngModel)]="periodo" (ngModelChange)="carregarGrafico()">
        <mat-button-toggle value="7">7 dias</mat-button-toggle>
        <mat-button-toggle value="30">30 dias</mat-button-toggle>
        <mat-button-toggle value="90">90 dias</mat-button-toggle>
      </mat-button-toggle-group>
    </div>

    <!-- Cards de resumo -->
    <div class="cards-grid">
      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar class="icon-vendas">shopping_cart</mat-icon>
          <mat-card-title>Total de pedidos</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p class="metric">{{ resumo()?.totalPedidos ?? '—' }}</p>
          <p class="sub">{{ resumo()?.aprovados ?? 0 }} aprovados</p>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar class="icon-receita">payments</mat-icon>
          <mat-card-title>Receita aprovada</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p class="metric">{{ resumo()?.valorTotal | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</p>
          <p class="sub">Ticket médio: {{ resumo()?.ticketMedio | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</p>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar class="icon-taxa">verified</mat-icon>
          <mat-card-title>Taxa de aprovação</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p class="metric">{{ taxaAprovacao() | percent:'1.0-1' }}</p>
          <p class="sub">{{ resumo()?.cancelados ?? 0 }} cancelados · {{ resumo()?.reembolsados ?? 0 }} reembolsados</p>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar class="icon-pendente">hourglass_empty</mat-icon>
          <mat-card-title>Pendentes</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p class="metric">{{ resumo()?.pendentes ?? '—' }}</p>
          <p class="sub">Aguardando pagamento</p>
        </mat-card-content>
      </mat-card>
    </div>

    <!-- Gráfico de barras -->
    <mat-card class="chart-card">
      <mat-card-header>
        <mat-card-title>Vendas aprovadas — últimos {{ periodo }} dias</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        @if (vendasDiarias().length === 0) {
          <p class="empty">Sem vendas aprovadas no período.</p>
        } @else {
          <div class="chart">
            @for (v of vendasDiarias(); track v.dia) {
              <div class="bar-col" [title]="v.dia + ': ' + v.quantidade + ' venda(s) · R$ ' + v.valor">
                <div class="bar-fill" [style.height.%]="alturaBar(v.valor)"></div>
                <span class="bar-label">{{ v.dia | slice:5 }}</span>
              </div>
            }
          </div>
          <div class="chart-legend">
            <span>Receita máxima/dia: {{ maxDiario() | currency:'BRL':'symbol':'1.0-0':'pt-BR' }}</span>
          </div>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
    h2 { margin: 0; }
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .metric { font-size: 1.8rem; font-weight: 600; margin: 8px 0 4px; color: var(--mat-sys-on-surface); }
    .sub { font-size: 0.8rem; color: var(--mat-sys-on-surface-variant); margin: 0; }
    .icon-vendas  { color: var(--mat-sys-primary); }
    .icon-receita { color: #2e7d32; }
    .icon-taxa    { color: #1565c0; }
    .icon-pendente{ color: #e65100; }

    .chart-card { margin-top: 0; }
    .chart {
      display: flex; align-items: flex-end; gap: 4px;
      height: 160px; padding: 0 4px 0; overflow-x: auto;
    }
    .bar-col {
      display: flex; flex-direction: column; align-items: center;
      min-width: 24px; flex: 1; height: 100%; justify-content: flex-end;
      cursor: default;
    }
    .bar-fill {
      width: 100%; min-height: 2px;
      background: var(--mat-sys-primary); border-radius: 3px 3px 0 0;
      transition: height 0.3s ease;
    }
    .bar-col:hover .bar-fill { background: var(--mat-sys-secondary); }
    .bar-label { font-size: 0.6rem; color: var(--mat-sys-on-surface-variant); margin-top: 4px; white-space: nowrap; }
    .chart-legend { margin-top: 8px; font-size: 0.75rem; color: var(--mat-sys-on-surface-variant); }
    .empty { color: var(--mat-sys-on-surface-variant); padding: 24px 0; text-align: center; }
  `],
})
export class RelatoriosComponent implements OnInit {
  private auth     = inject(AuthService);
  private commerce = inject(CommerceService);

  resumo       = signal<ResumoRelatorio | null>(null);
  vendasDiarias = signal<VendaDiaria[]>([]);
  periodo      = '30';

  taxaAprovacao = computed(() => {
    const r = this.resumo();
    if (!r || r.totalPedidos === 0) return 0;
    return r.aprovados / r.totalPedidos;
  });

  maxDiario = computed(() =>
    this.vendasDiarias().reduce((max, v) => Math.max(max, v.valor), 0)
  );

  alturaBar(valor: number): number {
    const max = this.maxDiario();
    return max > 0 ? Math.max(2, (valor / max) * 100) : 2;
  }

  ngOnInit(): void {
    const contaId = this.auth.user()?.contaId;
    if (!contaId) return;

    this.commerce.relatorioResumo(contaId).subscribe(res => this.resumo.set(res.data));
    this.carregarGrafico();
  }

  carregarGrafico(): void {
    const contaId = this.auth.user()?.contaId;
    if (!contaId) return;
    this.commerce.relatorioVendasDiarias(contaId, +this.periodo)
      .subscribe(res => this.vendasDiarias.set(res.data));
  }
}
