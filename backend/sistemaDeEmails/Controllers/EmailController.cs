using Microsoft.AspNetCore.Mvc;
using sistemaDeEmails.DTOs;
using sistemaDeEmails.Models;
using sistemaDeEmails.Services;

namespace sistemaDeEmails.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _service;

        public EmailController(IEmailService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<EmailResponseDto>>> Get()
        {
            var emails = await _service.GetAllAsync();
            return Ok(emails);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EmailResponseDto>> GetById(int id)
        {
            try
            {
                var email = await _service.GetByIdAsync(id);

                if (email == null)
                    return NotFound(new { mensagem = "Email não encontrado." });

                return Ok(email);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensagem = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<Email>> Post([FromBody] EmailCreateDto dto)
        {
            try
            {
                var emailCriado = await _service.CreateAsync(dto);

                return CreatedAtAction(
                    nameof(Get),
                    new { id = emailCriado.EmailId },
                    emailCriado
                    );
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensagem = ex.Message});
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Email>> Put(int id, [FromBody] EmailUpdateDto dto)
        {
            try
            {
                var email = await _service.UpdateAsync(id, dto);

                if (email == null)
                    return NotFound(new { mensagem = "Email não encontrado." });

                return Ok(email);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensagem = ex.Message });
            }
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<EmailResponseDto>> Patch(long id, [FromBody] EmailPatchDto dto)
        {
            try
            {
                var email = await _service.PatchAsync(id, dto);

                if (email == null)
                    return NotFound(new { mensagem = "Email não encontrado." });

                return Ok(email);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensagem = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var deletado = await _service.DeleteAsync(id);

                if (!deletado)
                    return NotFound(new { mensagem = "Email não encontrado." });

                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensagem = ex.Message });
            }
        }
    }
}
