export type TipoProduto = 'CURSO_ONLINE' | 'EBOOK' | 'MENTORIA' | 'SERVICO' | 'EVENTO' | 'ASSINATURA' | 'FISICO';

export interface Produto {
  id: string;
  contaId: string;
  nome: string;
  descricao: string;
  imagemUrl: string | null;
  tipo: TipoProduto;
  preco: number;
  periodoReembolsoDias: number;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CriarProdutoRequest {
  nome: string;
  descricao?: string;
  imagemUrl?: string;
  tipo: TipoProduto;
  preco: number;
  periodoReembolsoDias?: number;
}
