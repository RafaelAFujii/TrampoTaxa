using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrampoTaxa.Api.Data;
using TrampoTaxa.Api.DTOs;
using TrampoTaxa.Api.Models;

namespace TrampoTaxa.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContractorController : ControllerBase
{
    private readonly AppDbContext _db;

    public ContractorController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("gigs")]
    public async Task<IActionResult> CreateGig([FromBody] CreateGigRequest request)
    {
        var venue = await _db.Venues.FindAsync(request.VenueId);
        if (venue == null) return NotFound(new { message = "Estabelecimento não encontrado." });

        var gig = new Gig
        {
            VenueId = request.VenueId,
            Title = request.Title,
            RoleRequired = request.RoleRequired,
            Description = request.Description,
            HourlyRate = request.HourlyRate,
            EstimatedTotal = request.EstimatedTotal,
            ShiftStart = request.ShiftStart,
            ShiftEnd = request.ShiftEnd,
            Vacancies = request.Vacancies,
            Status = GigStatus.Open,
            MasterQrCodeSecret = "QR_MESTRE_123"
        };

        _db.Gigs.Add(gig);
        await _db.SaveChangesAsync();

        return Ok(gig);
    }

    /// <summary>
    /// Approve applicant: updates status to Approved, creates shift record,
    /// and automatically cancels competing active applications for that freelancer.
    /// </summary>
    [HttpPost("approve-applicant")]
    public async Task<IActionResult> ApproveApplicant([FromBody] ApproveApplicationRequest request)
    {
        var application = await _db.GigApplications
            .Include(a => a.Gig)
            .Include(a => a.Freelancer)
            .FirstOrDefaultAsync(a => a.Id == request.ApplicationId);

        if (application == null)
        {
            return NotFound(new { message = "Candidatura não encontrada." });
        }

        if (application.Status != ApplicationStatus.Applied)
        {
            return BadRequest(new { message = $"Candidatura não está pendente. Status atual: {application.Status}" });
        }

        application.Status = ApplicationStatus.Approved;
        application.StatusUpdatedAt = DateTime.UtcNow;

        // Auto-cancel competing pending applications of this freelancer in other open gigs
        var competingApps = await _db.GigApplications
            .Where(a => a.FreelancerId == application.FreelancerId && a.Id != application.Id && a.Status == ApplicationStatus.Applied)
            .ToListAsync();

        foreach (var comp in competingApps)
        {
            comp.Status = ApplicationStatus.Cancelled;
            comp.StatusUpdatedAt = DateTime.UtcNow;
        }

        // Create scheduled shift
        var existingShift = await _db.Shifts
            .FirstOrDefaultAsync(s => s.GigId == application.GigId && s.FreelancerId == application.FreelancerId);

        if (existingShift == null)
        {
            var shift = new Shift
            {
                GigId = application.GigId,
                FreelancerId = application.FreelancerId,
                TotalAmount = application.Gig?.EstimatedTotal ?? 0,
                Phase = ShiftPhase.Scheduled
            };
            _db.Shifts.Add(shift);
        }

        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = "Candidato aprovado com sucesso! Vaga garantida e candidaturas concorrentes canceladas automaticamente.",
            applicationId = application.Id,
            freelancerName = application.Freelancer?.Name,
            competingCancelledCount = competingApps.Count
        });
    }

    /// <summary>
    /// Contractor immediate approval of shift: advances phase to PixScheduled
    /// </summary>
    [HttpPost("approve-shift")]
    public async Task<IActionResult> ApproveShift([FromBody] ApproveShiftRequest request)
    {
        var shift = await _db.Shifts
            .Include(s => s.Freelancer)
            .Include(s => s.Gig)
            .FirstOrDefaultAsync(s => s.Id == request.ShiftId);

        if (shift == null) return NotFound(new { message = "Turno não encontrado." });

        shift.Phase = ShiftPhase.PixScheduled;
        shift.ApprovedAt = DateTime.UtcNow;
        shift.Rating = request.Rating ?? 5;
        shift.FeedbackComment = request.FeedbackComment ?? "Excelente atendimento, pontual e prestativo.";

        if (shift.Freelancer != null)
        {
            shift.Freelancer.CompletedGigsCount += 1;
            // recalculate rating
            var userRatings = await _db.Shifts
                .Where(s => s.FreelancerId == shift.FreelancerId && s.Rating.HasValue)
                .Select(s => s.Rating!.Value)
                .ToListAsync();

            userRatings.Add(shift.Rating.Value);
            shift.Freelancer.Rating = Math.Round((decimal)userRatings.Average(), 2);
        }

        if (shift.Gig != null)
        {
            shift.Gig.Status = GigStatus.Completed;
        }

        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = "Turno aprovado! Pagamento Pix agendado automaticamente.",
            shiftId = shift.Id,
            phase = shift.Phase.ToString(),
            pixScheduledTo = shift.Freelancer?.PixKey,
            amount = shift.TotalAmount,
            rating = shift.Rating
        });
    }

    /// <summary>
    /// Contractor contests shift within 2-hour window
    /// </summary>
    [HttpPost("contest-shift")]
    public async Task<IActionResult> ContestShift([FromBody] ContestShiftRequest request)
    {
        var shift = await _db.Shifts.FindAsync(request.ShiftId);
        if (shift == null) return NotFound(new { message = "Turno não encontrado." });

        shift.Phase = ShiftPhase.Contested;
        shift.ContestationReason = request.Reason;

        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = "Turno contestado. O caso foi encaminhado para a mediação da equipe TrampoTaxa.",
            shiftId = shift.Id,
            phase = shift.Phase.ToString(),
            reason = request.Reason
        });
    }

    /// <summary>
    /// Contractor dashboard: summary metrics and gigs
    /// </summary>
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard([FromQuery] Guid contractorId)
    {
        var venues = await _db.Venues
            .Include(v => v.Gigs)
                .ThenInclude(g => g.Applications)
                    .ThenInclude(a => a.Freelancer)
            .Include(v => v.Gigs)
                .ThenInclude(g => g.Shifts)
            .Where(v => v.OwnerId == contractorId)
            .ToListAsync();

        var allGigs = venues.SelectMany(v => v.Gigs).ToList();
        var allShifts = allGigs.SelectMany(g => g.Shifts).ToList();

        var totalInvested = allShifts
            .Where(s => s.Phase == ShiftPhase.Approved || s.Phase == ShiftPhase.PixScheduled)
            .Sum(s => s.TotalAmount);

        var activeGigsCount = allGigs.Count(g => g.Status == GigStatus.Open || g.Status == GigStatus.InProgress);
        var pendingReviewCount = allShifts.Count(s => s.Phase == ShiftPhase.ReviewPending);

        return Ok(new
        {
            contractorId,
            metrics = new
            {
                totalInvested,
                activeGigsCount,
                pendingReviewCount,
                totalVenues = venues.Count
            },
            venues = venues.Select(v => new
            {
                v.Id,
                v.Name,
                v.Neighborhood,
                gigs = v.Gigs.Select(g => new
                {
                    g.Id,
                    g.Title,
                    g.RoleRequired,
                    g.HourlyRate,
                    g.EstimatedTotal,
                    g.ShiftStart,
                    g.ShiftEnd,
                    Status = g.Status.ToString(),
                    applications = g.Applications.Select(a => new
                    {
                        a.Id,
                        FreelancerId = a.Freelancer?.Id,
                        FreelancerName = a.Freelancer?.Name,
                        FreelancerSpecialty = a.Freelancer?.Specialty,
                        FreelancerRating = a.Freelancer?.Rating,
                        Status = a.Status.ToString()
                    }),
                    shifts = g.Shifts.Select(s => new
                    {
                        s.Id,
                        s.FreelancerId,
                        Phase = s.Phase.ToString(),
                        s.CheckInTime,
                        s.CheckOutRequestedTime,
                        s.TotalAmount
                    })
                })
            })
        });
    }
}
