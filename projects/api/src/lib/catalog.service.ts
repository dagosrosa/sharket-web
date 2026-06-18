import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, CheckoutConfig, CriarOfertaRequest, CriarProdutoRequest, Oferta, OfertaPublica, Produto, SalvarCheckoutConfigRequest } from 'models';
import { SHARKET_API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private http = inject(HttpClient);
  private config = inject(SHARKET_API_CONFIG);
  private base = () => `${this.config.catalogUrl}/api/v1/produtos`;
  private baseOfertas = () => `${this.config.catalogUrl}/api/v1/ofertas`;

  listar(contaId: string): Observable<ApiResponse<Produto[]>> {
    return this.http.get<ApiResponse<Produto[]>>(this.base(), {
      headers: { 'X-Conta-Id': contaId },
    });
  }

  buscar(id: string, contaId: string): Observable<ApiResponse<Produto>> {
    return this.http.get<ApiResponse<Produto>>(`${this.base()}/${id}`, {
      headers: { 'X-Conta-Id': contaId },
    });
  }

  criar(req: CriarProdutoRequest, contaId: string): Observable<ApiResponse<Produto>> {
    return this.http.post<ApiResponse<Produto>>(this.base(), req, {
      headers: { 'X-Conta-Id': contaId },
    });
  }

  atualizar(id: string, req: CriarProdutoRequest, contaId: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.base()}/${id}`, req, {
      headers: { 'X-Conta-Id': contaId },
    });
  }

  desativar(id: string, contaId: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base()}/${id}`, {
      headers: { 'X-Conta-Id': contaId },
    });
  }

  listarOfertas(contaId: string, produtoId?: string): Observable<ApiResponse<Oferta[]>> {
    const params: Record<string, string> = {};
    if (produtoId) params['produtoId'] = produtoId;
    return this.http.get<ApiResponse<Oferta[]>>(this.baseOfertas(), {
      headers: { 'X-Conta-Id': contaId },
      params,
    });
  }

  criarOferta(req: CriarOfertaRequest, contaId: string): Observable<ApiResponse<Oferta>> {
    return this.http.post<ApiResponse<Oferta>>(this.baseOfertas(), req, {
      headers: { 'X-Conta-Id': contaId },
    });
  }

  atualizarOferta(id: string, req: Omit<CriarOfertaRequest, 'produtoId'>, contaId: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.baseOfertas()}/${id}`, req, {
      headers: { 'X-Conta-Id': contaId },
    });
  }

  desativarOferta(id: string, contaId: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseOfertas()}/${id}`, {
      headers: { 'X-Conta-Id': contaId },
    });
  }

  buscarOfertaPublica(id: string): Observable<ApiResponse<OfertaPublica>> {
    return this.http.get<ApiResponse<OfertaPublica>>(`${this.baseOfertas()}/public/${id}`);
  }

  getCheckoutConfig(contaId: string): Observable<ApiResponse<CheckoutConfig>> {
    return this.http.get<ApiResponse<CheckoutConfig>>(
      `${this.config.catalogUrl}/api/v1/checkout-config`,
      { headers: { 'X-Conta-Id': contaId } }
    );
  }

  saveCheckoutConfig(req: SalvarCheckoutConfigRequest, contaId: string): Observable<ApiResponse<CheckoutConfig>> {
    return this.http.put<ApiResponse<CheckoutConfig>>(
      `${this.config.catalogUrl}/api/v1/checkout-config`,
      req,
      { headers: { 'X-Conta-Id': contaId } }
    );
  }
}
