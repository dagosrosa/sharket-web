import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, LoginRequest, LoginResponse } from 'models';
import { SHARKET_API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class IamService {
  private http = inject(HttpClient);
  private config = inject(SHARKET_API_CONFIG);

  login(req: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.config.iamUrl}/api/v1/auth/login`,
      req
    );
  }
}
