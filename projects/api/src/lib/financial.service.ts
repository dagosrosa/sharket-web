import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Lancamento, Page, Saldo, Saque, SolicitarSaqueRequest } from 'models';
import { SHARKET_API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class FinancialService {
  private http = inject(HttpClient);
  private config = inject(SHARKET_API_CONFIG);
  private base = () => `${this.config.financialUrl}/api/v1/financeiro`;

  saldo(contaId: string): Observable<ApiResponse<Saldo>> {
    return this.http.get<ApiResponse<Saldo>>(`${this.base()}/saldo`, {
      headers: { 'X-Conta-Id': contaId },
    });
  }

  lancamentos(contaId: string, page = 0, size = 20): Observable<ApiResponse<Page<Lancamento>>> {
    return this.http.get<ApiResponse<Page<Lancamento>>>(`${this.base()}/lancamentos`, {
      params: { page, size },
      headers: { 'X-Conta-Id': contaId },
    });
  }

  saques(contaId: string, page = 0, size = 20): Observable<ApiResponse<Page<Saque>>> {
    return this.http.get<ApiResponse<Page<Saque>>>(`${this.base()}/saques`, {
      params: { page, size },
      headers: { 'X-Conta-Id': contaId },
    });
  }

  solicitarSaque(req: SolicitarSaqueRequest, contaId: string): Observable<ApiResponse<Saque>> {
    return this.http.post<ApiResponse<Saque>>(`${this.base()}/saques`, req, {
      headers: { 'X-Conta-Id': contaId },
    });
  }
}
