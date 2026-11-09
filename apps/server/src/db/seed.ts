import { db } from './client';
import {
  mockGigs,
  INITIAL_CONTRACTOR_GIGS,
  INITIAL_CHAT_MESSAGES,
} from '@trampotaxa/shared/mocks';

export async function runSeed(): Promise<{
  usersCount: number;
  venuesCount: number;
  gigsCount: number;
  applicantsCount: number;
  messagesCount: number;
}> {
  console.log('Iniciando carga de dados (Seed) para Microsoft SQL Server / TrampoTaxa...');

  // 1. Cadastrar Usuários Contratantes e Freelancers
  const contractorUser = await db.upsertUser({
    id: 'user-contractor-1',
    name: 'Roberto Alencar (Gerente Batel)',
    email: 'roberto@bistrobatel.com.br',
    passwordHash: 'hash_senha_teste_123',
    role: 'Contratante',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=240&auto=format&fit=crop&q=80',
    phone: '(41) 98877-6655',
    document: '12.345.678/0001-90',
    bio: 'Gerente operacional e sommelier com 12 anos de atuação em Curitiba.',
    profession: 'Gerente Geral',
    rating: 4.9,
    totalGigsCompleted: 140,
    punctualityRate: '100%',
  });

  const freelancerUser = await db.upsertUser({
    id: 'free-1',
    name: 'Gabriel Silva',
    email: 'gabriel.silva@curitiba.com',
    passwordHash: 'hash_senha_teste_123',
    role: 'Freelancer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
    phone: '(41) 99123-4567',
    document: '123.456.789-00',
    pixKey: 'gabriel.silva@curitiba.com',
    bio: 'Bartender profissional com mais de 5 anos de experiência na noite curitibana.',
    profession: 'Bartender Pro',
    rating: 4.9,
    totalGigsCompleted: 48,
    punctualityRate: '99%',
  });

  const freelancerUser2 = await db.upsertUser({
    id: 'free-2',
    name: 'Bruno Matos',
    email: 'bruno.matos@curitiba.com',
    passwordHash: 'hash_senha_teste_123',
    role: 'Freelancer',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
    phone: '(41) 99881-2233',
    document: '234.567.890-11',
    pixKey: 'bruno.matos@curitiba.com',
    bio: 'Garçom e Barback ágil e pontual para grandes eventos.',
    profession: 'Garçom & Barback',
    rating: 4.7,
    totalGigsCompleted: 19,
    punctualityRate: '96%',
  });

  // 2. Cadastrar Locais (Venues)
  const venuesMap = new Map<string, string>();
  for (const gig of mockGigs) {
    const venueId = `venue-${gig.venueName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    await db.upsertVenue({
      id: venueId,
      name: gig.venueName,
      neighborhood: gig.neighborhood,
      address: `${gig.neighborhood}, Curitiba - PR`,
      lat: gig.latLng.lat,
      lng: gig.latLng.lng,
      rating: gig.rating,
    });
    venuesMap.set(gig.venueName, venueId);
  }

  // 3. Cadastrar Vagas do Radar (mockGigs)
  for (const gig of mockGigs) {
    const venueId = venuesMap.get(gig.venueName) || 'venue-default';
    await db.upsertGig({
      id: gig.id,
      venueId,
      contractorId: contractorUser.id,
      title: `Taxa de ${gig.profession} - ${gig.venueName}`,
      role: gig.profession,
      category: 'Turno Normal',
      shiftDate: 'Hoje',
      dateFormatted: 'Hoje, Horário Noturno',
      startTime: gig.shiftTime.split(' - ')[0] || '19:00',
      endTime: gig.shiftTime.split(' - ')[1] || '01:00',
      rate: gig.rate,
      rateFormatted: gig.rateFormatted,
      shiftDuration: gig.shiftDuration,
      vacancies: 1,
      status: 'Aberta',
      dressCode: gig.microtraining.description,
      rulesAndNotes: gig.microtraining.description,
      qrCodeSecret: 'QR_MESTRE_123',
      active: gig.active,
    });
  }

  // 4. Cadastrar Vagas Administrativas do Contratante (INITIAL_CONTRACTOR_GIGS)
  let totalApplicantsCount = 0;
  for (const cgig of INITIAL_CONTRACTOR_GIGS) {
    let venueId = venuesMap.get(cgig.venueName);
    if (!venueId) {
      venueId = `venue-${cgig.venueName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      await db.upsertVenue({
        id: venueId,
        name: cgig.venueName,
        neighborhood: cgig.neighborhood,
        address: cgig.address,
        lat: -25.4452,
        lng: -49.2941,
        rating: 4.9,
      });
      venuesMap.set(cgig.venueName, venueId);
    }

    await db.upsertGig({
      id: cgig.id,
      venueId,
      contractorId: contractorUser.id,
      title: cgig.title,
      role: cgig.role,
      category: cgig.category,
      shiftDate: cgig.date,
      dateFormatted: cgig.dateFormatted,
      startTime: cgig.startTime,
      endTime: cgig.endTime,
      rate: cgig.rate,
      rateFormatted: cgig.rateFormatted,
      shiftDuration: '6 horas',
      vacancies: cgig.vacancies,
      status: cgig.status,
      dressCode: cgig.dressCode,
      rulesAndNotes: cgig.rulesAndNotes,
      qrCodeSecret: cgig.qrCodeSecret || 'QR_MESTRE_123',
      approvedFreelancerId: cgig.approvedFreelancerId,
      checkInTimestamp: cgig.checkInTimestamp,
      checkOutTimestamp: cgig.checkOutTimestamp,
      autoCheckoutDeadline: cgig.autoCheckoutDeadline,
      shiftPhase: cgig.shiftPhase,
      active: true,
    });

    // Inserir Candidatos das Vagas
    if (cgig.applicants && cgig.applicants.length > 0) {
      for (const app of cgig.applicants) {
        totalApplicantsCount++;
        await db.upsertApplicant({
          id: `app-${cgig.id}-${app.id}`,
          gigId: cgig.id,
          freelancerId: app.id === 'free-1' ? freelancerUser.id : freelancerUser2.id,
          status: app.status,
          isOverbooking: app.isOverbooking || false,
          overbookingSlots: app.overbookingSlots || 1,
          rating: app.rating,
          feedback: app.bio,
        });
      }
    }
  }

  // 5. Inserir Mensagens de Chat Históricas
  let messagesCount = 0;
  if (INITIAL_CHAT_MESSAGES && INITIAL_CHAT_MESSAGES.length > 0) {
    for (const msg of INITIAL_CHAT_MESSAGES) {
      messagesCount++;
      await db.insertChatMessage({
        id: msg.id,
        gigId: msg.gigId,
        senderId: msg.senderRole === 'Contratante' ? contractorUser.id : freelancerUser.id,
        senderName: msg.senderName,
        senderRole: msg.senderRole,
        text: msg.text,
        timestamp: msg.timestamp,
        isRead: msg.read,
      });
    }
  }

  console.log('Seed do banco SQL Server concluído com sucesso!');
  return {
    usersCount: 3,
    venuesCount: venuesMap.size,
    gigsCount: mockGigs.length + INITIAL_CONTRACTOR_GIGS.length,
    applicantsCount: totalApplicantsCount,
    messagesCount,
  };
}

// Execução direta via CLI se invocado como script
if (import.meta.main) {
  runSeed()
    .then((res) => {
      console.log('Resultado do Seed:', res);
      process.exit(0);
    })
    .catch((err) => {
      console.error('Falha no Seed:', err);
      process.exit(1);
    });
}
