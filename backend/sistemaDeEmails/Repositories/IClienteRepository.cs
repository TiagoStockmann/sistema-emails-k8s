using sistemaDeEmails.Models;
namespace sistemaDeEmails.Repositories
{
    public interface IClienteRepository
    {
        Task<List<Cliente>> GetAllAsync();
        Task<Cliente?> GetByIdAsync(long id);
        Task<Cliente> AddAsync(Cliente cliente);
        Task<Cliente> UpdateAsync(Cliente cliente);
        Task<bool> DeleteAsync(long id);
    }
}
