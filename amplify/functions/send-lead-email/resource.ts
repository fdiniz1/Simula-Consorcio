import { defineFunction } from '@aws-amplify/backend';

export const sendLeadEmail = defineFunction({
  name: 'send-lead-email',
  entry: './handler.ts',
  bundling: {
    // @aws-sdk/* is provided by the Lambda Node.js 18+ runtime
    externalModules: ['@aws-sdk/client-ses'],
  },
});
