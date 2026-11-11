using BCrypt.Net;
using TrampoTaxa.Api.Models;

namespace TrampoTaxa.Api.Data;

public static class DbInitializer
{
    public static void Seed(AppDbContext context)
    {
        context.Database.EnsureCreated();

        if (context.Users.Any())
        {
            return; // Already seeded
        }

        var defaultPasswordHash = BCrypt.Net.BCrypt.HashPassword("SenhaSegura123!");

        // Real Contractor (Owner of Batel Venue)
        var contractorUser = new User
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            Name = "Gerência Bistrô do Batel",
            Email = "gerencia@bistrobatel.com.br",
            PasswordHash = defaultPasswordHash,
            Role = UserRole.Contractor,
            Document = "12.345.678/0001-90",
            Phone = "(41) 99876-5432",
            Rating = 4.9m,
            CompletedGigsCount = 42,
            CreatedAt = DateTime.UtcNow.AddMonths(-3)
        };

        // Real Freelancers
        var freelancer1 = new User
        {
            Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
            Name = "Gabriel Silva",
            Email = "gabriel.silva@trampotaxa.com.br",
            PasswordHash = defaultPasswordHash,
            Role = UserRole.Freelancer,
            Document = "123.456.789-00",
            Phone = "(41) 98765-4321",
            PixKey = "gabriel.silva@pix.trampotaxa.com.br",
            Specialty = "Bartender & Mixologia",
            Rating = 4.95m,
            CompletedGigsCount = 28,
            CreatedAt = DateTime.UtcNow.AddMonths(-2)
        };

        var freelancer2 = new User
        {
            Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
            Name = "Mariana Souza",
            Email = "mariana.souza@trampotaxa.com.br",
            PasswordHash = defaultPasswordHash,
            Role = UserRole.Freelancer,
            Document = "987.654.321-99",
            Phone = "(41) 99123-4567",
            PixKey = "mariana.souza@pix.trampotaxa.com.br",
            Specialty = "Hostess & Atendimento VIP",
            Rating = 4.88m,
            CompletedGigsCount = 19,
            CreatedAt = DateTime.UtcNow.AddMonths(-1)
        };

        var freelancer3 = new User
        {
            Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
            Name = "Lucas Oliveira",
            Email = "lucas.oliveira@trampotaxa.com.br",
            PasswordHash = defaultPasswordHash,
            Role = UserRole.Freelancer,
            Document = "456.789.123-11",
            Phone = "(41) 99234-5678",
            PixKey = "lucas.oliveira@pix.trampotaxa.com.br",
            Specialty = "Garçom & Salão",
            Rating = 4.80m,
            CompletedGigsCount = 14,
            CreatedAt = DateTime.UtcNow.AddMonths(-1)
        };

        context.Users.AddRange(contractorUser, freelancer1, freelancer2, freelancer3);

        // Venues in Curitiba
        var venue1 = new Venue
        {
            Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
            OwnerId = contractorUser.Id,
            Name = "Bistrô do Batel",
            TradeName = "Bistrô Batel Alta Gastronomia",
            Cnpj = "12.345.678/0001-90",
            Address = "Av. do Batel, 1550",
            Neighborhood = "Batel",
            City = "Curitiba",
            State = "PR",
            Latitude = -25.4411,
            Longitude = -49.2831,
            CreatedAt = DateTime.UtcNow.AddMonths(-3)
        };

        var venue2 = new Venue
        {
            Id = Guid.Parse("66666666-6666-6666-6666-666666666666"),
            OwnerId = contractorUser.Id,
            Name = "Rooftop 360 Batel",
            TradeName = "Rooftop Bar e Lounge",
            Cnpj = "12.345.678/0002-71",
            Address = "Rua Bispo Dom José, 2200",
            Neighborhood = "Seminário / Batel Soho",
            City = "Curitiba",
            State = "PR",
            Latitude = -25.4475,
            Longitude = -49.2965,
            CreatedAt = DateTime.UtcNow.AddMonths(-2)
        };

        context.Venues.AddRange(venue1, venue2);

        // Gigs
        var gig1 = new Gig
        {
            Id = Guid.Parse("77777777-7777-7777-7777-777777777777"),
            VenueId = venue1.Id,
            Title = "Bartender Chefe - Sexta Black Tie",
            RoleRequired = "Bartender",
            Description = "Atendimento a coquetelaria clássica e autoral em evento fechado para 120 convidados. Taxa com Pix agendado logo após checkout.",
            HourlyRate = 45.0m,
            EstimatedTotal = 270.0m,
            ShiftStart = DateTime.UtcNow.AddHours(2),
            ShiftEnd = DateTime.UtcNow.AddHours(8),
            Vacancies = 1,
            Status = GigStatus.Open,
            MasterQrCodeSecret = "QR_MESTRE_123",
            CreatedAt = DateTime.UtcNow.AddDays(-1)
        };

        var gig2 = new Gig
        {
            Id = Guid.Parse("88888888-8888-8888-8888-888888888888"),
            VenueId = venue1.Id,
            Title = "Hostess de Recepção e RSVP",
            RoleRequired = "Hostess",
            Description = "Recepção de convidados vips, conferência de nomes e acomodação nas mesas no salão nobre.",
            HourlyRate = 35.0m,
            EstimatedTotal = 210.0m,
            ShiftStart = DateTime.UtcNow.AddHours(3),
            ShiftEnd = DateTime.UtcNow.AddHours(9),
            Vacancies = 1,
            Status = GigStatus.Open,
            MasterQrCodeSecret = "QR_MESTRE_123",
            CreatedAt = DateTime.UtcNow.AddDays(-1)
        };

        var gig3 = new Gig
        {
            Id = Guid.Parse("99999999-9999-9999-9999-999999999999"),
            VenueId = venue2.Id,
            Title = "Garçom Volante para Lounge Rooftop",
            RoleRequired = "Garçom",
            Description = "Serviço volante de finger foods e espumantes em terraço panorâmico. Traje all black.",
            HourlyRate = 30.0m,
            EstimatedTotal = 180.0m,
            ShiftStart = DateTime.UtcNow.AddHours(4),
            ShiftEnd = DateTime.UtcNow.AddHours(10),
            Vacancies = 2,
            Status = GigStatus.Open,
            MasterQrCodeSecret = "QR_MESTRE_123",
            CreatedAt = DateTime.UtcNow.AddDays(-1)
        };

        context.Gigs.AddRange(gig1, gig2, gig3);

        // Pre-create 1 active application for freelancer1 to test overbooking slots (1 of 3 used)
        var existingApp = new GigApplication
        {
            Id = Guid.NewGuid(),
            GigId = gig2.Id,
            FreelancerId = freelancer1.Id,
            Status = ApplicationStatus.Applied,
            AppliedAt = DateTime.UtcNow.AddHours(-1)
        };
        context.GigApplications.Add(existingApp);

        context.SaveChanges();
    }
}
