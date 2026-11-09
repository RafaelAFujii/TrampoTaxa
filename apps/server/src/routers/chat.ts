import { z } from 'zod';
import { router, protectedProcedure } from '../trpc/init';
import { db } from '../db/client';

export const chatRouter = router({
  getMessages: protectedProcedure
    .input(z.object({ gigId: z.string() }))
    .query(async ({ input }) => {
      const messages = await db.listMessagesByGigId(input.gigId);
      return messages;
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        gigId: z.string(),
        text: z.string().min(1, 'Mensagem não pode ser vazia'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = `msg-${Date.now()}`;
      const message = await db.insertChatMessage({
        id,
        gigId: input.gigId,
        senderId: ctx.user.id,
        senderName: ctx.user.name,
        senderRole: ctx.user.role,
        text: input.text,
        timestamp: new Date().toISOString(),
        isRead: false,
      });

      return message;
    }),
});
