import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Page, Pedido, PedidoCriadoResultado, RealizarPedidoRequest } from 'models';
import { SHARKET_API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class CommerceService {
  private http = inject(HttpClient);
  private config = inject(SHARKET_API_CONFIG);
  private base = () => `${this.config.commerceUrl}/api/v1/pedidos`;

  listar(contaId: string, page = 0, size = 20): Observable<ApiResponse<Page<Pedido>>> {
    return this.http.get<ApiResponse<Page<Pedido>>>(this.base(), {
      params: { page, size },
      headers: { 'X-Conta-Id': contaId },
    });
  }

  criar(req: RealizarPedidoRequest, contaId: string): Observable<ApiResponse<PedidoCriadoResultado>> {
    return this.http.post<ApiResponse<PedidoCriadoResultado>>(this.base(), req, {
      headers: { 'X-Conta-Id': contaId },
    });
  }

  buscar(id: string, contaId: string): Observable<ApiResponse<Pedido>> {
    return this.http.get<ApiResponse<Pedido>>(`${this.base()}/${id}`, {
      headers: { 'X-Conta-Id': contaId },
    });
  }
}
