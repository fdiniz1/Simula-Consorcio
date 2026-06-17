import React, { useCallback, useState } from 'react';
import type { SimulationInputs } from '../utils/calculations';
import { PRAZO_MAX, formatCurrency, formatPercent } from '../utils/calculations';

type ExtendedInputs = SimulationInputs & { 
  seguroPrestamista?: number;
  prazoContemplacao?: number;
  taxaTrAno?: number; // Inclusão da taxa TR estimada ao ano
};

interface ConfigCardProps {
  inputs: ExtendedInputs;
  onChange: (key: keyof ExtendedInputs, value: number) => void;
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
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <div>
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{label}</span>
          {sublabel && (
            <span className="ml-2 text-[11px] text-text-secondary/60">{sublabel}</span>
          )}
        </div>
        <span className="text-lg font-bold tabular-nums" style={{ color }}>{format(value)}</span>
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
      <div className="flex justify-between text-[10px] text-text-secondary/40 tabular-nums">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

export const ConfigCard = React.memo(function ConfigCard({ inputs, onChange }: ConfigCardProps) {
  const { 
    valorImovel, 
    entradaPerc, 
    prazo, 
    taxaJurosAno, 
    taxaAdm, 
    fundoReserva, 
    prazoConsorcio, 
    reajusteAnual, 
    redutorPerc,
    seguroPrestamista = 0.00035,
    prazoContemplacao = 24,
    taxaTrAno = 0.015 // Valor padrão de 1.5% a.a. para a TR
  } = inputs;

  // Estados de expansão/recolhimento das seções de UX
  const [expandiFinanceiro, setExpandiFinanceiro] = useState(true);
  const [expandiPrazos, setExpandiPrazos] = useState(false);
  const [expandiTaxas, setExpandiTaxas] = useState(false);

  const [simularContemplacao, setSimularContemplacao] = useState(false);
  
  const entradaValor = valorImovel * entradaPerc;

  const handleChange = useCallback(
    (key: keyof ExtendedInputs) => (v: number) => onChange(key, v),
    [onChange]
  );

  const taxaAdmMensal = (taxaAdm / prazoConsorcio) * 100;
  const custoEfetivoTotalAtuarial = (taxaAdm + fundoReserva + (seguroPrestamista * prazoConsorcio)) * 100;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
      {/* Header Principal */}
      <div className="flex items-center gap-3 border-b border-border/30 pb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F2EDE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-semibold text-text-primary">Parâmetros de Simulação</h2>
          <p className="text-xs text-text-secondary/60">Ajuste técnico de variáveis e taxas</p>
        </div>
      </div>

      {/* Bloco 1: Capital & Crédito (Variáveis de custo direto do imóvel e financiamento) */}
      <div className="border border-border/40 rounded-xl overflow-hidden bg-white/[0.01]">
        <button
          type="button"
          onClick={() => setExpandiFinanceiro(!expandiFinanceiro)}
          className="w-full flex justify-between items-center p-3.5 text-left bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
        >
          <span className="text-[10px] font-bold text-text-secondary/70 tracking-widest uppercase">
            1. Dimensão de Capital & Crédito
          </span>
          <svg
            className={`w-4 h-4 text-text-secondary/60 transform transition-transform ${expandiFinanceiro ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {expandiFinanceiro && (
          <div className="p-4 space-y-5 border-t border-border/20 bg-card/50 animate-fadeIn">
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
            />

            <Slider
              label="Taxa de Juros (Financiamento)"
              value={taxaJurosAno}
              min={0.05}
              max={0.25}
              step={0.001}
              format={(v) => `${(v * 100).toFixed(1)}% a.a.`}
              onChange={handleChange('taxaJurosAno')}
            />

            {/* Nova variável de TR inserida estrategicamente aqui */}
            <Slider
              label="Projeção da TR (Financiamento)"
              sublabel="(Taxa Referencial)"
              value={taxaTrAno}
              min={0.00}
              max={0.05}
              step={0.001}
              format={(v) => `${(v * 100).toFixed(1)}% a.a.`}
              onChange={handleChange('taxaTrAno')}
              color="#f87171" // Destacado em tom avermelhado/laranja por ser custo oculto do banco
            />
          </div>
        )}
      </div>

      {/* Bloco 2: Estrutura Temporal / Prazos */}
      <div className="border border-border/40 rounded-xl overflow-hidden bg-white/[0.01]">
        <button
          type="button"
          onClick={() => setExpandiPrazos(!expandiPrazos)}
          className="w-full flex justify-between items-center p-3.5 text-left bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
        >
          <span className="text-[10px] font-bold text-text-secondary/70 tracking-widest uppercase">
            2. Estrutura Temporal & Prazos
          </span>
          <svg
            className={`w-4 h-4 text-text-secondary/60 transform transition-transform ${expandiPrazos ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expandiPrazos && (
          <div className="p-4 space-y-5 border-t border-border/20 bg-card/50 animate-fadeIn">
            <Slider
              label="Prazo do financiamento"
              value={prazo}
              min={60}
              max={PRAZO_MAX}
              step={12}
              format={(v) => `${v} meses`}
              onChange={handleChange('prazo')}
            />

            <Slider
              label="Prazo do Consórcio"
              value={prazoConsorcio}
              min={60}
              max={240}
              step={10}
              format={(v) => `${v} meses`}
              onChange={handleChange('prazoConsorcio')}
            />

            <div className="flex items-center justify-between p-3 rounded-xl border border-border/30 bg-[#11100c]">
              <div>
                <span className="text-xs font-semibold text-text-primary uppercase tracking-wider block">Simular Contemplação</span>
                <span className="text-[10px] text-text-secondary/60">Gera comportamento misto pós-crédito</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const novoEstado = !simularContemplacao;
                  setSimularContemplacao(novoEstado);
                  if (!novoEstado) {
                    onChange('prazoContemplacao', prazoConsorcio);
                  } else {
                    onChange('prazoContemplacao', 24);
                  }
                }}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
                  simularContemplacao ? 'bg-[#F5C200]' : 'bg-white/10'
                }`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-[#0f0e0c] transition-transform ${simularContemplacao ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>

            {simularContemplacao && (
              <div className="pt-1 animate-fadeIn">
                <Slider
                  label="Prazo Estimado de Contemplação"
                  value={prazoContemplacao}
                  min={1}
                  max={prazoConsorcio - 1}
                  step={1}
                  format={(v) => `${v}º mês`}
                  onChange={handleChange('prazoContemplacao')}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bloco 3: Taxas Operacionais & Redutores */}
      <div className="border border-border/40 rounded-xl overflow-hidden bg-white/[0.01]">
        <button
          type="button"
          onClick={() => setExpandiTaxas(!expandiTaxas)}
          className="w-full flex justify-between items-center p-3.5 text-left bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
        >
          <span className="text-[10px] font-bold text-text-secondary/70 tracking-widest uppercase">
            3. Taxas Operacionais & Custos
          </span>
          <svg
            className={`w-4 h-4 text-text-secondary/60 transform transition-transform ${expandiTaxas ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expandiTaxas && (
          <div className="p-4 space-y-5 border-t border-border/20 bg-card/50 animate-fadeIn">
            <Slider
              label="Taxa de Administração (Total)"
              value={taxaAdm}
              min={0.10}
              max={0.35}
              step={0.005}
              format={(v) => `${(v * 100).toFixed(1)}%`}
              onChange={handleChange('taxaAdm')}
            />

            <Slider
              label="Fundo de Reserva"
              value={fundoReserva}
              min={0.00}
              max={0.05}
              step={0.005}
              format={(v) => `${(v * 100).toFixed(1)}%`}
              onChange={handleChange('fundoReserva')}
            />

            <Slider
              label="Seguro Prestamista"
              sublabel="(Mensal)"
              value={seguroPrestamista}
              min={0.0000}
              max={0.0010}
              step={0.00005}
              format={(v) => `${(v * 100).toFixed(3)}% a.m.`}
              onChange={handleChange('seguroPrestamista')}
            />

            <Slider
              label="Reajuste Anual da Carta"
              sublabel={reajusteAnual === 0 ? '(Fixo)' : '(INCC/IPCA)'}
              value={reajusteAnual}
              min={0.00}
              max={0.12}
              step={0.005}
              format={(v) => `${(v * 100).toFixed(1)}% a.a.`}
              onChange={handleChange('reajusteAnual')}
            />

            <Slider
              label="Redutor de Parcela"
              sublabel={redutorPerc === 1 ? '(Integral)' : '(Cota Reduzida)'}
              value={redutorPerc}
              min={0.30}
              max={1.00}
              step={0.05}
              format={(v) => `${(v * 100).toFixed(0)}%`}
              onChange={handleChange('redutorPerc')}
            />
          </div>
        )}
      </div>

      {/* Métricas Calculadas In Loco */}
      <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-text-secondary/70">
        <div className="rounded-xl p-3 border border-border/40 bg-[#16140f]">
          <p className="text-text-secondary/40 mb-0.5">Taxa Adm. Proporcional</p>
          <p className="font-bold text-text-primary tabular-nums">
            {taxaAdmMensal.toFixed(4)}% <span className="font-normal text-text-secondary/40">/mês</span>
          </p>
        </div>
        <div className="rounded-xl p-3 border border-border/40 bg-[#16140f]">
          <p className="text-text-secondary/40 mb-0.5">Custo Efetivo Estruturado</p>
          <p className="font-bold text-text-primary tabular-nums">
            {custoEfetivoTotalAtuarial.toFixed(2)}% <span className="font-normal text-text-secondary/40">total</span>
          </p>
        </div>
      </div>
    </div>
  );
});