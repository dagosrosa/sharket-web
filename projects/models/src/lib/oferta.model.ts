export type TipoOferta = 'UNICA' | 'RECORRENTE' | 'PARCELADA';

export interface Oferta {
  id: string;
  contaId: string;
  produtoId: string;
  nome: string;
  valor: number;
  tipo: TipoOferta;
  maxParcelas: number;
  principal: boolean;
  ativa: boolean;
  criadoEm: string;
}

export interface OfertaPublica {
  id: string;
  produtoId: string;
  nomeProduto: string;
  nomeOferta: string;
  valor: number;
  tipo: TipoOferta;
  maxParcelas: number;
  tipoProduto: string;
  urlDownload: string | null;
}

export interface CriarOfertaRequest {
  produtoId: string;
  nome: string;
  valor: number;
  tipo: TipoOferta;
  maxParcelas: number;
}
