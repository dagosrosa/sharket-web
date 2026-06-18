export type StatusPedido =
  | 'PENDENTE'
  | 'AGUARDANDO_PAGAMENTO'
  | 'APROVADO'
  | 'CANCELADO'
  | 'REEMBOLSADO'
  | 'EXPIRADO';

export type MetodoPagamento = 'CARTAO_CREDITO' | 'PIX' | 'BOLETO' | 'BOLETO_PARCELADO';

export interface DadosCliente {
  nome: string;
  email: string;
  documento: string;
}

export interface Pedido {
  id: string;
  contaId: string;
  ofertaId: string | null;
  produtoId: string;
  cliente: DadosCliente;
  metodo: MetodoPagamento;
  status: StatusPedido;
  valor: number;
  parcelas: number;
  referenciaGateway: string | null;
  tipoProduto: string;
  urlDownload: string | null;
  codigoRastreio: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface RealizarPedidoRequest {
  ofertaId?: string;
  produtoId: string;
  clienteNome: string;
  clienteEmail: string;
  clienteDocumento: string;
  metodo: string;
  valor: number;
  parcelas: number;
  tipoProduto: string;
  urlDownload?: string;
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
