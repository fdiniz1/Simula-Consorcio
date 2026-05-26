import type { SimulationResult } from '../utils/calculations';
import { formatCurrency } from '../utils/calculations';
import { AnimatedCurrency } from './AnimatedCurrency';

interface ImpactBoxProps {
  result: SimulationResult;
}

export function ImpactBox({ result }: ImpactBoxProps) {
  const { economiaVsPrice, economiaVsSac } = result;
  const bestEconomia = Math.max(economiaVsPrice, economiaVsSac);

  return (
    <div className="rounded-2xl p-6 md:p-8 border relative overflow-hidden animate-fade-up"
      style={{ background: 'linear-gradient(135deg, #1a1810 0%, #16140F 100%)', borderColor: 'rgba(74, 222, 128, 0.2)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(74, 222, 128, 0.05) 0%, transparent 60%)' }} />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#4ade80' }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4ade80' }}>
              Por que o Consórcio compensa financeiramente?
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-1">
            Dinheiro no seu bolso
          </h2>
          <AnimatedCurrency
            value={bestEconomia}
            className="font-display text-4xl md:text-5xl font-black"
            style={{ color: '#4ade80' }}
          />
          <p className="text-sm text-text-secondary/60 mt-2">
            O valor que os bancos pegariam de Juros
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full md:w-auto mt-4 md:mt-0">
          <div className="rounded-xl p-5 text-center flex flex-col justify-center" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}>
            <p className="text-xs font-semibold text-red-400 mb-1">Custo extra no Price</p>
            <p className="text-xl font-black text-red-400">+{formatCurrency(economiaVsPrice)}</p>
          </div>
          <div className="rounded-xl p-5 text-center flex flex-col justify-center" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}>
            <p className="text-xs font-semibold text-orange-400 mb-1">Custo extra no SAC</p>
            <p className="text-xl font-black text-orange-400">+{formatCurrency(economiaVsSac)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
