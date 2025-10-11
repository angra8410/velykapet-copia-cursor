using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VentasPetApi.Models
{
    [Table("Productos")]
    public class Producto
    {
        [Key]
        public int IdProducto { get; set; }

        [Required]
        [MaxLength(200)]
        public string NombreBase { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Descripcion { get; set; }

        public int IdCategoria { get; set; }

        [MaxLength(50)]
        public string TipoMascota { get; set; } = string.Empty; // 'Perros', 'Gatos' - Se mantiene para compatibilidad

        [MaxLength(500)]
        public string? URLImagen { get; set; }

        public bool Activo { get; set; } = true;

        public DateTime FechaCreacion { get; set; } = DateTime.Now;

        public DateTime FechaActualizacion { get; set; } = DateTime.Now;

        // Nuevos campos para filtros avanzados
        public int? IdMascotaTipo { get; set; }
        public int? IdCategoriaAlimento { get; set; }
        public int? IdSubcategoria { get; set; }
        public int? IdPresentacion { get; set; }
        public int? ProveedorId { get; set; }

        // Navegación existente
        [ForeignKey("IdCategoria")]
        public virtual Categoria Categoria { get; set; } = null!;

        public virtual ICollection<VariacionProducto> Variaciones { get; set; } = new List<VariacionProducto>();

        // Navegación para filtros avanzados
        [ForeignKey("IdMascotaTipo")]
        public virtual MascotaTipo? MascotaTipo { get; set; }

        [ForeignKey("IdCategoriaAlimento")]
        public virtual CategoriaAlimento? CategoriaAlimento { get; set; }

        [ForeignKey("IdSubcategoria")]
        public virtual SubcategoriaAlimento? Subcategoria { get; set; }

        [ForeignKey("IdPresentacion")]
        public virtual PresentacionEmpaque? Presentacion { get; set; }

        [ForeignKey("ProveedorId")]
        public virtual Proveedor? Proveedor { get; set; }
    }

    [Table("Categorias")]
    public class Categoria
    {
        [Key]
        public int IdCategoria { get; set; }

        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Descripcion { get; set; }

        [MaxLength(50)]
        public string? TipoMascota { get; set; } // 'Perros', 'Gatos', 'Ambos'

        public bool Activa { get; set; } = true;

        // Navegación
        public virtual ICollection<Producto> Productos { get; set; } = new List<Producto>();
    }

    [Table("VariacionesProducto")]
    public class VariacionProducto
    {
        [Key]
        public int IdVariacion { get; set; }

        public int IdProducto { get; set; }

        [Required]
        [MaxLength(50)]
        public string Peso { get; set; } = string.Empty; // "500GR", "1.5 KG", "3 KG"

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Precio { get; set; }

        public int Stock { get; set; } = 0;

        public bool Activa { get; set; } = true;

        public DateTime FechaCreacion { get; set; } = DateTime.Now;

        // Navegación
        [ForeignKey("IdProducto")]
        public virtual Producto Producto { get; set; } = null!;

        public virtual ICollection<CarritoCompras> CarritoCompras { get; set; } = new List<CarritoCompras>();
        public virtual ICollection<ItemPedido> ItemsPedido { get; set; } = new List<ItemPedido>();
    }

    // DTOs para transferencia de datos
    public class ProductoDto
    {
        public int IdProducto { get; set; }
        public string NombreBase { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public int IdCategoria { get; set; }
        public string NombreCategoria { get; set; } = string.Empty;
        public string TipoMascota { get; set; } = string.Empty;
        public string? URLImagen { get; set; }
        public bool Activo { get; set; }
        public List<VariacionProductoDto> Variaciones { get; set; } = new List<VariacionProductoDto>();
        
        // Nuevos campos para filtros avanzados
        public int? IdMascotaTipo { get; set; }
        public string? NombreMascotaTipo { get; set; }
        public int? IdCategoriaAlimento { get; set; }
        public string? NombreCategoriaAlimento { get; set; }
        public int? IdSubcategoria { get; set; }
        public string? NombreSubcategoria { get; set; }
        public int? IdPresentacion { get; set; }
        public string? NombrePresentacion { get; set; }
        
        // Images collection - populated with URLImagen for backward compatibility
        // Allows frontend to access image(s) via both Images and URLImagen fields
        public List<string> Images 
        { 
            get 
            {
                var imagesList = new List<string>();
                if (!string.IsNullOrWhiteSpace(URLImagen))
                {
                    imagesList.Add(URLImagen);
                }
                return imagesList;
            }
        }
    }

    public class VariacionProductoDto
    {
        public int IdVariacion { get; set; }
        public int IdProducto { get; set; }
        public string Peso { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public int Stock { get; set; }
        public bool Activa { get; set; }
    }

    public class CategoriaDto
    {
        public int IdCategoria { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public string? TipoMascota { get; set; }
        public bool Activa { get; set; }
    }

    // DTOs para tablas maestras de filtros
    public class MascotaTipoDto
    {
        public int IdMascotaTipo { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public bool Activo { get; set; }
    }

    public class CategoriaAlimentoDto
    {
        public int IdCategoriaAlimento { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public int? IdMascotaTipo { get; set; }
        public string? NombreMascotaTipo { get; set; }
        public bool Activa { get; set; }
    }

    public class SubcategoriaAlimentoDto
    {
        public int IdSubcategoria { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public int IdCategoriaAlimento { get; set; }
        public string? NombreCategoriaAlimento { get; set; }
        public bool Activa { get; set; }
    }

    public class PresentacionEmpaqueDto
    {
        public int IdPresentacion { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public bool Activa { get; set; }
    }

    // DTOs para creación de productos con variaciones
    public class VariacionCrearDto
    {
        [Required]
        [MaxLength(50)]
        public string Presentacion { get; set; } = string.Empty; // Maps to Peso field: "500 GR", "1.5 KG", etc.

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "El precio debe ser mayor a 0")]
        public decimal Precio { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "El stock no puede ser negativo")]
        public int Stock { get; set; } = 0;

        [MaxLength(500)]
        public string? URLImagen { get; set; }
    }

    public class ProductoConVariacionesDto
    {
        [Required]
        [MaxLength(200)]
        public string NombreBase { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Descripcion { get; set; }

        [Required]
        public int IdCategoria { get; set; }

        [Required]
        [MaxLength(50)]
        public string TipoMascota { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? URLImagen { get; set; }

        public int? IdMascotaTipo { get; set; }
        public int? IdCategoriaAlimento { get; set; }
        public int? IdSubcategoria { get; set; }
        public int? IdPresentacion { get; set; }
        public int? ProveedorId { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "Debe incluir al menos una variación")]
        public List<VariacionCrearDto> VariacionesProducto { get; set; } = new List<VariacionCrearDto>();
    }

    public class ProductoCreadoResponseDto
    {
        public int IdProducto { get; set; }
        public string NombreBase { get; set; } = string.Empty;
        public List<VariacionCreadaDto> Variaciones { get; set; } = new List<VariacionCreadaDto>();
        public string Mensaje { get; set; } = string.Empty;
    }

    public class VariacionCreadaDto
    {
        public int IdVariacion { get; set; }
        public string Presentacion { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public int Stock { get; set; }
    }

    // Nuevas tablas maestras para filtros avanzados
    [Table("MascotaTipo")]
    public class MascotaTipo
    {
        [Key]
        public int IdMascotaTipo { get; set; }

        [Required]
        [MaxLength(50)]
        public string Nombre { get; set; } = string.Empty; // "GATO", "PERRO"

        public bool Activo { get; set; } = true;

        // Navegación
        public virtual ICollection<Producto> Productos { get; set; } = new List<Producto>();
        public virtual ICollection<CategoriaAlimento> Categorias { get; set; } = new List<CategoriaAlimento>();
    }

    [Table("CategoriaAlimento")]
    public class CategoriaAlimento
    {
        [Key]
        public int IdCategoriaAlimento { get; set; }

        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; } = string.Empty; // "ALIMENTO SECO", "ALIMENTO HÚMEDO"

        public int? IdMascotaTipo { get; set; }

        public bool Activa { get; set; } = true;

        // Navegación
        [ForeignKey("IdMascotaTipo")]
        public virtual MascotaTipo? MascotaTipo { get; set; }
        public virtual ICollection<Producto> Productos { get; set; } = new List<Producto>();
        public virtual ICollection<SubcategoriaAlimento> Subcategorias { get; set; } = new List<SubcategoriaAlimento>();
    }

    [Table("SubcategoriaAlimento")]
    public class SubcategoriaAlimento
    {
        [Key]
        public int IdSubcategoria { get; set; }

        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; } = string.Empty; // "DIETA SECA PRESCRITA", "ADULT", "KITTEN"

        public int IdCategoriaAlimento { get; set; }

        public bool Activa { get; set; } = true;

        // Navegación
        [ForeignKey("IdCategoriaAlimento")]
        public virtual CategoriaAlimento CategoriaAlimento { get; set; } = null!;
        public virtual ICollection<Producto> Productos { get; set; } = new List<Producto>();
    }

    [Table("PresentacionEmpaque")]
    public class PresentacionEmpaque
    {
        [Key]
        public int IdPresentacion { get; set; }

        [Required]
        [MaxLength(50)]
        public string Nombre { get; set; } = string.Empty; // "BOLSA", "LATA", "SOBRE"

        public bool Activa { get; set; } = true;

        // Navegación
        public virtual ICollection<Producto> Productos { get; set; } = new List<Producto>();
    }
}
