import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Assinatura, Page } from 'models';
import { SHARKET_API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private http = inject(HttpClient);
  private config = inject(SHARKET_API_CONFIG);
  private base = () => `${this.config.subscriptionUrl}/api/v1/assinaturas`;

  listar(contaId: string, page = 0, size = 20): Observable<ApiResponse<Page<Assinatura>>> {
    return this.http.get<ApiResponse<Page<Assinatura>>>(this.base(), {
      params: { page, size },
      headers: { 'X-Conta-Id': contaId },
    });
  }

  cancelar(id: string, contaId: string): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.base()}/${id}/cancelar`, {}, {
      headers: { 'X-Conta-Id': contaId },
    });
  }
}
