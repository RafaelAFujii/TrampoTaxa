import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure, protectedProcedure } from '../trpc/init';
import { db } from '../db/client';

export const authRouter = router({
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email('Email inválido'),
        password: z.string().min(4, 'A senha deve conter no mínimo 4 caracteres'),
      })
    )
    .mutation(async ({ input }) => {
      const user = await db.findUserByEmail(input.email);
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Usuário não encontrado com o email informado.',
        });
      }

      // Token mock/simulado compatível com a suíte de autenticação
      const token = `user_${user.id}`;
      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
          profession: user.profession,
        },
      };
    }),

  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, 'Nome é obrigatório'),
        email: z.string().email('Email inválido'),
        password: z.string().min(4, 'Senha curta'),
        role: z.enum(['Contratante', 'Freelancer']),
        document: z.string().optional(),
        phone: z.string().optional(),
        profession: z.string().optional(),
        pixKey: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const existing = await db.findUserByEmail(input.email);
      if (existing) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Já existe um cadastro com este endereço de email.',
        });
      }

      const id = `user-${Date.now()}`;
      const newUser = await db.upsertUser({
        id,
        name: input.name,
        email: input.email,
        passwordHash: input.password,
        role: input.role,
        document: input.document,
        phone: input.phone,
        profession: input.profession || (input.role === 'Freelancer' ? 'Bartender' : 'Gerente'),
        pixKey: input.pixKey,
        avatarUrl:
          input.role === 'Contratante'
            ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=240&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
        rating: 5.0,
        totalGigsCompleted: 0,
        punctualityRate: '100%',
      });

      return {
        token: `user_${newUser.id}`,
        user: newUser,
      };
    }),

  me: protectedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
});
