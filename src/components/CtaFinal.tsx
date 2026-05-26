import { formatCurrency } from '../utils/calculations';
import type { SimulationResult } from '../utils/calculations';

const WA_NUMBER = '5512987055203';

interface CtaFinalProps {
  result: SimulationResult;
  onCtaClick?: () => void;
}

export function CtaFinal({ result, onCtaClick }: CtaFinalProps) {
  const economia = Math.max(result.economiaVsPrice, result.economiaVsSac);
  const valorImovel = result.consorcio.credito;

  const waText = encodeURIComponent(
    `Olá Fabrício! Fiz a simulação e vi que vou pagar ${formatCurrency(economia)} a mais no financiamento para um imóvel de ${formatCurrency(valorImovel)}. Quero entender melhor o consórcio.`
  );
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${waText}`;

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 mb-10">
      <div className="rounded-2xl p-8 md:p-12 text-center border relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a1810 0%, #16140F 100%)', borderColor: 'rgba(74,222,128,0.2)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.06) 0%, transparent 70%)' }} />

        <div className="relative z-10 flex flex-col items-center gap-5">
          <p className="text-text-secondary/60 text-sm font-medium uppercase tracking-widest">O que isso significa para você</p>

          <p className="font-display text-2xl md:text-3xl font-bold text-text-primary leading-snug max-w-xl">
            Você vai pagar{' '}
            <span className="text-red-400">{formatCurrency(economia)} a mais</span>
            {' '}no financiamento.
          </p>
          <p className="text-text-secondary/60 text-base max-w-md">
            Quer ver como evitar isso no seu caso específico?
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-3 px-7 py-4 rounded-xl font-bold text-base transition-all duration-200 hover:opacity-95 hover:scale-105 active:scale-100 shadow-xl"
              style={{ background: '#25D366', color: '#fff', boxShadow: '0 8px 30px rgba(37,211,102,0.25)', textDecoration: 'none' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              Falar com especialista no WhatsApp
            </a>

            <button
              onClick={onCtaClick}
              className="flex-1 flex items-center justify-center gap-3 px-7 py-4 rounded-xl font-bold text-base transition-all duration-200 hover:opacity-95 hover:scale-105 active:scale-100 shadow-xl"
              style={{ background: '#F5C200', color: '#0F0E0C', boxShadow: '0 8px 30px rgba(245,194,0,0.2)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              Simular no Consórcio
            </button>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-text-secondary/30 text-center mt-6 max-w-2xl mx-auto">
        * Simulações baseadas em taxas médias de mercado (12% a.a. para financiamento, 23% de administração para consórcio, entrada de 20% no financiamento).
        Parcelas do consórcio sujeitas a reajuste anual pelo INCC. Valores puramente informativos.
      </p>
    </section>
  );
}
