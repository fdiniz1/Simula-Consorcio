import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import type { TooltipContentProps } from 'recharts';
import type { SimulationResult, SimulationInputs } from '../utils/calculations';
import { formatCurrency } from '../utils/calculations';

interface ChartsProps {
  result: SimulationResult;
  inputs: SimulationInputs;
}

const COLORS = {
  consorcioMin: '#4ade80',   // verde — menor parcela possível
  consorcio: '#a3e635',      // lima — parcela padrão
  price: '#ef4444',          // vermelho
  sac: '#f97316',            // laranja
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
  const { consorcio, price, sac } = result;

  // Parcelas: mostra o intervalo do consórcio (com redutor) vs financiamentos
  const parcelaData = [
    { name: 'Consórcio (mín) ★', valor: consorcio.parcelaMensalMin, fill: COLORS.consorcioMin },
    { name: 'Consórcio (padrão)', valor: consorcio.parcelaMensal, fill: COLORS.consorcio },
    { name: 'Parc. Fixa (banco)', valor: price.primeiroMes, fill: COLORS.price },
    { name: 'Parc. Decrescente', valor: sac.primeiroMes, fill: COLORS.sac },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 max-w-3xl mx-auto">
      {/* Gráfico 2 – Parcelas */}
      <div className="rounded-2xl p-6 md:p-8 animate-fade-up delay-100" style={cardStyle}>
        <h3 className="text-xl font-bold text-text-primary mb-1 text-center">Parcela mensal comparada</h3>
        <p className="text-sm text-text-secondary/50 mb-8 text-center">Impacto no seu orçamento mês a mês</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart layout="vertical" data={parcelaData} margin={{ top: 4, right: 28, left: 4, bottom: 4 }} barCategoryGap="22%">
            <CartesianGrid horizontal={false} stroke="rgba(242,237,226,0.05)" />
            <XAxis type="number" tickFormatter={(v) => `R$${(v / 1000).toFixed(1)}k`} tick={tickStyle} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ ...tickStyle, fontSize: 10, fontWeight: 500 }} axisLine={false} tickLine={false} width={120} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(242,237,226,0.03)' }} />
            <Bar dataKey="valor" radius={[0, 6, 6, 0]} maxBarSize={36}>
              {parcelaData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-[11px] text-text-secondary/35 text-center mt-4">
          ★ Parcela mínima com redutor de 50% · sujeito a reajuste pelo INCC
        </p>
      </div>
    </div>
  );
}

