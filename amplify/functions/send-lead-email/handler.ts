import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import type { AppSyncResolverHandler } from 'aws-lambda';

const ses = new SESClient({});

// FROM_EMAIL deve ser um endereço verificado no AWS SES (ou domínio verificado)
const FROM_EMAIL = 'fabricio.diniz@cashwise.com.br';
const TO_EMAILS = ['victor.souza@cashwise.com.br', 'fabricio.diniz@cashwise.com.br'];

type MutationArgs = {
  nome: string;
  email: string;
  telefone: string;
  valorImovel?: number | null;
  economia?: number | null;
};

const formatBRL = (value?: number | null) =>
  value != null
    ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : '–';

export const handler: AppSyncResolverHandler<MutationArgs, string> = async (event) => {
  const { nome, email, telefone, valorImovel, economia } = event.arguments;

  try {
    await ses.send(
      new SendEmailCommand({
        Source: FROM_EMAIL,
        Destination: { ToAddresses: TO_EMAILS },
        Message: {
          Subject: { Data: `Novo lead do simulador: ${nome}` },
          Body: {
            Html: {
              Data: `
                <h2 style="font-family:sans-serif;color:#1a1a1a;">Novo Lead — Simulador de Consórcio</h2>
                <table style="font-family:sans-serif;font-size:15px;color:#333;border-collapse:collapse;">
                  <tr><td style="padding:6px 12px 6px 0;font-weight:bold;">Nome</td><td>${nome}</td></tr>
                  <tr><td style="padding:6px 12px 6px 0;font-weight:bold;">E-mail</td><td>${email}</td></tr>
                  <tr><td style="padding:6px 12px 6px 0;font-weight:bold;">Telefone</td><td>${telefone}</td></tr>
                  <tr><td style="padding:6px 12px 6px 0;font-weight:bold;">Valor do imóvel</td><td>${formatBRL(valorImovel)}</td></tr>
                  <tr><td style="padding:6px 12px 6px 0;font-weight:bold;">Economia estimada</td><td>${formatBRL(economia)}</td></tr>
                </table>
              `,
            },
            Text: {
              Data: `Novo lead: ${nome} | ${email} | ${telefone} | Imóvel: ${formatBRL(valorImovel)} | Economia: ${formatBRL(economia)}`,
            },
          },
        },
      })
    );
  } catch (err) {
    console.error('[send-lead-email] SES error:', JSON.stringify(err));
    throw err;
  }

  return 'ok';
};
