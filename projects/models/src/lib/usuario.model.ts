export type Perfil = 'MASTER' | 'KINGPIN' | 'ADMINISTRATOR' | 'PARTNER' | 'SUPPORT_PRODUCER' | 'SUPPORT_FINANCIAL';

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

export interface CadastroRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  contaId: string;
  nome: string;
  email: string;
  role: Perfil;
}
