using sistemaDeEmails.DTOs;
using sistemaDeEmails.Models;
using sistemaDeEmails.Repositories;

namespace sistemaDeEmails.Services
{
    public class ClienteService : IClienteService
    {
        private readonly IClienteRepository _repository;

        public ClienteService(IClienteRepository repository)
        {
            _repository = repository;
        }

        private ClienteResponseDto MapToResponseDto(Cliente cliente)
        {
            return new ClienteResponseDto
            {
                ClienteId = cliente.ClienteId,
                Nome = cliente.Nome,
                Emails = cliente.Emails.Select(e => new EmailResumoDto
                {
                    EmailId = e.EmailId,
                    Nome = e.Nome,
                    Email = e.Email1
                }).ToList()
            };
        }

        public async Task<Cliente> CreateAsync(ClienteCreateDto dto)
        {
            if (dto == null)
               throw new ArgumentNullException(nameof(dto));
            if (string.IsNullOrWhiteSpace(dto.Nome))
                throw new ArithmeticException("O nome do cliente é obrigatório.");
            var cliente = new Cliente
            {
                Nome = dto.Nome.Trim()
            };

            return await _repository.AddAsync(cliente);
        }

        public async Task<bool> DeleteAsync(long id)
        {
            if (id <= 0)
                throw new ArgumentException("Id inválido.");

            return await _repository.DeleteAsync(id);
        }

        public async Task<List<ClienteResponseDto>> GetAllAsync()
        {
            var clientes = await _repository.GetAllAsync();

            return clientes
                .Select(MapToResponseDto)
                .ToList();
        }

        public async Task<ClienteResponseDto?> GetByIdAsync(long id)
        {
            if (id <= 0)
                throw new ArgumentException("Id inválido.");

            var cliente = await _repository.GetByIdAsync(id);

            if (cliente == null)
                return null;

            return MapToResponseDto(cliente);
        }

        public async Task<Cliente?> UpdateAsync(long id, ClienteUpdateDto dto)
        {
            if (id <= 0)
                throw new ArgumentException("Id inválido.");

            if (string.IsNullOrWhiteSpace(dto.Nome))
                throw new ArgumentException("Nome obrigatório.");

            var cliente = await _repository.GetByIdAsync(id);

            if (cliente == null)
                return null;

            cliente.Nome = dto.Nome.Trim();

            return await _repository.UpdateAsync(cliente);
        }
    }
}
