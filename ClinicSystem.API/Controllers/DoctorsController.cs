using ClinicSystem.API.Data;
using ClinicSystem.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinicSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DoctorsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDoctors(
            string? specialization,
            int page = 1,
            int pageSize = 6)
        {
            var query = _context.Doctors
                .Include(d => d.User)
                .AsQueryable();

            if (!string.IsNullOrEmpty(specialization))
            {
                query = query.Where(d =>

                    d.Specialization.ToLower()
                        .Contains(
                            specialization.ToLower()
                        )

                    ||

                    d.User.FullName.ToLower()
                        .Contains(
                            specialization.ToLower()
                        )

                );
            }

            var totalCount = await query.CountAsync();

            var doctors = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,

                Data = doctors.Select(d => new
                {
                    d.Id,

                    d.Specialization,

                    d.Fees,

                    d.Phone,

                    User = new
                    {
                        d.User.Id,
                        d.User.FullName,
                        d.User.Email,
                        d.User.Role
                    }
                })
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDoctorById(
            int id)
        {
            var doctor = await _context.Doctors
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (doctor == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                doctor.Id,
                doctor.Specialization,
                doctor.Fees,

                User = new
                {
                    doctor.User.Id,
                    doctor.User.FullName,
                    doctor.User.Email,
                    doctor.User.Role
                }
            });
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddDoctor(
            Doctor doctor)
        {
            _context.Doctors.Add(doctor);

            await _context.SaveChangesAsync();

            return Ok(doctor);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var doctor = await _context.Doctors
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (doctor == null)
            {
                return NotFound("Doctor not found");
            }

            var appointments = await _context.Appointments
                .Where(a => a.DoctorId == id)
                .ToListAsync();

            _context.Appointments.RemoveRange(appointments);

            _context.Doctors.Remove(doctor);

            _context.Users.Remove(doctor.User);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Doctor deleted successfully"
            });
        }
    }
}