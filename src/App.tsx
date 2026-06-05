import { useState, useMemo, useCallback } from 'react';
import { calcularSimulacao } from './utils/calculations';
import type { SimulationInputs } from './utils/calculations';
import { Hero } from './components/Hero';
import logo from './assets/logo.png';
import { ConfigCard } from './components/ConfigCard';
import { ResultCards } from './components/ResultCards';
import { Charts } from './components/Charts';
import { ImpactBox } from './components/ImpactBox';
import { CtaFinal } from './components/CtaFinal';
import { LeadForm } from './components/LeadForm';

const DEFAULT_INPUTS: SimulationInputs = {
  valorImovel: 500_000,
  entradaPerc: 0.20,
  prazo: 240,
};

export default function App() {
  const [inputs, setInputs] = useState<SimulationInputs>(DEFAULT_INPUTS);
  // Mostra o form até o usuário preencher; cache de 24h no localStorage
  const [showLeadForm, setShowLeadForm] = useState<boolean>(() => {
    const ts = localStorage.getItem('lead_ts');
    if (!ts) return true;
    return Date.now() - Number(ts) > 24 * 60 * 60 * 1000;
  });

  function handleLeadSubmitted() {
    localStorage.setItem('lead_ts', String(Date.now()));
    setShowLeadForm(false);
  }

  const handleChange = useCallback(
    (key: keyof SimulationInputs, value: number) => {
      setInputs((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const result = useMemo(() => calcularSimulacao(inputs), [inputs]);

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 backdrop-blur-md border-b border-border/40" style={{ background: 'rgba(15,14,12,0.85)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
            <span className="font-semibold text-sm text-text-primary">Consorcio <span style={{ color: '#F5C200' }}>Smart</span></span>
          </div>
        </div>
      </nav>

      <main className="pt-6 pb-20">
        <Hero />

        {/* Simulador */}
        <section id="simulador" className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 items-start">
            <div className="lg:sticky lg:top-20">
              <ConfigCard inputs={inputs} onChange={handleChange} />
            </div>
            <div className="space-y-6">
              <ResultCards result={result} inputs={inputs} />
            </div>
          </div>
        </section>

        {/* Charts + Impact */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 space-y-6">
          <Charts result={result} inputs={inputs} />
          <ImpactBox result={result} />
        </section>

        {/* CTA */}
        <CtaFinal result={result} />
      </main>

      {/* Lead Form Modal */}
      {showLeadForm && (
        <LeadForm
          inputs={inputs}
          result={result}
          onSubmitted={handleLeadSubmitted}
        />
      )}
    </div>
  );
}
