import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure, contractorProcedure } from '../trpc/init';
import { db } from '../db/client';

export const gigsRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          profession: z.string().optional(),
          neighborhood: z.string().optional(),
          status: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const gigs = await db.listGigs({
        profession: input?.profession,
        neighborhood: input?.neighborhood,
        status: input?.status,
      });

      const venues = await db.listVenues();
      const venuesMap = new Map(venues.map((v) => [v.id, v]));

      return gigs.map((g) => ({
        ...g,
        venue: venuesMap.get(g.venueId) || null,
      }));
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const gig = await db.findGigById(input.id);
      if (!gig) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Vaga não encontrada com o id ${input.id}`,
        });
      }

      const venues = await db.listVenues();
      const venue = venues.find((v) => v.id === gig.venueId) || null;
      const applicants = await db.findApplicantsByGigId(gig.id);

      return {
        ...gig,
        venue,
        applicants,
      };
    }),

  create: contractorProcedure
    .input(
      z.object({
        title: z.string().min(3),
        role: z.string(),
        category: z.enum(['Turno Normal', 'Cobertura de Emergência', 'Evento Especial']),
        venueName: z.string(),
        neighborhood: z.string(),
        address: z.string(),
        shiftDate: z.string(),
        dateFormatted: z.string(),
        startTime: z.string(),
        endTime: z.string(),
        rate: z.number().positive(),
        shiftDuration: z.string(),
        vacancies: z.number().int().min(1).default(1),
        dressCode: z.string(),
        rulesAndNotes: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const venueId = `venue-${input.venueName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      await db.upsertVenue({
        id: venueId,
        name: input.venueName,
        neighborhood: input.neighborhood,
        address: input.address,
        lat: -25.44,
        lng: -49.28,
        rating: 5.0,
      });

      const gigId = `cgig-${Date.now()}`;
      const newGig = await db.upsertGig({
        id: gigId,
        venueId,
        contractorId: ctx.user.id,
        title: input.title,
        role: input.role,
        category: input.category,
        shiftDate: input.shiftDate,
        dateFormatted: input.dateFormatted,
        startTime: input.startTime,
        endTime: input.endTime,
        rate: input.rate,
        rateFormatted: `R$ ${input.rate.toFixed(2).replace('.', ',')}`,
        shiftDuration: input.shiftDuration,
        vacancies: input.vacancies,
        status: 'Aberta',
        dressCode: input.dressCode,
        rulesAndNotes: input.rulesAndNotes,
        qrCodeSecret: 'QR_MESTRE_123',
        active: true,
      });

      return newGig;
    }),
});
