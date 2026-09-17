using Microsoft.EntityFrameworkCore;
using sistemaDeEmails.Models;
using sistemaDeEmails.Repositories;


namespace sistemaDeEmails.Repositories
{
    public class EmailRepository : IEmailRepository
    {
        private readonly AppDbContext _context;

        public EmailRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Email>> GetAllAsync()
        {
            return await _context.Emails
                .Include(e => e.Cliente)
                .AsNoTracking()
                .OrderBy(c => c.Nome)
                .ToListAsync();
        }

        public async Task<Email> AddAsync(Email email)
        {
            _context.Emails.Add(email);
            await _context.SaveChangesAsync();
            return email;
        }

        public async Task<bool> ExistsAsync(long clientId)
        {
            return await _context.Clientes.AnyAsync(c => c.ClienteId == clientId);
        }

        public async Task<Email?> GetByIdAsync(long id)
        {
            return await _context.Emails
                .Include (e => e.Cliente)
                .FirstOrDefaultAsync(c => c.EmailId == id);
        }

        public async Task<Email> UpdateAsync(Email email)
        {
            _context.Emails.Update(email);
            await _context.SaveChangesAsync();
            return email;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var email = await _context.Emails.FindAsync(id);

            if (email == null)
                return false;
            
            _context.Emails.Remove(email);
            await _context.SaveChangesAsync();
            return true;
            
        }
    }
}
