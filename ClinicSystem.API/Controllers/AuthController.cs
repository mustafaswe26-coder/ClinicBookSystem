using ClinicSystem.API.Data;
using ClinicSystem.API.DTOs;
using ClinicSystem.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace ClinicSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(
            ApplicationDbContext context,
            IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var userExists = await _context.Users
                .AnyAsync(u => u.Email == dto.Email);

            if (userExists)
            {
                return BadRequest("Email already exists");
            }

            if (dto.Role == "Doctor")
            {
                return BadRequest(
                    "Doctors can only be added by admin");
            }

            var user = new User
            {
                FullName = dto.FullName,

                Email = dto.Email,

                PasswordHash =
                    BCrypt.Net.BCrypt.HashPassword(
                        dto.Password),

                Role = dto.Role
            };

            _context.Users.Add(user);

            await _context.SaveChangesAsync();

            if (user.Role == "Patient")
            {
                var patient = new Patient
                {
                    UserId = user.Id,

                    Phone = dto.Phone
                };

                _context.Patients.Add(patient);

                await _context.SaveChangesAsync();
            }

            return Ok("User registered successfully");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(
                    u => u.Email == dto.Email);

            if (user == null)
            {
                return Unauthorized(
                    "Invalid email or password");
            }

            var isPasswordValid =
                BCrypt.Net.BCrypt.Verify(
                    dto.Password,
                    user.PasswordHash);

            if (!isPasswordValid)
            {
                return Unauthorized(
                    "Invalid email or password");
            }

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                token = token,

                userId = user.Id,

                fullName = user.FullName,

                role = user.Role
            });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult>
        GetCurrentUser()
        {
            var userId = User.FindFirstValue(
                ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(
                    u => u.Id == int.Parse(userId));

            if (user == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                user.Id,

                user.FullName,

                user.Email,

                user.Role,

               Phone =

_context.Patients
.FirstOrDefault(
    p => p.UserId == user.Id
) != null

?

_context.Patients
.FirstOrDefault(
    p => p.UserId == user.Id
)!.Phone

:

_context.Doctors
.FirstOrDefault(
    d => d.UserId == user.Id
) != null

?

_context.Doctors
.FirstOrDefault(
    d => d.UserId == user.Id
)!.Phone

:

null
            });
        }

        [Authorize]
        [HttpPut("update-profile")]
        public async Task<IActionResult>
        UpdateProfile(UpdateProfileDto dto)
        {
            var userId = User.FindFirstValue(
                ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(
                    u => u.Id == int.Parse(userId));

            if (user == null)
            {
                return NotFound();
            }

            user.FullName = dto.FullName;

            var patient = await _context.Patients
                .FirstOrDefaultAsync(
                    p => p.UserId == user.Id);

            if (patient != null)
            {
                patient.Phone = dto.Phone;
            }

            var doctor = await _context.Doctors
                .FirstOrDefaultAsync(
                    d => d.UserId == user.Id);

            if (doctor != null)
            {
                doctor.Phone = dto.Phone;
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Profile Updated"
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("all-users")]
        public async Task<IActionResult>
        GetAllUsers()
        {
            var users = await _context.Users
                .ToListAsync();

            var result = users.Select(u => new
            {
                u.Id,

                u.FullName,

                u.Email,

                u.Role,

                Phone =

                _context.Patients
                .FirstOrDefault(
                    p => p.UserId == u.Id
                ) != null

                ?

                _context.Patients
                .FirstOrDefault(
                    p => p.UserId == u.Id
                )!.Phone

                :

                _context.Doctors
                .FirstOrDefault(
                    d => d.UserId == u.Id
                ) != null

                ?

                _context.Doctors
                .FirstOrDefault(
                    d => d.UserId == u.Id
                )!.Phone

                :

                null
            });

            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("delete-user/{id}")]
        public async Task<IActionResult>
        DeleteUser(int id)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(
                    u => u.Id == id);

            if (user == null)
            {
                return NotFound(
                    "User not found");
            }

            var patient = await _context.Patients
                .FirstOrDefaultAsync(
                    p => p.UserId == id);

            if (patient != null)
            {
                var appointments =
                    await _context.Appointments

                    .Where(a =>
                        a.PatientId == patient.Id)

                    .ToListAsync();

                _context.Appointments
                    .RemoveRange(appointments);

                _context.Patients
                    .Remove(patient);
            }

            _context.Users.Remove(user);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message =
                "User deleted successfully"
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("add-doctor")]
        public async Task<IActionResult>
        AddDoctor(RegisterDto dto)
        {
            var userExists = await _context.Users
                .AnyAsync(u => u.Email == dto.Email);

            if (userExists)
            {
                return BadRequest(
                    "Email already exists");
            }

            var user = new User
            {
                FullName = dto.FullName,

                Email = dto.Email,

                PasswordHash =
                    BCrypt.Net.BCrypt.HashPassword(
                        dto.Password),

                Role = "Doctor"
            };

            _context.Users.Add(user);

            await _context.SaveChangesAsync();

            var doctor = new Doctor
            {
                UserId = user.Id,

                Specialization =
                    dto.Specialization,

                Fees = dto.Fees ?? 0,

                Phone = dto.Phone
            };

            _context.Doctors.Add(doctor);

            await _context.SaveChangesAsync();

            for (int day = 0; day < 7; day++)
            {
                var currentDate =
                    DateTime.Today.AddDays(day);

                for (int hour = 0; hour < 24; hour++)
                {
                    var slotTime =
                        currentDate.AddHours(hour);

                    _context.DoctorSlots.Add(
                        new DoctorSlot
                        {
                            DoctorId = doctor.Id,

                            StartTime = slotTime,

                            IsBooked = false,

                            IsAvailable = true
                        });
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message =
                "Doctor added successfully"
            });
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(
                    JwtRegisteredClaimNames.Sub,
                    user.Id.ToString()),

                new Claim(
                    JwtRegisteredClaimNames.Email,
                    user.Email),

                new Claim(
                    ClaimTypes.NameIdentifier,
                    user.Id.ToString()),

                new Claim(
                    ClaimTypes.Role,
                    user.Role)
            };

            var key =
                new SymmetricSecurityKey(

                    Encoding.UTF8.GetBytes(
                        _configuration["Jwt:Key"]));

            var creds =
                new SigningCredentials(
                    key,
                    SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer:
                    _configuration["Jwt:Issuer"],

                audience:
                    _configuration["Jwt:Audience"],

                claims: claims,

                expires:
                    DateTime.UtcNow.AddDays(7),

                signingCredentials: creds);

            return new JwtSecurityTokenHandler()
                .WriteToken(token);
        }
    }
}