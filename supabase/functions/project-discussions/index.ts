import { createHandler } from './handler.mjs';

// Keep the website's TypeScript check independent of a globally installed Deno SDK.
declare const Deno: {
  env: { get(name: string): string | undefined };
  serve(handler: (request: Request) => Promise<Response>): void;
};

Deno.serve(createHandler({ getEnv: (name: string) => Deno.env.get(name), fetch: globalThis.fetch }));
