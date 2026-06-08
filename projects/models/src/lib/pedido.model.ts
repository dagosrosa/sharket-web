export type StatusPedido =
  | 'CRIADO'
  | 'AGUARDANDO_PAGAMENTO'
  | 'PAGO'
  | 'EM_PROCESSAMENTO'
  | 'ENVIADO'
  | 'ENTREGUE'
  | 'CANCELADO'
  | 'REEMBOLSADO';

export interface ItemPedido {
  produtoId: string;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
}

export interface Pedido {
  id: string;
  compradorEmail: string;
  status: StatusPedido;
  itens: ItemPedido[];
  total: number;
  contaId: string;
  criadoEm: string;
  atualizadoEm: string;
}
