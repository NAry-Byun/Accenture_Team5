import { defineAuth } from '@aws-amplify/backend';
import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});

const schema = a.schema({
    Todo: a.model({
        id: a.string(),
        content: a.string(),
        owner: a.string()
    })
        .authorization(allow => [allow.owner()]),
});

// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: 'apiKey',
        apiKeyAuthorizationMode: { expiresInDays: 30 }
    }
});