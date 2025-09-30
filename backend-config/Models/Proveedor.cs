using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VentasPetApi.Models
{
    [Table("Proveedores")]
    public class Proveedor
    {
        [Key]
        public int ProveedorId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? RazonSocial { get; set; }

        [MaxLength(20)]
        public string? NIT { get; set; }

        [MaxLength(500)]
        public string? Direccion { get; set; }

        [MaxLength(20)]
        public string? Telefono { get; set; }

        [MaxLength(100)]
        [EmailAddress]
        public string? Email { get; set; }

        [MaxLength(200)]
        public string? SitioWeb { get; set; }

        [MaxLength(100)]
        public string? PersonaContacto { get; set; }

        [MaxLength(1000)]
        public string? Notas { get; set; }

        public bool Activo { get; set; } = true;

        public DateTime FechaCreacion { get; set; } = DateTime.Now;

        public DateTime FechaModificacion { get; set; } = DateTime.Now;

        // Navegación
        public virtual ICollection<Producto> Productos { get; set; } = new List<Producto>();
    }

    // DTOs para transferencia de datos
    public class ProveedorDto
    {
        public int ProveedorId { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? RazonSocial { get; set; }
        public string? NIT { get; set; }
        public string? Direccion { get; set; }
        public string? Telefono { get; set; }
        public string? Email { get; set; }
        public string? SitioWeb { get; set; }
        public string? PersonaContacto { get; set; }
        public string? Notas { get; set; }
        public bool Activo { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime FechaModificacion { get; set; }
    }

    public class ProveedorCrearDto
    {
        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? RazonSocial { get; set; }

        [MaxLength(20)]
        public string? NIT { get; set; }

        [MaxLength(500)]
        public string? Direccion { get; set; }

        [MaxLength(20)]
        public string? Telefono { get; set; }

        [MaxLength(100)]
        [EmailAddress]
        public string? Email { get; set; }

        [MaxLength(200)]
        public string? SitioWeb { get; set; }

        [MaxLength(100)]
        public string? PersonaContacto { get; set; }

        [MaxLength(1000)]
        public string? Notas { get; set; }
    }

    public class ProveedorActualizarDto
    {
        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? RazonSocial { get; set; }

        [MaxLength(20)]
        public string? NIT { get; set; }

        [MaxLength(500)]
        public string? Direccion { get; set; }

        [MaxLength(20)]
        public string? Telefono { get; set; }

        [MaxLength(100)]
        [EmailAddress]
        public string? Email { get; set; }

        [MaxLength(200)]
        public string? SitioWeb { get; set; }

        [MaxLength(100)]
        public string? PersonaContacto { get; set; }

        [MaxLength(1000)]
        public string? Notas { get; set; }

        public bool Activo { get; set; } = true;
    }
}
