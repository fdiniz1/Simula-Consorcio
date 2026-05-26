import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Lead: a
    .model({
      nome: a.string().required(),
      email: a.string().required(),
      telefone: a.string().required(),
      valorImovel: a.float(),
      prazo: a.integer(),
      entradaPercent: a.float(),
      sistema: a.string(),
      totalConsorcio: a.float(),
      totalFinanciamento: a.float(),
      economia: a.float(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 365 },
  },
});
