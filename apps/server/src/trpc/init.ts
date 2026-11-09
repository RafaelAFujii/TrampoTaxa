import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context';

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof Error && error.cause.name === 'ZodError'
            ? error.cause
            : null,
      },
    };
  },
});

export const router = t.router;
export const middleware = t.middleware;

// Procedimento Público
export const publicProcedure = t.procedure;

// Middleware de Autenticação
const isAuthed = middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Acesso não autorizado. Header Authorization Bearer obrigatório.',
    });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

// Procedimento Protegido
export const protectedProcedure = t.procedure.use(isAuthed);

// Procedimento exclusivo para Contratantes
export const contractorProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'Contratante') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Recurso restrito exclusivamente a perfis de Contratante.',
    });
  }
  return next({ ctx });
});

// Procedimento exclusivo para Freelancers
export const freelancerProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'Freelancer') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Recurso restrito exclusivamente a perfis de Freelancer.',
    });
  }
  return next({ ctx });
});
