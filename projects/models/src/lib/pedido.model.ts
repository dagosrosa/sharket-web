export type StatusPedido =
  | 'PENDENTE'
  | 'CRIADO'
  | 'AGUARDANDO_PAGAMENTO'
  | 'APROVADO'
  | 'PAGO'
  | 'EM_PROCESSAMENTO'
  | 'ENVIADO'
  | 'ENTREGUE'
  | 'CANCELADO'
  | 'REEMBOLSADO'
  | 'EXPIRADO';

export interface RealizarPedidoRequest {
  ofertaId?: string;
  produtoId: string;
  clienteNome: string;
  clienteEmail: string;
  clienteDocumento: string;
  metodo: string;
  valor: number;
  parcelas: number;
}

export interface PedidoCriadoResultado {
  pedidoId: string;
  status: StatusPedido;
  valor: number;
}

export interface PagamentoResultado {
  pagamentoId: string;
  status: string;
  pixQrCode: string | null;
  boletoLinhaDigitavel: string | null;
}

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
