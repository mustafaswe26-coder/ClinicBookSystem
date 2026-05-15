using ClinicSystem.API.Data;

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1",
        new Microsoft.OpenApi.Models.OpenApiInfo
        {
            Title = "Clinic System API",
            Version = "v1"
        });

    options.AddSecurityDefinition("Bearer",
        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            In = Microsoft.OpenApi.Models.ParameterLocation.Header,
            Description = "Enter JWT Token"
        });

    options.AddSecurityRequirement(
        new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
        {
            {
                new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Reference =
                        new Microsoft.OpenApi.Models.OpenApiReference
                        {
                            Type =
                                Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                },
                Array.Empty<string>()
            }
        });
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;

        options.SaveToken = true;

        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,

                ValidateAudience = true,

                ValidateLifetime = true,

                ValidateIssuerSigningKey = true,

                ValidIssuer =
                    builder.Configuration["Jwt:Issuer"],

                ValidAudience =
                    builder.Configuration["Jwt:Audience"],

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            builder.Configuration["Jwt:Key"]!
                        )
                    ),

                ClockSkew = TimeSpan.Zero
            };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var context =
        scope.ServiceProvider
        .GetRequiredService<ApplicationDbContext>();

    var doctors =
        context.Doctors.ToList();

    foreach (var doctor in doctors)
    {
        var lastSlot =
            context.DoctorSlots

            .Where(s =>
                s.DoctorId == doctor.Id)

            .OrderByDescending(s =>
                s.StartTime)

            .FirstOrDefault();

        DateTime startDate;

        if (lastSlot == null)
        {
            startDate = DateTime.Today;
        }
        else
        {
            startDate =
                lastSlot.StartTime
                .Date
                .AddDays(1);
        }

        var daysAhead =
            context.DoctorSlots

            .Where(s =>
                s.DoctorId == doctor.Id &&
                s.StartTime >= DateTime.Today)

            .Select(s =>
                s.StartTime.Date)

            .Distinct()

            .Count();

        int missingDays =
            7 - daysAhead;

        if (missingDays > 0)
        {
            for (int day = 0; day < missingDays; day++)
            {
                var currentDate =
                    startDate.AddDays(day);

                for (int hour = 0; hour < 24; hour++)
                {
                    var slotTime =
                        currentDate.AddHours(hour);

                    var slotExists =
                        context.DoctorSlots
                        .Any(s =>

                            s.DoctorId == doctor.Id &&

                            s.StartTime == slotTime
                        );

                    if (!slotExists)
                    {
                        context.DoctorSlots.Add(
                            new ClinicSystem.API.Models.DoctorSlot
                            {
                                DoctorId = doctor.Id,

                                StartTime = slotTime,

                                IsBooked = false,

                                IsAvailable = true
                            });
                    }
                }
            }
        }
    }

    context.SaveChanges();
}

app.UseSwagger();

app.UseSwaggerUI();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();