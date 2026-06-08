import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, CriarProdutoRequest, Page, Produto } from 'models';
import { SHARKET_API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private http = inject(HttpClient);
  private config = inject(SHARKET_API_CONFIG);
  private base = () => `${this.config.catalogUrl}/api/v1/produtos`;

  listar(contaId: string, page = 0, size = 20): Observable<ApiResponse<Page<Produto>>> {
    return this.http.get<ApiResponse<Page<Produto>>>(this.base(), {
      params: { page, size },
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
