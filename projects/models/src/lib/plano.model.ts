export interface Plano {
  id: string;
  nome: string;
  taxaPercentual: number;
  taxaFixa: number;
  ativo: boolean;
  criadoEm: string;
}

export interface CriarPlanoRequest {
  nome: string;
  taxaPercentual: number;
  taxaFixa: number;
}
