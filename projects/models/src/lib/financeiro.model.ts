export type TipoLancamento = 'CREDITO' | 'DEBITO';

export type StatusSaque = 'SOLICITADO' | 'PROCESSANDO' | 'CONCLUIDO' | 'CANCELADO';

export interface Saldo {
  disponivel: number;
  aLiberar: number;
}

export interface Lancamento {
  id: string;
  tipo: TipoLancamento;
  valor: number;
  descricao: string;
  liberadoEm: string;
  criadoEm: string;
}

export interface Saque {
  id: string;
  valor: number;
  status: StatusSaque;
  criadoEm: string;
  atualizadoEm: string;
}

export interface SolicitarSaqueRequest {
  valor: number;
}
