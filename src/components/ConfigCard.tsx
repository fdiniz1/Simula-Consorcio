import React, { useCallback } from 'react';
import type { SimulationInputs } from '../utils/calculations';
import { PRAZO_MAX, formatCurrency, formatPercent } from '../utils/calculations';

interface ConfigCardProps {
  inputs: SimulationInputs;
  onChange: (key: keyof SimulationInputs, value: number) => void;
}

interface SliderProps {
  label: string;
  sublabel?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
  color?: string;
}

function Slider({ label, sublabel, value, min, max, step, format, onChange, color = '#F5C200' }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  const trackStyle: React.CSSProperties = {
    background: `linear-gradient(to right, ${color} ${pct}%, rgba(255,255,255,0.08) ${pct}%)`,
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-baseline">
        <div>
          <span className="text-sm font-medium text-text-secondary uppercase tracking-wider">{label}</span>
          {sublabel && (
            <span className="ml-2 text-xs text-text-secondary/60">{sublabel}</span>
          )}
        </div>
        <span className="text-xl font-bold" style={{ color }}>{format(value)}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (val !== value) {
              onChange(val);
            }
          }}
          className="range-slider w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={trackStyle}
        />
      </div>
      <div className="flex justify-between text-xs text-text-secondary/50">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

export const ConfigCard = React.memo(function ConfigCard({ inputs, onChange }: ConfigCardProps) {
  const { valorImovel, entradaPerc, prazo } = inputs;
  const entradaValor = valorImovel * entradaPerc;

  const handleChange = useCallback(
    (key: keyof SimulationInputs) => (v: number) => onChange(key, v),
    [onChange]
  );

  return (
    <div className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,194,0,0.15)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5C200" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-semibold text-text-primary">Configure sua simulação</h2>
          <p className="text-xs text-text-secondary/70">Ajuste os parâmetros abaixo</p>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-8">
        <Slider
          label="Valor do Imóvel"
          value={valorImovel}
          min={200_000}
          max={3_000_000}
          step={10_000}
          format={formatCurrency}
          onChange={handleChange('valorImovel')}
        />

        <Slider
          label="Entrada (financiamento)"
          sublabel={`(${formatCurrency(entradaValor)})`}
          value={entradaPerc}
          min={0.10}
          max={0.50}
          step={0.05}
          format={formatPercent}
          onChange={handleChange('entradaPerc')}
          color="#F5C200"
        />

        <Slider
          label="Prazo do financiamento"
          value={prazo}
          min={60}
          max={PRAZO_MAX}
          step={12}
          format={(v) => `${v} meses`}
          onChange={handleChange('prazo')}
          color="#F5C200"
        />
      </div>

      {/* Info boxes */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="rounded-xl p-4 border border-border/50" style={{ background: 'rgba(245,194,0,0.06)' }}>
          <p className="text-xs text-text-secondary/70 mb-1">Crédito financiado</p>
          <p className="text-sm font-bold text-text-primary">{formatCurrency(valorImovel - entradaValor)}</p>
          <p className="text-xs mt-1" style={{ color: '#F5C200' }}>{(100 - entradaPerc * 100).toFixed(0)}% do imóvel</p>
        </div>
        <div className="rounded-xl p-4 border border-border/50" style={{ background: 'rgba(245,194,0,0.06)' }}>
          <p className="text-xs text-text-secondary/70 mb-1">Prazo em anos</p>
          <p className="text-sm font-bold text-text-primary">{(prazo / 12).toFixed(1)} anos</p>
          <p className="text-xs mt-1" style={{ color: '#F5C200' }}>Máx. {PRAZO_MAX / 12} anos (SFH)</p>
        </div>
      </div>

      {/* Mobile scroll hint */}
      <div className="md:hidden flex items-center justify-center gap-2 text-xs text-text-secondary/50 pt-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
        <span>Role para ver os resultados</span>
      </div>
    </div>
  );
});
