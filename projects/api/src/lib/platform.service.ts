import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiResponse,
  AplicativoOAuth,
  CriarFeatureFlagRequest,
  CriarPlanoRequest,
  FeatureFlag,
  Page,
  Plano,
  RegistrarAplicativoRequest,
} from 'models';
import { SHARKET_API_CONFIG } from './api.config';

const PLATFORM_PORT = 8088;

@Injectable({ providedIn: 'root' })
export class PlatformService {
  private http = inject(HttpClient);
  private config = inject(SHARKET_API_CONFIG);
  private base = () => {
    const host = new URL(this.config.iamUrl).hostname;
    return `http://${host}:${PLATFORM_PORT}/api/v1`;
  };

  // Planos
  listarPlanos(): Observable<ApiResponse<Page<Plano>>> {
    return this.http.get<ApiResponse<Page<Plano>>>(`${this.base()}/planos`);
  }

  criarPlano(req: CriarPlanoRequest): Observable<ApiResponse<Plano>> {
    return this.http.post<ApiResponse<Plano>>(`${this.base()}/planos`, req);
  }

  // Feature Flags
  listarFlags(): Observable<ApiResponse<Page<FeatureFlag>>> {
    return this.http.get<ApiResponse<Page<FeatureFlag>>>(`${this.base()}/feature-flags`);
  }

  criarFlag(req: CriarFeatureFlagRequest): Observable<ApiResponse<FeatureFlag>> {
    return this.http.post<ApiResponse<FeatureFlag>>(`${this.base()}/feature-flags`, req);
  }

  toggleFlag(id: string): Observable<ApiResponse<FeatureFlag>> {
    return this.http.patch<ApiResponse<FeatureFlag>>(
      `${this.base()}/feature-flags/${id}/toggle`,
      {}
    );
  }

  // OAuth Apps
  listarApps(): Observable<ApiResponse<Page<AplicativoOAuth>>> {
    return this.http.get<ApiResponse<Page<AplicativoOAuth>>>(`${this.base()}/oauth/aplicativos`);
  }

  registrarApp(req: RegistrarAplicativoRequest): Observable<ApiResponse<AplicativoOAuth>> {
    return this.http.post<ApiResponse<AplicativoOAuth>>(
      `${this.base()}/oauth/aplicativos`,
      req
    );
  }
}
