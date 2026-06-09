export interface FeatureFlag {
  id: string;
  chave: string;
  descricao: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CriarFeatureFlagRequest {
  chave: string;
  descricao: string;
}
