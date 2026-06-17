import { AnimatedCurrency } from './AnimatedCurrency';
import type { SimulationResult, SimulationInputs } from '../utils/calculations';
import { formatCurrency, formatPercent, formatPercentExact } from '../utils/calculations';

// Tipagem estendida incluindo os parâmetros opcionais da mesa e a TR
type ExtendedInputs = SimulationInputs & { 
  prazoContemplacao?: number;
  taxaTrAno?: number;
};

interface ResultCardsProps {
  result: SimulationResult;
  inputs: ExtendedInputs;
}

function heroFontClass(value: number): string {
  const len = formatCurrency(value).length;
  if (len <= 12) return 'text-3xl font-black tracking-tight';
  if (len <= 15) return 'text-2xl font-black tracking-tight';
  if (len <= 18) return 'text-xl font-black tracking-tight';
  return 'text-lg font-black tracking-tight';
}

function InfoRow({ label, value, highlightColor }: { label: string; value: string; highlightColor?: string }) {
  return (
    <div className="flex justify-between items-center min-h-[2.75rem] py-1.5 border-b border-border/30 gap-3">
      <span className="text-[11px] sm:text-xs text-text-secondary/70 flex-1 leading-tight">{label}</span>
      <span
        className="text-xs sm:text-sm font-semibold tabular-nums whitespace-nowrap shrink-0 text-right"
        style={{ color: highlightColor || '#F2EDE2' }}
      >
        {value}
      </span>
    </div>
  );
}

export function ResultCards({ result, inputs }: ResultCardsProps) {
  const { consorcio, price, sac, entradaValor, totalComEntradaPrice, totalComEntradaSac } = result;
  const creditoFinanciado = inputs.valorImovel - entradaValor;
  
  const { prazoContemplacao = inputs.prazoConsorcio, taxaTrAno = 0.015 } = inputs;

  // Se o prazo de contemplação estimado for menor que o prazo total, o switch está ativo
  const isContemplacaoAtiva = prazoContemplacao < inputs.prazoConsorcio;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full items-stretch">
      {/* Card 1: Consórcio */}
      <div
        className="rounded-2xl p-6 border relative overflow-hidden flex flex-col h-full w-full"
        style={{ background: '#16140F', borderColor: 'rgba(245,194,0,0.25)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full" style={{ background: '#F5C200' }} />
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#F5C200' }}>Consórcio</span>
        </div>
        <div className="mb-4 sm:mb-5 shrink-0 flex flex-col justify-center">
          <p className="text-xs text-text-secondary/60 mb-0.5 sm:mb-1">Custo Total</p>
          <div>
            <AnimatedCurrency value={consorcio.totalPago} className={`${heroFontClass(consorcio.totalPago)} text-text-primary whitespace-nowrap`} />
          </div>
        </div>
        <div className="flex flex-col justify-between gap-1 mt-1 sm:mt-2 flex-1">
          <InfoRow 
            label={isContemplacaoAtiva ? `Parcela Inicial (Até ${prazoContemplacao}º mês)` : `Parcela (Redutor ${formatPercent(inputs.redutorPerc)})`} 
            value={formatCurrency(consorcio.parcelaMensalMin)} 
            highlightColor="#4ade80" 
          />
          
          {isContemplacaoAtiva ? (
            <InfoRow 
              label={`Parcela Pós-Contemplação (Do ${prazoContemplacao + 1}º mês em diante)`} 
              value={formatCurrency(consorcio.parcelaPosContemplacao)} 
              highlightColor="#F5C200" 
            />
          ) : (
            <InfoRow 
              label="Parcela (Integral Padrão)" 
              value={formatCurrency(consorcio.parcelaMensal)} 
              highlightColor="#F5C200" 
            />
          )}

          <InfoRow label="Crédito Contratado" value={formatCurrency(consorcio.credito)} />
          <InfoRow 
            label={`Taxa Adm. (${formatPercentExact(inputs.taxaAdm)})`} 
            value={formatCurrency(consorcio.taxaAdministracao)} 
          />
          <InfoRow 
            label={`Fundo Reserva (${formatPercentExact(inputs.fundoReserva)})`} 
            value={formatCurrency(consorcio.fundoReserva)} 
          />
          <InfoRow label="Prazo" value={consorcio.prazo + ' meses'} />
        </div>
      </div>

      {/* Card 2: Financiamento Price */}
      <div
        className="rounded-2xl p-6 border relative overflow-hidden flex flex-col h-full w-full"
        style={{ background: '#16140F', borderColor: 'rgba(248,113,113,0.2)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <span className="text-xs font-bold tracking-widest uppercase text-red-400">Financ. Price</span>
        </div>
        <div className="mb-4 sm:mb-5 shrink-0 flex flex-col justify-center">
          <p className="text-xs text-text-secondary/60 mb-0.5 sm:mb-1">Custo Total (com Entrada)</p>
          <div>
            <AnimatedCurrency value={totalComEntradaPrice} className={`${heroFontClass(totalComEntradaPrice)} text-text-primary whitespace-nowrap`} />
          </div>
        </div>
        <div className="flex flex-col justify-between gap-1 mt-1 sm:mt-2 flex-1">
          <InfoRow label="Parcela Mensal (c/ Seguros)" value={formatCurrency(price.primeiroMes)} highlightColor="#f87171" />
          <InfoRow label={"Entrada (" + formatPercent(inputs.entradaPerc) + ")"} value={formatCurrency(entradaValor)} />
          <InfoRow label="Crédito Financiado" value={formatCurrency(creditoFinanciado)} />
          <InfoRow label="Taxa de Juros" value={`${(inputs.taxaJurosAno * 100).toFixed(1)}% a.a.`} />
          <InfoRow label={`Projeção TR (${(taxaTrAno * 100).toFixed(1)}% a.a.)`} value={formatCurrency(price.trPaga)} highlightColor="#ef4444" />
          <InfoRow label="Juros Pagos" value={formatCurrency(price.jurosPagos)} />
          <InfoRow label="Total Financiado" value={formatCurrency(price.totalPago)} />
          <InfoRow label="Prazo" value={inputs.prazo + ' meses'} />
        </div>
      </div>

      {/* Card 3: Financiamento SAC */}
      <div
        className="rounded-2xl p-6 border relative overflow-hidden flex flex-col h-full w-full"
        style={{ background: '#16140F', borderColor: 'rgba(249,115,22,0.2)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-orange-400" />
          <span className="text-xs font-bold tracking-widest uppercase text-orange-400">Financ. SAC</span>
        </div>
        <div className="mb-4 sm:mb-5 shrink-0 flex flex-col justify-center">
          <p className="text-xs text-text-secondary/60 mb-0.5 sm:mb-1">Custo Total (com Entrada)</p>
          <div>
            <AnimatedCurrency value={totalComEntradaSac} className={`${heroFontClass(totalComEntradaSac)} text-text-primary whitespace-nowrap`} />
          </div>
        </div>
        <div className="flex flex-col justify-between gap-1 mt-1 sm:mt-2 flex-1">
          <InfoRow label="Primeira Parcela" value={formatCurrency(sac.primeiroMes)} highlightColor="#f97316" />
          <InfoRow label="Última Parcela" value={formatCurrency(sac.ultimoMes)} highlightColor="#fdba74" />
          <InfoRow label={"Entrada (" + formatPercent(inputs.entradaPerc) + ")"} value={formatCurrency(entradaValor)} />
          <InfoRow label="Crédito Financiado" value={formatCurrency(creditoFinanciado)} />
          <InfoRow label="Taxa de Juros" value={`${(inputs.taxaJurosAno * 100).toFixed(1)}% a.a.`} />
          <InfoRow label={`Projeção TR (${(taxaTrAno * 100).toFixed(1)}% a.a.)`} value={formatCurrency(sac.trPaga)} highlightColor="#ef4444" />
          <InfoRow label="Juros Pagos" value={formatCurrency(sac.jurosPagos)} />
          <InfoRow label="Prazo" value={inputs.prazo + ' meses'} />
        </div>
      </div>
    </div>
  );
}