namespace ClinicSystem.API.Models
{
    public class Patient
    {
        public int Id { get; set; }

        public int UserId { get; set; }

       public string Phone { get; set; }
= string.Empty;

        public User? User { get; set; }
    }
}