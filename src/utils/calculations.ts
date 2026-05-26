// Prazo máximo: 420 meses (35 anos) — Caixa SBPE/SFH
// Entrada mínima SFH (≤ R$1,5M): 20% | SFI (> R$1,5M): 10%
export const PRAZO_MAX = 420;
export const ENTRADA_MIN_SFH = 0.2;   // 20%
export const ENTRADA_MIN_SFI = 0.1;   // 10%
export const LIMITE_SFH = 1_500_000;

export interface SimulationInputs {
  valorImovel: number;   // valor total do imóvel
  entradaPerc: number;   // percentual de entrada (0.20 = 20%)
  prazo: number;         // meses
}

export interface ConsorcioResult {
  credito: number;
  taxaAdministracao: number;
  fundoReserva: number;
  totalPago: number;
  parcelaMensal: number;
  parcelaMensalMin: number;
  parcelaMensalMax: number;
  prazo: number;
}

export interface FinanciamentoResult {
  creditoFinanciado: number;
  totalPago: number;
  jurosPagos: number;
  primeiroMes: number;
  ultimoMes: number;
  sistema: 'PRICE' | 'SAC';
}

export interface SimulationResult {
  consorcio: ConsorcioResult;
  price: FinanciamentoResult;
  sac: FinanciamentoResult;
  entradaValor: number;
  totalComEntradaPrice: number;
  totalComEntradaSac: number;
  economiaVsPrice: number;
  economiaVsSac: number;
  economiaPercVsPrice: number;
  economiaPercVsSac: number;
}

export function calcularConsorcio(inputs: SimulationInputs): ConsorcioResult {
  const { valorImovel } = inputs;
  const prazo = 200; // Consórcio normalmente é de até 200 meses
  const credito = valorImovel;
  const taxaAdministracao = credito * 0.23;
  const fundoReserva = credito * 0.02;
  const totalPago = credito + taxaAdministracao + fundoReserva;
  const parcelaMensal = totalPago / prazo;
  
  const parcelaMensalMin = parcelaMensal * 0.50; // Redutor máximo de 50%
  const parcelaMensalMax = parcelaMensal * 0.65; // Redutor mínimo de 35%

  return { credito, taxaAdministracao, fundoReserva, totalPago, parcelaMensal, parcelaMensalMin, parcelaMensalMax, prazo };
}

export function calcularPrice(creditoFinanciado: number, prazo: number): FinanciamentoResult {
  const taxaAnual = 0.12; // 12% a.a.
  const taxaMensal = Math.pow(1 + taxaAnual, 1 / 12) - 1;

  const parcela =
    (creditoFinanciado * taxaMensal * Math.pow(1 + taxaMensal, prazo)) /
    (Math.pow(1 + taxaMensal, prazo) - 1);

  const totalPago = parcela * prazo;
  const jurosPagos = totalPago - creditoFinanciado;

  return {
    creditoFinanciado,
    totalPago,
    jurosPagos,
    primeiroMes: parcela,
    ultimoMes: parcela,
    sistema: 'PRICE',
  };
}

export function calcularSac(creditoFinanciado: number, prazo: number): FinanciamentoResult {
  const taxaAnual = 0.12; // 12% a.a.
  const taxaMensal = Math.pow(1 + taxaAnual, 1 / 12) - 1;
  const amortizacao = creditoFinanciado / prazo;

  let totalPago = 0;
  let jurosPagos = 0;
  let primeiroMes = 0;
  let ultimoMes = 0;

  for (let i = 1; i <= prazo; i++) {
    const saldo = creditoFinanciado - amortizacao * (i - 1);
    const juros = saldo * taxaMensal;
    const parcela = amortizacao + juros;
    totalPago += parcela;
    jurosPagos += juros;
    if (i === 1) primeiroMes = parcela;
    if (i === prazo) ultimoMes = parcela;
  }

  return { creditoFinanciado, totalPago, jurosPagos, primeiroMes, ultimoMes, sistema: 'SAC' };
}

export function calcularSimulacao(inputs: SimulationInputs): SimulationResult {
  const entradaValor = inputs.valorImovel * inputs.entradaPerc;
  const creditoFinanciado = inputs.valorImovel - entradaValor;

  const consorcio = calcularConsorcio(inputs);
  const price = calcularPrice(creditoFinanciado, inputs.prazo);
  const sac = calcularSac(creditoFinanciado, inputs.prazo);

  // Total real pago no financiamento = entrada + parcelas
  const totalComEntradaPrice = entradaValor + price.totalPago;
  const totalComEntradaSac = entradaValor + sac.totalPago;

  const economiaVsPrice = totalComEntradaPrice - consorcio.totalPago;
  const economiaVsSac = totalComEntradaSac - consorcio.totalPago;
  const economiaPercVsPrice = (economiaVsPrice / totalComEntradaPrice) * 100;
  const economiaPercVsSac = (economiaVsSac / totalComEntradaSac) * 100;

  return {
    consorcio,
    price,
    sac,
    entradaValor,
    totalComEntradaPrice,
    totalComEntradaSac,
    economiaVsPrice,
    economiaVsSac,
    economiaPercVsPrice,
    economiaPercVsSac,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCurrencyFull(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}
