import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';
import { sendLeadEmail } from './functions/send-lead-email/resource';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';

export const backend = defineBackend({ data, sendLeadEmail });

// Concede permissão ao Lambda para enviar e-mails via SES
backend.sendLeadEmail.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['ses:SendEmail', 'ses:SendRawEmail'],
    resources: ['*'],
  })
);
