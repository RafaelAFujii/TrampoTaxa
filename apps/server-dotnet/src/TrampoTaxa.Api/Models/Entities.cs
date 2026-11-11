namespace TrampoTaxa.Api.Models;

public enum UserRole
{
    Freelancer = 0,
    Contractor = 1,
    Admin = 2
}

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public string? Document { get; set; } // CPF or CNPJ
    public string? Phone { get; set; }
    public string? PixKey { get; set; }
    public string? Specialty { get; set; } // e.g. Bartender, Garçom, Cozinheiro
    public decimal Rating { get; set; } = 5.0m;
    public int CompletedGigsCount { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Venue> Venues { get; set; } = new List<Venue>();
    public ICollection<GigApplication> Applications { get; set; } = new List<GigApplication>();
}

public class Venue
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid OwnerId { get; set; }
    public User? Owner { get; set; }
    public string Name { get; set; } = string.Empty;
    public string TradeName { get; set; } = string.Empty;
    public string Cnpj { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Neighborhood { get; set; } = string.Empty; // e.g. Batel, Centro
    public string City { get; set; } = "Curitiba";
    public string State { get; set; } = "PR";
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Gig> Gigs { get; set; } = new List<Gig>();
}

public enum GigStatus
{
    Open = 0,
    Filled = 1,
    InProgress = 2,
    Completed = 3,
    Cancelled = 4
}

public class Gig
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid VenueId { get; set; }
    public Venue? Venue { get; set; }
    public string Title { get; set; } = string.Empty;
    public string RoleRequired { get; set; } = string.Empty; // Bartender, Garçom, etc.
    public string Description { get; set; } = string.Empty;
    public decimal HourlyRate { get; set; }
    public decimal EstimatedTotal { get; set; }
    public DateTime ShiftStart { get; set; }
    public DateTime ShiftEnd { get; set; }
    public int Vacancies { get; set; } = 1;
    public GigStatus Status { get; set; } = GigStatus.Open;
    public string MasterQrCodeSecret { get; set; } = "QR_MESTRE_123";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<GigApplication> Applications { get; set; } = new List<GigApplication>();
    public ICollection<Shift> Shifts { get; set; } = new List<Shift>();
}

public enum ApplicationStatus
{
    Applied = 0,
    Approved = 1,
    Cancelled = 2,
    Rejected = 3,
    Completed = 4
}

public class GigApplication
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid GigId { get; set; }
    public Gig? Gig { get; set; }
    public Guid FreelancerId { get; set; }
    public User? Freelancer { get; set; }
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Applied;
    public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
    public DateTime? StatusUpdatedAt { get; set; }
}

public enum ShiftPhase
{
    Scheduled = 0,
    CheckedIn = 1,
    ReviewPending = 2, // Auto-checkout 2-hour contestation window
    Approved = 3,
    Contested = 4,
    PixScheduled = 5
}

public class Shift
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid GigId { get; set; }
    public Gig? Gig { get; set; }
    public Guid FreelancerId { get; set; }
    public User? Freelancer { get; set; }
    public DateTime? CheckInTime { get; set; }
    public DateTime? CheckOutRequestedTime { get; set; }
    public DateTime? ContestationDeadline { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public ShiftPhase Phase { get; set; } = ShiftPhase.Scheduled;
    public decimal TotalAmount { get; set; }
    public string? ContestationReason { get; set; }
    public int? Rating { get; set; }
    public string? FeedbackComment { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class ChatMessage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid GigId { get; set; }
    public Guid SenderId { get; set; }
    public string SenderName { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
