namespace ClinicSystem.API.DTOs
{
    public class CreateAppointmentDto
    {
        public int DoctorId { get; set; }

        public int PatientId { get; set; }

        public DateTime AppointmentDate { get; set; }
    }
}