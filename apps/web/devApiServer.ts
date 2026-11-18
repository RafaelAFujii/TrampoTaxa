import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import express, { type Request, type Response } from 'express';

type BackendRole = 'Freelancer' | 'Contractor';

interface DbUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: BackendRole;
  document?: string;
  phone?: string;
  pixKey?: string | null;
  specialty?: string | null;
  rating: number;
  completedGigsCount: number;
  createdAt: string;
}

interface DbVenue {
  id: string;
  ownerId: string;
  name: string;
  tradeName: string;
  cnpj: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

interface DbGig {
  id: string;
  venueId: string;
  title: string;
  roleRequired: string;
  description: string;
  hourlyRate: number;
  estimatedTotal: number;
  shiftStart: string;
  shiftEnd: string;
  vacancies: number;
  status: number; // 0 = Open, 1 = InProgress, 2 = Completed
  masterQrCodeSecret: string;
  createdAt: string;
}

interface DbApplication {
  id: string;
  gigId: string;
  freelancerId: string;
  status: number; // 0 = Applied, 1 = Approved, 2 = Rejected, 3 = Cancelled
  appliedAt: string;
  statusUpdatedAt?: string;
}

interface DbShift {
  id: string;
  gigId: string;
  freelancerId: string;
  phase: string;
  checkInTime?: string;
  checkOutRequestedTime?: string;
  contestationDeadline?: string;
  approvedAt?: string;
  totalAmount: number;
  rating?: number;
  feedbackComment?: string;
  contestationReason?: string;
  createdAt: string;
}

interface DbChatMessage {
  id: string;
  gigId: string;
  senderId: string;
  senderName: string;
  text: string;
  sentAt: string;
}

interface DevDatabase {
  users: DbUser[];
  venues: DbVenue[];
  gigs: DbGig[];
  applications: DbApplication[];
  shifts: DbShift[];
  chatMessages: DbChatMessage[];
}

const DB_FILE_PATH = path.join(os.tmpdir(), 'trampotaxa-dev-db.json');
const TOKEN_SECRET = process.env.JWT_SECRET || 'trampotaxa-local-dev-secret-key';

const CURITIBA_NEIGHBORHOOD_COORDS: Record<string, { lat: number; lng: number }> = {
  batel: { lat: -25.4411, lng: -49.2831 },
  'batel soho': { lat: -25.4425, lng: -49.2865 },
  seminario: { lat: -25.4475, lng: -49.2965 },
  centro: { lat: -25.4284, lng: -49.2733 },
  'centro civico': { lat: -25.4152, lng: -49.2697 },
  'agua verde': { lat: -25.4519, lng: -49.2803 },
  bigorrilho: { lat: -25.4326, lng: -49.2995 },
  cabral: { lat: -25.4066, lng: -49.2557 },
  juveve: { lat: -25.4146, lng: -49.2591 },
  'santa felicidade': { lat: -25.3999, lng: -49.3318 },
  merces: { lat: -25.4202, lng: -49.2912 },
  reboucas: { lat: -25.4429, lng: -49.2647 },
  'cristo rei': { lat: -25.4352, lng: -49.2471 },
  portao: { lat: -25.4759, lng: -49.2929 },
};

function geocodeCuritibaNeighborhood(neighborhood?: string): { lat: number; lng: number } {
  if (!neighborhood) return { lat: -25.4411, lng: -49.2831 };
  const normalized = neighborhood
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  for (const [key, coords] of Object.entries(CURITIBA_NEIGHBORHOOD_COORDS)) {
    if (normalized.includes(key)) {
      return coords;
    }
  }
  return { lat: -25.4355, lng: -49.2785 };
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${derived}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash.startsWith('scrypt:')) {
    return false;
  }
  const parts = storedHash.split(':');
  if (parts.length !== 3) return false;
  const [, salt, originalHex] = parts;
  const derived = crypto.scryptSync(password, salt, 64);
  const original = Buffer.from(originalHex, 'hex');
  if (derived.length !== original.length) return false;
  return crypto.timingSafeEqual(derived, original);
}

function generateToken(user: DbUser): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    })
  ).toString('base64url');
  const sig = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');
  return `${header}.${payload}.${sig}`;
}

function createInitialSeed(): DevDatabase {
  const now = Date.now();
  const defaultPasswordHash = hashPassword('SenhaSegura123!');

  const contractorId = '11111111-1111-1111-1111-111111111111';
  const freelancer1Id = '22222222-2222-2222-2222-222222222222';
  const freelancer2Id = '33333333-3333-3333-3333-333333333333';
  const freelancer3Id = '44444444-4444-4444-4444-444444444444';

  const venue1Id = '55555555-5555-5555-5555-555555555555';
  const venue2Id = '66666666-6666-6666-6666-666666666666';

  const gig1Id = '77777777-7777-7777-7777-777777777777';
  const gig2Id = '88888888-8888-8888-8888-888888888888';
  const gig3Id = '99999999-9999-9999-9999-999999999999';

  return {
    users: [
      {
        id: contractorId,
        name: 'Gerência Bistrô do Batel',
        email: 'gerencia@bistrobatel.com.br',
        passwordHash: defaultPasswordHash,
        role: 'Contractor',
        document: '12.345.678/0001-90',
        phone: '(41) 99876-5432',
        pixKey: null,
        specialty: null,
        rating: 4.9,
        completedGigsCount: 42,
        createdAt: new Date(now - 90 * 86400_000).toISOString(),
      },
      {
        id: freelancer1Id,
        name: 'Gabriel Silva',
        email: 'gabriel.silva@trampotaxa.com.br',
        passwordHash: defaultPasswordHash,
        role: 'Freelancer',
        document: '123.456.789-00',
        phone: '(41) 98765-4321',
        pixKey: 'gabriel.silva@pix.trampotaxa.com.br',
        specialty: 'Bartender & Mixologia',
        rating: 4.95,
        completedGigsCount: 28,
        createdAt: new Date(now - 60 * 86400_000).toISOString(),
      },
      {
        id: freelancer2Id,
        name: 'Mariana Souza',
        email: 'mariana.souza@trampotaxa.com.br',
        passwordHash: defaultPasswordHash,
        role: 'Freelancer',
        document: '987.654.321-99',
        phone: '(41) 99123-4567',
        pixKey: 'mariana.souza@pix.trampotaxa.com.br',
        specialty: 'Hostess & Atendimento VIP',
        rating: 4.88,
        completedGigsCount: 19,
        createdAt: new Date(now - 30 * 86400_000).toISOString(),
      },
      {
        id: freelancer3Id,
        name: 'Lucas Oliveira',
        email: 'lucas.oliveira@trampotaxa.com.br',
        passwordHash: defaultPasswordHash,
        role: 'Freelancer',
        document: '456.789.123-11',
        phone: '(41) 99234-5678',
        pixKey: 'lucas.oliveira@pix.trampotaxa.com.br',
        specialty: 'Garçom & Salão',
        rating: 4.8,
        completedGigsCount: 14,
        createdAt: new Date(now - 30 * 86400_000).toISOString(),
      },
    ],
    venues: [
      {
        id: venue1Id,
        ownerId: contractorId,
        name: 'Bistrô do Batel',
        tradeName: 'Bistrô Batel Alta Gastronomia',
        cnpj: '12.345.678/0001-90',
        address: 'Av. do Batel, 1550',
        neighborhood: 'Batel',
        city: 'Curitiba',
        state: 'PR',
        latitude: -25.4411,
        longitude: -49.2831,
        createdAt: new Date(now - 90 * 86400_000).toISOString(),
      },
      {
        id: venue2Id,
        ownerId: contractorId,
        name: 'Rooftop 360 Batel',
        tradeName: 'Rooftop Bar e Lounge',
        cnpj: '12.345.678/0002-71',
        address: 'Rua Bispo Dom José, 2200',
        neighborhood: 'Seminário / Batel Soho',
        city: 'Curitiba',
        state: 'PR',
        latitude: -25.4475,
        longitude: -49.2965,
        createdAt: new Date(now - 60 * 86400_000).toISOString(),
      },
    ],
    gigs: [
      {
        id: gig1Id,
        venueId: venue1Id,
        title: 'Bartender Chefe - Sexta Black Tie',
        roleRequired: 'Bartender',
        description:
          'Atendimento a coquetelaria clássica e autoral em evento fechado para 120 convidados. Taxa com Pix agendado logo após checkout.',
        hourlyRate: 45,
        estimatedTotal: 270,
        shiftStart: new Date(now + 2 * 3600_000).toISOString(),
        shiftEnd: new Date(now + 8 * 3600_000).toISOString(),
        vacancies: 1,
        status: 0,
        masterQrCodeSecret: 'QR_MESTRE_123',
        createdAt: new Date(now - 86400_000).toISOString(),
      },
      {
        id: gig2Id,
        venueId: venue1Id,
        title: 'Hostess de Recepção e RSVP',
        roleRequired: 'Hostess',
        description:
          'Recepção de convidados vips, conferência de nomes e acomodação nas mesas no salão nobre.',
        hourlyRate: 35,
        estimatedTotal: 210,
        shiftStart: new Date(now + 3 * 3600_000).toISOString(),
        shiftEnd: new Date(now + 9 * 3600_000).toISOString(),
        vacancies: 1,
        status: 0,
        masterQrCodeSecret: 'QR_MESTRE_123',
        createdAt: new Date(now - 86400_000).toISOString(),
      },
      {
        id: gig3Id,
        venueId: venue2Id,
        title: 'Garçom Volante para Lounge Rooftop',
        roleRequired: 'Garçom',
        description:
          'Serviço volante de finger foods e espumantes em terraço panorâmico. Traje all black.',
        hourlyRate: 30,
        estimatedTotal: 180,
        shiftStart: new Date(now + 4 * 3600_000).toISOString(),
        shiftEnd: new Date(now + 10 * 3600_000).toISOString(),
        vacancies: 2,
        status: 0,
        masterQrCodeSecret: 'QR_MESTRE_123',
        createdAt: new Date(now - 86400_000).toISOString(),
      },
    ],
    applications: [
      {
        id: crypto.randomUUID(),
        gigId: gig2Id,
        freelancerId: freelancer1Id,
        status: 0,
        appliedAt: new Date(now - 3600_000).toISOString(),
      },
    ],
    shifts: [],
    chatMessages: [],
  };
}

function loadDatabase(): DevDatabase {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, 'utf8');
      const parsed = JSON.parse(raw) as Partial<DevDatabase>;
      if (Array.isArray(parsed.users) && parsed.users.length > 0) {
        return {
          users: parsed.users,
          venues: parsed.venues ?? [],
          gigs: parsed.gigs ?? [],
          applications: parsed.applications ?? [],
          shifts: parsed.shifts ?? [],
          chatMessages: parsed.chatMessages ?? [],
        };
      }
    }
  } catch {
    // Recreate clean seed on parse failure
  }
  const seeded = createInitialSeed();
  saveDatabase(seeded);
  return seeded;
}

function saveDatabase(db: DevDatabase): void {
  fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), 'utf8');
}

function isPortListening(port: number, host = '127.0.0.1'): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host });
    const timer = setTimeout(() => {
      socket.destroy();
      resolve(false);
    }, 300);

    socket.once('connect', () => {
      clearTimeout(timer);
      socket.destroy();
      resolve(true);
    });

    socket.once('error', () => {
      clearTimeout(timer);
      socket.destroy();
      resolve(false);
    });
  });
}

function createApiApp() {
  const app = express();
  app.use(express.json());

  app.get('/', (_req: Request, res: Response) => {
    res.json({
      name: 'TrampoTaxa Local API',
      status: 'healthy',
      database: 'Local Persistent Store',
      version: '1.0.0',
    });
  });

  app.post('/api/auth/register', (req: Request, res: Response) => {
    const body = req.body ?? {};
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const name = String(body.name || '').trim();
    const rawRole = String(body.role || '').trim().toLowerCase();

    if (!email || !password || !name) {
      res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
      return;
    }

    if (rawRole !== 'freelancer' && rawRole !== 'contractor') {
      res.status(400).json({ message: "Papel inválido. Escolha 'Freelancer' ou 'Contractor'." });
      return;
    }

    const db = loadDatabase();
    if (db.users.some((u) => u.email.toLowerCase() === email)) {
      res.status(400).json({ message: 'Email já cadastrado na plataforma.' });
      return;
    }

    const role: BackendRole = rawRole === 'contractor' ? 'Contractor' : 'Freelancer';
    const user: DbUser = {
      id: crypto.randomUUID(),
      name,
      email,
      passwordHash: hashPassword(password),
      role,
      document: body.document ? String(body.document) : undefined,
      phone: body.phone ? String(body.phone) : undefined,
      pixKey: body.pixKey ? String(body.pixKey) : null,
      specialty: body.specialty ? String(body.specialty) : null,
      rating: 5.0,
      completedGigsCount: 0,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);

    let venue: DbVenue | null = null;
    if (role === 'Contractor') {
      const neighborhood = String(body.neighborhood || 'Batel').trim() || 'Batel';
      const geocoded = geocodeCuritibaNeighborhood(neighborhood);
      const lat = typeof body.latitude === 'number' ? body.latitude : geocoded.lat;
      const lng = typeof body.longitude === 'number' ? body.longitude : geocoded.lng;
      const venueName = String(body.venueName || user.name).trim() || user.name;

      venue = {
        id: crypto.randomUUID(),
        ownerId: user.id,
        name: venueName,
        tradeName: venueName,
        cnpj: String(body.document || ''),
        address: String(body.address || 'Av. do Batel, 1550').trim() || 'Av. do Batel, 1550',
        neighborhood,
        city: String(body.city || 'Curitiba'),
        state: String(body.state || 'PR'),
        latitude: lat,
        longitude: lng,
        createdAt: new Date().toISOString(),
      };
      db.venues.push(venue);
    }

    saveDatabase(db);

    const token = generateToken(user);
    res.json({
      token,
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      pixKey: user.pixKey,
      specialty: user.specialty,
      rating: user.rating,
      venueId: venue?.id ?? null,
      venueName: venue?.name ?? null,
      venueAddress: venue?.address ?? null,
      venueNeighborhood: venue?.neighborhood ?? null,
    });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const body = req.body ?? {};
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    const db = loadDatabase();
    const user = db.users.find((u) => u.email.toLowerCase() === email);

    if (!user || !verifyPassword(password, user.passwordHash)) {
      res.status(401).json({ message: 'Email ou senha incorretos.' });
      return;
    }

    const primaryVenue = db.venues.find((v) => v.ownerId === user.id) ?? null;
    const token = generateToken(user);

    res.json({
      token,
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      pixKey: user.pixKey,
      specialty: user.specialty,
      rating: user.rating,
      venueId: primaryVenue?.id ?? null,
      venueName: primaryVenue?.name ?? null,
      venueAddress: primaryVenue?.address ?? null,
      venueNeighborhood: primaryVenue?.neighborhood ?? null,
    });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const userId = String(req.query.userId || '').trim();
    const db = loadDatabase();
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado.' });
      return;
    }

    const primaryVenue = db.venues.find((v) => v.ownerId === user.id) ?? null;
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      document: user.document,
      phone: user.phone,
      pixKey: user.pixKey,
      specialty: user.specialty,
      rating: user.rating,
      completedGigsCount: user.completedGigsCount,
      venue: primaryVenue
        ? {
            id: primaryVenue.id,
            name: primaryVenue.name,
            address: primaryVenue.address,
            neighborhood: primaryVenue.neighborhood,
            city: primaryVenue.city,
            latitude: primaryVenue.latitude,
            longitude: primaryVenue.longitude,
          }
        : null,
    });
  });

  app.get('/api/gigs', (req: Request, res: Response) => {
    const roleFilter = String(req.query.role || '').trim().toLowerCase();
    const neighborhoodFilter = String(req.query.neighborhood || '').trim().toLowerCase();

    const db = loadDatabase();
    let gigs = db.gigs.slice();

    if (roleFilter) {
      gigs = gigs.filter(
        (g) =>
          g.roleRequired.toLowerCase().includes(roleFilter) ||
          g.title.toLowerCase().includes(roleFilter)
      );
    }

    if (neighborhoodFilter) {
      gigs = gigs.filter((g) => {
        const venue = db.venues.find((v) => v.id === g.venueId);
        return Boolean(venue && venue.neighborhood.toLowerCase().includes(neighborhoodFilter));
      });
    }

    gigs.sort((a, b) => new Date(a.shiftStart).getTime() - new Date(b.shiftStart).getTime());

    const response = gigs.map((g) => {
      const venue = db.venues.find((v) => v.id === g.venueId) ?? null;
      const applicationsCount = db.applications.filter(
        (a) => a.gigId === g.id && (a.status === 0 || a.status === 1)
      ).length;

      return {
        id: g.id,
        title: g.title,
        roleRequired: g.roleRequired,
        description: g.description,
        hourlyRate: g.hourlyRate,
        estimatedTotal: g.estimatedTotal,
        shiftStart: g.shiftStart,
        shiftEnd: g.shiftEnd,
        vacancies: g.vacancies,
        status: g.status,
        venue: venue
          ? {
              id: venue.id,
              name: venue.name,
              address: venue.address,
              neighborhood: venue.neighborhood,
              city: venue.city,
              latitude: venue.latitude,
              longitude: venue.longitude,
            }
          : null,
        applicationsCount,
      };
    });

    res.json(response);
  });

  app.get('/api/gigs/:id', (req: Request, res: Response) => {
    const db = loadDatabase();
    const gig = db.gigs.find((g) => g.id === req.params.id);
    if (!gig) {
      res.status(404).json({ message: 'Vaga não encontrada.' });
      return;
    }

    const venue = db.venues.find((v) => v.id === gig.venueId) ?? null;
    const applications = db.applications
      .filter((a) => a.gigId === gig.id)
      .map((a) => {
        const freelancer = db.users.find((u) => u.id === a.freelancerId);
        return {
          id: a.id,
          gigId: a.gigId,
          freelancerId: a.freelancerId,
          status: a.status,
          appliedAt: a.appliedAt,
          freelancer: freelancer
            ? {
                id: freelancer.id,
                name: freelancer.name,
                specialty: freelancer.specialty,
                rating: freelancer.rating,
              }
            : null,
        };
      });

    res.json({
      id: gig.id,
      title: gig.title,
      roleRequired: gig.roleRequired,
      description: gig.description,
      hourlyRate: gig.hourlyRate,
      estimatedTotal: gig.estimatedTotal,
      shiftStart: gig.shiftStart,
      shiftEnd: gig.shiftEnd,
      vacancies: gig.vacancies,
      status: gig.status,
      venue: venue
        ? {
            id: venue.id,
            name: venue.name,
            address: venue.address,
            neighborhood: venue.neighborhood,
            city: venue.city,
            latitude: venue.latitude,
            longitude: venue.longitude,
          }
        : null,
      applications,
      shifts: db.shifts.filter((s) => s.gigId === gig.id),
    });
  });

  app.post('/api/contractor/gigs', (req: Request, res: Response) => {
    const body = req.body ?? {};
    const db = loadDatabase();
    const venue = db.venues.find((v) => v.id === body.venueId);
    if (!venue) {
      res.status(404).json({ message: 'Estabelecimento não encontrado.' });
      return;
    }

    const gig: DbGig = {
      id: crypto.randomUUID(),
      venueId: venue.id,
      title: String(body.title || 'Vaga de Taxa'),
      roleRequired: String(body.roleRequired || 'Bartender'),
      description: String(body.description || ''),
      hourlyRate: Number(body.hourlyRate || 35),
      estimatedTotal: Number(body.estimatedTotal || 210),
      shiftStart: String(body.shiftStart || new Date().toISOString()),
      shiftEnd: String(body.shiftEnd || new Date(Date.now() + 6 * 3600_000).toISOString()),
      vacancies: Math.max(1, Number(body.vacancies || 1)),
      status: 0,
      masterQrCodeSecret: 'QR_MESTRE_123',
      createdAt: new Date().toISOString(),
    };

    db.gigs.push(gig);
    saveDatabase(db);
    res.json(gig);
  });

  app.post('/api/freelancer/apply', (req: Request, res: Response) => {
    const body = req.body ?? {};
    const db = loadDatabase();
    const freelancer = db.users.find((u) => u.id === body.freelancerId && u.role === 'Freelancer');
    if (!freelancer) {
      res.status(400).json({ message: 'Freelancer inválido.' });
      return;
    }
    const gig = db.gigs.find((g) => g.id === body.gigId);
    if (!gig) {
      res.status(404).json({ message: 'Vaga não encontrada.' });
      return;
    }
    if (gig.status !== 0) {
      res.status(400).json({ message: 'Esta vaga não está mais aberta para candidaturas.' });
      return;
    }

    const activeApps = db.applications.filter(
      (a) => a.freelancerId === freelancer.id && (a.status === 0 || a.status === 1)
    );
    if (activeApps.some((a) => a.gigId === gig.id)) {
      res.status(400).json({ message: 'Você já está candidatado ou aprovado para esta vaga.' });
      return;
    }
    if (activeApps.length >= 3) {
      res.status(400).json({
        message: `Limite de overbooking atingido! Você já possui ${activeApps.length} candidaturas ativas. O limite máximo permitido são 3.`,
        currentActiveApplications: activeApps.length,
        maxAllowed: 3,
      });
      return;
    }

    const appRecord: DbApplication = {
      id: crypto.randomUUID(),
      gigId: gig.id,
      freelancerId: freelancer.id,
      status: 0,
      appliedAt: new Date().toISOString(),
    };
    db.applications.push(appRecord);
    saveDatabase(db);

    res.json({
      message: 'Candidatura registrada com sucesso no TrampoTaxa!',
      applicationId: appRecord.id,
      activeCount: activeApps.length + 1,
      slotsRemaining: 3 - (activeApps.length + 1),
    });
  });

  app.get('/api/chat/:gigId/messages', (req: Request, res: Response) => {
    const db = loadDatabase();
    const messages = db.chatMessages.filter((m) => m.gigId === req.params.gigId);
    res.json(messages);
  });

  app.post('/api/chat/:gigId/messages', (req: Request, res: Response) => {
    const body = req.body ?? {};
    const db = loadDatabase();
    const message: DbChatMessage = {
      id: crypto.randomUUID(),
      gigId: String(req.params.gigId),
      senderId: String(body.senderId || 'system'),
      senderName: String(body.senderName || 'Usuário'),
      text: String(body.text || ''),
      sentAt: new Date().toISOString(),
    };
    db.chatMessages.push(message);
    saveDatabase(db);
    res.json(message);
  });

  return app;
}

let activeServer: http.Server | null = null;
let startPromise: Promise<void> | null = null;

export async function ensureDevApiServer(port = 5000): Promise<void> {
  if (activeServer) return;
  if (startPromise) return startPromise;

  startPromise = (async () => {
    const alreadyRunning = await isPortListening(port, '127.0.0.1');
    if (alreadyRunning) {
      return;
    }

    const app = createApiApp();
    await new Promise<void>((resolve) => {
      const server = http.createServer(app);
      server.once('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
          resolve();
          return;
        }
        console.warn('[dev-api] Warning starting local API fallback:', err.message);
        resolve();
      });

      server.listen(port, '127.0.0.1', () => {
        activeServer = server;
        console.log(`[dev-api] TrampoTaxa local API listening on http://127.0.0.1:${port}`);
        resolve();
      });
    });
  })();

  return startPromise;
}

export function closeDevApiServer(): void {
  if (activeServer) {
    activeServer.close();
    activeServer = null;
    startPromise = null;
  }
}
