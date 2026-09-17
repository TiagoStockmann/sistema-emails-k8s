using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace sistemaDeEmails.Models;

[Table("emails")]
[Index("Email1", Name = "emails_email_key", IsUnique = true)]
public partial class Email
{
    [Key]
    [Column("email_id")]
    public long EmailId { get; set; }

    [Column("cliente_id")]
    public long ClienteId { get; set; }

    [Column("nome")]
    [StringLength(150)]
    public string Nome { get; set; } = null!;

    [Column("email")]
    [StringLength(255)]
    public string Email1 { get; set; } = null!;

    [ForeignKey("ClienteId")]
    [InverseProperty("Emails")]
    public virtual Cliente Cliente { get; set; } = null!;
}
