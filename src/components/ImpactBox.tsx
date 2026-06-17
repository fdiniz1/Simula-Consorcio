import type { SimulationResult } from '../utils/calculations';
import { formatCurrency } from '../utils/calculations';
import { AnimatedCurrency } from './AnimatedCurrency';

interface ImpactBoxProps {
  result: SimulationResult;
}

export function ImpactBox({ result }: ImpactBoxProps) {
  const { economiaVsPrice, economiaVsSac } = result;
  const deltaMaximo = Math.max(economiaVsPrice, economiaVsSac);

  return (
    <div className="rounded-2xl p-6 md:p-8 border relative overflow-hidden animate-fade-up"
      style={{ background: 'linear-gradient(135deg, #1a1810 0%, #16140F 100%)', borderColor: 'rgba(74, 222, 128, 0.2)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(74, 222, 128, 0.05) 0%, transparent 60%)' }} />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full" style={{ background: '#4ade80' }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4ade80' }}>
              Diferencial de Custo Operacional
            </span>
          </div>
          <h2 className="font-display text-base font-semibold text-text-secondary/80 mb-1">
            Delta Máximo de Economia (Consórcio vs Financiamento)
          </h2>
          <AnimatedCurrency
            value={deltaMaximo}
            className="font-display text-4xl md:text-5xl font-black tabular-nums"
            style={{ color: '#4ade80' }}
          />
          <p className="text-xs text-text-secondary/50 mt-2 leading-relaxed">
            Indicador baseado na diferença direta entre o somatório das parcelas do financiamento e o custo total estruturado da carta de crédito.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full md:w-auto mt-4 md:mt-0">
          <div className="rounded-xl p-5 text-center flex flex-col justify-center" style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.15)' }}>
            <p className="text-xs font-semibold text-red-400 mb-1">Spread vs PRICE</p>
            <p className="text-xl font-black text-red-400 tabular-nums">+{formatCurrency(economiaVsPrice)}</p>
          </div>
          <div className="rounded-xl p-5 text-center flex flex-col justify-center" style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.15)' }}>
            <p className="text-xs font-semibold text-orange-400 mb-1">Spread vs SAC</p>
            <p className="text-xl font-black text-orange-400 tabular-nums">+{formatCurrency(economiaVsSac)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}