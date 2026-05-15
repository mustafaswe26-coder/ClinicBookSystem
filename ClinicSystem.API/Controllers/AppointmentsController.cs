using ClinicSystem.API.Data;
using ClinicSystem.API.DTOs;
using ClinicSystem.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ClinicSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AppointmentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Patient")]
        [HttpPost]
        public async Task<IActionResult> CreateAppointment(
            CreateAppointmentDto dto)
        {
            var doctorExists = await _context.Doctors
                .AnyAsync(d => d.Id == dto.DoctorId);

            if (!doctorExists)
            {
                return BadRequest("Doctor not found");
            }

            var patientExists = await _context.Patients
                .AnyAsync(p => p.Id == dto.PatientId);

            if (!patientExists)
            {
                return BadRequest("Patient not found");
            }

            var isBooked = await _context.Appointments
                .AnyAsync(a =>
                    a.DoctorId == dto.DoctorId &&
                    a.AppointmentDate == dto.AppointmentDate);

            if (isBooked)
            {
                return BadRequest(
                    "This appointment is already booked");
            }

            var appointment = new Appointment
            {
                DoctorId = dto.DoctorId,
                PatientId = dto.PatientId,
                AppointmentDate = dto.AppointmentDate,
                Status = "Confirmed"
            };

            _context.Appointments.Add(appointment);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                appointment.Id,
                appointment.DoctorId,
                appointment.PatientId,
                appointment.AppointmentDate,
                appointment.Status
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult>
        GetAppointments()
        {
            var appointments =
                await _context.Appointments

                .Include(a => a.Doctor)
                .ThenInclude(d => d.User)

                .Include(a => a.Patient)
                .ThenInclude(p => p.User)

                .OrderByDescending(a => a.AppointmentDate)

                .ToListAsync();

            return Ok(

                appointments.Select(a => new
                {
                    a.Id,

                    Doctor = new
                    {
                        a.Doctor.Id,

                        FullName =
                            a.Doctor.User.FullName
                    },

                    Patient = new
                    {
                        a.Patient.Id,

                        FullName =
                            a.Patient.User.FullName
                    },

                    a.AppointmentDate,

                    a.Status
                })
            );
        }

        [HttpPost("book-slot")]
        public async Task<IActionResult> BookSlot(
            BookSlotDto dto)
        {
            var slot = await _context.DoctorSlots
                .FirstOrDefaultAsync(s => s.Id == dto.SlotId);

            if (slot == null)
            {
                return BadRequest("Slot not found");
            }

            if (slot.IsBooked)
            {
                return BadRequest("Slot already booked");
            }

            var patientExists = await _context.Patients
                .AnyAsync(p => p.Id == dto.PatientId);

            if (!patientExists)
            {
                return BadRequest("Patient not found");
            }

            var appointment = new Appointment
            {
                DoctorId = slot.DoctorId,
                PatientId = dto.PatientId,
                AppointmentDate = slot.StartTime,
                Status = "Confirmed"
            };

            slot.IsBooked = true;

            _context.Appointments.Add(appointment);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                appointment.Id,
                appointment.DoctorId,
                appointment.PatientId,
                appointment.AppointmentDate,
                appointment.Status
            });
        }

        [Authorize(Roles = "Patient")]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyAppointments()
        {
            var userIdClaim =
                User.FindFirst(
                    ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var userId =
                int.Parse(userIdClaim.Value);

            var patient = await _context.Patients
                .FirstOrDefaultAsync(
                    p => p.UserId == userId);

            if (patient == null)
            {
                return BadRequest(
                    "Patient profile not found");
            }

            var appointments =
                await _context.Appointments

                .Include(a => a.Doctor)
                .ThenInclude(d => d.User)

                .Where(a =>
                    a.PatientId == patient.Id)

                .OrderByDescending(a => a.AppointmentDate)

                .ToListAsync();

            return Ok(appointments);
        }

        [Authorize(Roles = "Doctor")]
        [HttpGet("doctor-appointments")]
        public async Task<IActionResult>
        GetDoctorAppointments()
        {
            var userId =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier);

            if (!int.TryParse(userId, out int id))
{
    return Unauthorized();
}

var doctor = await _context.Doctors
    .FirstOrDefaultAsync(
        d => d.UserId == id);

            if (doctor == null)
            {
                return NotFound(
                    "Doctor not found");
            }

            var appointments =
                await _context.Appointments

                .Include(a => a.Patient)

                .ThenInclude(p => p.User)

                .Where(a =>
                    a.DoctorId ==
                    doctor.Id)

                .OrderByDescending(a => a.AppointmentDate)

                .ToListAsync();

            return Ok(

                appointments.Select(a => new
                {
                    patient =
                        a.Patient.User.FullName,

                    time =
                        a.AppointmentDate
                        .ToString("hh:mm tt"),

                    status =
                        a.Status
                })
            );
        }

        [Authorize(Roles = "Admin")]
[HttpPatch("{id}/status")]
public async Task<IActionResult>
UpdateAppointmentStatus(
int id,
UpdateAppointmentStatusDto dto)
{
    var appointment =
        await _context.Appointments
        .FirstOrDefaultAsync(
            a => a.Id == id);

    if (appointment == null)
    {
        return NotFound(
            "Appointment not found");
    }

    appointment.Status = dto.Status;

    await _context.SaveChangesAsync();

    return Ok(new
    {
        message = "Status updated"
    });
}

    }
}