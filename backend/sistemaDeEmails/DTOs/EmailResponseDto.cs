namespace sistemaDeEmails.DTOs
{
    public class EmailResponseDto
    {
        public long EmailId { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string ClienteNome { get; set; } = string.Empty;
    }
}
