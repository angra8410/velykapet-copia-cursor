using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VentasPetApi.Models
{
    [Table("Usuarios")]
    public class Usuario
    {
        [Key]
        public int IdUsuario { get; set; }

        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Apellido { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string Contrasena { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? Telefono { get; set; }

        [MaxLength(500)]
        public string? Direccion { get; set; }

        public bool Activo { get; set; } = true;

        public DateTime FechaCreacion { get; set; } = DateTime.Now;

        public DateTime FechaActualizacion { get; set; } = DateTime.Now;

        // Navegación
        public virtual ICollection<CarritoCompras> CarritoCompras { get; set; } = new List<CarritoCompras>();
        public virtual ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
    }

    // DTOs para transferencia de datos
    public class UsuarioDto
    {
        public int IdUsuario { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Telefono { get; set; }
        public string? Direccion { get; set; }
        public bool Activo { get; set; }
        public DateTime FechaCreacion { get; set; }
    }

    public class UsuarioLoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Contrasena { get; set; } = string.Empty;
    }

    public class UsuarioRegistroDto
    {
        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Apellido { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Contrasena { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? Telefono { get; set; }

        [MaxLength(500)]
        public string? Direccion { get; set; }
    }
}
