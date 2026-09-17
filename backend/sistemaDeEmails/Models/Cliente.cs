using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace sistemaDeEmails.Models;

[Table("cliente")]
public partial class Cliente
{
    [Key]
    [Column("cliente_id")]
    public long ClienteId { get; set; }

    [Column("nome")]
    [StringLength(150)]
    public string Nome { get; set; } = null!;

    [InverseProperty("Cliente")]
    public virtual ICollection<Email> Emails { get; set; } = new List<Email>();
}
