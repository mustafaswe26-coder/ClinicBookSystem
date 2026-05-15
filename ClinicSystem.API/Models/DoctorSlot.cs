namespace ClinicSystem.API.Models
{
    public class DoctorSlot
    {
        public int Id { get; set; }

        public int DoctorId { get; set; }

        public DateTime StartTime { get; set; }

        public bool IsBooked { get; set; } = false;

        public bool IsAvailable { get; set; } = true;

        public Doctor? Doctor { get; set; }
    }
}