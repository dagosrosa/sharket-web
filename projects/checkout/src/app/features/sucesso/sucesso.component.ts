import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { CheckoutStateService } from '../../services/checkout-state.service';

@Component({
  selector: 'app-sucesso',
  imports: [MatButtonModule, MatIconModule, CurrencyPipe],
  template: `
    <div class="page">
      <div class="brand">Sharket</div>

      <div class="success-box">
        <mat-icon class="icon">check_circle</mat-icon>
        <h1>Compra confirmada!</h1>

        @if (state.dadosComprador(); as d) {
          <p>Olá, <strong>{{ d.nome }}</strong>!</p>
          <p>Enviamos a confirmação para <strong>{{ d.email }}</strong>.</p>
        }

        @if (state.produto(); as p) {
          <p class="produto-info">
            <strong>{{ p.nome }}</strong> —
            {{ p.preco | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
          </p>
        }

        <p class="metodo-info">
          @switch (state.metodoPagamento()) {
            @case ('PIX') { Pagamento via PIX aprovado instantaneamente. }
            @case ('BOLETO') { Seu boleto será enviado por email. Prazo: 3 dias úteis. }
            @case ('CARTAO_CREDITO') { Pagamento no cartão de crédito aprovado. }
          }
        </p>
      </div>
    </div>
  `,
  styles: [`
    .page { display: flex; flex-direction: column; align-items: center; min-height: 100vh; padding: 40px 16px; background: var(--mat-sys-surface-container-low); }
    .brand { font-size: 1.5rem; font-weight: 700; color: var(--mat-sys-primary); margin-bottom: 40px; }
    .success-box { text-align: center; max-width: 480px; }
    .icon { font-size: 72px; width: 72px; height: 72px; color: var(--mat-sys-primary); }
    h1 { margin: 16px 0 24px; }
    p { margin: 8px 0; color: var(--mat-sys-on-surface-variant); }
    .produto-info, .metodo-info { margin-top: 16px; }
  `],
})
export class SucessoComponent {
  state = inject(CheckoutStateService);
}
