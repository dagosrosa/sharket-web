export type Periodicidade = 'MENSAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';

export type StatusAssinatura = 'ATIVA' | 'PAUSADA' | 'CANCELADA' | 'INADIMPLENTE';

export interface Assinatura {
  id: string;
  compradorEmail: string;
  produtoId: string;
  nomeProduto: string;
  valorCobrado: number;
  periodicidade: Periodicidade;
  status: StatusAssinatura;
  dataProximaCobranca: string;
  contaId: string;
  criadoEm: string;
}
