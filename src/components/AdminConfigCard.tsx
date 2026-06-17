import React, { useCallback } from 'react';
import type { SimulationInputs } from '../utils/calculations';

interface AdminConfigCardProps {
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

function Slider({ label, sublabel, value, min, max, step, format, onChange, color = '#4ade80' }: SliderProps) {
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

export const AdminConfigCard = React.memo(function AdminConfigCard({ inputs, onChange }: AdminConfigCardProps) {
  const { taxaJurosAno, taxaAdm, fundoReserva, prazoConsorcio } = inputs;

  const handleValueChange = useCallback(
    (key: keyof SimulationInputs) => (v: number) => onChange(key, v),
    [onChange]
  );

  return (
    <div className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-8">
      {/* Header Técnico */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(74,222,128,0.1)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-semibold text-text-primary">Parâmetros da Mesa</h2>
          <p className="text-xs text-text-secondary/70">Ajuste fino de taxas, spreads e prazos</p>
        </div>
      </div>

      {/* Sliders de Parâmetros Avançados */}
      <div className="space-y-8">
        <Slider
          label="Taxa de Juros (Financiamento)"
          value={taxaJurosAno}
          min={0.05}
          max={0.25}
          step={0.001}
          format={(v) => `${(v * 100).toFixed(1)}% a.a.`}
          onChange={handleValueChange('taxaJurosAno')}
          color="#4ade80"
        />

        <Slider
          label="Prazo do Consórcio"
          value={prazoConsorcio}
          min={60}
          max={240}
          step={10}
          format={(v) => `${v} meses`}
          onChange={handleValueChange('prazoConsorcio')}
          color="#4ade80"
        />

        <Slider
          label="Taxa de Administração (Total)"
          value={taxaAdm}
          min={0.10}
          max={0.35}
          step={0.005}
          format={(v) => `${(v * 100).toFixed(1)}%`}
          onChange={handleValueChange('taxaAdm')}
          color="#4ade80"
        />

        <Slider
          label="Fundo de Reserva"
          value={fundoReserva}
          min={0.00}
          max={0.05}
          step={0.005}
          format={(v) => `${(v * 100).toFixed(1)}%`}
          onChange={handleValueChange('fundoReserva')}
          color="#4ade80"
        />
      </div>

      {/* Resumo Técnico Interno */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="rounded-xl p-4 border border-border/50" style={{ background: 'rgba(74,222,128,0.04)' }}>
          <p className="text-xs text-text-secondary/70 mb-1">Taxa Adm. Proporcional</p>
          <p className="text-sm font-bold text-text-primary">
            {((taxaAdm / prazoConsorcio) * 100).toFixed(4)}% <span className="text-[10px] text-text-secondary/50 font-normal">ao mês</span>
          </p>
        </div>
        <div className="rounded-xl p-4 border border-border/50" style={{ background: 'rgba(74,222,128,0.04)' }}>
          <p className="text-xs text-text-secondary/70 mb-1">Custo Efetivo Estruturado</p>
          <p className="text-sm font-bold text-text-primary">
            {((taxaAdm + fundoReserva) * 100).toFixed(2)}% <span className="text-[10px] text-text-secondary/50 font-normal">total</span>
          </p>
        </div>
      </div>
    </div>
  );
});