using ClinicSystem.API.Data;
using ClinicSystem.API.DTOs;
using ClinicSystem.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinicSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorSlotsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DoctorSlotsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Admin,Doctor")]
        [HttpPost]
        public async Task<IActionResult> AddSlot(
            CreateDoctorSlotDto dto)
        {
            var doctorExists = await _context.Doctors
                .AnyAsync(d => d.Id == dto.DoctorId);

            if (!doctorExists)
            {
                return BadRequest("Doctor not found");
            }

            var slotExists = await _context.DoctorSlots
                .AnyAsync(s =>
                    s.DoctorId == dto.DoctorId &&
                    s.StartTime == dto.StartTime);

            if (slotExists)
            {
                return BadRequest(
                    "Slot already exists");
            }

            var slot = new DoctorSlot
            {
                DoctorId = dto.DoctorId,
                StartTime = dto.StartTime
            };

            _context.DoctorSlots.Add(slot);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                slot.Id,
                slot.DoctorId,
                slot.StartTime,
                slot.IsBooked
            });
        }

        [HttpGet("available/{doctorId}")]
        public async Task<IActionResult> GetAvailableSlots(
            int doctorId)
        {
            var slots = await _context.DoctorSlots
                .Where(s =>

    s.DoctorId == doctorId &&

    !s.IsBooked &&

    s.IsAvailable &&

    s.StartTime > DateTime.Now
)
                .OrderBy(s => s.StartTime)
                .ToListAsync();

            return Ok(
                slots.Select(slot => new
                {
                    slot.Id,
                    slot.DoctorId,
                    slot.StartTime,
                    slot.IsBooked
                }));
        }

        [Authorize(Roles = "Admin")]
[HttpPatch("{id}/disable")]
public async Task<IActionResult>
DisableSlot(int id)
{
    var slot = await _context.DoctorSlots
        .FirstOrDefaultAsync(
            s => s.Id == id);

    if (slot == null)
    {
        return NotFound(
            "Slot not found");
    }

    slot.IsAvailable = false;

    await _context.SaveChangesAsync();

    return Ok(new
    {
        message = "Slot disabled"
    });
}

[Authorize(Roles = "Admin")]
[HttpPatch("{id}/enable")]
public async Task<IActionResult>
EnableSlot(int id)
{
    var slot = await _context.DoctorSlots
        .FirstOrDefaultAsync(
            s => s.Id == id);

    if (slot == null)
    {
        return NotFound(
            "Slot not found");
    }

    slot.IsAvailable = true;

    await _context.SaveChangesAsync();

    return Ok(new
    {
        message = "Slot enabled"
    });
}

[Authorize(Roles = "Admin")]
[HttpGet("doctor/{doctorId}")]
public async Task<IActionResult>
GetDoctorSlots(
int doctorId)
{
    var slots = await _context.DoctorSlots

        .Where(s =>
            s.DoctorId == doctorId)

        .OrderBy(s => s.StartTime)

        .Select(slot => new
        {
            slot.Id,

            slot.StartTime,

            slot.IsBooked,

            slot.IsAvailable
        })

        .ToListAsync();

    return Ok(slots);
}

    }
}