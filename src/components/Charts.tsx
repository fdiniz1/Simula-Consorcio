import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell} from 'recharts';
import type { TooltipContentProps } from 'recharts';
import type { SimulationResult, SimulationInputs } from '../utils/calculations';
import { formatCurrency } from '../utils/calculations';

interface ChartsProps {
  result: SimulationResult;
  inputs: SimulationInputs;
}

const COLORS = {
  consorcioMin: '#4ade80',   // verde — redutor 50%
  consorcio: '#a3e635',      // lima — integral
  price: '#ef4444',          // vermelho — PRICE
  sac: '#f97316',            // laranja — SAC
};

function CustomTooltip({ active, payload, label }: Partial<TooltipContentProps<number, string>>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-4 py-3" style={{ background: '#1a1810', border: '1px solid rgba(242,237,226,0.1)', boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}>
      <p className="text-xs font-medium mb-2" style={{ color: 'rgba(242,237,226,0.5)' }}>{label}</p>
      {payload.map((entry) => {
        const value = Array.isArray(entry.value) ? entry.value[0] : entry.value;
        const numericValue = typeof value === 'number' ? value : Number(value ?? 0);
        const key = String(entry.dataKey ?? entry.name ?? entry.graphicalItemId);

        return (
          <p key={key} className="text-sm font-semibold tabular-nums" style={{ color: entry.fill || entry.color }}>
            {formatCurrency(numericValue)}
          </p>
        );
      })}
    </div>
  );
}

const tickStyle = { fill: 'rgba(242,237,226,0.4)', fontSize: 11, fontFamily: 'Inter' };
const cardStyle: React.CSSProperties = { background: '#16140F', border: '1px solid rgba(242,237,226,0.07)' };

export function Charts({ result }: ChartsProps) {
  const { consorcio, price, sac, totalComEntradaPrice, totalComEntradaSac } = result;

  // GRÁFICO 1: Fluxo de caixa e desembolso imediato (Mantido o seu original)
  const parcelaData = [
    { name: 'Consórcio (Red. 50%)', valor: consorcio.parcelaMensalMin, fill: COLORS.consorcioMin },
    { name: 'Consórcio (Integral)', valor: consorcio.parcelaMensal, fill: COLORS.consorcio },
    { name: 'Financiamento PRICE', valor: price.primeiroMes, fill: COLORS.price },
    { name: 'Financiamento SAC (A0)', valor: sac.primeiroMes, fill: COLORS.sac },
  ];

  // GRÁFICO 2: O argumento de fechamento (Custo Total da operação)
  // Usamos a cor padrão do consórcio (Integral/Padrão) para contrastar com os financiamentos
  const custoTotalData = [
    { name: 'Consórcio', valor: consorcio.totalPago, fill: COLORS.consorcio },
    { name: 'Financ. PRICE', valor: totalComEntradaPrice, fill: COLORS.price },
    { name: 'Financ. SAC', valor: totalComEntradaSac, fill: COLORS.sac },
  ];

  return (
    /* Forçado layout duplo fluido para ocupar toda a largura estendida da tela em calls */
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      
      {/* CARD 1: COMPARATIVO DE PARCELAS */}
      <div className="rounded-2xl p-6 md:p-8 animate-fade-up delay-100 flex flex-col justify-between" style={cardStyle}>
        <div>
          <h3 className="text-base font-semibold text-text-primary mb-1 text-center lg:text-left">Comparativo de Parcelas Iniciais</h3>
          <p className="text-xs text-text-secondary/50 mb-8 text-center lg:text-left">Esforço imediato no caixa mensal do cliente</p>
        </div>
        
        <ResponsiveContainer width="100%" height={240}>
          <BarChart layout="vertical" data={parcelaData} margin={{ top: 4, right: 28, left: 4, bottom: 4 }} barCategoryGap="22%">
            <CartesianGrid horizontal={false} stroke="rgba(242,237,226,0.05)" />
            <XAxis type="number" tickFormatter={(v) => `R$${(v / 1000).toFixed(1)}k`} tick={tickStyle} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ ...tickStyle, fontSize: 10, fontWeight: 500 }} axisLine={false} tickLine={false} width={130} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(242,237,226,0.03)' }} />
            <Bar dataKey="valor" radius={[0, 6, 6, 0]} maxBarSize={32}>
              {parcelaData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* CARD 2: COMPARATIVO DE CUSTO TOTAL (O argumento de impacto) */}
      <div className="rounded-2xl p-6 md:p-8 animate-fade-up delay-200 flex flex-col justify-between" style={cardStyle}>
        <div>
          <h3 className="text-base font-semibold text-text-primary mb-1 text-center lg:text-left">Custo Total da Operação</h3>
          <p className="text-xs text-text-secondary/50 mb-8 text-center lg:text-left">O tamanho do patrimônio que é consumido por juros bancários</p>
        </div>

        <ResponsiveContainer width="100%" height={240}>
          {/* Layout vertical também para manter o padrão estético limpo ao lado do Card 1 */}
          <BarChart layout="vertical" data={custoTotalData} margin={{ top: 4, right: 28, left: 4, bottom: 4 }} barCategoryGap="28%">
            <CartesianGrid horizontal={false} stroke="rgba(242,237,226,0.05)" />
            <XAxis type="number" tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} tick={tickStyle} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ ...tickStyle, fontSize: 10, fontWeight: 500 }} axisLine={false} tickLine={false} width={130} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(242,237,226,0.03)' }} />
            <Bar dataKey="valor" radius={[0, 6, 6, 0]} maxBarSize={32}>
              {custoTotalData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}