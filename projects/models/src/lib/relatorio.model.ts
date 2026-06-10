export interface ResumoRelatorio {
  totalPedidos: number;
  valorTotal: number;
  ticketMedio: number;
  aprovados: number;
  pendentes: number;
  cancelados: number;
  reembolsados: number;
}

export interface VendaDiaria {
  dia: string;
  quantidade: number;
  valor: number;
}
