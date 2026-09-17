    using Microsoft.EntityFrameworkCore;
    using sistemaDeEmails.Models;
    using sistemaDeEmails.Repositories;
    using sistemaDeEmails.Services;

    namespace sistemaDeEmails
    {
        public class Program
        {
            public static void Main(string[] args)
            {
                var builder = WebApplication.CreateBuilder(args);

                builder.Services.AddDbContext<AppDbContext>(options =>
                    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

                builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
                builder.Services.AddScoped<IClienteService, ClienteService>();
                builder.Services.AddScoped<IEmailRepository, EmailRepository>();
                builder.Services.AddScoped<IEmailService, EmailService>();

                builder.Services.AddCors(options =>
                {
                    options.AddPolicy("FrontendPolicy", policy =>
                    {
                        policy
                            .AllowAnyOrigin()
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    });
                });

                builder.Services.AddControllers();
                builder.Services.AddEndpointsApiExplorer();
                builder.Services.AddSwaggerGen();

                var app = builder.Build();

                app.UseSwagger();
                app.UseSwaggerUI();

                app.UseCors("FrontendPolicy");

                app.UseAuthorization();

                app.MapControllers();

                app.Run();
            }
        }
    }