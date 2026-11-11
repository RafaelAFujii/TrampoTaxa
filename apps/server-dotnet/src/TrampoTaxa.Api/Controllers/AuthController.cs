using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrampoTaxa.Api.Data;
using TrampoTaxa.Api.DTOs;
using TrampoTaxa.Api.Models;
using TrampoTaxa.Api.Services;

namespace TrampoTaxa.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ITokenService _tokenService;

    public AuthController(AppDbContext db, ITokenService tokenService)
    {
        _db = db;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (await _db.Users.AnyAsync(u => u.Email.ToLower() == request.Email.ToLower()))
        {
            return BadRequest(new { message = "Email já cadastrado na plataforma." });
        }

        if (!Enum.TryParse<UserRole>(request.Role, true, out var role))
        {
            return BadRequest(new { message = "Papel inválido. Escolha 'Freelancer' ou 'Contractor'." });
        }

        var user = new User
        {
            Name = request.Name,
            Email = request.Email.Trim().ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = role,
            Document = request.Document,
            Phone = request.Phone,
            PixKey = request.PixKey,
            Specialty = request.Specialty,
            Rating = 5.0m
        };

        _db.Users.Add(user);

        Venue? venue = null;
        if (role == UserRole.Contractor)
        {
            venue = new Venue
            {
                OwnerId = user.Id,
                Owner = user,
                Name = !string.IsNullOrWhiteSpace(request.VenueName) ? request.VenueName : user.Name,
                TradeName = !string.IsNullOrWhiteSpace(request.VenueName) ? request.VenueName : user.Name,
                Cnpj = request.Document ?? string.Empty,
                Address = !string.IsNullOrWhiteSpace(request.Address) ? request.Address : "Av. do Batel, 1550",
                Neighborhood = !string.IsNullOrWhiteSpace(request.Neighborhood) ? request.Neighborhood : "Batel",
                City = !string.IsNullOrWhiteSpace(request.City) ? request.City : "Curitiba",
                State = !string.IsNullOrWhiteSpace(request.State) ? request.State : "PR",
                Latitude = request.Latitude ?? -25.4411,
                Longitude = request.Longitude ?? -49.2831
            };
            _db.Venues.Add(venue);
        }

        await _db.SaveChangesAsync();

        var token = _tokenService.GenerateToken(user);
        return Ok(new AuthResponse(
            token,
            user.Id,
            user.Name,
            user.Email,
            user.Role.ToString(),
            user.PixKey,
            user.Specialty,
            user.Rating,
            venue?.Id,
            venue?.Name,
            venue?.Address,
            venue?.Neighborhood
        ));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _db.Users
            .Include(u => u.Venues)
            .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.Trim().ToLower());

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Email ou senha incorretos." });
        }

        var token = _tokenService.GenerateToken(user);
        var primaryVenue = user.Venues.FirstOrDefault();

        return Ok(new AuthResponse(
            token,
            user.Id,
            user.Name,
            user.Email,
            user.Role.ToString(),
            user.PixKey,
            user.Specialty,
            user.Rating,
            primaryVenue?.Id,
            primaryVenue?.Name,
            primaryVenue?.Address,
            primaryVenue?.Neighborhood
        ));
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetProfile([FromQuery] Guid userId)
    {
        var user = await _db.Users
            .Include(u => u.Venues)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return NotFound(new { message = "Usuário não encontrado." });

        var primaryVenue = user.Venues.FirstOrDefault();

        return Ok(new
        {
            user.Id,
            user.Name,
            user.Email,
            Role = user.Role.ToString(),
            user.Document,
            user.Phone,
            user.PixKey,
            user.Specialty,
            user.Rating,
            user.CompletedGigsCount,
            Venue = primaryVenue == null ? null : new
            {
                primaryVenue.Id,
                primaryVenue.Name,
                primaryVenue.Address,
                primaryVenue.Neighborhood,
                primaryVenue.City,
                primaryVenue.Latitude,
                primaryVenue.Longitude
            }
        });
    }
}
