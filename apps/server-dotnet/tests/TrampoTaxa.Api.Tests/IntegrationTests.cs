using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TrampoTaxa.Api.Data;
using TrampoTaxa.Api.DTOs;
using TrampoTaxa.Api.Models;
using Xunit;

namespace TrampoTaxa.Api.Tests;

public class TrampoTaxaApiIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    private readonly WebApplicationFactory<Program> _factory;

    public TrampoTaxaApiIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task HealthEndpoint_ReturnsHealthyStatus()
    {
        var response = await _client.GetAsync("/");
        response.EnsureSuccessStatusCode();

        var body = await response.Content.ReadAsStringAsync();
        Assert.Contains("TrampoTaxa .NET 8 Backend API", body);
        Assert.Contains("PostgreSQL 15", body);
    }

    [Fact]
    public async Task ContractorAndFreelancer_CanLoginWithRealHashedPassword()
    {
        // 1. Contractor login
        var contractorLogin = new LoginRequest("gerencia@bistrobatel.com.br", "SenhaSegura123!");
        var contractorRes = await _client.PostAsJsonAsync("/api/auth/login", contractorLogin);
        contractorRes.EnsureSuccessStatusCode();

        var contractorAuth = await contractorRes.Content.ReadFromJsonAsync<AuthResponse>();
        Assert.NotNull(contractorAuth);
        Assert.NotEmpty(contractorAuth.Token);
        Assert.Equal("Contractor", contractorAuth.Role);
        Assert.Equal("Gerência Bistrô do Batel", contractorAuth.Name);

        // 2. Freelancer login
        var freelancerLogin = new LoginRequest("gabriel.silva@trampotaxa.com.br", "SenhaSegura123!");
        var freelancerRes = await _client.PostAsJsonAsync("/api/auth/login", freelancerLogin);
        freelancerRes.EnsureSuccessStatusCode();

        var freelancerAuth = await freelancerRes.Content.ReadFromJsonAsync<AuthResponse>();
        Assert.NotNull(freelancerAuth);
        Assert.NotEmpty(freelancerAuth.Token);
        Assert.Equal("Freelancer", freelancerAuth.Role);
        Assert.Equal("gabriel.silva@pix.trampotaxa.com.br", freelancerAuth.PixKey);
    }

    [Fact]
    public async Task Pillar1_OverbookingLimit_BlocksApplicationWhenExceedingThreeSlots()
    {
        // Create an isolated test freelancer with 3 pre-existing applications
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var testFreelancer = new User
        {
            Name = "Teste Overbooking",
            Email = $"overbooking_{Guid.NewGuid()}@trampotaxa.com.br",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("SenhaSegura123!"),
            Role = UserRole.Freelancer
        };
        db.Users.Add(testFreelancer);

        var venue = db.Venues.First();

        // Create 4 open gigs
        var gigs = new List<Gig>();
        for (int i = 0; i < 4; i++)
        {
            var g = new Gig
            {
                VenueId = venue.Id,
                Title = $"Gig Teste Overbooking {i}",
                RoleRequired = "Garçom",
                HourlyRate = 30,
                EstimatedTotal = 150,
                ShiftStart = DateTime.UtcNow.AddHours(2),
                ShiftEnd = DateTime.UtcNow.AddHours(6),
                Status = GigStatus.Open
            };
            db.Gigs.Add(g);
            gigs.Add(g);
        }
        await db.SaveChangesAsync();

        // Apply to 1st, 2nd, 3rd gig (should succeed)
        for (int i = 0; i < 3; i++)
        {
            var applyReq = new ApplyGigRequest(gigs[i].Id, testFreelancer.Id);
            var res = await _client.PostAsJsonAsync("/api/freelancer/apply", applyReq);
            Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        }

        // Apply to 4th gig (MUST BE BLOCKED by Pillar 1 rule)
        var blockedReq = new ApplyGigRequest(gigs[3].Id, testFreelancer.Id);
        var blockedRes = await _client.PostAsJsonAsync("/api/freelancer/apply", blockedReq);
        Assert.Equal(HttpStatusCode.BadRequest, blockedRes.StatusCode);

        var errContent = await blockedRes.Content.ReadAsStringAsync();
        Assert.Contains("Limite de overbooking atingido", errContent);
    }

    [Fact]
    public async Task Pillar2_CheckIn_RequiresValidMasterQrCode()
    {
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var freelancer = db.Users.First(u => u.Role == UserRole.Freelancer);
        var venue = db.Venues.First();

        var gig = new Gig
        {
            VenueId = venue.Id,
            Title = "Gig Check-in Master Test",
            RoleRequired = "Bartender",
            HourlyRate = 40,
            EstimatedTotal = 240,
            ShiftStart = DateTime.UtcNow.AddHours(1),
            ShiftEnd = DateTime.UtcNow.AddHours(6),
            Status = GigStatus.Open,
            MasterQrCodeSecret = "QR_MESTRE_123"
        };
        db.Gigs.Add(gig);

        var app = new GigApplication
        {
            GigId = gig.Id,
            FreelancerId = freelancer.Id,
            Status = ApplicationStatus.Approved
        };
        db.GigApplications.Add(app);
        await db.SaveChangesAsync();

        // 1. Try Invalid QR Code -> Must fail
        var invalidCheckIn = new CheckInRequest(gig.Id, freelancer.Id, "QR_FAKE_INVALIDO_999");
        var failRes = await _client.PostAsJsonAsync("/api/freelancer/checkin", invalidCheckIn);
        Assert.Equal(HttpStatusCode.BadRequest, failRes.StatusCode);
        var failMsg = await failRes.Content.ReadAsStringAsync();
        Assert.Contains("QR Code inválido", failMsg);

        // 2. Try Master QR Code -> Must succeed
        var validCheckIn = new CheckInRequest(gig.Id, freelancer.Id, "QR_MESTRE_123");
        var successRes = await _client.PostAsJsonAsync("/api/freelancer/checkin", validCheckIn);
        Assert.Equal(HttpStatusCode.OK, successRes.StatusCode);

        var okMsg = await successRes.Content.ReadAsStringAsync();
        Assert.Contains("Check-in realizado com sucesso", okMsg);
    }

    [Fact]
    public async Task Pillar3_Checkout_OpensTwoHourWindow_AndCanBeApprovedByContractor()
    {
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var freelancer = db.Users.First(u => u.Role == UserRole.Freelancer);
        var venue = db.Venues.First();

        var gig = new Gig
        {
            VenueId = venue.Id,
            Title = "Gig Auto Checkout Test",
            RoleRequired = "Hostess",
            HourlyRate = 35,
            EstimatedTotal = 210,
            ShiftStart = DateTime.UtcNow.AddHours(-6),
            ShiftEnd = DateTime.UtcNow,
            Status = GigStatus.InProgress
        };
        db.Gigs.Add(gig);

        var shift = new Shift
        {
            GigId = gig.Id,
            FreelancerId = freelancer.Id,
            CheckInTime = DateTime.UtcNow.AddHours(-6),
            Phase = ShiftPhase.CheckedIn,
            TotalAmount = 210
        };
        db.Shifts.Add(shift);
        await db.SaveChangesAsync();

        // 1. Request Checkout -> Enters ReviewPending with 2-hour deadline
        var checkoutReq = new RequestCheckoutRequest(shift.Id);
        var checkoutRes = await _client.PostAsJsonAsync("/api/freelancer/request-checkout", checkoutReq);
        Assert.Equal(HttpStatusCode.OK, checkoutRes.StatusCode);

        // Refresh shift
        using (var verifyScope = _factory.Services.CreateScope())
        {
            var verifyDb = verifyScope.ServiceProvider.GetRequiredService<AppDbContext>();
            var updatedShift = await verifyDb.Shifts.FindAsync(shift.Id);
            Assert.NotNull(updatedShift);
            Assert.Equal(ShiftPhase.ReviewPending, updatedShift.Phase);
            Assert.NotNull(updatedShift.ContestationDeadline);
            // Verify deadline is roughly 2 hours from checkout
            Assert.True(updatedShift.ContestationDeadline > DateTime.UtcNow.AddMinutes(110));
        }

        // 2. Contractor Approves Shift with 5-star rating -> Advances to PixScheduled
        var approveReq = new ApproveShiftRequest(shift.Id, 5, "Atendimento exemplar no Bistrô");
        var approveRes = await _client.PostAsJsonAsync("/api/contractor/approve-shift", approveReq);
        Assert.Equal(HttpStatusCode.OK, approveRes.StatusCode);

        var approveMsg = await approveRes.Content.ReadAsStringAsync();
        Assert.Contains("Pix agendado automaticamente", approveMsg);
    }
}
