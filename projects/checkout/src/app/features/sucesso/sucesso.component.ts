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
          <p>Ola, <strong>{{ d.nome }}</strong>!</p>
          <p>Confirmacao enviada para <strong>{{ d.email }}</strong>.</p>
        }

        @if (state.produto(); as p) {
          <p class="produto-info">
            <strong>{{ p.nome }}</strong> -
            {{ p.preco | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
          </p>
        }

        @if (state.pagamentoResultado(); as pag) {

          @if (pag.pixQrCode) {
            <div class="pix-box">
              <mat-icon>qr_code_2</mat-icon>
              <p class="pix-titulo">Pague pelo PIX</p>
              <p class="pix-instrucao">Copie o codigo abaixo e cole no app do seu banco:</p>
              <div class="pix-codigo">{{ pag.pixQrCode }}</div>
              <button mat-stroked-button (click)="copiarPix(pag.pixQrCode!)">
                <mat-icon>content_copy</mat-icon> Copiar codigo PIX
              </button>
            </div>
          }

          @if (pag.boletoLinhaDigitavel) {
            <div class="boleto-box">
              <mat-icon>receipt</mat-icon>
              <p class="boleto-titulo">Boleto gerado</p>
              <p class="boleto-instrucao">Linha digitavel:</p>
              <div class="boleto-codigo">{{ pag.boletoLinhaDigitavel }}</div>
              <button mat-stroked-button (click)="copiarBoleto(pag.boletoLinhaDigitavel!)">
                <mat-icon>content_copy</mat-icon> Copiar linha digitavel
              </button>
            </div>
          }

          @if (!pag.pixQrCode && !pag.boletoLinhaDigitavel) {
            <p class="metodo-info">Pagamento no cartao de credito aprovado.</p>
          }

        } @else {
          <p class="metodo-info">
            @switch (state.metodoPagamento()) {
              @case ('PIX') { Pagamento via PIX aprovado instantaneamente. }
              @case ('BOLETO') { Seu boleto sera enviado por email. Prazo: 3 dias uteis. }
              @case ('CARTAO_CREDITO') { Pagamento no cartao de credito aprovado. }
            }
          </p>
        }
      </div>
    </div>
  `,
  styles: [`
    .page { display: flex; flex-direction: column; align-items: center; min-height: 100vh; padding: 40px 16px; background: var(--mat-sys-surface-container-low); }
    .brand { font-size: 1.5rem; font-weight: 700; color: var(--mat-sys-primary); margin-bottom: 40px; }
    .success-box { text-align: center; max-width: 520px; width: 100%; }
    .icon { font-size: 72px; width: 72px; height: 72px; color: var(--mat-sys-primary); }
    h1 { margin: 16px 0 24px; }
    p { margin: 8px 0; color: var(--mat-sys-on-surface-variant); }
    .produto-info, .metodo-info { margin-top: 16px; }
    .pix-box, .boleto-box {
      margin-top: 24px; padding: 20px; border-radius: 12px;
      background: var(--mat-sys-surface-container); text-align: left;
      mat-icon { font-size: 2rem; width: 2rem; height: 2rem; color: var(--mat-sys-primary); }
    }
    .pix-titulo, .boleto-titulo { font-weight: 600; font-size: 1.1rem; margin: 8px 0 4px; color: var(--mat-sys-on-surface); }
    .pix-instrucao, .boleto-instrucao { font-size: 0.875rem; margin-bottom: 12px; }
    .pix-codigo, .boleto-codigo {
      font-family: monospace; font-size: 0.8rem; word-break: break-all;
      background: var(--mat-sys-surface-container-highest); padding: 12px; border-radius: 8px;
      margin-bottom: 12px; color: var(--mat-sys-on-surface);
    }
  `],
})
export class SucessoComponent {
  state = inject(CheckoutStateService);

  copiarPix(codigo: string): void {
    navigator.clipboard.writeText(codigo);
  }

  copiarBoleto(codigo: string): void {
    navigator.clipboard.writeText(codigo);
  }
}
