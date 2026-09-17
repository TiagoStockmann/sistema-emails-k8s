using Microsoft.OpenApi;
using sistemaDeEmails.DTOs;
using sistemaDeEmails.Models;
using sistemaDeEmails.Repositories;


namespace sistemaDeEmails.Services
{
    public class EmailService : IEmailService
    {
        private readonly IEmailRepository _repository;

        public EmailService(IEmailRepository repository)
        {
            _repository = repository;
        }

        public async Task<Email> CreateAsync(EmailCreateDto dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));
            if (dto.ClienteId <= 0)
                throw new ArgumentException("O Id do cliente é obrigatório.");
            var clienteExiste = await _repository.ExistsAsync(dto.ClienteId);
            if (!clienteExiste)
                throw new ArgumentException("Cliente não encontrado.");
            if (string.IsNullOrWhiteSpace(dto.Nome))
                throw new ArgumentException("O nome do usuario é obrigatório.");
            if (string.IsNullOrWhiteSpace(dto.Email))
                throw new ArgumentException("O email do cliente é obrigatório.");
            var email = new Email
            {
                ClienteId = dto.ClienteId,
                Nome = dto.Nome.Trim(),
                Email1 = dto.Email.Trim()
            };

            return await _repository.AddAsync(email);
        }

        public async Task<bool> DeleteAsync(long id)
        {
            if (id <= 0)
                throw new ArgumentException("Id inválido.");
            
            return await _repository.DeleteAsync(id);
            
        }

        public async Task<List<EmailResponseDto>> GetAllAsync()
        {
            var emails = await _repository.GetAllAsync();

            return emails.Select(e => new EmailResponseDto
            {
                EmailId = (int)e.EmailId,
                Nome = e.Nome,
                Email = e.Email1,
                ClienteNome = e.Cliente.Nome != null ? e.Cliente.Nome : string.Empty
            }).ToList();
        }

        public async Task<EmailResponseDto?> GetByIdAsync(long id)
        {
            if (id <= 0)
                throw new ArgumentException("Id inválido.");

            var email = await _repository.GetByIdAsync(id);

            if (email == null)
                return null;

            return new EmailResponseDto
            {
                EmailId = (int)email.EmailId,
                Nome = email.Nome,
                Email = email.Email1,
                ClienteNome = email.Cliente != null ? email.Cliente.Nome : string.Empty
            };
        }

        public async Task<EmailResponseDto?> PatchAsync(long id, EmailPatchDto dto)
        {
            if (id <= 0)
                throw new ArgumentException("Id inválido.");

            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            if (!dto.ClienteId.HasValue &&
                string.IsNullOrWhiteSpace(dto.Nome) &&
                string.IsNullOrWhiteSpace(dto.Email1))
            {
                throw new ArgumentException("Nenhum campo para atualizar.");
            }

            var email = await _repository.GetByIdAsync(id);

            if (email == null)
                return null;

            if (dto.ClienteId.HasValue)
                email.ClienteId = dto.ClienteId.Value;

            if (!string.IsNullOrWhiteSpace(dto.Nome))
                email.Nome = dto.Nome.Trim();

            if (!string.IsNullOrWhiteSpace(dto.Email1))
                email.Email1 = dto.Email1.Trim();

            await _repository.UpdateAsync(email);

            var emailAtualizado = await _repository.GetByIdAsync(id);

            return new EmailResponseDto
            {
                EmailId = emailAtualizado!.EmailId,
                Nome = emailAtualizado.Nome,
                Email = emailAtualizado.Email1,
                ClienteNome = emailAtualizado.Cliente?.Nome ?? string.Empty
            };
        }

        public async Task<EmailResponseDto?> UpdateAsync(long id, EmailUpdateDto dto)
        {
            if (id <= 0)
                throw new ArgumentException("Id inválido.");

            if (string.IsNullOrWhiteSpace(dto.Nome))
                throw new ArgumentException("Nome obrigatório.");

            if (string.IsNullOrWhiteSpace(dto.Email))
                throw new ArgumentException("Email obrigatório.");

            var email = await _repository.GetByIdAsync(id);

            if (email == null)
                return null;

            email.ClienteId = dto.ClienteId;
            email.Nome = dto.Nome.Trim();
            email.Email1 = dto.Email.Trim();

            var atualizado = await _repository.UpdateAsync(email);

            return new EmailResponseDto
            {
                EmailId = (int)atualizado.EmailId,
                Nome = atualizado.Nome,
                Email = atualizado.Email1,
                ClienteNome = atualizado.Cliente?.Nome ?? string.Empty
            };
        }
    }
}
