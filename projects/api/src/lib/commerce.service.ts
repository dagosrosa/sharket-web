import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Pedido, PedidoCriadoResultado, RealizarPedidoRequest, ResumoRelatorio, StatusPedido, VendaDiaria } from 'models';
import { SHARKET_API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class CommerceService {
  private http = inject(HttpClient);
  private config = inject(SHARKET_API_CONFIG);
  private base = () => `${this.config.commerceUrl}/api/v1/pedidos`;

  listar(contaId: string, status?: StatusPedido): Observable<ApiResponse<Pedido[]>> {
    const params: Record<string, string> = {};
    if (status) params['status'] = status;
    return this.http.get<ApiResponse<Pedido[]>>(this.base(), {
      params,
      headers: { 'X-Conta-Id': contaId },
    });
  }

  buscar(id: string, contaId: string): Observable<ApiResponse<Pedido>> {
    return this.http.get<ApiResponse<Pedido>>(`${this.base()}/${id}`, {
      headers: { 'X-Conta-Id': contaId },
    });
  }

  criar(req: RealizarPedidoRequest, contaId: string): Observable<ApiResponse<PedidoCriadoResultado>> {
    return this.http.post<ApiResponse<PedidoCriadoResultado>>(this.base(), req, {
      headers: { 'X-Conta-Id': contaId },
    });
  }

  listarMinhasCompras(): Observable<ApiResponse<Pedido[]>> {
    return this.http.get<ApiResponse<Pedido[]>>(`${this.base()}/comprador`);
  }

  buscarMinhaCompra(id: string): Observable<ApiResponse<Pedido>> {
    return this.http.get<ApiResponse<Pedido>>(`${this.base()}/comprador/${id}`);
  }

  relatorioResumo(contaId: string): Observable<ApiResponse<ResumoRelatorio>> {
    return this.http.get<ApiResponse<ResumoRelatorio>>(
      `${this.config.commerceUrl}/api/v1/relatorios/resumo`,
      { headers: { 'X-Conta-Id': contaId } }
    );
  }

  relatorioVendasDiarias(contaId: string, dias = 30): Observable<ApiResponse<VendaDiaria[]>> {
    return this.http.get<ApiResponse<VendaDiaria[]>>(
      `${this.config.commerceUrl}/api/v1/relatorios/vendas-diarias`,
      { headers: { 'X-Conta-Id': contaId }, params: { dias } }
    );
  }
}
