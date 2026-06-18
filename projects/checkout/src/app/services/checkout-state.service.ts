import { Injectable, signal } from '@angular/core';
import { CheckoutConfig, PagamentoResultado, Produto } from 'models';

export type MetodoPagamento = 'CARTAO_CREDITO' | 'PIX' | 'BOLETO';

export interface DadosComprador {
  nome: string;
  email: string;
  cpf: string;
}

export interface DadosCartao {
  numero: string;
  nomeTitular: string;
  validade: string;
  cvv: string;
}

@Injectable({ providedIn: 'root' })
export class CheckoutStateService {
  produto = signal<Produto | null>(null);
  contaId = signal<string>('');
  ofertaId = signal<string | null>(null);
  tipoProduto = signal<string>('CURSO_ONLINE');
  urlDownload = signal<string | null>(null);
  branding    = signal<CheckoutConfig | null>(null);
  dadosComprador = signal<DadosComprador | null>(null);
  metodoPagamento = signal<MetodoPagamento>('PIX');
  dadosCartao = signal<DadosCartao | null>(null);
  pagamentoResultado = signal<PagamentoResultado | null>(null);
}
