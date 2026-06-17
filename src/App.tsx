import { useState, useMemo, useCallback } from 'react';
import { calcularSimulacao } from './utils/calculations';
import type { SimulationInputs } from './utils/calculations';
import logo from './assets/logo.png';
import { ConfigCard } from './components/ConfigCard';
import { ResultCards } from './components/ResultCards';
import { Charts } from './components/Charts';
import { ImpactBox } from './components/ImpactBox';

// Estendendo a tipagem no App para aceitar a nova variável da TR de forma opcional ou direta
type AppSimulationInputs = SimulationInputs & {
  taxaTrAno?: number;
};

const DEFAULT_INPUTS: AppSimulationInputs = {
  valorImovel: 500_000,
  entradaPerc: 0.20,
  prazo: 240,
  taxaJurosAno: 0.12,         
  taxaAdm: 0.23,              
  fundoReserva: 0.02,         
  seguroPrestamista: 0.00035, 
  prazoConsorcio: 200,        
  reajusteAnual: 0.05,        
  redutorPerc: 0.50,          
  prazoContemplacao: 24,      
  taxaTrAno: 0.015, // Adicionado o valor padrão da TR para o estado inicial
};

export default function App() {
  // Estado agora utiliza a tipagem estendida que inclui a TR
  const [inputs, setInputs] = useState<AppSimulationInputs>(DEFAULT_INPUTS);

  const handleChange = useCallback(
    (key: keyof AppSimulationInputs, value: number) => {
      setInputs((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // O cast para SimulationInputs garante compatibilidade com a função de cálculo se ela ainda não aceitar a TR nativamente
  const result = useMemo(() => calcularSimulacao(inputs as SimulationInputs), [inputs]);

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      {/* Navbar Minimalista com largura estendida */}
      <nav className="sticky top-0 z-40 backdrop-blur-md border-b border-border/40" style={{ background: 'rgba(15,14,12,0.85)' }}>
        <div className="max-w-[95vw] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
            <span className="font-semibold text-sm text-text-primary">Consorcio <span style={{ color: '#F5C200' }}>Smart</span> — <span className="text-text-secondary/60 font-normal">Painel Interno</span></span>
          </div>
        </div>
      </nav>

      <main className="pt-6 pb-20 space-y-6">
        {/* Área Principal: Expandida para quase a largura total da tela */}
        <section className="max-w-[95vw] mx-auto px-4 sm:px-6">
          {/* Grid proporcional: 3 colunas para ConfigCard, 9 colunas para ResultCards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* ConfigCard enxuto na lateral esquerda */}
            <div className="lg:col-span-3 lg:sticky lg:top-20 w-full">
              <ConfigCard inputs={inputs} onChange={handleChange} />
            </div>
            
            {/* ResultCards gigante ocupando todo o resto da tela à direita */}
            <div className="lg:col-span-9 w-full">
              <ResultCards result={result} inputs={inputs} />
            </div>

          </div>
        </section>

        {/* Seção inferior de gráficos acompanhando a mesma largura de tela cheia */}
        <section className="max-w-[95vw] mx-auto px-4 sm:px-6 space-y-6">
          <Charts result={result} inputs={inputs as SimulationInputs} />
          <ImpactBox result={result} />
        </section>
      </main>
    </div>
  );
}