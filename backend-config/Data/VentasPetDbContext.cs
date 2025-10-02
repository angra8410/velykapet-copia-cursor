using Microsoft.EntityFrameworkCore;
using VentasPetApi.Models;

namespace VentasPetApi.Data
{
    public class VentasPetDbContext : DbContext
    {
        public VentasPetDbContext(DbContextOptions<VentasPetDbContext> options) : base(options)
        {
        }

        // Tablas principales
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Proveedor> Proveedores { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<VariacionProducto> VariacionesProducto { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }
        public DbSet<ItemPedido> ItemsPedido { get; set; }
        public DbSet<Pago> Pagos { get; set; }
        public DbSet<CarritoCompras> CarritoCompras { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración de Usuarios
            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.HasKey(e => e.IdUsuario);
                entity.Property(e => e.Nombre).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Telefono).HasMaxLength(20);
                entity.Property(e => e.Direccion).HasMaxLength(500);
                entity.HasIndex(e => e.Email).IsUnique();
            });

            // Configuración de Categorías
            modelBuilder.Entity<Categoria>(entity =>
            {
                entity.HasKey(e => e.IdCategoria);
                entity.Property(e => e.Nombre).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Descripcion).HasMaxLength(500);
            });

            // Configuración de Proveedores
            modelBuilder.Entity<Proveedor>(entity =>
            {
                entity.HasKey(e => e.ProveedorId);
                entity.Property(e => e.Nombre).IsRequired().HasMaxLength(100);
                entity.Property(e => e.RazonSocial).HasMaxLength(200);
                entity.Property(e => e.NIT).HasMaxLength(20);
                entity.Property(e => e.Direccion).HasMaxLength(500);
                entity.Property(e => e.Telefono).HasMaxLength(20);
                entity.Property(e => e.Email).HasMaxLength(100);
                entity.Property(e => e.SitioWeb).HasMaxLength(200);
                entity.Property(e => e.PersonaContacto).HasMaxLength(100);
                entity.Property(e => e.Notas).HasMaxLength(1000);
            });

            // Configuración de Productos
            modelBuilder.Entity<Producto>(entity =>
            {
                entity.HasKey(e => e.IdProducto);
                entity.Property(e => e.NombreBase).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Descripcion).HasMaxLength(1000);
                entity.Property(e => e.TipoMascota).IsRequired().HasMaxLength(50);
                entity.Property(e => e.URLImagen).HasMaxLength(500);

                // Relaciones
                entity.HasOne(d => d.Categoria)
                    .WithMany(p => p.Productos)
                    .HasForeignKey(d => d.IdCategoria)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configuración de Variaciones de Producto
            modelBuilder.Entity<VariacionProducto>(entity =>
            {
                entity.HasKey(e => e.IdVariacion);
                entity.Property(e => e.Peso).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Precio).HasColumnType("decimal(10,2)");

                // Relación con Producto
                entity.HasOne(d => d.Producto)
                    .WithMany(p => p.Variaciones)
                    .HasForeignKey(d => d.IdProducto)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configuración de Pedidos
            modelBuilder.Entity<Pedido>(entity =>
            {
                entity.HasKey(e => e.IdPedido);
                entity.Property(e => e.Estado).IsRequired().HasMaxLength(50);
                entity.Property(e => e.TotalPedido).HasColumnType("decimal(10,2)");
                entity.Property(e => e.DireccionEnvio).HasMaxLength(500);
                entity.Property(e => e.Notas).HasMaxLength(1000);

                // Relación con Usuario
                entity.HasOne(d => d.Usuario)
                    .WithMany(p => p.Pedidos)
                    .HasForeignKey(d => d.IdUsuario)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configuración de Items de Pedido
            modelBuilder.Entity<ItemPedido>(entity =>
            {
                entity.HasKey(e => e.IdItemPedido);
                entity.Property(e => e.Cantidad).IsRequired();
                entity.Property(e => e.PrecioUnitario).HasColumnType("decimal(10,2)");
                entity.Property(e => e.Subtotal).HasColumnType("decimal(10,2)");

                // Relaciones
                entity.HasOne(d => d.Pedido)
                    .WithMany(p => p.ItemsPedido)
                    .HasForeignKey(d => d.IdPedido)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.Variacion)
                    .WithMany(v => v.ItemsPedido)
                    .HasForeignKey(d => d.IdVariacion)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configuración de Pagos
            modelBuilder.Entity<Pago>(entity =>
            {
                entity.HasKey(e => e.IdPago);
                entity.Property(e => e.Metodo).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Estado).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Monto).HasColumnType("decimal(10,2)");
                entity.Property(e => e.IdTransaccion).HasMaxLength(100);

                // Relación con Pedido
                entity.HasOne(d => d.Pedido)
                    .WithMany(p => p.Pagos)
                    .HasForeignKey(d => d.IdPedido)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configuración de Carrito de Compras
            modelBuilder.Entity<CarritoCompras>(entity =>
            {
                entity.HasKey(e => e.IdCarrito);
                entity.Property(e => e.Cantidad).IsRequired();

                // Relaciones
                entity.HasOne(d => d.Usuario)
                    .WithMany(p => p.CarritoCompras)
                    .HasForeignKey(d => d.IdUsuario)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.Variacion)
                    .WithMany(v => v.CarritoCompras)
                    .HasForeignKey(d => d.IdVariacion)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Datos iniciales
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Categorías iniciales
            modelBuilder.Entity<Categoria>().HasData(
                new Categoria
                {
                    IdCategoria = 1,
                    Nombre = "Alimento para Perros",
                    Descripcion = "Alimento balanceado para perros de todas las edades",
                    TipoMascota = "Perros",
                    Activa = true
                },
                new Categoria
                {
                    IdCategoria = 2,
                    Nombre = "Alimento para Gatos",
                    Descripcion = "Alimento balanceado para gatos de todas las edades",
                    TipoMascota = "Gatos",
                    Activa = true
                },
                new Categoria
                {
                    IdCategoria = 3,
                    Nombre = "Snacks y Premios",
                    Descripcion = "Snacks y premios para perros y gatos",
                    TipoMascota = "Ambos",
                    Activa = true
                },
                new Categoria
                {
                    IdCategoria = 4,
                    Nombre = "Accesorios",
                    Descripcion = "Accesorios para mascotas",
                    TipoMascota = "Ambos",
                    Activa = true
                }
            );

            // Proveedores iniciales
            modelBuilder.Entity<Proveedor>().HasData(
                new Proveedor
                {
                    ProveedorId = 1,
                    Nombre = "Royal Canin",
                    RazonSocial = "Royal Canin México S.A. de C.V.",
                    NIT = "900123456-7",
                    Direccion = "Av. Insurgentes Sur 1234, Ciudad de México",
                    Telefono = "55-1234-5678",
                    Email = "contacto@royalcanin.com.mx",
                    SitioWeb = "https://www.royalcanin.com.mx",
                    PersonaContacto = "María González",
                    Notas = "Proveedor principal de alimento premium",
                    Activo = true
                },
                new Proveedor
                {
                    ProveedorId = 2,
                    Nombre = "Hill's Science Diet",
                    RazonSocial = "Hill's Pet Nutrition México",
                    NIT = "900987654-3",
                    Direccion = "Blvd. Ávila Camacho 567, Estado de México",
                    Telefono = "55-9876-5432",
                    Email = "ventas@hills.com.mx",
                    SitioWeb = "https://www.hills.com.mx",
                    PersonaContacto = "Carlos Rodríguez",
                    Notas = "Especialistas en nutrición veterinaria",
                    Activo = true
                },
                new Proveedor
                {
                    ProveedorId = 3,
                    Nombre = "Purina Pro Plan",
                    RazonSocial = "Nestlé Purina PetCare México",
                    NIT = "900456789-1",
                    Direccion = "Carretera México-Toluca Km 15.5, Estado de México",
                    Telefono = "55-4567-8912",
                    Email = "distribuidores@purina.com.mx",
                    SitioWeb = "https://www.purina.com.mx",
                    PersonaContacto = "Ana Martínez",
                    Notas = "Alimento de alta calidad para mascotas",
                    Activo = true
                }
            );
        }
    }
}