import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, contractorProcedure } from '../trpc/init';
import { db } from '../db/client';

export const contractorRouter = router({
  listGigs: contractorProcedure.query(async ({ ctx }) => {
    const allGigs = await db.listGigs();
    const contractorGigs = allGigs.filter((g) => g.contractorId === ctx.user.id || g.id.startsWith('cgig-'));

    const venues = await db.listVenues();
    const venuesMap = new Map(venues.map((v) => [v.id, v]));

    const enriched = await Promise.all(
      contractorGigs.map(async (gig) => {
        const venue = venuesMap.get(gig.venueId);
        const applicants = await db.findApplicantsByGigId(gig.id);

        const enrichedApplicants = await Promise.all(
          applicants.map(async (app) => {
            const user = await db.findUserById(app.freelancerId);
            return {
              id: app.freelancerId,
              name: user?.name || 'Freelancer',
              avatarUrl: user?.avatarUrl || '',
              profession: user?.profession || 'Profissional',
              rating: user?.rating || 4.9,
              totalGigsCompleted: user?.totalGigsCompleted || 10,
              punctualityRate: user?.punctualityRate || '100%',
              specialties: ['Agilidade', 'Pontualidade'],
              status: app.status,
              appliedAt: app.appliedAt || 'Hoje',
              phone: user?.phone || '(41) 99999-0000',
              bio: user?.bio || '',
              isOverbooking: app.isOverbooking,
              overbookingSlots: app.overbookingSlots,
            };
          })
        );

        return {
          ...gig,
          venueName: venue?.name || gig.title,
          neighborhood: venue?.neighborhood || 'Batel',
          address: venue?.address || 'Curitiba/PR',
          applicants: enrichedApplicants,
        };
      })
    );

    return enriched;
  }),

  // Aprovação com resolução de overbooking concorrente
  approveApplicant: contractorProcedure
    .input(
      z.object({
        gigId: z.string(),
        freelancerId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const gig = await db.findGigById(input.gigId);
      if (!gig) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Vaga não encontrada.',
        });
      }

      // 1. Atualizar a vaga para Preenchida com o freelancer aprovado
      const updatedGig = await db.upsertGig({
        ...gig,
        status: 'Preenchida',
        approvedFreelancerId: input.freelancerId,
        shiftPhase: 'aguardando_checkin',
      });

      // 2. Atualizar o candidato na vaga para Aprovado
      const applicantId = `app-${input.gigId}-${input.freelancerId}`;
      await db.upsertApplicant({
        id: applicantId,
        gigId: input.gigId,
        freelancerId: input.freelancerId,
        status: 'Aprovado',
        isOverbooking: false,
        overbookingSlots: 0,
      });

      // 3. Regra de Overbooking: Cancelar automaticamente outras candidaturas ativas do freelancer
      await db.cancelConcurrentApplicationsForFreelancer(input.freelancerId, input.gigId);

      return {
        success: true,
        message: 'Freelancer aprovado com sucesso! Suas outras candidaturas concorrentes foram canceladas automaticamente.',
        gig: updatedGig,
      };
    }),

  rejectApplicant: contractorProcedure
    .input(
      z.object({
        gigId: z.string(),
        freelancerId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const applicantId = `app-${input.gigId}-${input.freelancerId}`;
      await db.upsertApplicant({
        id: applicantId,
        gigId: input.gigId,
        freelancerId: input.freelancerId,
        status: 'Recusado',
        isOverbooking: false,
        overbookingSlots: 0,
      });

      return {
        success: true,
        message: 'Candidatura recusada.',
      };
    }),

  releasePix: contractorProcedure
    .input(z.object({ gigId: z.string() }))
    .mutation(async ({ input }) => {
      const gig = await db.findGigById(input.gigId);
      if (!gig) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Vaga não encontrada.',
        });
      }

      const updated = await db.upsertGig({
        ...gig,
        shiftPhase: 'pix_aprovado',
        status: 'Finalizada',
      });

      return {
        success: true,
        message: 'PIX liberado antecipadamente com sucesso!',
        gig: updated,
      };
    }),

  kpis: contractorProcedure.query(async () => {
    return {
      totalInvested: 3580,
      totalInvestedFormatted: 'R$ 3.580,00',
      completedGigsCount: 16,
      hiredFreelancersCount: 12,
      averageRateFormatted: 'R$ 223,75',
      punctualityScore: '99.2%',
    };
  }),
});
