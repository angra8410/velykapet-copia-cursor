using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VentasPetApi.Data;
using VentasPetApi.Models;

namespace VentasPetApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductosController : ControllerBase
    {
        private readonly VentasPetDbContext _context;

        public ProductosController(VentasPetDbContext context)
        {
            _context = context;
        }

        // GET: api/Productos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductoDto>>> GetProductos(
            [FromQuery] string? categoria = null,
            [FromQuery] string? tipoMascota = null,
            [FromQuery] string? busqueda = null)
        {
            var query = _context.Productos
                .Include(p => p.Categoria)
                .Include(p => p.Variaciones.Where(v => v.Activa))
                .Where(p => p.Activo);

            // Filtrar por categoría
            if (!string.IsNullOrEmpty(categoria))
            {
                query = query.Where(p => p.Categoria.Nombre.ToLower().Contains(categoria.ToLower()));
            }

            // Filtrar por tipo de mascota
            if (!string.IsNullOrEmpty(tipoMascota))
            {
                query = query.Where(p => p.TipoMascota.ToLower() == tipoMascota.ToLower());
            }

            // Buscar por nombre
            if (!string.IsNullOrEmpty(busqueda))
            {
                query = query.Where(p => p.NombreBase.ToLower().Contains(busqueda.ToLower()) ||
                                       p.Descripcion.ToLower().Contains(busqueda.ToLower()));
            }

            var productos = await query.ToListAsync();

            var productosDto = productos.Select(p => new ProductoDto
            {
                IdProducto = p.IdProducto,
                NombreBase = p.NombreBase,
                Descripcion = p.Descripcion,
                IdCategoria = p.IdCategoria,
                NombreCategoria = p.Categoria.Nombre,
                TipoMascota = p.TipoMascota,
                URLImagen = p.URLImagen,
                Activo = p.Activo,
                Variaciones = p.Variaciones.Select(v => new VariacionProductoDto
                {
                    IdVariacion = v.IdVariacion,
                    IdProducto = v.IdProducto,
                    Peso = v.Peso,
                    Precio = v.Precio,
                    Stock = v.Stock,
                    Activa = v.Activa
                }).ToList()
            }).ToList();

            return Ok(productosDto);
        }

        // GET: api/Productos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductoDto>> GetProducto(int id)
        {
            var producto = await _context.Productos
                .Include(p => p.Categoria)
                .Include(p => p.Variaciones.Where(v => v.Activa))
                .FirstOrDefaultAsync(p => p.IdProducto == id && p.Activo);

            if (producto == null)
            {
                return NotFound();
            }

            var productoDto = new ProductoDto
            {
                IdProducto = producto.IdProducto,
                NombreBase = producto.NombreBase,
                Descripcion = producto.Descripcion,
                IdCategoria = producto.IdCategoria,
                NombreCategoria = producto.Categoria.Nombre,
                TipoMascota = producto.TipoMascota,
                URLImagen = producto.URLImagen,
                Activo = producto.Activo,
                Variaciones = producto.Variaciones.Select(v => new VariacionProductoDto
                {
                    IdVariacion = v.IdVariacion,
                    IdProducto = v.IdProducto,
                    Peso = v.Peso,
                    Precio = v.Precio,
                    Stock = v.Stock,
                    Activa = v.Activa
                }).ToList()
            };

            return Ok(productoDto);
        }

        // GET: api/Productos/categorias
        [HttpGet("categorias")]
        public async Task<ActionResult<IEnumerable<CategoriaDto>>> GetCategorias()
        {
            var categorias = await _context.Categorias
                .Where(c => c.Activa)
                .Select(c => new CategoriaDto
                {
                    IdCategoria = c.IdCategoria,
                    Nombre = c.Nombre,
                    Descripcion = c.Descripcion,
                    TipoMascota = c.TipoMascota,
                    Activa = c.Activa
                })
                .ToListAsync();

            return Ok(categorias);
        }

        // GET: api/Productos/variaciones/5
        [HttpGet("variaciones/{id}")]
        public async Task<ActionResult<IEnumerable<VariacionProductoDto>>> GetVariacionesProducto(int id)
        {
            var variaciones = await _context.VariacionesProducto
                .Where(v => v.IdProducto == id && v.Activa)
                .Select(v => new VariacionProductoDto
                {
                    IdVariacion = v.IdVariacion,
                    IdProducto = v.IdProducto,
                    Peso = v.Peso,
                    Precio = v.Precio,
                    Stock = v.Stock,
                    Activa = v.Activa
                })
                .ToListAsync();

            return Ok(variaciones);
        }

        // GET: api/Productos/buscar?q=termino
        [HttpGet("buscar")]
        public async Task<ActionResult<IEnumerable<ProductoDto>>> BuscarProductos([FromQuery] string q)
        {
            if (string.IsNullOrEmpty(q))
            {
                return BadRequest("El término de búsqueda no puede estar vacío");
            }

            var productos = await _context.Productos
                .Include(p => p.Categoria)
                .Include(p => p.Variaciones.Where(v => v.Activa))
                .Where(p => p.Activo && 
                           (p.NombreBase.ToLower().Contains(q.ToLower()) ||
                            p.Descripcion.ToLower().Contains(q.ToLower()) ||
                            p.Categoria.Nombre.ToLower().Contains(q.ToLower())))
                .ToListAsync();

            var productosDto = productos.Select(p => new ProductoDto
            {
                IdProducto = p.IdProducto,
                NombreBase = p.NombreBase,
                Descripcion = p.Descripcion,
                IdCategoria = p.IdCategoria,
                NombreCategoria = p.Categoria.Nombre,
                TipoMascota = p.TipoMascota,
                URLImagen = p.URLImagen,
                Activo = p.Activo,
                Variaciones = p.Variaciones.Select(v => new VariacionProductoDto
                {
                    IdVariacion = v.IdVariacion,
                    IdProducto = v.IdProducto,
                    Peso = v.Peso,
                    Precio = v.Precio,
                    Stock = v.Stock,
                    Activa = v.Activa
                }).ToList()
            }).ToList();

            return Ok(productosDto);
        }
    }
}
