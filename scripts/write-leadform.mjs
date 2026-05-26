import { writeFileSync } from 'fs';
import { join } from 'path';

const base = 'c:/Projetos/Consórcio/src/components';

writeFileSync(join(base, 'LeadForm.tsx'), `
import { useState } from 'react';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import type { SimulationInputs, SimulationResult } from '../utils/calculations';
import { formatCurrency } from '../utils/calculations';

const WHATSAPP_NUMBER = '5512987055203';

interface LeadFormProps {
  inputs: SimulationInputs;
  result: SimulationResult;
  onClose: () => void;
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

  if (!data.nome.trim() || data.nome.trim().length < 3) {
    errors.nome = 'Informe seu nome completo (mín. 3 caracteres)';
  }

  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/;
  if (!emailRegex.test(data.email.trim())) {
    errors.email = 'Informe um e-mail válido';
  }

  const rawPhone = data.telefone.replace(/\\D/g, '');
  const phoneToTest = rawPhone.startsWith('55') ? '+' + rawPhone : '+55' + rawPhone;
  if (!isValidPhoneNumber(phoneToTest, 'BR')) {
    errors.telefone = 'Informe um telefone brasileiro válido (ex: (12) 98765-4321)';
  }

  return errors;
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return \`(\${digits.slice(0, 2)}) \${digits.slice(2)}\`;
  if (digits.length <= 10) return \`(\${digits.slice(0, 2)}) \${digits.slice(2, 6)}-\${digits.slice(6)}\`;
  return \`(\${digits.slice(0, 2)}) \${digits.slice(2, 7)}-\${digits.slice(7)}\`;
}

async function saveLeadToAmplify(data: FormState, inputs: SimulationInputs, result: SimulationResult) {
  try {
    // Importação dinâmica para não quebrar se Amplify não estiver configurado
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
    // Amplify pode não estar configurado no sandbox ainda — não bloqueia o fluxo
    console.warn('Amplify não configurado — lead não salvo no backend.');
  }
}

export function LeadForm({ inputs, result, onClose }: LeadFormProps) {
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
    await saveLeadToAmplify(form, inputs, result);

    const msg = encodeURIComponent(
      \`Olá! Me chamo \${form.nome.trim()} e fiz a simulação no site.\\n\\nImóvel: \${formatCurrency(inputs.valorImovel)} | Prazo: \${inputs.prazo} meses\\nEconomia no consórcio: \${formatCurrency(result.economiaVsPrice)}\\n\\nGostaria de receber uma proposta!\`
    );
    window.open(\`https://wa.me/\${WHATSAPP_NUMBER}?text=\${msg}\`, '_blank', 'noopener,noreferrer');
    setSubmitting(false);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 md:p-8 border animate-fade-up relative"
        style={{ background: '#16140F', borderColor: 'rgba(245,194,0,0.25)', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary/50 hover:text-text-primary transition-colors"
          aria-label="Fechar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#F5C200' }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#F5C200' }}>Proposta gratuita</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-text-primary mb-1">Receba sua proposta</h2>
          <p className="text-sm text-text-secondary/60">
            Preencha seus dados e nosso especialista vai te contatar pelo WhatsApp.
          </p>
        </div>

        {/* Simulation summary */}
        <div
          className="rounded-xl p-4 mb-6 grid grid-cols-2 gap-3 text-center"
          style={{ background: 'rgba(245,194,0,0.06)', border: '1px solid rgba(245,194,0,0.12)' }}
        >
          <div>
            <p className="text-xs text-text-secondary/60 mb-0.5">Imóvel</p>
            <p className="text-sm font-bold" style={{ color: '#F5C200' }}>{formatCurrency(inputs.valorImovel)}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary/60 mb-0.5">Economia estimada</p>
            <p className="text-sm font-bold" style={{ color: '#F5C200' }}>{formatCurrency(result.economiaVsPrice)}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Nome */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="lf-nome">
              Nome completo
            </label>
            <input
              id="lf-nome"
              type="text"
              autoComplete="name"
              value={form.nome}
              onChange={handleChange('nome')}
              placeholder="Seu nome"
              className="w-full rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/30 border outline-none transition-all"
              style={{
                background: '#1a1810',
                borderColor: errors.nome ? '#f87171' : 'rgba(242,237,226,0.1)',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#F5C200')}
              onBlur={(e) => (e.currentTarget.style.borderColor = errors.nome ? '#f87171' : 'rgba(242,237,226,0.1)')}
            />
            {errors.nome && <p className="text-xs text-red-400 mt-1">{errors.nome}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="lf-email">
              E-mail
            </label>
            <input
              id="lf-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="seu@email.com"
              className="w-full rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/30 border outline-none transition-all"
              style={{
                background: '#1a1810',
                borderColor: errors.email ? '#f87171' : 'rgba(242,237,226,0.1)',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#F5C200')}
              onBlur={(e) => (e.currentTarget.style.borderColor = errors.email ? '#f87171' : 'rgba(242,237,226,0.1)')}
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="lf-tel">
              WhatsApp / Telefone
            </label>
            <input
              id="lf-tel"
              type="tel"
              autoComplete="tel"
              inputMode="numeric"
              value={form.telefone}
              onChange={handleChange('telefone')}
              placeholder="(12) 98765-4321"
              className="w-full rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/30 border outline-none transition-all"
              style={{
                background: '#1a1810',
                borderColor: errors.telefone ? '#f87171' : 'rgba(242,237,226,0.1)',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#F5C200')}
              onBlur={(e) => (e.currentTarget.style.borderColor = errors.telefone ? '#f87171' : 'rgba(242,237,226,0.1)')}
            />
            {errors.telefone && <p className="text-xs text-red-400 mt-1">{errors.telefone}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90 mt-2 disabled:opacity-50"
            style={{ background: '#F5C200', color: '#0F0E0C' }}
          >
            {submitting ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
                Enviar e abrir WhatsApp
              </>
            )}
          </button>

          <p className="text-xs text-text-secondary/30 text-center">
            Seus dados são usados apenas para contato. Sem spam.
          </p>
        </form>
      </div>
    </div>
  );
}
`.trimStart(), 'utf8');
console.log('LeadForm.tsx ✓');
