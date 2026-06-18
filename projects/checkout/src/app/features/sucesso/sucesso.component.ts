import { Component, inject, signal, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { CheckoutStateService } from '../../services/checkout-state.service';
import { PixelService } from '../../services/pixel.service';
import QRCode from 'qrcode';

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
              <p class="pix-titulo">
                <mat-icon>pix</mat-icon>
                Pague com PIX
              </p>

              @if (qrDataUrl()) {
                <div class="qr-wrapper">
                  <img [src]="qrDataUrl()" alt="QR Code PIX" class="qr-img" />
                </div>
              }

              <p class="pix-instrucao">Ou copie o codigo PIX Copia e Cola:</p>
              <div class="pix-codigo">{{ pag.pixQrCode }}</div>
              <button mat-stroked-button (click)="copiar(pag.pixQrCode!, 'pix')">
                <mat-icon>{{ copiado() === 'pix' ? 'check' : 'content_copy' }}</mat-icon>
                {{ copiado() === 'pix' ? 'Copiado!' : 'Copiar codigo PIX' }}
              </button>
            </div>
          }

          @if (pag.boletoLinhaDigitavel) {
            <div class="boleto-box">
              <p class="boleto-titulo">
                <mat-icon>receipt</mat-icon>
                Boleto gerado
              </p>
              <p class="boleto-instrucao">Linha digitavel:</p>
              <div class="boleto-codigo">{{ pag.boletoLinhaDigitavel }}</div>
              <button mat-stroked-button (click)="copiar(pag.boletoLinhaDigitavel!, 'boleto')">
                <mat-icon>{{ copiado() === 'boleto' ? 'check' : 'content_copy' }}</mat-icon>
                {{ copiado() === 'boleto' ? 'Copiado!' : 'Copiar linha digitavel' }}
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
    }
    .pix-titulo, .boleto-titulo {
      display: flex; align-items: center; gap: 8px;
      font-weight: 600; font-size: 1.1rem; margin: 0 0 16px;
      color: var(--mat-sys-on-surface);
      mat-icon { color: var(--mat-sys-primary); }
    }
    .qr-wrapper {
      display: flex; justify-content: center; margin-bottom: 16px;
    }
    .qr-img {
      width: 220px; height: 220px; border-radius: 8px;
      border: 1px solid var(--mat-sys-outline-variant);
      background: #fff;
    }
    .pix-instrucao, .boleto-instrucao { font-size: 0.875rem; margin-bottom: 8px; }
    .pix-codigo, .boleto-codigo {
      font-family: monospace; font-size: 0.75rem; word-break: break-all;
      background: var(--mat-sys-surface-container-highest); padding: 12px; border-radius: 8px;
      margin-bottom: 12px; color: var(--mat-sys-on-surface);
    }
  `],
})
export class SucessoComponent implements OnInit {
  state    = inject(CheckoutStateService);
  private pixel = inject(PixelService);
  qrDataUrl = signal('');
  copiado   = signal('');

  ngOnInit(): void {
    const pag   = this.state.pagamentoResultado();
    const preco = this.state.produto()?.preco;
    this.pixel.track('Purchase', { value: preco, currency: 'BRL' });
    if (pag?.pixQrCode) {
      QRCode.toDataURL(pag.pixQrCode, { width: 220, margin: 1, color: { dark: '#000000', light: '#ffffff' } })
        .then(url => this.qrDataUrl.set(url));
    }
  }

  copiar(codigo: string, tipo: string): void {
    navigator.clipboard.writeText(codigo);
    this.copiado.set(tipo);
    setTimeout(() => this.copiado.set(''), 2000);
  }
}
