using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrampoTaxa.Api.Data;
using TrampoTaxa.Api.DTOs;
using TrampoTaxa.Api.Models;

namespace TrampoTaxa.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly AppDbContext _db;

    public ChatController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("{gigId}")]
    public async Task<IActionResult> GetMessages(Guid gigId)
    {
        var messages = await _db.ChatMessages
            .Where(c => c.GigId == gigId)
            .OrderBy(c => c.Timestamp)
            .ToListAsync();

        return Ok(messages);
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
    {
        var message = new ChatMessage
        {
            GigId = request.GigId,
            SenderId = request.SenderId,
            SenderName = request.SenderName,
            Message = request.Message,
            Timestamp = DateTime.UtcNow
        };

        _db.ChatMessages.Add(message);
        await _db.SaveChangesAsync();

        return Ok(message);
    }
}
