import { defineFunction } from '@aws-amplify/backend';

export const sendLeadEmail = defineFunction({
  name: 'send-lead-email',
  entry: './handler.ts',
});
