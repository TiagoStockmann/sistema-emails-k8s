using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace sistemaDeEmails.Models;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Cliente> Clientes { get; set; }

    public virtual DbSet<Email> Emails { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            var cs = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
                     ?? "Host=localhost;Port=5432;Database=postgres;Username=postgres;Password=postgres;Ssl Mode=Disable";
            optionsBuilder.UseNpgsql(cs);
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.ClienteId).HasName("cliente_pkey");

            entity.Property(e => e.ClienteId).UseIdentityAlwaysColumn();
        });

        modelBuilder.Entity<Email>(entity =>
        {
            entity.HasKey(e => e.EmailId).HasName("emails_pkey");

            entity.Property(e => e.EmailId).UseIdentityAlwaysColumn();

            entity.HasOne(d => d.Cliente).WithMany(p => p.Emails).HasConstraintName("fk_emails_cliente");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
