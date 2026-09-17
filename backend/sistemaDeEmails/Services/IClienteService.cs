using sistemaDeEmails.DTOs;
using sistemaDeEmails.Models;

namespace sistemaDeEmails.Services
{
    public interface IClienteService
    {
        Task<List<ClienteResponseDto>> GetAllAsync();
        Task<ClienteResponseDto?> GetByIdAsync(long id);
        Task<Cliente> CreateAsync(ClienteCreateDto dto);
        Task<Cliente?> UpdateAsync(long id, ClienteUpdateDto dto);
        Task<bool> DeleteAsync(long id);
    }
}
