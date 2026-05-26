import { writeFileSync } from 'fs';

const content = `import { useState } from 'react';
import { isValidPhoneNumber } from 'libphonenumber-js';
import type { SimulationInputs, SimulationResult } from '../utils/calculations';

const WHATSAPP_NUMBER = '5512987055203';

interface LeadFormProps {
  inputs: SimulationInputs;
  result: SimulationResult;
  onSubmitted: () => void;
}

interface FormState {
  nome: string;
  email: string;
  telefone: string;
}

interface FormErrors {
  nome?: string;
  email?: string;
  telefone?: string;
}

function validateForm(data: FormState): FormErrors {
  const errors: FormErrors = {};

  const nome = data.nome.trim();
  if (nome.length < 3) {
    errors.nome = 'Informe seu nome completo';
  } else if (!/^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF ]{3,}$/.test(nome)) {
    errors.nome = 'Apenas letras e espaços';
  }

  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/;
  if (!emailRegex.test(data.email.trim())) {
    errors.email = 'Informe um e-mail válido';
  }

  const digits = data.telefone.replace(/\\D/g, '');
  const phoneToTest = digits.startsWith('55') ? '+' + digits : '+55' + digits;
  if (!isValidPhoneNumber(phoneToTest, 'BR')) {
    errors.telefone = 'Telefone inválido (ex: (12) 98765-4321)';
  }

  return errors;
}

function formatPhone(raw: string): string {
  const d = raw.replace(/\\D/g, '').slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
  if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
  return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
}

async function saveLead(data: FormState, inputs: SimulationInputs, result: SimulationResult) {
  try {
    const { generateClient } = await import('aws-amplify/data');
    const client = generateClient<any>();
    await client.models.Lead.create({
      nome: data.nome.trim(),
      email: data.email.trim().toLowerCase(),
      telefone: data.telefone.replace(/\\D/g, ''),
      valorImovel: inputs.valorImovel,
      prazo: inputs.prazo,
      entradaPercent: inputs.entradaPerc,
      sistema: 'CONSORCIO',
      totalConsorcio: result.consorcio.totalPago,
      totalFinanciamento: result.totalComEntradaPrice,
      economia: result.economiaVsPrice,
    });
  } catch {
    console.warn('Amplify não configurado — lead não salvo no backend.');
  }
}

export function LeadForm({ inputs, result, onSubmitted }: LeadFormProps) {
  const [form, setForm] = useState<FormState>({ nome: '', email: '', telefone: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = field === 'telefone' ? formatPhone(e.target.value) : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    await saveLead(form, inputs, result);
    setSubmitting(false);
    onSubmitted();
  }

  const inputBase: React.CSSProperties = {
    background: '#1a1810',
    border: '1.5px solid rgba(242,237,226,0.1)',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  function focusStyle(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = '#F5C200';
  }

  function blurStyle(field: keyof FormErrors) {
    return (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = errors[field] ? '#f87171' : 'rgba(242,237,226,0.1)';
    };
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-7 border animate-fade-up"
        style={{ background: '#16140F', borderColor: 'rgba(245,194,0,0.3)', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-5">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: '#F5C200' }}
          >
            <span className="text-lg font-black text-black">C</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="font-display text-xl font-bold text-text-primary text-center mb-1">
          Preencha seus dados
        </h2>
        <p className="text-sm text-center mb-6" style={{ color: 'rgba(242,237,226,0.5)' }}>
          para acessar a ferramenta gratuitamente
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Nome */}
          <div>
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{ color: 'rgba(242,237,226,0.7)' }}
              htmlFor="lf-nome"
            >
              Nome completo
            </label>
            <input
              id="lf-nome"
              type="text"
              autoComplete="name"
              autoFocus
              value={form.nome}
              onChange={handleChange('nome')}
              placeholder="Seu nome"
              className="w-full rounded-xl px-4 py-3 text-sm text-text-primary"
              style={{ ...inputBase, borderColor: errors.nome ? '#f87171' : 'rgba(242,237,226,0.1)', color: '#F2EDE2' }}
              onFocus={focusStyle}
              onBlur={blurStyle('nome')}
            />
            {errors.nome && (
              <p className="text-xs text-red-400 mt-1">{errors.nome}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{ color: 'rgba(242,237,226,0.7)' }}
              htmlFor="lf-email"
            >
              E-mail
            </label>
            <input
              id="lf-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="seu@email.com"
              className="w-full rounded-xl px-4 py-3 text-sm"
              style={{ ...inputBase, borderColor: errors.email ? '#f87171' : 'rgba(242,237,226,0.1)', color: '#F2EDE2' }}
              onFocus={focusStyle}
              onBlur={blurStyle('email')}
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{ color: 'rgba(242,237,226,0.7)' }}
              htmlFor="lf-tel"
            >
              Telefone / WhatsApp
            </label>
            <input
              id="lf-tel"
              type="tel"
              autoComplete="tel"
              inputMode="numeric"
              value={form.telefone}
              onChange={handleChange('telefone')}
              placeholder="(12) 98765-4321"
              className="w-full rounded-xl px-4 py-3 text-sm"
              style={{ ...inputBase, borderColor: errors.telefone ? '#f87171' : 'rgba(242,237,226,0.1)', color: '#F2EDE2' }}
              onFocus={focusStyle}
              onBlur={blurStyle('telefone')}
            />
            {errors.telefone && (
              <p className="text-xs text-red-400 mt-1">{errors.telefone}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm mt-1 transition-all duration-200 hover:opacity-90 disabled:opacity-50"
            style={{ background: '#F5C200', color: '#0F0E0C' }}
          >
            {submitting ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            ) : (
              'Acessar a ferramenta'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
`;

writeFileSync('c:/Projetos/Consórcio/src/components/LeadForm.tsx', content, 'utf8');
console.log('LeadForm.tsx ok');
