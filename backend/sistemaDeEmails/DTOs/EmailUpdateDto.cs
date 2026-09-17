namespace sistemaDeEmails.DTOs
{
    public class EmailUpdateDto
    {
        public long ClienteId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Nome { get; set; } = string.Empty;

    }
}
