export type Perfil = 'MASTER' | 'ADMIN' | 'VENDEDOR' | 'SUPORTE';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: Perfil;
  contaId: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}
