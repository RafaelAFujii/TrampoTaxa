import sql from 'mssql';
import {
  UserEntity,
  VenueEntity,
  GigEntity,
  GigApplicantEntity,
  ChatMessageEntity,
  ReviewEntity,
} from './schema';

/**
 * Configuração da Conexão com Microsoft SQL Server
 */
export const mssqlConfig: sql.config = {
  user: process.env.MSSQL_USER || 'sa',
  password: process.env.MSSQL_PASSWORD || 'YourStrong(!)Password123',
  server: process.env.MSSQL_HOST || 'localhost',
  port: Number(process.env.MSSQL_PORT) || 1433,
  database: process.env.MSSQL_DATABASE || 'trampotaxa',
  options: {
    encrypt: process.env.MSSQL_ENCRYPT === 'true',
    trustServerCertificate: process.env.MSSQL_TRUST_SERVER_CERTIFICATE !== 'false',
    connectTimeout: 4000,
  },
};

/**
 * Repositório em Memória (Fallback para Ambiente de Desenvolvimento/Testes sem Docker MSSQL ativo)
 */
class InMemoryDatabase {
  users = new Map<string, UserEntity>();
  venues = new Map<string, VenueEntity>();
  gigs = new Map<string, GigEntity>();
  applicants = new Map<string, GigApplicantEntity>();
  messages = new Map<string, ChatMessageEntity>();
  reviews = new Map<string, ReviewEntity>();

  clear() {
    this.users.clear();
    this.venues.clear();
    this.gigs.clear();
    this.applicants.clear();
    this.messages.clear();
    this.reviews.clear();
  }
}

export const inMemoryDb = new InMemoryDatabase();

let pool: sql.ConnectionPool | null = null;
let isConnectedToMssql = false;

/**
 * Inicialização do Pool de Conexão com Microsoft SQL Server
 */
export async function getDbConnection(): Promise<{
  pool: sql.ConnectionPool | null;
  isLive: boolean;
}> {
  if (pool && isConnectedToMssql) {
    return { pool, isLive: true };
  }

  try {
    pool = new sql.ConnectionPool(mssqlConfig);
    await pool.connect();
    isConnectedToMssql = true;
    return { pool, isLive: true };
  } catch (error) {
    // Fallback gracioso para testes e desenvolvimento offline
    isConnectedToMssql = false;
    return { pool: null, isLive: false };
  }
}

/**
 * Interface Unificada de Operações de Banco de Dados
 */
export const db = {
  get isLiveMssql() {
    return isConnectedToMssql;
  },

  // Usuários
  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const { pool, isLive } = await getDbConnection();
    if (isLive && pool) {
      const result = await pool
        .request()
        .input('email', sql.NVarChar, email)
        .query('SELECT * FROM users WHERE email = @email');
      return result.recordset[0] || null;
    }
    for (const u of inMemoryDb.users.values()) {
      if (u.email.toLowerCase() === email.toLowerCase()) return u;
    }
    return null;
  },

  async findUserById(id: string): Promise<UserEntity | null> {
    const { pool, isLive } = await getDbConnection();
    if (isLive && pool) {
      const result = await pool
        .request()
        .input('id', sql.NVarChar, id)
        .query('SELECT * FROM users WHERE id = @id');
      return result.recordset[0] || null;
    }
    return inMemoryDb.users.get(id) || null;
  },

  async upsertUser(user: UserEntity): Promise<UserEntity> {
    inMemoryDb.users.set(user.id, user);
    const { pool, isLive } = await getDbConnection();
    if (isLive && pool) {
      await pool
        .request()
        .input('id', sql.NVarChar, user.id)
        .input('name', sql.NVarChar, user.name)
        .input('email', sql.NVarChar, user.email)
        .input('password_hash', sql.NVarChar, user.passwordHash || '')
        .input('role', sql.NVarChar, user.role)
        .input('avatar_url', sql.NVarChar, user.avatarUrl || null)
        .input('phone', sql.NVarChar, user.phone || null)
        .input('document', sql.NVarChar, user.document || null)
        .input('bio', sql.NVarChar, user.bio || null)
        .input('pix_key', sql.NVarChar, user.pixKey || null)
        .input('profession', sql.NVarChar, user.profession || null)
        .input('rating', sql.Decimal(3, 2), user.rating || 5.0)
        .input('total_gigs_completed', sql.Int, user.totalGigsCompleted || 0)
        .input('punctuality_rate', sql.NVarChar, user.punctualityRate || '100%')
        .query(`
          MERGE users AS target
          USING (SELECT @id AS id) AS source ON target.id = source.id
          WHEN MATCHED THEN UPDATE SET
            name = @name, email = @email, role = @role, avatar_url = @avatar_url,
            phone = @phone, document = @document, bio = @bio, pix_key = @pix_key,
            profession = @profession, rating = @rating, total_gigs_completed = @total_gigs_completed,
            punctuality_rate = @punctuality_rate, updated_at = SYSDATETIME()
          WHEN NOT MATCHED THEN INSERT (
            id, name, email, password_hash, role, avatar_url, phone, document, bio,
            pix_key, profession, rating, total_gigs_completed, punctuality_rate
          ) VALUES (
            @id, @name, @email, @password_hash, @role, @avatar_url, @phone, @document,
            @bio, @pix_key, @profession, @rating, @total_gigs_completed, @punctuality_rate
          );
        `);
    }
    return user;
  },

  // Locais / Venues
  async upsertVenue(venue: VenueEntity): Promise<VenueEntity> {
    inMemoryDb.venues.set(venue.id, venue);
    const { pool, isLive } = await getDbConnection();
    if (isLive && pool) {
      await pool
        .request()
        .input('id', sql.NVarChar, venue.id)
        .input('name', sql.NVarChar, venue.name)
        .input('neighborhood', sql.NVarChar, venue.neighborhood)
        .input('address', sql.NVarChar, venue.address)
        .input('lat', sql.Decimal(10, 7), venue.lat)
        .input('lng', sql.Decimal(10, 7), venue.lng)
        .input('rating', sql.Decimal(3, 2), venue.rating)
        .query(`
          MERGE venues AS target
          USING (SELECT @id AS id) AS source ON target.id = source.id
          WHEN MATCHED THEN UPDATE SET name = @name, neighborhood = @neighborhood, address = @address, lat = @lat, lng = @lng, rating = @rating
          WHEN NOT MATCHED THEN INSERT (id, name, neighborhood, address, lat, lng, rating) VALUES (@id, @name, @neighborhood, @address, @lat, @lng, @rating);
        `);
    }
    return venue;
  },

  async listVenues(): Promise<VenueEntity[]> {
    const { pool, isLive } = await getDbConnection();
    if (isLive && pool) {
      const result = await pool.request().query('SELECT * FROM venues');
      return result.recordset;
    }
    return Array.from(inMemoryDb.venues.values());
  },

  // Vagas / Gigs
  async listGigs(filters?: {
    profession?: string;
    neighborhood?: string;
    status?: string;
  }): Promise<GigEntity[]> {
    const { pool, isLive } = await getDbConnection();
    if (isLive && pool) {
      let query = 'SELECT * FROM gigs WHERE 1=1';
      const req = pool.request();
      if (filters?.profession && filters.profession !== 'All') {
        query += ' AND role = @role';
        req.input('role', sql.NVarChar, filters.profession);
      }
      if (filters?.neighborhood) {
        query += ' AND venue_id IN (SELECT id FROM venues WHERE neighborhood LIKE @neighborhood)';
        req.input('neighborhood', sql.NVarChar, `%${filters.neighborhood}%`);
      }
      if (filters?.status) {
        query += ' AND status = @status';
        req.input('status', sql.NVarChar, filters.status);
      }
      const result = await req.query(query);
      return result.recordset;
    }

    let items = Array.from(inMemoryDb.gigs.values());
    if (filters?.profession && filters.profession !== 'All') {
      items = items.filter((g) => g.role === filters.profession);
    }
    if (filters?.status) {
      items = items.filter((g) => g.status === filters.status);
    }
    return items;
  },

  async findGigById(id: string): Promise<GigEntity | null> {
    const { pool, isLive } = await getDbConnection();
    if (isLive && pool) {
      const result = await pool
        .request()
        .input('id', sql.NVarChar, id)
        .query('SELECT * FROM gigs WHERE id = @id');
      return result.recordset[0] || null;
    }
    return inMemoryDb.gigs.get(id) || null;
  },

  async upsertGig(gig: GigEntity): Promise<GigEntity> {
    inMemoryDb.gigs.set(gig.id, gig);
    const { pool, isLive } = await getDbConnection();
    if (isLive && pool) {
      await pool
        .request()
        .input('id', sql.NVarChar, gig.id)
        .input('venue_id', sql.NVarChar, gig.venueId)
        .input('contractor_id', sql.NVarChar, gig.contractorId)
        .input('title', sql.NVarChar, gig.title)
        .input('role', sql.NVarChar, gig.role)
        .input('category', sql.NVarChar, gig.category)
        .input('shift_date', sql.NVarChar, gig.shiftDate)
        .input('date_formatted', sql.NVarChar, gig.dateFormatted)
        .input('start_time', sql.NVarChar, gig.startTime)
        .input('end_time', sql.NVarChar, gig.endTime)
        .input('rate', sql.Decimal(10, 2), gig.rate)
        .input('rate_formatted', sql.NVarChar, gig.rateFormatted)
        .input('shift_duration', sql.NVarChar, gig.shiftDuration)
        .input('vacancies', sql.Int, gig.vacancies)
        .input('status', sql.NVarChar, gig.status)
        .input('dress_code', sql.NVarChar, gig.dressCode)
        .input('rules_and_notes', sql.NVarChar, gig.rulesAndNotes)
        .input('qr_code_secret', sql.NVarChar, gig.qrCodeSecret)
        .input('approved_freelancer_id', sql.NVarChar, gig.approvedFreelancerId || null)
        .input('check_in_timestamp', sql.BigInt, gig.checkInTimestamp || null)
        .input('check_out_timestamp', sql.BigInt, gig.checkOutTimestamp || null)
        .input('auto_checkout_deadline', sql.BigInt, gig.autoCheckoutDeadline || null)
        .input('shift_phase', sql.NVarChar, gig.shiftPhase || null)
        .input('dispute_reason', sql.NVarChar, gig.disputeReason || null)
        .input('active', sql.Bit, gig.active ? 1 : 0)
        .query(`
          MERGE gigs AS target
          USING (SELECT @id AS id) AS source ON target.id = source.id
          WHEN MATCHED THEN UPDATE SET
            venue_id = @venue_id, title = @title, role = @role, category = @category,
            shift_date = @shift_date, date_formatted = @date_formatted, start_time = @start_time,
            end_time = @end_time, rate = @rate, rate_formatted = @rate_formatted,
            shift_duration = @shift_duration, vacancies = @vacancies, status = @status,
            dress_code = @dress_code, rules_and_notes = @rules_and_notes, qr_code_secret = @qr_code_secret,
            approved_freelancer_id = @approved_freelancer_id, check_in_timestamp = @check_in_timestamp,
            check_out_timestamp = @check_out_timestamp, auto_checkout_deadline = @auto_checkout_deadline,
            shift_phase = @shift_phase, dispute_reason = @dispute_reason, active = @active
          WHEN NOT MATCHED THEN INSERT (
            id, venue_id, contractor_id, title, role, category, shift_date, date_formatted,
            start_time, end_time, rate, rate_formatted, shift_duration, vacancies, status,
            dress_code, rules_and_notes, qr_code_secret, approved_freelancer_id, check_in_timestamp,
            check_out_timestamp, auto_checkout_deadline, shift_phase, dispute_reason, active
          ) VALUES (
            @id, @venue_id, @contractor_id, @title, @role, @category, @shift_date, @date_formatted,
            @start_time, @end_time, @rate, @rate_formatted, @shift_duration, @vacancies, @status,
            @dress_code, @rules_and_notes, @qr_code_secret, @approved_freelancer_id, @check_in_timestamp,
            @check_out_timestamp, @auto_checkout_deadline, @shift_phase, @dispute_reason, @active
          );
        `);
    }
    return gig;
  },

  // Candidaturas e Overbooking
  async findApplicantsByGigId(gigId: string): Promise<GigApplicantEntity[]> {
    const { pool, isLive } = await getDbConnection();
    if (isLive && pool) {
      const result = await pool
        .request()
        .input('gig_id', sql.NVarChar, gigId)
        .query('SELECT * FROM gig_applicants WHERE gig_id = @gig_id');
      return result.recordset;
    }
    return Array.from(inMemoryDb.applicants.values()).filter((a) => a.gigId === gigId);
  },

  async countActiveApplicationsForFreelancer(freelancerId: string): Promise<number> {
    const { pool, isLive } = await getDbConnection();
    if (isLive && pool) {
      const result = await pool
        .request()
        .input('freelancer_id', sql.NVarChar, freelancerId)
        .query(
          "SELECT COUNT(*) as total FROM gig_applicants WHERE freelancer_id = @freelancer_id AND status IN ('Pendente', 'candidatado')"
        );
      return result.recordset[0]?.total || 0;
    }
    return Array.from(inMemoryDb.applicants.values()).filter(
      (a) =>
        a.freelancerId === freelancerId &&
        (a.status === 'Pendente' || a.status === 'candidatado')
    ).length;
  },

  async upsertApplicant(applicant: GigApplicantEntity): Promise<GigApplicantEntity> {
    inMemoryDb.applicants.set(applicant.id, applicant);
    const { pool, isLive } = await getDbConnection();
    if (isLive && pool) {
      await pool
        .request()
        .input('id', sql.NVarChar, applicant.id)
        .input('gig_id', sql.NVarChar, applicant.gigId)
        .input('freelancer_id', sql.NVarChar, applicant.freelancerId)
        .input('status', sql.NVarChar, applicant.status)
        .input('is_overbooking', sql.Bit, applicant.isOverbooking ? 1 : 0)
        .input('overbooking_slots', sql.Int, applicant.overbookingSlots || 1)
        .query(`
          MERGE gig_applicants AS target
          USING (SELECT @id AS id) AS source ON target.id = source.id
          WHEN MATCHED THEN UPDATE SET status = @status, is_overbooking = @is_overbooking, overbooking_slots = @overbooking_slots
          WHEN NOT MATCHED THEN INSERT (id, gig_id, freelancer_id, status, is_overbooking, overbooking_slots) VALUES (@id, @gig_id, @freelancer_id, @status, @is_overbooking, @overbooking_slots);
        `);
    }
    return applicant;
  },

  async cancelConcurrentApplicationsForFreelancer(
    freelancerId: string,
    exceptGigId: string
  ): Promise<void> {
    for (const [id, a] of inMemoryDb.applicants.entries()) {
      if (
        a.freelancerId === freelancerId &&
        a.gigId !== exceptGigId &&
        (a.status === 'Pendente' || a.status === 'candidatado')
      ) {
        inMemoryDb.applicants.set(id, { ...a, status: 'cancelado' });
      }
    }
    const { pool, isLive } = await getDbConnection();
    if (isLive && pool) {
      await pool
        .request()
        .input('freelancer_id', sql.NVarChar, freelancerId)
        .input('except_gig_id', sql.NVarChar, exceptGigId)
        .query(`
          UPDATE gig_applicants
          SET status = 'cancelado'
          WHERE freelancer_id = @freelancer_id AND gig_id <> @except_gig_id AND status IN ('Pendente', 'candidatado')
        `);
    }
  },

  // Mensagens de Chat
  async listMessagesByGigId(gigId: string): Promise<ChatMessageEntity[]> {
    const { pool, isLive } = await getDbConnection();
    if (isLive && pool) {
      const result = await pool
        .request()
        .input('gig_id', sql.NVarChar, gigId)
        .query('SELECT * FROM chat_messages WHERE gig_id = @gig_id ORDER BY timestamp ASC');
      return result.recordset;
    }
    return Array.from(inMemoryDb.messages.values())
      .filter((m) => m.gigId === gigId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  async insertChatMessage(message: ChatMessageEntity): Promise<ChatMessageEntity> {
    inMemoryDb.messages.set(message.id, message);
    const { pool, isLive } = await getDbConnection();
    if (isLive && pool) {
      await pool
        .request()
        .input('id', sql.NVarChar, message.id)
        .input('gig_id', sql.NVarChar, message.gigId)
        .input('sender_id', sql.NVarChar, message.senderId)
        .input('sender_name', sql.NVarChar, message.senderName)
        .input('sender_role', sql.NVarChar, message.senderRole)
        .input('text', sql.NVarChar, message.text)
        .input('is_read', sql.Bit, message.isRead ? 1 : 0)
        .query(`
          INSERT INTO chat_messages (id, gig_id, sender_id, sender_name, sender_role, text, is_read)
          VALUES (@id, @gig_id, @sender_id, @sender_name, @sender_role, @text, @is_read)
        `);
    }
    return message;
  },

  // Avaliações
  async insertReview(review: ReviewEntity): Promise<ReviewEntity> {
    inMemoryDb.reviews.set(review.id, review);
    const { pool, isLive } = await getDbConnection();
    if (isLive && pool) {
      await pool
        .request()
        .input('id', sql.NVarChar, review.id)
        .input('gig_id', sql.NVarChar, review.gigId)
        .input('reviewer_id', sql.NVarChar, review.reviewerId)
        .input('target_id', sql.NVarChar, review.targetId)
        .input('stars', sql.Int, review.stars)
        .input('feedback', sql.NVarChar, review.feedback || null)
        .input('tags', sql.NVarChar, JSON.stringify(review.tags || []))
        .query(`
          INSERT INTO reviews (id, gig_id, reviewer_id, target_id, stars, feedback, tags)
          VALUES (@id, @gig_id, @reviewer_id, @target_id, @stars, @feedback, @tags)
        `);
    }
    return review;
  },
};
