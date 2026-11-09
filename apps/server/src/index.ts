import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from './routers';
import { createContext } from './trpc/context';
import { runSeed } from './db/seed';

const PORT = Number(process.env.PORT) || 4000;

// Inicializa os dados com seed caso o banco esteja vazio
await runSeed().catch((err) => {
  console.warn('Aviso: Seed automático em background:', err);
});

export const server = Bun.serve({
  port: PORT,
  async fetch(req: Request) {
    const url = new URL(req.url);

    // Headers CORS para os clientes Web e Mobile do monorepo
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-trpc-source',
    };

    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // Healthcheck
    if (url.pathname === '/health' || url.pathname === '/') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          service: 'TrampoTaxa tRPC Backend',
          runtime: 'Bun',
          database: 'Microsoft SQL Server',
          timestamp: new Date().toISOString(),
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Roteamento tRPC
    if (url.pathname.startsWith('/trpc')) {
      const response = await fetchRequestHandler({
        endpoint: '/trpc',
        req,
        router: appRouter,
        createContext,
      });

      // Injeta CORS na resposta do tRPC
      const newHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([k, v]) => newHeaders.set(k, v));

      return new Response(response.body, {
        status: response.status,
        headers: newHeaders,
      });
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  },
});

console.log(`🚀 TrampoTaxa tRPC Backend rodando na porta ${PORT} via Bun.serve`);
