import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PagamentoResultado } from 'models';
import { SHARKET_API_CONFIG } from './api.config';

export interface ProcessarPagamentoRequest {
  pedidoId: string;
  gateway: 'GETNET' | 'PAGARME';
  metodo: string;
  valor: number;
  parcelas: number;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private config = inject(SHARKET_API_CONFIG);
  private base = () => `${this.config.paymentUrl}/api/v1/pagamentos`;

  processar(req: ProcessarPagamentoRequest, contaId: string): Observable<ApiResponse<PagamentoResultado>> {
    return this.http.post<ApiResponse<PagamentoResultado>>(this.base(), req, {
      headers: { 'X-Conta-Id': contaId },
    });
  }
}
