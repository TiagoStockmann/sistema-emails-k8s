using Microsoft.AspNetCore.Mvc;
using sistemaDeEmails.DTOs;
using sistemaDeEmails.Models;
using sistemaDeEmails.Services;

namespace sistemaDeEmails.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly IClienteService _service;

        public ClientesController(IClienteService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<ClienteResponseDto>>> Get()
        {
            var clientes = await _service.GetAllAsync();
            return Ok(clientes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ClienteResponseDto>> GetById(long id)
        {
            try
            {
                var cliente = await _service.GetByIdAsync(id);

                if (cliente == null)
                    return NotFound(new { mensagem = "Cliente não encontrado." });

                return Ok(cliente);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensagem = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<Cliente>> Post([FromBody] ClienteCreateDto dto) 
        { 
            try
            {
                var clienteCriado = await _service.CreateAsync(dto);

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = clienteCriado.ClienteId },
                    clienteCriado
                );
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensagem = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Cliente>> Put(long id, [FromBody] ClienteUpdateDto dto)
        {
            try
            {
                var cliente = await _service.UpdateAsync(id, dto);

                if (cliente == null)
                    return NotFound(new { mensagem = "Cliente não encontrado." });

                return Ok(cliente);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensagem = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            try
            {
                var deletado = await _service.DeleteAsync(id);

                if (!deletado)
                    return NotFound(new { mensagem = "Cliente não encontrado." });

                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensagem = ex.Message });
            }
        }
    }
}