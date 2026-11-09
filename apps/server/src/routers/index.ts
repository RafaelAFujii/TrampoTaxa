import { router } from '../trpc/init';
import { authRouter } from './auth';
import { gigsRouter } from './gigs';
import { freelancerRouter } from './freelancer';
import { contractorRouter } from './contractor';
import { chatRouter } from './chat';

export const appRouter = router({
  auth: authRouter,
  gigs: gigsRouter,
  freelancer: freelancerRouter,
  contractor: contractorRouter,
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
