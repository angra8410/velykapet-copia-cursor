using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VentasPetApi.Data;
using VentasPetApi.Models;

namespace VentasPetApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProveedoresController : ControllerBase
    {
        private readonly VentasPetDbContext _context;

        public ProveedoresController(VentasPetDbContext context)
        {
            _context = context;
        }

        // GET: api/Proveedores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProveedorDto>>> GetProveedores(
            [FromQuery] bool? activo = null,
            [FromQuery] string? busqueda = null)
        {
            var query = _context.Proveedores.AsQueryable();

            // Filtrar por estado activo
            if (activo.HasValue)
            {
                query = query.Where(p => p.Activo == activo.Value);
            }

            // Buscar por nombre, razón social o NIT
            if (!string.IsNullOrEmpty(busqueda))
            {
                query = query.Where(p => 
                    p.Nombre.ToLower().Contains(busqueda.ToLower()) ||
                    (p.RazonSocial != null && p.RazonSocial.ToLower().Contains(busqueda.ToLower())) ||
                    (p.NIT != null && p.NIT.ToLower().Contains(busqueda.ToLower())));
            }

            var proveedores = await query
                .OrderBy(p => p.Nombre)
                .ToListAsync();

            var proveedoresDto = proveedores.Select(p => new ProveedorDto
            {
                ProveedorId = p.ProveedorId,
                Nombre = p.Nombre,
                RazonSocial = p.RazonSocial,
                NIT = p.NIT,
                Direccion = p.Direccion,
                Telefono = p.Telefono,
                Email = p.Email,
                SitioWeb = p.SitioWeb,
                PersonaContacto = p.PersonaContacto,
                Notas = p.Notas,
                Activo = p.Activo,
                FechaCreacion = p.FechaCreacion,
                FechaModificacion = p.FechaModificacion
            }).ToList();

            return Ok(proveedoresDto);
        }

        // GET: api/Proveedores/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProveedorDto>> GetProveedor(int id)
        {
            var proveedor = await _context.Proveedores
                .FirstOrDefaultAsync(p => p.ProveedorId == id);

            if (proveedor == null)
            {
                return NotFound();
            }

            var proveedorDto = new ProveedorDto
            {
                ProveedorId = proveedor.ProveedorId,
                Nombre = proveedor.Nombre,
                RazonSocial = proveedor.RazonSocial,
                NIT = proveedor.NIT,
                Direccion = proveedor.Direccion,
                Telefono = proveedor.Telefono,
                Email = proveedor.Email,
                SitioWeb = proveedor.SitioWeb,
                PersonaContacto = proveedor.PersonaContacto,
                Notas = proveedor.Notas,
                Activo = proveedor.Activo,
                FechaCreacion = proveedor.FechaCreacion,
                FechaModificacion = proveedor.FechaModificacion
            };

            return Ok(proveedorDto);
        }

        // POST: api/Proveedores
        [HttpPost]
        public async Task<ActionResult<ProveedorDto>> CrearProveedor(ProveedorCrearDto proveedorCrear)
        {
            // Verificar si ya existe un proveedor con el mismo nombre
            var proveedorExistente = await _context.Proveedores
                .FirstOrDefaultAsync(p => p.Nombre.ToLower() == proveedorCrear.Nombre.ToLower());

            if (proveedorExistente != null)
            {
                return BadRequest("Ya existe un proveedor con ese nombre");
            }

            var proveedor = new Proveedor
            {
                Nombre = proveedorCrear.Nombre,
                RazonSocial = proveedorCrear.RazonSocial,
                NIT = proveedorCrear.NIT,
                Direccion = proveedorCrear.Direccion,
                Telefono = proveedorCrear.Telefono,
                Email = proveedorCrear.Email,
                SitioWeb = proveedorCrear.SitioWeb,
                PersonaContacto = proveedorCrear.PersonaContacto,
                Notas = proveedorCrear.Notas,
                Activo = true,
                FechaCreacion = DateTime.Now,
                FechaModificacion = DateTime.Now
            };

            _context.Proveedores.Add(proveedor);
            await _context.SaveChangesAsync();

            var proveedorDto = new ProveedorDto
            {
                ProveedorId = proveedor.ProveedorId,
                Nombre = proveedor.Nombre,
                RazonSocial = proveedor.RazonSocial,
                NIT = proveedor.NIT,
                Direccion = proveedor.Direccion,
                Telefono = proveedor.Telefono,
                Email = proveedor.Email,
                SitioWeb = proveedor.SitioWeb,
                PersonaContacto = proveedor.PersonaContacto,
                Notas = proveedor.Notas,
                Activo = proveedor.Activo,
                FechaCreacion = proveedor.FechaCreacion,
                FechaModificacion = proveedor.FechaModificacion
            };

            return CreatedAtAction(nameof(GetProveedor), new { id = proveedor.ProveedorId }, proveedorDto);
        }

        // PUT: api/Proveedores/5
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarProveedor(int id, ProveedorActualizarDto proveedorActualizar)
        {
            var proveedor = await _context.Proveedores.FindAsync(id);

            if (proveedor == null)
            {
                return NotFound();
            }

            // Verificar si ya existe otro proveedor con el mismo nombre
            var proveedorExistente = await _context.Proveedores
                .FirstOrDefaultAsync(p => p.Nombre.ToLower() == proveedorActualizar.Nombre.ToLower() && p.ProveedorId != id);

            if (proveedorExistente != null)
            {
                return BadRequest("Ya existe otro proveedor con ese nombre");
            }

            proveedor.Nombre = proveedorActualizar.Nombre;
            proveedor.RazonSocial = proveedorActualizar.RazonSocial;
            proveedor.NIT = proveedorActualizar.NIT;
            proveedor.Direccion = proveedorActualizar.Direccion;
            proveedor.Telefono = proveedorActualizar.Telefono;
            proveedor.Email = proveedorActualizar.Email;
            proveedor.SitioWeb = proveedorActualizar.SitioWeb;
            proveedor.PersonaContacto = proveedorActualizar.PersonaContacto;
            proveedor.Notas = proveedorActualizar.Notas;
            proveedor.Activo = proveedorActualizar.Activo;
            proveedor.FechaModificacion = DateTime.Now;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProveedorExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Proveedores/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarProveedor(int id)
        {
            var proveedor = await _context.Proveedores.FindAsync(id);

            if (proveedor == null)
            {
                return NotFound();
            }

            // NOTE: Producto model doesn't have ProveedorId relationship
            // If you need to track proveedor-producto relationship, add ProveedorId to Producto model
            // For now, we allow deletion without checking products
            // var tieneProductos = await _context.Productos
            //     .AnyAsync(p => p.ProveedorId == id);
            //
            // if (tieneProductos)
            // {
            //     return BadRequest("No se puede eliminar el proveedor porque tiene productos asociados. Desactívelo en su lugar.");
            // }

            _context.Proveedores.Remove(proveedor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PATCH: api/Proveedores/5/activar
        [HttpPatch("{id}/activar")]
        public async Task<IActionResult> ActivarProveedor(int id)
        {
            var proveedor = await _context.Proveedores.FindAsync(id);

            if (proveedor == null)
            {
                return NotFound();
            }

            proveedor.Activo = true;
            proveedor.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PATCH: api/Proveedores/5/desactivar
        [HttpPatch("{id}/desactivar")]
        public async Task<IActionResult> DesactivarProveedor(int id)
        {
            var proveedor = await _context.Proveedores.FindAsync(id);

            if (proveedor == null)
            {
                return NotFound();
            }

            proveedor.Activo = false;
            proveedor.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Proveedores/5/productos
        [HttpGet("{id}/productos")]
        public async Task<ActionResult<IEnumerable<ProductoDto>>> GetProductosProveedor(int id)
        {
            var proveedor = await _context.Proveedores.FindAsync(id);

            if (proveedor == null)
            {
                return NotFound();
            }

            // NOTE: Producto model doesn't have ProveedorId relationship
            // This endpoint cannot filter by provider until the relationship is added
            // Returning empty list for now
            return Ok(new List<ProductoDto>());
            
            // ORIGINAL CODE (commented out until Producto model has ProveedorId):
            // var productos = await _context.Productos
            //     .Include(p => p.Categoria)
            //     .Include(p => p.Variaciones.Where(v => v.Activa))
            //     .Where(p => p.ProveedorId == id && p.Activo)
            //     .ToListAsync();
            //
            // var productosDto = productos.Select(p => new ProductoDto
            // {
            //     IdProducto = p.IdProducto,
            //     NombreBase = p.NombreBase,
            //     Descripcion = p.Descripcion,
            //     IdCategoria = p.IdCategoria,
            //     NombreCategoria = p.Categoria.Nombre,
            //     TipoMascota = p.TipoMascota,
            //     URLImagen = p.URLImagen,
            //     Activo = p.Activo,
            //     Variaciones = p.Variaciones.Select(v => new VariacionProductoDto
            //     {
            //         IdVariacion = v.IdVariacion,
            //         IdProducto = v.IdProducto,
            //         Peso = v.Peso,
            //         Precio = v.Precio,
            //         Stock = v.Stock,
            //         Activa = v.Activa
            //     }).ToList()
            // }).ToList();
            //
            // return Ok(productosDto);
        }

        private bool ProveedorExists(int id)
        {
            return _context.Proveedores.Any(e => e.ProveedorId == id);
        }
    }
}
