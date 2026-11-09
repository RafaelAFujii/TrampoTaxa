import { describe, it, expect, beforeEach } from 'bun:test';
import { appRouter } from '../routers';
import { runSeed } from '../db/seed';
import { db, inMemoryDb } from '../db/client';

describe('TrampoTaxa tRPC Backend & SQL Server Architecture Suite', () => {
  beforeEach(async () => {
    inMemoryDb.clear();
    await runSeed();
  });

  it('deve realizar o seed com sucesso e popular os dados iniciais de Curitiba', async () => {
    const venues = await db.listVenues();
    expect(venues.length).toBeGreaterThan(0);

    const gigs = await db.listGigs();
    expect(gigs.length).toBeGreaterThan(0);

    const contractor = await db.findUserByEmail('roberto@bistrobatel.com.br');
    expect(contractor).not.toBeNull();
    expect(contractor?.role).toBe('Contratante');

    const freelancer = await db.findUserById('free-1');
    expect(freelancer).not.toBeNull();
    expect(freelancer?.role).toBe('Freelancer');
  });

  it('authRouter: deve autenticar usuário existente e retornar token e perfil', async () => {
    const caller = appRouter.createCaller({ user: null, req: new Request('http://localhost') });

    const result = await caller.auth.login({
      email: 'roberto@bistrobatel.com.br',
      password: 'senha_valida_123',
    });

    expect(result.token).toBe('user_user-contractor-1');
    expect(result.user.name).toBe('Roberto Alencar (Gerente Batel)');
    expect(result.user.role).toBe('Contratante');
  });

  it('gigsRouter: deve listar vagas no radar com informações completas do estabelecimento', async () => {
    const caller = appRouter.createCaller({ user: null, req: new Request('http://localhost') });

    const gigs = await caller.gigs.list();
    expect(gigs.length).toBeGreaterThan(0);

    const first = gigs[0];
    expect(first.title).toBeDefined();
    expect(first.rateFormatted).toBeDefined();
    expect(first.venue).toBeDefined();
  });

  it('freelancerRouter (Pilar 1 - Overbooking Controlado): deve aplicar para vaga e bloquear a 4ª candidatura simultânea', async () => {
    // Cria um freelancer de teste isolado para testar o limite de 3 vagas
    const testFreelancer = await db.upsertUser({
      id: 'free-test-overbooking',
      name: 'Freelancer Teste Overbooking',
      email: 'free-test@trampotaxa.com',
      role: 'Freelancer',
      rating: 5.0,
      totalGigsCompleted: 5,
      punctualityRate: '100%',
    });

    const caller = appRouter.createCaller({ user: testFreelancer, req: new Request('http://localhost') });

    // 1ª, 2ª e 3ª candidaturas permitidas
    const res1 = await caller.freelancer.applyToGig({ gigId: 'gig-1' });
    expect(res1.success).toBe(true);

    const res2 = await caller.freelancer.applyToGig({ gigId: 'gig-2' });
    expect(res2.success).toBe(true);

    const res3 = await caller.freelancer.applyToGig({ gigId: 'gig-3' });
    expect(res3.success).toBe(true);

    // 4ª vaga simultânea deve ser rejeitada pelo controle de overbooking
    let error: any;
    try {
      await caller.freelancer.applyToGig({ gigId: 'gig-4' });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error?.message).toContain('Limite de Overbooking atingido');
  });

  it('freelancerRouter (Pilar 2 - Scanner QR Mestre): deve validar presença com QR_MESTRE_123', async () => {
    const freelancer = await db.findUserById('free-1');
    const caller = appRouter.createCaller({ user: freelancer, req: new Request('http://localhost') });

    // Código inválido
    let error: any;
    try {
      await caller.freelancer.checkIn({ gigId: 'gig-1', qrCode: 'QR_INCORRETO' });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error?.message).toContain('QR Code inválido');

    // Código Mestre correto
    const valid = await caller.freelancer.checkIn({
      gigId: 'gig-1',
      qrCode: 'QR_MESTRE_123',
    });
    expect(valid.success).toBe(true);
    expect(valid.gig.shiftPhase).toBe('em_turno');
    expect(valid.gig.checkInTimestamp).toBeDefined();
  });

  it('freelancerRouter (Pilar 2 - Auto-Checkout): deve registrar check-out e abrir janela de 2h', async () => {
    const freelancer = await db.findUserById('free-1');
    const caller = appRouter.createCaller({ user: freelancer, req: new Request('http://localhost') });

    const checkout = await caller.freelancer.checkOut({ gigId: 'gig-1' });
    expect(checkout.success).toBe(true);
    expect(checkout.gig.shiftPhase).toBe('checkout_pendente');
    expect(checkout.gig.autoCheckoutDeadline).toBeGreaterThan(Date.now());
  });

  it('contractorRouter: aprovação de candidato deve preencher a vaga e cancelar candidaturas concorrentes', async () => {
    const contractor = await db.findUserById('user-contractor-1');
    const testFreelancer = await db.upsertUser({
      id: 'free-test-cancel',
      name: 'Freelancer Auto Cancel',
      email: 'free-cancel@trampotaxa.com',
      role: 'Freelancer',
      rating: 5.0,
      totalGigsCompleted: 0,
      punctualityRate: '100%',
    });

    const freelancerCaller = appRouter.createCaller({ user: testFreelancer, req: new Request('http://localhost') });
    await freelancerCaller.freelancer.applyToGig({ gigId: 'gig-1' });
    await freelancerCaller.freelancer.applyToGig({ gigId: 'gig-2' });

    const contractorCaller = appRouter.createCaller({ user: contractor, req: new Request('http://localhost') });
    const approval = await contractorCaller.contractor.approveApplicant({
      gigId: 'gig-1',
      freelancerId: 'free-test-cancel',
    });

    expect(approval.success).toBe(true);
    expect(approval.gig.status).toBe('Preenchida');

    // Vaga 2 deve ter sido cancelada automaticamente
    const appsGig2 = await db.findApplicantsByGigId('gig-2');
    const appFreeGig2 = appsGig2.find((a) => a.freelancerId === 'free-test-cancel');
    expect(appFreeGig2?.status).toBe('cancelado');
  });

  it('chatRouter: deve permitir envio e listagem de mensagens do turno', async () => {
    const contractor = await db.findUserById('user-contractor-1');
    const caller = appRouter.createCaller({ user: contractor, req: new Request('http://localhost') });

    const sent = await caller.chat.sendMessage({
      gigId: 'gig-1',
      text: 'Olá! Não se esqueça de trazer o avental preto para o turno.',
    });
    expect(sent.text).toContain('avental preto');

    const messages = await caller.chat.getMessages({ gigId: 'gig-1' });
    expect(messages.some((m) => m.text.includes('avental preto'))).toBe(true);
  });
});
