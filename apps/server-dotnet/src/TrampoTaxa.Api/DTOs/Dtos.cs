namespace TrampoTaxa.Api.DTOs;

public record RegisterRequest(
    string Name,
    string Email,
    string Password,
    string Role, // "Freelancer" or "Contractor"
    string? Document,
    string? Phone,
    string? PixKey,
    string? Specialty,
    // Estabelecimento (quando Role == "Contractor")
    string? VenueName,
    string? Address,
    string? Neighborhood,
    string? City,
    string? State,
    double? Latitude,
    double? Longitude
);

public record LoginRequest(
    string Email,
    string Password
);

public record AuthResponse(
    string Token,
    Guid UserId,
    string Name,
    string Email,
    string Role,
    string? PixKey,
    string? Specialty,
    decimal Rating,
    Guid? VenueId,
    string? VenueName,
    string? VenueAddress,
    string? VenueNeighborhood
);

public record ApplyGigRequest(
    Guid GigId,
    Guid FreelancerId
);

public record CheckInRequest(
    Guid GigId,
    Guid FreelancerId,
    string QrCodeData
);

public record RequestCheckoutRequest(
    Guid ShiftId
);

public record ApproveShiftRequest(
    Guid ShiftId,
    int? Rating,
    string? FeedbackComment
);

public record ContestShiftRequest(
    Guid ShiftId,
    string Reason
);

public record ApproveApplicationRequest(
    Guid ApplicationId
);

public record CreateGigRequest(
    Guid VenueId,
    string Title,
    string RoleRequired,
    string Description,
    decimal HourlyRate,
    decimal EstimatedTotal,
    DateTime ShiftStart,
    DateTime ShiftEnd,
    int Vacancies
);

public record SendMessageRequest(
    Guid GigId,
    Guid SenderId,
    string SenderName,
    string Message
);
