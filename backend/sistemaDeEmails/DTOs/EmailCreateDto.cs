namespace sistemaDeEmails.DTOs
{
    public class EmailCreateDto
    {
        public long ClienteId { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
