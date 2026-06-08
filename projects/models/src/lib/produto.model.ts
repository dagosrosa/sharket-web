export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  ativo: boolean;
  contaId: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CriarProdutoRequest {
  nome: string;
  descricao: string;
  preco: number;
}
