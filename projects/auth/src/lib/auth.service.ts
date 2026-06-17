import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginResponse, Usuario } from 'models';

const TOKEN_KEY = 'sharket_token';
const USER_KEY = 'sharket_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);

  private _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private _user = signal<Usuario | null>(this._loadUser());

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());

  setSession(response: LoginResponse): void {
    const usuario: Usuario = {
      id: response.contaId,
      nome: response.nome,
      email: response.email,
      perfil: response.role,
      contaId: response.contaId,
    };
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(usuario));
    this._token.set(response.token);
    this._user.set(usuario);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  private _loadUser(): Usuario | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as Usuario) : null;
  }
}
