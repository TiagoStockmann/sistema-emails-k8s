using sistemaDeEmails.Models;
namespace sistemaDeEmails.Repositories
{
    public interface IEmailRepository
    {
        Task<List<Email>> GetAllAsync();
        Task<Email?> GetByIdAsync(long id);
        Task<Email> AddAsync(Email email);
        Task<bool> ExistsAsync(long clientId);
        Task<Email> UpdateAsync(Email email);
        Task<bool> DeleteAsync(long id);
    }
}

