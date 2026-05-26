export function Hero() {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-8 md:pt-16 md:pb-12 text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7 border animate-fade-up"
        style={{ background: 'rgba(245,194,0,0.08)', borderColor: 'rgba(245,194,0,0.2)' }}>
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#F5C200' }} />
        <span className="text-xs font-medium" style={{ color: '#F5C200' }}>Calculadora gratuita · Resultado em segundos</span>
      </div>

      {/* Title */}
      <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 animate-fade-up delay-100">
        <span className="text-text-primary">Quanto você vai pagar</span>
        <br />
        <span style={{ background: 'linear-gradient(135deg, #F5C200 0%, #FFD740 50%, #D4A800 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          a mais no financiamento?
        </span>
      </h1>

      {/* Single clear explanation */}
      <div className="rounded-2xl px-6 py-5 mb-8 animate-fade-up delay-200 text-left space-y-2"
        style={{ background: '#1a1810', border: '1px solid rgba(242,237,226,0.07)' }}>
        <p className="text-base text-text-secondary/80 leading-relaxed">
          <span className="font-semibold text-red-400">No financiamento,</span> o banco cobra juros sobre cada parcela — o imóvel pode te custar o dobro do preço.
        </p>
        <p className="text-base text-text-secondary/80 leading-relaxed">
          <span className="font-semibold" style={{ color: '#4ade80' }}>No consórcio,</span> você paga só a taxa de administração — sem juros, sem entrada obrigatória.
        </p>
        <p className="text-sm text-text-secondary/50 pt-1">Configure abaixo e veja a diferença exata no seu caso.</p>
      </div>

      {/* Arrow */}
      <div className="flex flex-col items-center gap-1 text-text-secondary/40 animate-bounce">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
