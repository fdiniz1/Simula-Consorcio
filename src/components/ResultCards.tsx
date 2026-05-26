import { AnimatedCurrency } from './AnimatedCurrency';
import type { SimulationResult, SimulationInputs } from '../utils/calculations';
import { formatCurrency, formatPercent } from '../utils/calculations';

interface ResultCardsProps {
  result: SimulationResult;
  inputs: SimulationInputs;
}

function heroFontClass(value: number): string {
  const len = formatCurrency(value).length;
  if (len <= 12) return 'text-3xl font-black tracking-tight';
  if (len <= 15) return 'text-2xl font-black tracking-tight';
  if (len <= 18) return 'text-xl font-black tracking-tight';
  return 'text-lg font-black tracking-tight';
}

function InfoRow({ label, value, highlight, highlightColor }: { label: string; value: string; highlight?: boolean; highlightColor?: string }) {
  return (
    <div className="flex justify-between items-center min-h-[2.75rem] py-1.5 border-b border-border/30 gap-3">
      <span className="text-[11px] sm:text-xs text-text-secondary/70 flex-1 leading-tight">{label}</span>
      <span
        className="text-xs sm:text-sm font-semibold tabular-nums whitespace-nowrap shrink-0 text-right"
        style={highlight || highlightColor ? { color: highlightColor || '#F5C200' } : { color: '#F2EDE2' }}
      >
        {value}
      </span>
    </div>
  );
}

export function ResultCards({ result, inputs }: ResultCardsProps) {
  const { consorcio, price, sac, entradaValor, totalComEntradaPrice, totalComEntradaSac } = result;
  const creditoFinanciado = inputs.valorImovel - entradaValor;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Consórcio */}
      <div
        className="rounded-2xl p-6 border animate-fade-up relative overflow-hidden flex flex-col h-full"
        style={{ background: '#16140F', borderColor: 'rgba(245,194,0,0.25)', boxShadow: '0 0 40px rgba(245,194,0,0.05)' }}
      >
        <div
          className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
          style={{ background: '#F5C200', opacity: 0.08, filter: 'blur(32px)', transform: 'translate(30%,-30%)' }}
        />
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full" style={{ background: '#F5C200', boxShadow: '0 0 6px #F5C200' }} />
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#F5C200' }}>Consórcio</span>
        </div>
        <div className="mb-4 sm:mb-5 shrink-0 flex flex-col justify-center">
          <p className="text-xs text-text-secondary/60 mb-0.5 sm:mb-1">Total pago</p>
          <div>
            <AnimatedCurrency value={consorcio.totalPago} className={`${heroFontClass(consorcio.totalPago)} text-text-primary whitespace-nowrap`} />
          </div>
          <p className="text-[11px] text-text-secondary/50 mt-2">+ o indice de reajuste da carta</p>
        </div>
        <div className="flex flex-col justify-between gap-1 mt-1 sm:mt-2 flex-1">
          <InfoRow label="Parcela (50% redutor)" value={formatCurrency(consorcio.parcelaMensalMin)} highlightColor="#4ade80" />
          <InfoRow label="Parcela (35% redutor)" value={formatCurrency(consorcio.parcelaMensalMax)} highlightColor="#fde047" />
          <InfoRow label="Parcela (integral)" value={formatCurrency(consorcio.parcelaMensal)} highlightColor="#F5C200" />
          <InfoRow label="Crédito contratado" value={formatCurrency(consorcio.credito)} />
          <InfoRow label="Taxa adm. (23%)" value={formatCurrency(consorcio.taxaAdministracao)} />
          <InfoRow label="Fundo res. (2%)" value={formatCurrency(consorcio.fundoReserva)} />
          <InfoRow label="Prazo" value={consorcio.prazo + ' meses'} />
        </div>
      </div>

      {/* Financiamento Price */}
      <div
        className="rounded-2xl p-6 border animate-fade-up delay-100 relative overflow-hidden flex flex-col h-full"
        style={{ background: '#16140F', borderColor: 'rgba(248,113,113,0.2)' }}
      >
        <div
          className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
          style={{ background: '#f87171', opacity: 0.08, filter: 'blur(32px)', transform: 'translate(30%,-30%)' }}
        />
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <span className="text-xs font-bold tracking-widest uppercase text-red-400">Financ. Price</span>
        </div>
        <div className="mb-4 sm:mb-5 shrink-0 flex flex-col justify-center">
          <p className="text-xs text-text-secondary/60 mb-0.5 sm:mb-1">Total com entrada</p>
          <div>
            <AnimatedCurrency value={totalComEntradaPrice} className={`${heroFontClass(totalComEntradaPrice)} text-text-primary whitespace-nowrap`} />
          </div>
          <p className="text-[11px] text-text-secondary/50 mt-2">Financ. Parcelas fixas</p>
        </div>
        <div className="flex flex-col justify-between gap-1 mt-1 sm:mt-2 flex-1">
          <InfoRow label="Parcela (fixa)" value={formatCurrency(price.primeiroMes)} highlightColor="#f87171" />
          <InfoRow label={"Entrada (" + formatPercent(inputs.entradaPerc) + ")"} value={formatCurrency(entradaValor)} />
          <InfoRow label="Crédito financiado" value={formatCurrency(creditoFinanciado)} />
          <InfoRow label="Taxa de juros" value="12% a.a." />
          <InfoRow label="Juros pagos" value={formatCurrency(price.jurosPagos)} />
          <InfoRow label="Total financiado" value={formatCurrency(price.totalPago)} />
          <InfoRow label="Prazo" value={inputs.prazo + ' meses'} />
        </div>
      </div>

      {/* Financiamento SAC */}
      <div
        className="rounded-2xl p-6 border animate-fade-up delay-200 relative overflow-hidden flex flex-col h-full"
        style={{ background: '#16140F', borderColor: 'rgba(249,115,22,0.2)' }}
      >
        <div
          className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
          style={{ background: '#f97316', opacity: 0.08, filter: 'blur(32px)', transform: 'translate(30%,-30%)' }}
        />
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-orange-400" />
          <span className="text-xs font-bold tracking-widest uppercase text-orange-400">Financ. SAC</span>
        </div>
        <div className="mb-4 sm:mb-5 shrink-0 flex flex-col justify-center">
          <p className="text-xs text-text-secondary/60 mb-0.5 sm:mb-1">Total com entrada</p>
          <div>
            <AnimatedCurrency value={totalComEntradaSac} className={`${heroFontClass(totalComEntradaSac)} text-text-primary whitespace-nowrap`} />
          </div>
          <p className="text-[11px] text-text-secondary/50 mt-2">Financ. Parcelas decrescentes</p>
        </div>
        <div className="flex flex-col justify-between gap-1 mt-1 sm:mt-2 flex-1">
          <InfoRow label="1ª Parcela" value={formatCurrency(sac.primeiroMes)} highlightColor="#f97316" />
          <InfoRow label="Última Parcela" value={formatCurrency(sac.ultimoMes)} highlightColor="#fdba74" />
          <InfoRow label={"Entrada (" + formatPercent(inputs.entradaPerc) + ")"} value={formatCurrency(entradaValor)} />
          <InfoRow label="Crédito financiado" value={formatCurrency(creditoFinanciado)} />
          <InfoRow label="Taxa de juros" value="12% a.a." />
          <InfoRow label="Juros pagos" value={formatCurrency(sac.jurosPagos)} />
          <InfoRow label="Prazo" value={inputs.prazo + ' meses'} />
        </div>
      </div>
    </div>
  );
}
