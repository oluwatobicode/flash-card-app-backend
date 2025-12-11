import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { config, SESSION } from "../config";

// Create MongoDB client for Better Auth
const client = new MongoClient(config.databaseUrl);

export const auth = betterAuth({
  database: mongodbAdapter(client.db()),
  baseURL: config.betterAuthUrl,
  secret: config.betterAuthSecret,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: config.googleClientId!,
      clientSecret: config.googleClientSecret!,
    },
  },
  session: {
    expiresIn: SESSION.EXPIRES_IN,
    updateAge: SESSION.UPDATE_AGE,
  },
});

// Export auth types for use in middleware
export type Session = typeof auth.$Infer.Session;
