// Prazo máximo: 420 meses (35 anos) — Caixa SBPE/SFH
// Entrada mínima SFH (≤ R$1,5M): 20% | SFI (> R$1,5M): 10%
export const PRAZO_MAX = 420;
export const ENTRADA_MIN_SFH = 0.2;   // 20%
export const ENTRADA_MIN_SFI = 0.1;   // 10%
export const LIMITE_SFH = 1_500_000;

export interface SimulationInputs {
  valorImovel: number;        // valor total do imóvel
  entradaPerc: number;        // percentual de entrada (0.20 = 20%)
  prazo: number;              // meses do financiamento
  // --- Parâmetros Avançados da Mesa ---
  taxaJurosAno: number;       // ex: 0.12 para 12% a.a.
  taxaTrAno?: number;         // ex: 0.015 para 1.5% a.a. (TR Estimada)
  taxaAdm: number;            // ex: 0.23 para 23%
  fundoReserva: number;       // ex: 0.02 para 2%
  seguroPrestamista: number;  // ex: 0.00035 para 0.035% a.m.
  prazoConsorcio: number;     // meses do consórcio
  reajusteAnual: number;      // ex: 0.05 para 5% a.a. (INCC/IPCA ou Fixo)
  redutorPerc: number;        // ex: 0.50 para 50% de redutor de parcela
  prazoContemplacao: number;  // ex: 24 meses estimados para contemplação
}

export interface ConsorcioResult {
  credito: number;
  taxaAdministracao: number;
  fundoReserva: number;
  totalSeguroPrestamista: number;
  totalPago: number;
  parcelaMensal: number;         // Parcela Integral base (100% + Seguro)
  parcelaMensalMin: number;      // Parcela Reduzida antes da contemplação
  parcelaPosContemplacao: number;// Parcela recalculada com a diluição pós-contemplação
  prazo: number;
}

export interface FinanciamentoResult {
  creditoFinanciado: number;
  totalPago: number;
  jurosPagos: number;
  trPaga: number;               // Custo total acumulado da TR oculta
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
  const { valorImovel, taxaAdm, fundoReserva, seguroPrestamista, prazoConsorcio, redutorPerc, prazoContemplacao } = inputs;
  const credito = valorImovel;
  
  const taxaAdministracao = credito * taxaAdm;
  const fundoReservaValor = credito * fundoReserva;
  
  const custoSeguroMensal = credito * seguroPrestamista;
  const totalSeguroPrestamista = custoSeguroMensal * prazoConsorcio;
  
  const parcelaBaseMensal = (credito + taxaAdministracao + fundoReservaValor) / prazoConsorcio;
  
  const parcelaMensal = parcelaBaseMensal + custoSeguroMensal;
  const parcelaMensalMin = (parcelaBaseMensal * redutorPerc) + custoSeguroMensal; 

  const mesesReduzidos = Math.min(prazoContemplacao, prazoConsorcio);
  const mesesRestantes = prazoConsorcio - mesesReduzidos;

  const deficitMensal = parcelaMensal - parcelaMensalMin;
  const saldoDevedorOculto = deficitMensal * mesesReduzidos;

  let parcelaPosContemplacao = parcelaMensal;
  if (mesesRestantes > 0) {
    parcelaPosContemplacao = parcelaMensal + (saldoDevedorOculto / mesesRestantes);
  }

  const totalPago = (parcelaMensalMin * mesesReduzidos) + (parcelaPosContemplacao * mesesRestantes);

  return { 
    credito, 
    taxaAdministracao, 
    fundoReserva: fundoReservaValor, 
    totalSeguroPrestamista,
    totalPago, 
    parcelaMensal, 
    parcelaMensalMin, 
    parcelaPosContemplacao,
    prazo: prazoConsorcio 
  };
}

// Simulador realístico PRICE considerando a correção mensal do saldo devedor via TR + Seguros Ocultos obrigatórios (MIP/DFI) e taxa de boleto
export function calcularPrice(creditoFinanciado: number, prazo: number, taxaAnual: number, taxaTrAnual: number = 0.015): FinanciamentoResult {
  const taxaJurosMensal = Math.pow(1 + taxaAnual, 1 / 12) - 1;
  const taxaTrMensal = Math.pow(1 + taxaTrAnual, 1 / 12) - 1;
  
  // Encargos fixos bancários reais: Seguros habitacionais obrigatórios (MIP/DFI) + taxa de adm mensal
  const taxaSegurosMes = 0.0001; // ~0.01% am cobrado sobre o saldo devedor
  const taxaAdmContrato = 25;    // R$ 25,00 por parcela fixo

  let saldoDevedor = creditoFinanciado;
  let totalPago = 0;
  let jurosPagos = 0;
  let trPaga = 0;
  let primeiroMes = 0;
  let ultimoMes = 0;

  for (let i = 1; i <= prazo; i++) {
    if (saldoDevedor <= 0) break;

    // 1. Aplicação da TR corrigindo o saldo devedor antes da parcela
    const correcaoTR = saldoDevedor * taxaTrMensal;
    trPaga += correcaoTR;
    saldoDevedor += correcaoTR;

    // 2. Cálculo da parcela PRICE base do mês
    const parcelaBase = (saldoDevedor * taxaJurosMensal * Math.pow(1 + taxaJurosMensal, prazo - i + 1)) / 
                        (Math.pow(1 + taxaJurosMensal, prazo - i + 1) - 1);

    const jurosDoMes = saldoDevedor * taxaJurosMensal;
    const amortizacaoDoMes = parcelaBase - jurosDoMes;

    // 3. Soma dos seguros obrigatórios e tarifas bancárias que o gerente omite
    const custoSeguro = saldoDevedor * taxaSegurosMes;
    const parcelaTotal = parcelaBase + custoSeguro + taxaAdmContrato;

    jurosPagos += jurosDoMes;
    totalPago += parcelaTotal;
    saldoDevedor -= amortizacaoDoMes;

    if (i === 1) primeiroMes = parcelaTotal;
    if (i === prazo) ultimoMes = parcelaTotal;
  }

  return { creditoFinanciado, totalPago, jurosPagos, trPaga, primeiroMes, ultimoMes, sistema: 'PRICE' };
}

// Simulador realístico SAC recalculando a queda da amortização mensal sofrendo reajuste de inflação/TR no saldo residual
export function calcularSac(creditoFinanciado: number, prazo: number, taxaAnual: number, taxaTrAnual: number = 0.015): FinanciamentoResult {
  const taxaJurosMensal = Math.pow(1 + taxaAnual, 1 / 12) - 1;
  const taxaTrMensal = Math.pow(1 + taxaTrAnual, 1 / 12) - 1;
  
  const taxaSegurosMes = 0.0001;
  const taxaAdmContrato = 25;

  let saldoDevedor = creditoFinanciado;
  let totalPago = 0;
  let jurosPagos = 0;
  let trPaga = 0;
  let primeiroMes = 0;
  let ultimoMes = 0;

  for (let i = 1; i <= prazo; i++) {
    if (saldoDevedor <= 0) break;

    // 1. Correção monetária mensal do saldo por TR
    const correcaoTR = saldoDevedor * taxaTrMensal;
    trPaga += correcaoTR;
    saldoDevedor += correcaoTR;

    // 2. Amortização linear sobre a base remanescente
    const amortizacao = saldoDevedor / (prazo - i + 1);
    const jurosDoMes = saldoDevedor * taxaJurosMensal;
    
    // 3. Parcela final composta
    const custoSeguro = saldoDevedor * taxaSegurosMes;
    const parcelaTotal = amortizacao + jurosDoMes + custoSeguro + taxaAdmContrato;

    jurosPagos += jurosDoMes;
    totalPago += parcelaTotal;
    saldoDevedor -= amortizacao;

    if (i === 1) primeiroMes = parcelaTotal;
    if (i === prazo) ultimoMes = parcelaTotal;
  }

  return { creditoFinanciado, totalPago, jurosPagos, trPaga, primeiroMes, ultimoMes, sistema: 'SAC' };
}

export function calcularSimulacao(inputs: SimulationInputs): SimulationResult {
  const entradaValor = inputs.valorImovel * inputs.entradaPerc;
  const creditoFinanciado = inputs.valorImovel - entradaValor;
  
  const taxaTrAno = inputs.taxaTrAno ?? 0.015;

  const consorcio = calcularConsorcio(inputs);
  const price = calcularPrice(creditoFinanciado, inputs.prazo, inputs.taxaJurosAno, taxaTrAno);
  const sac = calcularSac(creditoFinanciado, inputs.prazo, inputs.taxaJurosAno, taxaTrAno);

  const totalComEntradaPrice = entradaValor + price.totalPago;
  const totalComEntradaSac = entradaValor + sac.totalPago;

  const economyVsPrice = totalComEntradaPrice - consorcio.totalPago;
  const economyVsSac = totalComEntradaSac - consorcio.totalPago;
  const economiaPercVsPrice = (economyVsPrice / totalComEntradaPrice) * 100;
  const economiaPercVsSac = (economyVsSac / totalComEntradaSac) * 100;

  return {
    consorcio,
    price,
    sac,
    entradaValor,
    totalComEntradaPrice,
    totalComEntradaSac,
    economiaVsPrice: economyVsPrice,
    economiaVsSac: economyVsSac,
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

export function formatPercentExact(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}