namespace sistemaDeEmails.DTOs
{
    public class ClienteResponseDto
    {
        public long ClienteId { get; set; }
        public string Nome { get; set; } = string.Empty;
        public List<EmailResumoDto> Emails { get; set; } = new();
    }
}
