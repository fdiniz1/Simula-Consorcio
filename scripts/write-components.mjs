import { writeFileSync } from 'fs';
import { join } from 'path';

const base = 'c:/Projetos/Consórcio/src/components';
const utils = 'c:/Projetos/Consórcio/src';

// ─── ResultCards.tsx ──────────────────────────────────────────────────────────
writeFileSync(join(base, 'ResultCards.tsx'), `
import { AnimatedCurrency } from './AnimatedCurrency';
import type { SimulationResult, SimulationInputs } from '../utils/calculations';
import { formatCurrency, formatPercent } from '../utils/calculations';

interface ResultCardsProps {
  result: SimulationResult;
  inputs: SimulationInputs;
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border/30">
      <span className="text-xs text-text-secondary/70">{label}</span>
      <span
        className="text-sm font-semibold tabular-nums"
        style={highlight ? { color: '#F5C200' } : { color: '#F2EDE2' }}
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
        className="rounded-2xl p-6 border animate-fade-up relative overflow-hidden"
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
        <div className="mb-5">
          <p className="text-xs text-text-secondary/60 mb-1">Total pago</p>
          <AnimatedCurrency value={consorcio.totalPago} className="text-2xl md:text-3xl font-black text-text-primary" />
        </div>
        <div className="space-y-0.5">
          <InfoRow label="Crédito contratado" value={formatCurrency(consorcio.credito)} />
          <InfoRow label="Taxa adm. (18%)" value={formatCurrency(consorcio.taxaAdministracao)} />
          <InfoRow label="Fundo reserva (2%)" value={formatCurrency(consorcio.fundoReserva)} />
          <InfoRow label="Parcela mensal" value={formatCurrency(consorcio.parcelaMensal)} highlight />
          <InfoRow label="Prazo" value={inputs.prazo + ' meses'} />
        </div>
        <div className="mt-4 pt-3 border-t border-border/30">
          <p className="text-xs" style={{ color: 'rgba(245,194,0,0.6)' }}>Sem juros. Sem entrada obrigatória.</p>
        </div>
      </div>

      {/* Financiamento Price */}
      <div
        className="rounded-2xl p-6 border animate-fade-up delay-100 relative overflow-hidden"
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
        <div className="mb-5">
          <p className="text-xs text-text-secondary/60 mb-1">Total com entrada</p>
          <AnimatedCurrency value={totalComEntradaPrice} className="text-2xl md:text-3xl font-black text-text-primary" />
        </div>
        <div className="space-y-0.5">
          <InfoRow label={"Entrada (" + formatPercent(inputs.entradaPerc) + ")"} value={formatCurrency(entradaValor)} />
          <InfoRow label="Crédito financiado" value={formatCurrency(creditoFinanciado)} />
          <InfoRow label="Juros pagos (11% a.a.)" value={formatCurrency(price.jurosPagos)} />
          <InfoRow label="Parcela mensal (fixa)" value={formatCurrency(price.primeiroMes)} highlight />
          <InfoRow label="Total só financ." value={formatCurrency(price.totalPago)} />
        </div>
        <div className="mt-4 pt-3 border-t border-border/30">
          <p className="text-xs text-red-400/70">Tabela Price · parcela fixa</p>
        </div>
      </div>

      {/* Financiamento SAC */}
      <div
        className="rounded-2xl p-6 border animate-fade-up delay-200 relative overflow-hidden"
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
        <div className="mb-5">
          <p className="text-xs text-text-secondary/60 mb-1">Total com entrada</p>
          <AnimatedCurrency value={totalComEntradaSac} className="text-2xl md:text-3xl font-black text-text-primary" />
        </div>
        <div className="space-y-0.5">
          <InfoRow label={"Entrada (" + formatPercent(inputs.entradaPerc) + ")"} value={formatCurrency(entradaValor)} />
          <InfoRow label="Crédito financiado" value={formatCurrency(creditoFinanciado)} />
          <InfoRow label="Juros pagos (11% a.a.)" value={formatCurrency(sac.jurosPagos)} />
          <InfoRow label="1ª parcela" value={formatCurrency(sac.primeiroMes)} />
          <InfoRow label="Última parcela" value={formatCurrency(sac.ultimoMes)} highlight />
        </div>
        <div className="mt-4 pt-3 border-t border-border/30">
          <p className="text-xs text-orange-400/70">SAC · parcelas decrescentes</p>
        </div>
      </div>
    </div>
  );
}
`.trimStart(), 'utf8');
console.log('ResultCards.tsx ✓');

// ─── Charts.tsx ───────────────────────────────────────────────────────────────
writeFileSync(join(base, 'Charts.tsx'), `
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import type { SimulationResult, SimulationInputs } from '../utils/calculations';
import { formatCurrency } from '../utils/calculations';

interface ChartsProps {
  result: SimulationResult;
  inputs: SimulationInputs;
}

const COLORS = {
  consorcio: '#F5C200',
  price: '#f87171',
  sac: '#f97316',
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-4 py-3" style={{ background: '#1a1810', border: '1px solid rgba(242,237,226,0.1)', boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}>
      <p className="text-xs font-medium mb-2" style={{ color: 'rgba(242,237,226,0.5)' }}>{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey} className="text-sm font-semibold tabular-nums" style={{ color: entry.fill || entry.color }}>
          {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

const tickStyle = { fill: 'rgba(242,237,226,0.4)', fontSize: 11, fontFamily: 'Inter' };
const cardStyle: React.CSSProperties = { background: '#16140F', border: '1px solid rgba(242,237,226,0.07)' };

export function Charts({ result, inputs }: ChartsProps) {
  const { consorcio, price, sac, entradaValor, totalComEntradaPrice, totalComEntradaSac } = result;

  const totalData = [
    { name: 'Consórcio', total: consorcio.totalPago, fill: COLORS.consorcio },
    { name: 'Price', total: totalComEntradaPrice, fill: COLORS.price },
    { name: 'SAC', total: totalComEntradaSac, fill: COLORS.sac },
  ];

  const parcelaData = [
    { name: 'Consórcio', valor: consorcio.parcelaMensal, fill: COLORS.consorcio },
    { name: 'Price', valor: price.primeiroMes, fill: COLORS.price },
    { name: 'SAC início', valor: sac.primeiroMes, fill: '#fb923c' },
    { name: 'SAC fim', valor: sac.ultimoMes, fill: '#fdba74' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico 1 – Total pago */}
      <div className="rounded-2xl p-6 md:p-8 animate-fade-up" style={cardStyle}>
        <h3 className="text-base font-semibold text-text-primary mb-1">Total desembolsado</h3>
        <p className="text-xs text-text-secondary/50 mb-6">Inclui entrada no financiamento</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={totalData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }} barCategoryGap="30%">
            <CartesianGrid vertical={false} stroke="rgba(242,237,226,0.05)" />
            <XAxis dataKey="name" tick={tickStyle} axisLine={false} tickLine={false} />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(v) => \`R$\${(v / 1000).toFixed(0)}k\`} width={58} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(242,237,226,0.03)' }} />
            <Bar dataKey="total" radius={[6, 6, 0, 0]} maxBarSize={80}>
              {totalData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-4 justify-center flex-wrap">
          {[{ label: 'Consórcio', color: COLORS.consorcio }, { label: 'Price', color: COLORS.price }, { label: 'SAC', color: COLORS.sac }].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
              <span className="text-xs" style={{ color: 'rgba(242,237,226,0.5)' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfico 2 – Parcelas */}
      <div className="rounded-2xl p-6 md:p-8 animate-fade-up delay-100" style={cardStyle}>
        <h3 className="text-base font-semibold text-text-primary mb-1">Comparativo de parcelas</h3>
        <p className="text-xs text-text-secondary/50 mb-6">Valor pago por mês em cada modalidade</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={parcelaData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }} barCategoryGap="30%">
            <CartesianGrid vertical={false} stroke="rgba(242,237,226,0.05)" />
            <XAxis dataKey="name" tick={{ ...tickStyle, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(v) => \`R$\${(v / 1000).toFixed(1)}k\`} width={58} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(242,237,226,0.03)' }} />
            <Bar dataKey="valor" radius={[6, 6, 0, 0]} maxBarSize={80}>
              {parcelaData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-4 justify-center flex-wrap">
          {[{ label: 'Consórcio', color: COLORS.consorcio }, { label: 'Price', color: COLORS.price }, { label: 'SAC início', color: '#fb923c' }, { label: 'SAC fim', color: '#fdba74' }].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
              <span className="text-xs" style={{ color: 'rgba(242,237,226,0.5)' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
`.trimStart(), 'utf8');
console.log('Charts.tsx ✓');

// ─── Hero.tsx ─────────────────────────────────────────────────────────────────
writeFileSync(join(base, 'Hero.tsx'), `
export function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-8 md:pt-16 md:pb-12 text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border animate-fade-up"
        style={{ background: 'rgba(245,194,0,0.08)', borderColor: 'rgba(245,194,0,0.2)' }}>
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#F5C200' }} />
        <span className="text-xs font-medium" style={{ color: '#F5C200' }}>Simulação em tempo real</span>
      </div>

      {/* Title */}
      <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4 animate-fade-up delay-100">
        <span className="text-text-primary">Consórcio ou</span>
        <br />
        <span style={{ background: 'linear-gradient(135deg, #F5C200 0%, #FFD740 50%, #D4A800 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Financiamento?
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-base md:text-lg text-text-secondary/80 max-w-xl mx-auto mb-8 animate-fade-up delay-200">
        Compare as duas modalidades de forma simples, transparente e sem enrolação.
        Descubra quanto você realmente paga em cada uma.
      </p>

      {/* Stats row */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-10 animate-fade-up delay-300">
        {[
          { label: 'Taxa adm. consórcio', value: '20%' },
          { label: 'Juros financiamento', value: '11% a.a.' },
          { label: 'Prazo máximo SFH', value: '35 anos' },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-2xl font-bold" style={{ color: '#F5C200' }}>{s.value}</p>
            <p className="text-xs text-text-secondary/60 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Arrow down (mobile) */}
      <div className="md:hidden mt-8 flex flex-col items-center gap-1 text-text-secondary/40 animate-bounce">
        <span className="text-xs">Configure abaixo</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
`.trimStart(), 'utf8');
console.log('Hero.tsx ✓');

// ─── ImpactBox.tsx ────────────────────────────────────────────────────────────
writeFileSync(join(base, 'ImpactBox.tsx'), `
import type { SimulationResult } from '../utils/calculations';
import { formatCurrency, formatPercent } from '../utils/calculations';
import { AnimatedCurrency } from './AnimatedCurrency';

interface ImpactBoxProps {
  result: SimulationResult;
}

export function ImpactBox({ result }: ImpactBoxProps) {
  const { economiaVsPrice, economiaVsSac, economiaPercVsPrice, economiaPercVsSac } = result;
  const bestEconomia = Math.max(economiaVsPrice, economiaVsSac);
  const bestPerc = economiaVsPrice > economiaVsSac ? economiaPercVsPrice : economiaPercVsSac;
  const bestLabel = economiaVsPrice > economiaVsSac ? 'vs Financiamento Price' : 'vs Financiamento SAC';

  return (
    <div className="rounded-2xl p-6 md:p-8 border relative overflow-hidden animate-fade-up"
      style={{ background: 'linear-gradient(135deg, #1a1810 0%, #16140F 100%)', borderColor: 'rgba(245,194,0,0.2)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(245,194,0,0.05) 0%, transparent 60%)' }} />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#F5C200' }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#F5C200' }}>
              Impacto no seu bolso
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-1">
            Economize até
          </h2>
          <AnimatedCurrency
            value={bestEconomia}
            className="font-display text-4xl md:text-5xl font-black"
            style={{ color: '#F5C200' }}
          />
          <p className="text-sm text-text-secondary/60 mt-2">
            {bestLabel} · {bestPerc.toFixed(1)}% de economia
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(245,194,0,0.08)', border: '1px solid rgba(245,194,0,0.15)' }}>
            <p className="text-xs text-text-secondary/60 mb-1">vs Price</p>
            <p className="text-xl font-black" style={{ color: '#F5C200' }}>{formatPercent(economiaPercVsPrice / 100)}</p>
            <p className="text-xs text-text-secondary/50 mt-1">{formatCurrency(economiaVsPrice)}</p>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(245,194,0,0.08)', border: '1px solid rgba(245,194,0,0.15)' }}>
            <p className="text-xs text-text-secondary/60 mb-1">vs SAC</p>
            <p className="text-xl font-black" style={{ color: '#F5C200' }}>{formatPercent(economiaPercVsSac / 100)}</p>
            <p className="text-xs text-text-secondary/50 mt-1">{formatCurrency(economiaVsSac)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
`.trimStart(), 'utf8');
console.log('ImpactBox.tsx ✓');

// ─── CtaFinal.tsx ─────────────────────────────────────────────────────────────
writeFileSync(join(base, 'CtaFinal.tsx'), `
const WHATSAPP_NUMBER = '5512987055203'; // (12) 98705-5203

interface CtaFinalProps {
  onCtaClick?: () => void;
}

export function CtaFinal({ onCtaClick }: CtaFinalProps) {
  const waUrl = \`https://wa.me/\${WHATSAPP_NUMBER}?text=\${encodeURIComponent('Olá! Fiz a simulação no site e gostaria de saber mais sobre consórcio.')}\`;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="rounded-2xl p-8 md:p-12 text-center border relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a1810 0%, #16140F 100%)', borderColor: 'rgba(245,194,0,0.2)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(245,194,0,0.08) 0%, transparent 70%)' }} />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border"
            style={{ background: 'rgba(245,194,0,0.08)', borderColor: 'rgba(245,194,0,0.2)' }}>
            <span className="text-xs font-medium" style={{ color: '#F5C200' }}>Especialistas disponíveis</span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-3">
            Pronto para economizar?
          </h2>
          <p className="text-text-secondary/70 max-w-md mx-auto mb-8">
            Fale com nosso consultor e descubra o melhor caminho para conquistar seu imóvel sem pagar juros abusivos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Lead Form Button */}
            <button
              onClick={onCtaClick}
              className="flex items-center gap-3 px-7 py-4 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90 hover:scale-105 active:scale-100"
              style={{ background: '#F5C200', color: '#0F0E0C' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 12V22H4V12" /><path d="M22 7H2v5h20V7z" /><path d="M12 22V7" />
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
              </svg>
              Receber proposta gratuita
            </button>

            {/* WhatsApp Button */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-7 py-4 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90 border"
              style={{ borderColor: 'rgba(245,194,0,0.3)', color: '#F5C200', textDecoration: 'none', background: 'rgba(245,194,0,0.06)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#F5C200">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              (12) 98705-5203
            </a>
          </div>

          <p className="text-xs text-text-secondary/40 mt-6">
            Atendimento de segunda a sábado · Sem compromisso
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-text-secondary/30 text-center mt-6 max-w-2xl mx-auto">
        * Simulações baseadas em taxas médias de mercado (11% a.a. para financiamento, 20% de administração para consórcio).
        Consulte condições específicas com seu banco ou administradora. Valores informativos.
      </p>
    </section>
  );
}
`.trimStart(), 'utf8');
console.log('CtaFinal.tsx ✓');

console.log('\\n✅ Todos os componentes reescritos com sucesso!');
