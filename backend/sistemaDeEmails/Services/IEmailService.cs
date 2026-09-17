using sistemaDeEmails.DTOs;
using sistemaDeEmails.Models;

namespace sistemaDeEmails.Services
{
    public interface IEmailService
    {
        Task<List<EmailResponseDto>> GetAllAsync();
        Task<EmailResponseDto?> GetByIdAsync(long id);
        Task<Email> CreateAsync(EmailCreateDto dto);
        Task<EmailResponseDto?> UpdateAsync(long id, EmailUpdateDto dto);
        Task<bool> DeleteAsync(long id);
        Task<EmailResponseDto?> PatchAsync(long id, EmailPatchDto dto);
    }
}
