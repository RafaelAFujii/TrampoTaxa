import { z } from 'zod';

/**
 * =====================================================================
 * TRAMPOTAXA - MODELAGEM RELACIONAL MICROSOFT SQL SERVER
 * Mapeamento dos tipos de packages/shared para Schemas de Banco de Dados
 * =====================================================================
 */

// Definições de tipos SQL Server em T-SQL para DDL / Migrations
export const SQL_SERVER_DDL = `
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' and xtype='U')
CREATE TABLE users (
    id NVARCHAR(64) PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    email NVARCHAR(150) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) NOT NULL, -- 'Contratante' | 'Freelancer'
    avatar_url NVARCHAR(500) NULL,
    phone NVARCHAR(30) NULL,
    document NVARCHAR(30) NULL, -- CPF ou CNPJ
    bio NVARCHAR(500) NULL,
    pix_key NVARCHAR(100) NULL,
    profession NVARCHAR(100) NULL,
    rating DECIMAL(3, 2) DEFAULT 5.0,
    total_gigs_completed INT DEFAULT 0,
    punctuality_rate NVARCHAR(10) DEFAULT '100%',
    created_at DATETIME2 DEFAULT SYSDATETIME(),
    updated_at DATETIME2 DEFAULT SYSDATETIME()
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='venues' and xtype='U')
CREATE TABLE venues (
    id NVARCHAR(64) PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    neighborhood NVARCHAR(100) NOT NULL,
    address NVARCHAR(255) NOT NULL,
    lat DECIMAL(10, 7) NOT NULL,
    lng DECIMAL(10, 7) NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 4.8,
    created_at DATETIME2 DEFAULT SYSDATETIME()
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='gigs' and xtype='U')
CREATE TABLE gigs (
    id NVARCHAR(64) PRIMARY KEY,
    venue_id NVARCHAR(64) NOT NULL FOREIGN KEY REFERENCES venues(id),
    contractor_id NVARCHAR(64) NOT NULL FOREIGN KEY REFERENCES users(id),
    title NVARCHAR(150) NOT NULL,
    role NVARCHAR(80) NOT NULL,
    category NVARCHAR(80) NOT NULL, -- 'Turno Normal' | 'Cobertura de Emergência' | 'Evento Especial'
    shift_date NVARCHAR(50) NOT NULL,
    date_formatted NVARCHAR(100) NOT NULL,
    start_time NVARCHAR(20) NOT NULL,
    end_time NVARCHAR(20) NOT NULL,
    rate DECIMAL(10, 2) NOT NULL,
    rate_formatted NVARCHAR(50) NOT NULL,
    shift_duration NVARCHAR(50) NOT NULL,
    vacancies INT NOT NULL DEFAULT 1,
    status NVARCHAR(50) NOT NULL DEFAULT 'Aberta',
    dress_code NVARCHAR(500) NOT NULL,
    rules_and_notes NVARCHAR(1000) NOT NULL,
    qr_code_secret NVARCHAR(50) NOT NULL DEFAULT 'QR_MESTRE_123',
    approved_freelancer_id NVARCHAR(64) NULL FOREIGN KEY REFERENCES users(id),
    check_in_timestamp BIGINT NULL,
    check_out_timestamp BIGINT NULL,
    auto_checkout_deadline BIGINT NULL,
    shift_phase NVARCHAR(50) NULL, -- 'aguardando_checkin' | 'em_turno' | 'checkout_pendente' | 'pix_aprovado'
    dispute_reason NVARCHAR(500) NULL,
    active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 DEFAULT SYSDATETIME()
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='gig_applicants' and xtype='U')
CREATE TABLE gig_applicants (
    id NVARCHAR(64) PRIMARY KEY,
    gig_id NVARCHAR(64) NOT NULL FOREIGN KEY REFERENCES gigs(id),
    freelancer_id NVARCHAR(64) NOT NULL FOREIGN KEY REFERENCES users(id),
    status NVARCHAR(50) NOT NULL DEFAULT 'Pendente', -- 'Pendente' | 'Aprovado' | 'Recusado' | 'cancelado'
    is_overbooking BIT NOT NULL DEFAULT 0,
    overbooking_slots INT NOT NULL DEFAULT 1,
    applied_at DATETIME2 DEFAULT SYSDATETIME(),
    rating DECIMAL(3, 2) NULL,
    feedback NVARCHAR(1000) NULL,
    evaluated_at DATETIME2 NULL,
    evaluated_by NVARCHAR(64) NULL
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='chat_messages' and xtype='U')
CREATE TABLE chat_messages (
    id NVARCHAR(64) PRIMARY KEY,
    gig_id NVARCHAR(64) NOT NULL FOREIGN KEY REFERENCES gigs(id),
    sender_id NVARCHAR(64) NOT NULL FOREIGN KEY REFERENCES users(id),
    sender_name NVARCHAR(150) NOT NULL,
    sender_role NVARCHAR(50) NOT NULL,
    text NVARCHAR(1000) NOT NULL,
    timestamp DATETIME2 DEFAULT SYSDATETIME(),
    is_read BIT NOT NULL DEFAULT 0
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='reviews' and xtype='U')
CREATE TABLE reviews (
    id NVARCHAR(64) PRIMARY KEY,
    gig_id NVARCHAR(64) NOT NULL FOREIGN KEY REFERENCES gigs(id),
    reviewer_id NVARCHAR(64) NOT NULL FOREIGN KEY REFERENCES users(id),
    target_id NVARCHAR(64) NOT NULL,
    stars INT NOT NULL,
    feedback NVARCHAR(1000) NULL,
    tags NVARCHAR(500) NULL,
    created_at DATETIME2 DEFAULT SYSDATETIME()
);
`;

/**
 * Schemas de Validação Zod & Tipos TypeScript
 */

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  passwordHash: z.string().optional(),
  role: z.enum(['Contratante', 'Freelancer']),
  avatarUrl: z.string().optional(),
  phone: z.string().optional(),
  document: z.string().optional(),
  bio: z.string().optional(),
  pixKey: z.string().optional(),
  profession: z.string().optional(),
  rating: z.number().default(5.0),
  totalGigsCompleted: z.number().default(0),
  punctualityRate: z.string().default('100%'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type UserEntity = z.infer<typeof UserSchema>;

export const VenueSchema = z.object({
  id: z.string(),
  name: z.string(),
  neighborhood: z.string(),
  address: z.string(),
  lat: z.number(),
  lng: z.number(),
  rating: z.number().default(4.8),
  createdAt: z.string().optional(),
});
export type VenueEntity = z.infer<typeof VenueSchema>;

export const GigSchema = z.object({
  id: z.string(),
  venueId: z.string(),
  contractorId: z.string(),
  title: z.string(),
  role: z.string(),
  category: z.enum(['Turno Normal', 'Cobertura de Emergência', 'Evento Especial']),
  shiftDate: z.string(),
  dateFormatted: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  rate: z.number(),
  rateFormatted: z.string(),
  shiftDuration: z.string(),
  vacancies: z.number().default(1),
  status: z.enum(['Aberta', 'Aguardando Confirmação', 'Preenchida', 'Finalizada', 'Cancelada']),
  dressCode: z.string(),
  rulesAndNotes: z.string(),
  qrCodeSecret: z.string().default('QR_MESTRE_123'),
  approvedFreelancerId: z.string().nullable().optional(),
  checkInTimestamp: z.number().nullable().optional(),
  checkOutTimestamp: z.number().nullable().optional(),
  autoCheckoutDeadline: z.number().nullable().optional(),
  shiftPhase: z
    .enum(['aguardando_checkin', 'em_turno', 'checkout_pendente', 'pix_aprovado', 'contestado'])
    .nullable()
    .optional(),
  disputeReason: z.string().nullable().optional(),
  active: z.boolean().default(true),
  createdAt: z.string().optional(),
});
export type GigEntity = z.infer<typeof GigSchema>;

export const GigApplicantSchema = z.object({
  id: z.string(),
  gigId: z.string(),
  freelancerId: z.string(),
  status: z.enum(['Pendente', 'Aprovado', 'Recusado', 'candidatado', 'confirmado', 'cancelado']),
  isOverbooking: z.boolean().default(false),
  overbookingSlots: z.number().default(1),
  appliedAt: z.string().optional(),
  rating: z.number().nullable().optional(),
  feedback: z.string().nullable().optional(),
  evaluatedAt: z.string().nullable().optional(),
  evaluatedBy: z.string().nullable().optional(),
});
export type GigApplicantEntity = z.infer<typeof GigApplicantSchema>;

export const ChatMessageSchema = z.object({
  id: z.string(),
  gigId: z.string(),
  senderId: z.string(),
  senderName: z.string(),
  senderRole: z.enum(['Contratante', 'Freelancer']),
  text: z.string(),
  timestamp: z.string(),
  isRead: z.boolean().default(false),
});
export type ChatMessageEntity = z.infer<typeof ChatMessageSchema>;

export const ReviewSchema = z.object({
  id: z.string(),
  gigId: z.string(),
  reviewerId: z.string(),
  targetId: z.string(),
  stars: z.number().min(1).max(5),
  feedback: z.string().optional(),
  tags: z.array(z.string()).default([]),
  createdAt: z.string().optional(),
});
export type ReviewEntity = z.infer<typeof ReviewSchema>;
