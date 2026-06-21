// Server-only config. The .server.ts suffix prevents Vite from bundling
// this file into the client.
//
// On Cloudflare Workers, env binds at REQUEST time via the `env` parameter.
// Never use process.env — it doesn't exist in the Workers runtime.

export function getServerConfig(env: Record<string, unknown> = {}) {
  return {
    nodeEnv: (env.NODE_ENV as string) || "production",
    // Add server-only values here, e.g.:
    //   databaseUrl: env.DATABASE_URL,
    //   stripeSecretKey: env.STRIPE_SECRET_KEY,
  };
}