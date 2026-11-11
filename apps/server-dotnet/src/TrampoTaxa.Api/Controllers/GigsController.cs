using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrampoTaxa.Api.Data;
using TrampoTaxa.Api.DTOs;
using TrampoTaxa.Api.Models;

namespace TrampoTaxa.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GigsController : ControllerBase
{
    private readonly AppDbContext _db;

    public GigsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetGigs([FromQuery] string? role, [FromQuery] string? neighborhood)
    {
        var query = _db.Gigs
            .Include(g => g.Venue)
            .Include(g => g.Applications)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(role))
        {
            query = query.Where(g => g.RoleRequired.ToLower().Contains(role.ToLower()) || g.Title.ToLower().Contains(role.ToLower()));
        }

        if (!string.IsNullOrWhiteSpace(neighborhood))
        {
            query = query.Where(g => g.Venue != null && g.Venue.Neighborhood.ToLower().Contains(neighborhood.ToLower()));
        }

        var gigs = await query
            .OrderBy(g => g.ShiftStart)
            .Select(g => new
            {
                g.Id,
                g.Title,
                g.RoleRequired,
                g.Description,
                g.HourlyRate,
                g.EstimatedTotal,
                g.ShiftStart,
                g.ShiftEnd,
                g.Vacancies,
                g.Status,
                Venue = g.Venue == null ? null : new
                {
                    g.Venue.Id,
                    g.Venue.Name,
                    g.Venue.Address,
                    g.Venue.Neighborhood,
                    g.Venue.City,
                    g.Venue.Latitude,
                    g.Venue.Longitude
                },
                ApplicationsCount = g.Applications.Count(a => a.Status == ApplicationStatus.Applied || a.Status == ApplicationStatus.Approved)
            })
            .ToListAsync();

        return Ok(gigs);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetGigById(Guid id)
    {
        var gig = await _db.Gigs
            .Include(g => g.Venue)
            .Include(g => g.Applications)
                .ThenInclude(a => a.Freelancer)
            .Include(g => g.Shifts)
            .FirstOrDefaultAsync(g => g.Id == id);

        if (gig == null) return NotFound(new { message = "Vaga não encontrada." });

        return Ok(gig);
    }
}
