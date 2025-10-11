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
            [FromQuery] string? busqueda = null,
            [FromQuery] int? idMascotaTipo = null,
            [FromQuery] int? idCategoriaAlimento = null,
            [FromQuery] int? idSubcategoria = null,
            [FromQuery] int? idPresentacion = null)
        {
            try
            {
                var query = _context.Productos
                    .Include(p => p.Categoria)
                    .Include(p => p.Variaciones.Where(v => v.Activa))
                    .Include(p => p.MascotaTipo)
                    .Include(p => p.CategoriaAlimento)
                    .Include(p => p.Subcategoria)
                    .Include(p => p.Presentacion)
                    .Where(p => p.Activo);

                // Filtro por categoría (existente, para compatibilidad)
                if (!string.IsNullOrEmpty(categoria))
                {
                    query = query.Where(p => p.Categoria.Nombre.ToLower().Contains(categoria.ToLower()));
                }

                // Filtro por tipo de mascota (existente, para compatibilidad)
                if (!string.IsNullOrEmpty(tipoMascota))
                {
                    query = query.Where(p => p.TipoMascota.ToLower() == tipoMascota.ToLower());
                }

                // Nuevos filtros avanzados
                if (idMascotaTipo.HasValue)
                {
                    query = query.Where(p => p.IdMascotaTipo == idMascotaTipo.Value);
                }

                if (idCategoriaAlimento.HasValue)
                {
                    query = query.Where(p => p.IdCategoriaAlimento == idCategoriaAlimento.Value);
                }

                if (idSubcategoria.HasValue)
                {
                    query = query.Where(p => p.IdSubcategoria == idSubcategoria.Value);
                }

                if (idPresentacion.HasValue)
                {
                    query = query.Where(p => p.IdPresentacion == idPresentacion.Value);
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
                    // Nuevos campos para filtros avanzados
                    IdMascotaTipo = p.IdMascotaTipo,
                    NombreMascotaTipo = p.MascotaTipo?.Nombre,
                    IdCategoriaAlimento = p.IdCategoriaAlimento,
                    NombreCategoriaAlimento = p.CategoriaAlimento?.Nombre,
                    IdSubcategoria = p.IdSubcategoria,
                    NombreSubcategoria = p.Subcategoria?.Nombre,
                    IdPresentacion = p.IdPresentacion,
                    NombrePresentacion = p.Presentacion?.Nombre,
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

                Console.WriteLine($"✅ Se encontraron {productosDto.Count} productos");
                return Ok(productosDto);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error en GetProductos: {ex.Message}");
                Console.WriteLine($"   StackTrace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"   InnerException: {ex.InnerException.Message}");
                }
                return StatusCode(500, new { 
                    error = "Error al obtener productos", 
                    message = ex.Message,
                    details = ex.InnerException?.Message 
                });
            }
        }

        // GET: api/Productos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductoDto>> GetProducto(int id)
        {
            var producto = await _context.Productos
                .Include(p => p.Categoria)
                .Include(p => p.Variaciones.Where(v => v.Activa))
                .Include(p => p.MascotaTipo)
                .Include(p => p.CategoriaAlimento)
                .Include(p => p.Subcategoria)
                .Include(p => p.Presentacion)
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
                // Nuevos campos para filtros avanzados
                IdMascotaTipo = producto.IdMascotaTipo,
                NombreMascotaTipo = producto.MascotaTipo?.Nombre,
                IdCategoriaAlimento = producto.IdCategoriaAlimento,
                NombreCategoriaAlimento = producto.CategoriaAlimento?.Nombre,
                IdSubcategoria = producto.IdSubcategoria,
                NombreSubcategoria = producto.Subcategoria?.Nombre,
                IdPresentacion = producto.IdPresentacion,
                NombrePresentacion = producto.Presentacion?.Nombre,
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
                .Include(p => p.MascotaTipo)
                .Include(p => p.CategoriaAlimento)
                .Include(p => p.Subcategoria)
                .Include(p => p.Presentacion)
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
                // Nuevos campos para filtros avanzados
                IdMascotaTipo = p.IdMascotaTipo,
                NombreMascotaTipo = p.MascotaTipo?.Nombre,
                IdCategoriaAlimento = p.IdCategoriaAlimento,
                NombreCategoriaAlimento = p.CategoriaAlimento?.Nombre,
                IdSubcategoria = p.IdSubcategoria,
                NombreSubcategoria = p.Subcategoria?.Nombre,
                IdPresentacion = p.IdPresentacion,
                NombrePresentacion = p.Presentacion?.Nombre,
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

        // GET: api/Productos/filtros/mascotas
        [HttpGet("filtros/mascotas")]
        public async Task<ActionResult<IEnumerable<MascotaTipoDto>>> GetMascotaTipos()
        {
            var mascotas = await _context.MascotaTipos
                .Where(m => m.Activo)
                .Select(m => new MascotaTipoDto
                {
                    IdMascotaTipo = m.IdMascotaTipo,
                    Nombre = m.Nombre,
                    Activo = m.Activo
                })
                .ToListAsync();

            return Ok(mascotas);
        }

        // GET: api/Productos/filtros/categorias-alimento
        [HttpGet("filtros/categorias-alimento")]
        public async Task<ActionResult<IEnumerable<CategoriaAlimentoDto>>> GetCategoriasAlimento([FromQuery] int? idMascotaTipo = null)
        {
            var query = _context.CategoriasAlimento
                .Include(c => c.MascotaTipo)
                .Where(c => c.Activa);

            if (idMascotaTipo.HasValue)
            {
                query = query.Where(c => c.IdMascotaTipo == idMascotaTipo.Value || c.IdMascotaTipo == null);
            }

            var categorias = await query
                .Select(c => new CategoriaAlimentoDto
                {
                    IdCategoriaAlimento = c.IdCategoriaAlimento,
                    Nombre = c.Nombre,
                    IdMascotaTipo = c.IdMascotaTipo,
                    NombreMascotaTipo = c.MascotaTipo != null ? c.MascotaTipo.Nombre : null,
                    Activa = c.Activa
                })
                .ToListAsync();

            return Ok(categorias);
        }

        // GET: api/Productos/filtros/subcategorias
        [HttpGet("filtros/subcategorias")]
        public async Task<ActionResult<IEnumerable<SubcategoriaAlimentoDto>>> GetSubcategorias([FromQuery] int? idCategoriaAlimento = null)
        {
            var query = _context.SubcategoriasAlimento
                .Include(s => s.CategoriaAlimento)
                .Where(s => s.Activa);

            if (idCategoriaAlimento.HasValue)
            {
                query = query.Where(s => s.IdCategoriaAlimento == idCategoriaAlimento.Value);
            }

            var subcategorias = await query
                .Select(s => new SubcategoriaAlimentoDto
                {
                    IdSubcategoria = s.IdSubcategoria,
                    Nombre = s.Nombre,
                    IdCategoriaAlimento = s.IdCategoriaAlimento,
                    NombreCategoriaAlimento = s.CategoriaAlimento.Nombre,
                    Activa = s.Activa
                })
                .ToListAsync();

            return Ok(subcategorias);
        }

        // GET: api/Productos/filtros/presentaciones
        [HttpGet("filtros/presentaciones")]
        public async Task<ActionResult<IEnumerable<PresentacionEmpaqueDto>>> GetPresentaciones()
        {
            var presentaciones = await _context.PresentacionesEmpaque
                .Where(p => p.Activa)
                .Select(p => new PresentacionEmpaqueDto
                {
                    IdPresentacion = p.IdPresentacion,
                    Nombre = p.Nombre,
                    Activa = p.Activa
                })
                .ToListAsync();

            return Ok(presentaciones);
        }

        // POST: api/Productos
        [HttpPost]
        public async Task<ActionResult<ProductoCreadoResponseDto>> CrearProductoConVariaciones([FromBody] ProductoConVariacionesDto productoDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { 
                    error = "Datos inválidos", 
                    detalles = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList() 
                });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Validar que la categoría existe
                var categoriaExiste = await _context.Categorias.AnyAsync(c => c.IdCategoria == productoDto.IdCategoria && c.Activa);
                if (!categoriaExiste)
                {
                    return BadRequest(new { 
                        error = "Categoría inválida", 
                        mensaje = $"La categoría con ID {productoDto.IdCategoria} no existe o está inactiva." 
                    });
                }

                // Validar IdMascotaTipo si se proporciona
                if (productoDto.IdMascotaTipo.HasValue)
                {
                    var mascotaTipoExiste = await _context.MascotaTipos.AnyAsync(m => m.IdMascotaTipo == productoDto.IdMascotaTipo.Value && m.Activo);
                    if (!mascotaTipoExiste)
                    {
                        return BadRequest(new { 
                            error = "Tipo de mascota inválido", 
                            mensaje = $"El tipo de mascota con ID {productoDto.IdMascotaTipo.Value} no existe o está inactivo." 
                        });
                    }
                }

                // Validar IdCategoriaAlimento si se proporciona
                if (productoDto.IdCategoriaAlimento.HasValue)
                {
                    var categoriaAlimentoExiste = await _context.CategoriasAlimento.AnyAsync(c => c.IdCategoriaAlimento == productoDto.IdCategoriaAlimento.Value && c.Activa);
                    if (!categoriaAlimentoExiste)
                    {
                        return BadRequest(new { 
                            error = "Categoría de alimento inválida", 
                            mensaje = $"La categoría de alimento con ID {productoDto.IdCategoriaAlimento.Value} no existe o está inactiva." 
                        });
                    }
                }

                // Validar IdSubcategoria si se proporciona
                if (productoDto.IdSubcategoria.HasValue)
                {
                    var subcategoriaExiste = await _context.SubcategoriasAlimento.AnyAsync(s => s.IdSubcategoria == productoDto.IdSubcategoria.Value && s.Activa);
                    if (!subcategoriaExiste)
                    {
                        return BadRequest(new { 
                            error = "Subcategoría inválida", 
                            mensaje = $"La subcategoría con ID {productoDto.IdSubcategoria.Value} no existe o está inactiva." 
                        });
                    }
                }

                // Validar IdPresentacion si se proporciona
                if (productoDto.IdPresentacion.HasValue)
                {
                    var presentacionExiste = await _context.PresentacionesEmpaque.AnyAsync(p => p.IdPresentacion == productoDto.IdPresentacion.Value && p.Activa);
                    if (!presentacionExiste)
                    {
                        return BadRequest(new { 
                            error = "Presentación inválida", 
                            mensaje = $"La presentación con ID {productoDto.IdPresentacion.Value} no existe o está inactiva." 
                        });
                    }
                }

                // Validar ProveedorId si se proporciona
                if (productoDto.ProveedorId.HasValue)
                {
                    var proveedorExiste = await _context.Proveedores.AnyAsync(p => p.ProveedorId == productoDto.ProveedorId.Value && p.Activo);
                    if (!proveedorExiste)
                    {
                        return BadRequest(new { 
                            error = "Proveedor inválido", 
                            mensaje = $"El proveedor con ID {productoDto.ProveedorId.Value} no existe o está inactivo." 
                        });
                    }
                }

                // Verificar que no exista un producto con el mismo nombre
                var productoExiste = await _context.Productos.AnyAsync(p => p.NombreBase == productoDto.NombreBase);
                if (productoExiste)
                {
                    return Conflict(new { 
                        error = "Producto duplicado", 
                        mensaje = $"Ya existe un producto con el nombre '{productoDto.NombreBase}'." 
                    });
                }

                // Crear el producto
                var producto = new Producto
                {
                    NombreBase = productoDto.NombreBase,
                    Descripcion = productoDto.Descripcion,
                    IdCategoria = productoDto.IdCategoria,
                    TipoMascota = productoDto.TipoMascota,
                    URLImagen = productoDto.URLImagen,
                    IdMascotaTipo = productoDto.IdMascotaTipo,
                    IdCategoriaAlimento = productoDto.IdCategoriaAlimento,
                    IdSubcategoria = productoDto.IdSubcategoria,
                    IdPresentacion = productoDto.IdPresentacion,
                    ProveedorId = productoDto.ProveedorId,
                    Activo = true,
                    FechaCreacion = DateTime.Now,
                    FechaActualizacion = DateTime.Now
                };

                _context.Productos.Add(producto);
                await _context.SaveChangesAsync();

                // Verificar que el producto se creó correctamente
                if (producto.IdProducto == 0)
                {
                    throw new Exception("Error al crear el producto: No se generó el ID del producto.");
                }

                // Crear las variaciones
                var variacionesCreadas = new List<VariacionCreadaDto>();
                foreach (var variacionDto in productoDto.VariacionesProducto)
                {
                    var variacion = new VariacionProducto
                    {
                        IdProducto = producto.IdProducto,
                        Peso = variacionDto.Presentacion,
                        Precio = variacionDto.Precio,
                        Stock = variacionDto.Stock,
                        Activa = true,
                        FechaCreacion = DateTime.Now
                    };

                    _context.VariacionesProducto.Add(variacion);
                    await _context.SaveChangesAsync();

                    variacionesCreadas.Add(new VariacionCreadaDto
                    {
                        IdVariacion = variacion.IdVariacion,
                        Presentacion = variacion.Peso,
                        Precio = variacion.Precio,
                        Stock = variacion.Stock
                    });
                }

                // Commit de la transacción
                await transaction.CommitAsync();

                var response = new ProductoCreadoResponseDto
                {
                    IdProducto = producto.IdProducto,
                    NombreBase = producto.NombreBase,
                    Variaciones = variacionesCreadas,
                    Mensaje = $"Producto '{producto.NombreBase}' creado exitosamente con {variacionesCreadas.Count} variación(es)."
                };

                Console.WriteLine($"✅ Producto creado exitosamente: ID={producto.IdProducto}, Nombre={producto.NombreBase}, Variaciones={variacionesCreadas.Count}");

                return CreatedAtAction(nameof(GetProducto), new { id = producto.IdProducto }, response);
            }
            catch (Exception ex)
            {
                // Rollback de la transacción en caso de error
                await transaction.RollbackAsync();

                Console.WriteLine($"❌ Error al crear producto con variaciones: {ex.Message}");
                Console.WriteLine($"   StackTrace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"   InnerException: {ex.InnerException.Message}");
                }

                return StatusCode(500, new { 
                    error = "Error al crear el producto", 
                    mensaje = ex.Message,
                    detalles = ex.InnerException?.Message 
                });
            }
        }
    }
}
