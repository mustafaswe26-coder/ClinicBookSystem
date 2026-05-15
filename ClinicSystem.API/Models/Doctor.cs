namespace ClinicSystem.API.Models
{
    public class Doctor
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string Specialization { get; set; }
= string.Empty;

        public decimal Fees { get; set; }

        public User? User { get; set; }

        public string? Phone { get; set; }
    }
}