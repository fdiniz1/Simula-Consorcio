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
  const { consorcio, price, sac, totalComEntradaPrice, totalComEntradaSac } = result;

  const totalData = [
    { name: 'Consórcio', total: consorcio.totalPago, fill: '#4ade80' },
    { name: 'Parcela Fixa', total: totalComEntradaPrice, fill: COLORS.price },
    { name: 'Parcela Decrescente', total: totalComEntradaSac, fill: COLORS.sac },
  ];

  // Parcelas: mostra o intervalo do consórcio (com redutor) vs financiamentos
  const parcelaData = [
    { name: 'Consórcio (mín) ★', valor: consorcio.parcelaMensalMin, fill: COLORS.consorcioMin },
    { name: 'Consórcio (padrão)', valor: consorcio.parcelaMensal, fill: COLORS.consorcio },
    { name: 'Parc. Fixa (banco)', valor: price.primeiroMes, fill: COLORS.price },
    { name: 'Parc. Decrescente', valor: sac.primeiroMes, fill: COLORS.sac },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico 1 – Total pago */}
      <div className="rounded-2xl p-6 md:p-8 animate-fade-up" style={cardStyle}>
        <h3 className="text-xl font-bold text-text-primary mb-1 text-center">Custo total desembolsado</h3>
        <p className="text-sm text-text-secondary/50 mb-8 text-center">Tudo que você vai pagar do início ao fim</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={totalData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }} barCategoryGap="35%">
            <CartesianGrid vertical={false} stroke="rgba(242,237,226,0.05)" />
            <XAxis dataKey="name" tick={{ ...tickStyle, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} width={62} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(242,237,226,0.03)' }} />
            <Bar dataKey="total" radius={[6, 6, 0, 0]} maxBarSize={80}>
              {totalData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-5 mt-5 justify-center flex-wrap">
          {[
            { label: 'Consórcio', color: '#4ade80' },
            { label: 'Parc. Fixa', color: COLORS.price },
            { label: 'Parc. Decrescente', color: COLORS.sac },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
              <span className="text-xs font-medium" style={{ color: 'rgba(242,237,226,0.6)' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

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
