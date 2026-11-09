import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, freelancerProcedure } from '../trpc/init';
import { db } from '../db/client';

export const freelancerRouter = router({
  // Pilar 1: Candidatura com Overbooking Controlado (Max 3 vagas concorrentes)
  applyToGig: freelancerProcedure
    .input(z.object({ gigId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const gig = await db.findGigById(input.gigId);
      if (!gig) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Vaga solicitada não encontrada.',
        });
      }

      if (gig.status !== 'Aberta' && gig.status !== 'Aguardando Confirmação') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Esta vaga não está mais recebendo candidaturas.',
        });
      }

      // Regra de Overbooking: Limite de no máximo 3 candidaturas ativas no mesmo período
      const activeCount = await db.countActiveApplicationsForFreelancer(ctx.user.id);
      if (activeCount >= 3) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Limite de Overbooking atingido: você já possui 3 candidaturas ativas concorrentes. Aguarde o retorno de um dos estabelecimentos.',
        });
      }

      const applicantId = `app-${input.gigId}-${ctx.user.id}`;
      const applicant = await db.upsertApplicant({
        id: applicantId,
        gigId: input.gigId,
        freelancerId: ctx.user.id,
        status: 'candidatado',
        isOverbooking: true,
        overbookingSlots: activeCount + 1,
        appliedAt: new Date().toISOString(),
      });

      return {
        success: true,
        message: `Candidatura enviada para ${gig.title}! Vaga em overbooking (${activeCount + 1}/3).`,
        applicant,
      };
    }),

  cancelApplication: freelancerProcedure
    .input(z.object({ gigId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const applicantId = `app-${input.gigId}-${ctx.user.id}`;
      await db.upsertApplicant({
        id: applicantId,
        gigId: input.gigId,
        freelancerId: ctx.user.id,
        status: 'cancelado',
        isOverbooking: false,
        overbookingSlots: 0,
      });

      return {
        success: true,
        message: 'Candidatura cancelada com sucesso.',
      };
    }),

  // Pilar 2: Scanner QR Mestre presencial ("QR_MESTRE_123")
  checkIn: freelancerProcedure
    .input(
      z.object({
        gigId: z.string(),
        qrCode: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const gig = await db.findGigById(input.gigId);
      if (!gig) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Turno não localizado.',
        });
      }

      if (input.qrCode.trim() !== (gig.qrCodeSecret || 'QR_MESTRE_123')) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'QR Code inválido. Aponte para o QR Code Mestre físico do estabelecimento.',
        });
      }

      const updated = await db.upsertGig({
        ...gig,
        checkInTimestamp: Date.now(),
        shiftPhase: 'em_turno',
      });

      return {
        success: true,
        message: `Check-in confirmado no ${gig.title}! Bom turno de trabalho.`,
        gig: updated,
      };
    }),

  // Pilar 2: Auto-Checkout (Janela de 2h de contestação)
  checkOut: freelancerProcedure
    .input(z.object({ gigId: z.string() }))
    .mutation(async ({ input }) => {
      const gig = await db.findGigById(input.gigId);
      if (!gig) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Turno não localizado.',
        });
      }

      const twoHoursMs = 2 * 60 * 60 * 1000;
      const now = Date.now();
      const updated = await db.upsertGig({
        ...gig,
        checkOutTimestamp: now,
        autoCheckoutDeadline: now + twoHoursMs,
        shiftPhase: 'checkout_pendente',
      });

      return {
        success: true,
        message: 'Check-out registrado. Janela de contestação de 2h iniciada para aprovação do PIX.',
        gig: updated,
      };
    }),

  // Pilar 3: Avaliação Obrigatória do Estabelecimento (5 Estrelas sem Loaders Chatos)
  submitReview: freelancerProcedure
    .input(
      z.object({
        gigId: z.string(),
        stars: z.number().min(1).max(5),
        feedback: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const gig = await db.findGigById(input.gigId);
      if (!gig) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Turno não encontrado.',
        });
      }

      const reviewId = `rev-${input.gigId}-${ctx.user.id}`;
      const review = await db.insertReview({
        id: reviewId,
        gigId: input.gigId,
        reviewerId: ctx.user.id,
        targetId: gig.venueId,
        stars: input.stars,
        feedback: input.feedback,
        tags: input.tags || [],
      });

      // Atualiza o turno para PIX liberado/agendado
      await db.upsertGig({
        ...gig,
        shiftPhase: 'pix_aprovado',
        status: 'Finalizada',
      });

      return {
        success: true,
        message: 'Avaliação registrada com sucesso! Repasse PIX liberado.',
        review,
      };
    }),

  // Relatório de Ganhos de Alto Impacto
  earnings: freelancerProcedure.query(async ({ ctx }) => {
    return {
      freelancerName: ctx.user.name,
      pixKey: ctx.user.pixKey || 'gabriel.silva@curitiba.com',
      todayEarningsFormatted: 'R$ 260,00',
      statusPix: 'PIX AGENDADO / LIBERADO',
      recentShifts: [
        {
          id: 'shift-1',
          venue: 'Taj Bar Curitiba',
          role: 'Bartender',
          date: 'Hoje',
          time: '19:00 - 01:00',
          amount: 'R$ 260,00',
          status: 'PIX Liberado',
        },
        {
          id: 'shift-2',
          venue: 'Bistrô do Batel',
          role: 'Bartender',
          date: 'Ontem',
          time: '18:00 - 00:00',
          amount: 'R$ 220,00',
          status: 'Pago via PIX',
        },
      ],
    };
  }),
});
