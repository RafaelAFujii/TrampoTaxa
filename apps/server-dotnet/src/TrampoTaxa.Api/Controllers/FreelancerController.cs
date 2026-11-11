using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrampoTaxa.Api.Data;
using TrampoTaxa.Api.DTOs;
using TrampoTaxa.Api.Models;

namespace TrampoTaxa.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FreelancerController : ControllerBase
{
    private readonly AppDbContext _db;
    public const int MAX_CONCURRENT_APPLICATIONS = 3;
    public const string MASTER_QR_CODE = "QR_MESTRE_123";

    public FreelancerController(AppDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// PILLAR 1: Overbooking Control (Max 3 concurrent active applications)
    /// </summary>
    [HttpPost("apply")]
    public async Task<IActionResult> Apply([FromBody] ApplyGigRequest request)
    {
        var freelancer = await _db.Users.FindAsync(request.FreelancerId);
        if (freelancer == null || freelancer.Role != UserRole.Freelancer)
        {
            return BadRequest(new { message = "Freelancer inválido." });
        }

        var gig = await _db.Gigs.FindAsync(request.GigId);
        if (gig == null)
        {
            return NotFound(new { message = "Vaga não encontrada." });
        }

        if (gig.Status != GigStatus.Open)
        {
            return BadRequest(new { message = "Esta vaga não está mais aberta para candidaturas." });
        }

        // Check if already applied to this gig
        var existing = await _db.GigApplications
            .FirstOrDefaultAsync(a => a.GigId == request.GigId && a.FreelancerId == request.FreelancerId && (a.Status == ApplicationStatus.Applied || a.Status == ApplicationStatus.Approved));

        if (existing != null)
        {
            return BadRequest(new { message = "Você já está candidatado ou aprovado para esta vaga." });
        }

        // Count active applications
        var activeCount = await _db.GigApplications
            .CountAsync(a => a.FreelancerId == request.FreelancerId && (a.Status == ApplicationStatus.Applied || a.Status == ApplicationStatus.Approved));

        if (activeCount >= MAX_CONCURRENT_APPLICATIONS)
        {
            return BadRequest(new
            {
                message = $"Limite de overbooking atingido! Você já possui {activeCount} candidaturas ativas. O limite máximo permitido são {MAX_CONCURRENT_APPLICATIONS}.",
                currentActiveApplications = activeCount,
                maxAllowed = MAX_CONCURRENT_APPLICATIONS
            });
        }

        var application = new GigApplication
        {
            GigId = request.GigId,
            FreelancerId = request.FreelancerId,
            Status = ApplicationStatus.Applied,
            AppliedAt = DateTime.UtcNow
        };

        _db.GigApplications.Add(application);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = "Candidatura registrada com sucesso no TrampoTaxa!",
            applicationId = application.Id,
            activeCount = activeCount + 1,
            slotsRemaining = MAX_CONCURRENT_APPLICATIONS - (activeCount + 1)
        });
    }

    /// <summary>
    /// PILLAR 2: Master QR Code Validation (Physical Presence Check-In)
    /// </summary>
    [HttpPost("checkin")]
    public async Task<IActionResult> CheckIn([FromBody] CheckInRequest request)
    {
        var gig = await _db.Gigs.FindAsync(request.GigId);
        if (gig == null)
        {
            return NotFound(new { message = "Vaga não encontrada." });
        }

        // Validate QR Code string against Master Secret
        if (request.QrCodeData?.Trim() != MASTER_QR_CODE && request.QrCodeData?.Trim() != gig.MasterQrCodeSecret)
        {
            return BadRequest(new
            {
                message = "QR Code inválido! É obrigatório escanear o QR Code Mestre físico presente no estabelecimento para efetuar o check-in.",
                expectedCodeHint = "QR_MESTRE_123"
            });
        }

        // Verify approved application
        var application = await _db.GigApplications
            .FirstOrDefaultAsync(a => a.GigId == request.GigId && a.FreelancerId == request.FreelancerId && a.Status == ApplicationStatus.Approved);

        if (application == null)
        {
            return BadRequest(new { message = "Você precisa estar formalmente aprovado pelo contratante nesta vaga para realizar o check-in." });
        }

        var shift = await _db.Shifts
            .FirstOrDefaultAsync(s => s.GigId == request.GigId && s.FreelancerId == request.FreelancerId);

        if (shift == null)
        {
            shift = new Shift
            {
                GigId = request.GigId,
                FreelancerId = request.FreelancerId,
                TotalAmount = gig.EstimatedTotal
            };
            _db.Shifts.Add(shift);
        }

        shift.CheckInTime = DateTime.UtcNow;
        shift.Phase = ShiftPhase.CheckedIn;
        gig.Status = GigStatus.InProgress;

        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = "Check-in realizado com sucesso via QR Code Mestre! Turno iniciado.",
            shiftId = shift.Id,
            phase = shift.Phase.ToString(),
            checkInTime = shift.CheckInTime
        });
    }

    /// <summary>
    /// PILLAR 3: Request Checkout & Trigger 2-Hour Auto-Checkout Contestation Window
    /// </summary>
    [HttpPost("request-checkout")]
    public async Task<IActionResult> RequestCheckout([FromBody] RequestCheckoutRequest request)
    {
        var shift = await _db.Shifts
            .Include(s => s.Gig)
            .FirstOrDefaultAsync(s => s.Id == request.ShiftId);

        if (shift == null)
        {
            return NotFound(new { message = "Turno não encontrado." });
        }

        if (shift.Phase != ShiftPhase.CheckedIn)
        {
            return BadRequest(new { message = $"Status inválido para checkout. Fase atual: {shift.Phase}" });
        }

        var now = DateTime.UtcNow;
        shift.CheckOutRequestedTime = now;
        shift.ContestationDeadline = now.AddHours(2); // 2-hour window
        shift.Phase = ShiftPhase.ReviewPending;

        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = "Solicitação de checkout enviada! Janela de contestação de 2 horas aberta para o contratante.",
            shiftId = shift.Id,
            phase = shift.Phase.ToString(),
            checkOutRequestedTime = shift.CheckOutRequestedTime,
            contestationDeadline = shift.ContestationDeadline,
            autoApproveInHours = 2
        });
    }

    /// <summary>
    /// Get Freelancer Dashboard stats & active flow status
    /// </summary>
    [HttpGet("my-status")]
    public async Task<IActionResult> GetMyStatus([FromQuery] Guid freelancerId)
    {
        var applications = await _db.GigApplications
            .Include(a => a.Gig)
                .ThenInclude(g => g!.Venue)
            .Where(a => a.FreelancerId == freelancerId)
            .OrderByDescending(a => a.AppliedAt)
            .ToListAsync();

        var shifts = await _db.Shifts
            .Include(s => s.Gig)
                .ThenInclude(g => g!.Venue)
            .Where(s => s.FreelancerId == freelancerId)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();

        var activeAppsCount = applications.Count(a => a.Status == ApplicationStatus.Applied || a.Status == ApplicationStatus.Approved);

        return Ok(new
        {
            freelancerId,
            activeApplicationsCount = activeAppsCount,
            maxAllowed = MAX_CONCURRENT_APPLICATIONS,
            availableSlots = Math.Max(0, MAX_CONCURRENT_APPLICATIONS - activeAppsCount),
            applications = applications.Select(a => new
            {
                a.Id,
                a.GigId,
                GigTitle = a.Gig?.Title,
                VenueName = a.Gig?.Venue?.Name,
                Status = a.Status.ToString(),
                a.AppliedAt,
                ShiftStart = a.Gig?.ShiftStart,
                HourlyRate = a.Gig?.HourlyRate,
                EstimatedTotal = a.Gig?.EstimatedTotal
            }),
            shifts = shifts.Select(s => new
            {
                s.Id,
                s.GigId,
                GigTitle = s.Gig?.Title,
                VenueName = s.Gig?.Venue?.Name,
                Phase = s.Phase.ToString(),
                s.CheckInTime,
                s.CheckOutRequestedTime,
                s.ContestationDeadline,
                s.TotalAmount,
                s.Rating
            })
        });
    }
}
