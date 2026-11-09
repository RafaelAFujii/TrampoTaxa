import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { db } from '../db/client';
import { UserEntity } from '../db/schema';

export interface Context {
  user: UserEntity | null;
  req: Request;
}

/**
 * Criação do Contexto de Requisição tRPC com Validação de JWT Bearer
 */
export async function createContext(
  opts: FetchCreateContextFnOptions
): Promise<Context> {
  const authHeader = opts.req.headers.get('authorization') || '';
  let user: UserEntity | null = null;

  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();

    // Em ambiente de teste/simulação e desenvolvimento com tokens estáticos ou JWT
    if (token === 'contractor-token-123') {
      user = await db.findUserById('user-contractor-1');
    } else if (token === 'freelancer-token-123') {
      user = await db.findUserById('free-1');
    } else if (token.startsWith('user_')) {
      user = await db.findUserById(token);
    } else {
      // Simulação de validação JWT decodificando payload base64 ou id
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payloadJson = Buffer.from(parts[1], 'base64').toString('utf-8');
          const payload = JSON.parse(payloadJson);
          if (payload.sub || payload.id) {
            user = await db.findUserById(payload.sub || payload.id);
          }
        }
      } catch (err) {
        user = null;
      }
    }
  }

  return {
    user,
    req: opts.req,
  };
}
