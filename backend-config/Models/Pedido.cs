using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VentasPetApi.Models
{
    [Table("Pedidos")]
    public class Pedido
    {
        [Key]
        public int IdPedido { get; set; }

        public int IdUsuario { get; set; }

        [Required]
        [MaxLength(50)]
        public string NumeroPedido { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Estado { get; set; } = "Pendiente"; // 'Pendiente', 'Confirmado', 'Enviado', 'Entregado', 'Cancelado'

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPedido { get; set; }

        [MaxLength(500)]
        public string? DireccionEnvio { get; set; }

        [MaxLength(20)]
        public string? TelefonoContacto { get; set; }

        [MaxLength(1000)]
        public string? Notas { get; set; }

        public DateTime FechaCreacion { get; set; } = DateTime.Now;

        public DateTime FechaActualizacion { get; set; } = DateTime.Now;

        // Navegación
        [ForeignKey("IdUsuario")]
        public virtual Usuario Usuario { get; set; } = null!;

        public virtual ICollection<ItemPedido> ItemsPedido { get; set; } = new List<ItemPedido>();
        public virtual ICollection<Pago> Pagos { get; set; } = new List<Pago>();
    }

    [Table("ItemsPedido")]
    public class ItemPedido
    {
        [Key]
        public int IdItemPedido { get; set; }

        public int IdPedido { get; set; }

        public int IdVariacion { get; set; }

        public int Cantidad { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecioUnitario { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Subtotal { get; set; }

        // Navegación
        [ForeignKey("IdPedido")]
        public virtual Pedido Pedido { get; set; } = null!;

        [ForeignKey("IdVariacion")]
        public virtual VariacionProducto Variacion { get; set; } = null!;
    }

    [Table("Pagos")]
    public class Pago
    {
        [Key]
        public int IdPago { get; set; }

        public int IdPedido { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Monto { get; set; }

        [MaxLength(50)]
        public string Estado { get; set; } = "Pendiente"; // 'Pendiente', 'Procesado', 'Fallido', 'Reembolsado'

        [MaxLength(50)]
        public string? Metodo { get; set; } // 'Tarjeta', 'Transferencia', 'Efectivo'

        [MaxLength(100)]
        public string? IdTransaccion { get; set; }

        [MaxLength(1000)]
        public string? DetallesPago { get; set; }

        public DateTime FechaCreacion { get; set; } = DateTime.Now;

        public DateTime FechaActualizacion { get; set; } = DateTime.Now;

        // Navegación
        [ForeignKey("IdPedido")]
        public virtual Pedido Pedido { get; set; } = null!;
    }

    [Table("CarritoCompras")]
    public class CarritoCompras
    {
        [Key]
        public int IdCarrito { get; set; }

        public int IdUsuario { get; set; }

        public int IdVariacion { get; set; }

        public int Cantidad { get; set; } = 1;

        public DateTime FechaAgregado { get; set; } = DateTime.Now;

        // Navegación
        [ForeignKey("IdUsuario")]
        public virtual Usuario Usuario { get; set; } = null!;

        [ForeignKey("IdVariacion")]
        public virtual VariacionProducto Variacion { get; set; } = null!;
    }

    // DTOs para transferencia de datos
    public class PedidoDto
    {
        public int IdPedido { get; set; }
        public int IdUsuario { get; set; }
        public string NumeroPedido { get; set; } = string.Empty;
        public string Estado { get; set; } = string.Empty;
        public decimal TotalPedido { get; set; }
        public string? DireccionEnvio { get; set; }
        public string? TelefonoContacto { get; set; }
        public string? Notas { get; set; }
        public DateTime FechaCreacion { get; set; }
        public List<ItemPedidoDto> Items { get; set; } = new List<ItemPedidoDto>();
    }

    public class ItemPedidoDto
    {
        public int IdItemPedido { get; set; }
        public int IdVariacion { get; set; }
        public string NombreProducto { get; set; } = string.Empty;
        public string Peso { get; set; } = string.Empty;
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal Subtotal { get; set; }
    }

    public class CarritoItemDto
    {
        public int IdCarrito { get; set; }
        public int IdVariacion { get; set; }
        public string NombreProducto { get; set; } = string.Empty;
        public string Peso { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public int Cantidad { get; set; }
        public decimal Subtotal { get; set; }
        public DateTime FechaAgregado { get; set; }
    }

    public class AgregarAlCarritoDto
    {
        [Required]
        public int IdVariacion { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser mayor a 0")]
        public int Cantidad { get; set; }
    }
}
