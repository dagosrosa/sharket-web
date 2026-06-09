export interface AplicativoOAuth {
  id: string;
  nome: string;
  clientId: string;
  clientSecret?: string;
  contaId: string;
  criadoEm: string;
}

export interface RegistrarAplicativoRequest {
  nome: string;
  contaId: string;
}
