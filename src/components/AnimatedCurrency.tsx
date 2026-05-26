import { formatCurrency } from '../utils/calculations';

interface AnimatedCurrencyProps {
  value: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Exibe um valor em BRL com animação CSS ao trocar.
 * Usa `key` baseado no valor arredondado para disparar o CSS animation via remount
 * sem nenhum setState ou requestAnimationFrame — evita loops de re-render.
 */
export function AnimatedCurrency({ value, className = '', style }: AnimatedCurrencyProps) {
  return (
    <span
      key={Math.round(value)}
      className={`animate-number ${className}`}
      style={style}
    >
      {formatCurrency(value)}
    </span>
  );
}


