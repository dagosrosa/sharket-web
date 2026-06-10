import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, CriarProdutoRequest, Produto } from 'models';
import { SHARKET_API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private http = inject(HttpClient);
  private config = inject(SHARKET_API_CONFIG);
  private base = () => `${this.config.catalogUrl}/api/v1/produtos`;

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

  desativar(id: string, contaId: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base()}/${id}`, {
      headers: { 'X-Conta-Id': contaId },
    });
  }
}
