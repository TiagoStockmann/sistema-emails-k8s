using Microsoft.EntityFrameworkCore;
using sistemaDeEmails.Models;

namespace sistemaDeEmails.Repositories
{
    public class ClienteRepository : IClienteRepository
    {
        private readonly AppDbContext _context;

        public ClienteRepository(AppDbContext context) {
            _context = context;
        }

        public async Task<List<Cliente>> GetAllAsync()
        {
            return await _context.Clientes
                .Include(c => c.Emails)
                .AsNoTracking()
                .OrderBy(c => c.Nome)
                .ToListAsync();
        }

        public async Task<Cliente> AddAsync(Cliente cliente)
        {
            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();
            return cliente;
        }

        public async Task<Cliente?> GetByIdAsync(long id)
        {
            return await _context.Clientes
                .Include(c => c.Emails)
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.ClienteId == id);
        }

        public async Task<Cliente> UpdateAsync(Cliente cliente)
        {
            _context.Clientes.Update(cliente);
            await _context.SaveChangesAsync();
            return cliente;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var cliente = await _context.Clientes.FindAsync(id);

            if (cliente == null)
                return false;

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
