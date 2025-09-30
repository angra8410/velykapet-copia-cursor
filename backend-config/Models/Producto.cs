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
        public string TipoMascota { get; set; } = string.Empty; // 'Perros', 'Gatos'

        [MaxLength(500)]
        public string? URLImagen { get; set; }

        public bool Activo { get; set; } = true;

        public DateTime FechaCreacion { get; set; } = DateTime.Now;

        public DateTime FechaActualizacion { get; set; } = DateTime.Now;

        // Navegación
        [ForeignKey("IdCategoria")]
        public virtual Categoria Categoria { get; set; } = null!;

        public virtual ICollection<VariacionProducto> Variaciones { get; set; } = new List<VariacionProducto>();
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
}
