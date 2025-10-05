using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace VentasPetApi.Migrations
{
    /// <inheritdoc />
    public partial class ActualizarProductoConImagenCloudflareR2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categorias",
                columns: table => new
                {
                    IdCategoria = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nombre = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Descripcion = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    TipoMascota = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    Activa = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categorias", x => x.IdCategoria);
                });

            migrationBuilder.CreateTable(
                name: "Proveedores",
                columns: table => new
                {
                    ProveedorId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nombre = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    RazonSocial = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    NIT = table.Column<string>(type: "TEXT", maxLength: 20, nullable: true),
                    Direccion = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Telefono = table.Column<string>(type: "TEXT", maxLength: 20, nullable: true),
                    Email = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    SitioWeb = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    PersonaContacto = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    Notas = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    Activo = table.Column<bool>(type: "INTEGER", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "TEXT", nullable: false),
                    FechaModificacion = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Proveedores", x => x.ProveedorId);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    IdUsuario = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nombre = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Apellido = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Contrasena = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Telefono = table.Column<string>(type: "TEXT", maxLength: 20, nullable: true),
                    Direccion = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Activo = table.Column<bool>(type: "INTEGER", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "TEXT", nullable: false),
                    FechaActualizacion = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.IdUsuario);
                });

            migrationBuilder.CreateTable(
                name: "Productos",
                columns: table => new
                {
                    IdProducto = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    NombreBase = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Descripcion = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    IdCategoria = table.Column<int>(type: "INTEGER", nullable: false),
                    TipoMascota = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    URLImagen = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Activo = table.Column<bool>(type: "INTEGER", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "TEXT", nullable: false),
                    FechaActualizacion = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ProveedorId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Productos", x => x.IdProducto);
                    table.ForeignKey(
                        name: "FK_Productos_Categorias_IdCategoria",
                        column: x => x.IdCategoria,
                        principalTable: "Categorias",
                        principalColumn: "IdCategoria",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Productos_Proveedores_ProveedorId",
                        column: x => x.ProveedorId,
                        principalTable: "Proveedores",
                        principalColumn: "ProveedorId");
                });

            migrationBuilder.CreateTable(
                name: "Pedidos",
                columns: table => new
                {
                    IdPedido = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    IdUsuario = table.Column<int>(type: "INTEGER", nullable: false),
                    NumeroPedido = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Estado = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    TotalPedido = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    DireccionEnvio = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    TelefonoContacto = table.Column<string>(type: "TEXT", maxLength: 20, nullable: true),
                    Notas = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    FechaCreacion = table.Column<DateTime>(type: "TEXT", nullable: false),
                    FechaActualizacion = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pedidos", x => x.IdPedido);
                    table.ForeignKey(
                        name: "FK_Pedidos_Usuarios_IdUsuario",
                        column: x => x.IdUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "VariacionesProducto",
                columns: table => new
                {
                    IdVariacion = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    IdProducto = table.Column<int>(type: "INTEGER", nullable: false),
                    Peso = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Precio = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Stock = table.Column<int>(type: "INTEGER", nullable: false),
                    Activa = table.Column<bool>(type: "INTEGER", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VariacionesProducto", x => x.IdVariacion);
                    table.ForeignKey(
                        name: "FK_VariacionesProducto_Productos_IdProducto",
                        column: x => x.IdProducto,
                        principalTable: "Productos",
                        principalColumn: "IdProducto",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Pagos",
                columns: table => new
                {
                    IdPago = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    IdPedido = table.Column<int>(type: "INTEGER", nullable: false),
                    Monto = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Estado = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Metodo = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    IdTransaccion = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    DetallesPago = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    FechaCreacion = table.Column<DateTime>(type: "TEXT", nullable: false),
                    FechaActualizacion = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pagos", x => x.IdPago);
                    table.ForeignKey(
                        name: "FK_Pagos_Pedidos_IdPedido",
                        column: x => x.IdPedido,
                        principalTable: "Pedidos",
                        principalColumn: "IdPedido",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CarritoCompras",
                columns: table => new
                {
                    IdCarrito = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    IdUsuario = table.Column<int>(type: "INTEGER", nullable: false),
                    IdVariacion = table.Column<int>(type: "INTEGER", nullable: false),
                    Cantidad = table.Column<int>(type: "INTEGER", nullable: false),
                    FechaAgregado = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CarritoCompras", x => x.IdCarrito);
                    table.ForeignKey(
                        name: "FK_CarritoCompras_Usuarios_IdUsuario",
                        column: x => x.IdUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CarritoCompras_VariacionesProducto_IdVariacion",
                        column: x => x.IdVariacion,
                        principalTable: "VariacionesProducto",
                        principalColumn: "IdVariacion",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ItemsPedido",
                columns: table => new
                {
                    IdItemPedido = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    IdPedido = table.Column<int>(type: "INTEGER", nullable: false),
                    IdVariacion = table.Column<int>(type: "INTEGER", nullable: false),
                    Cantidad = table.Column<int>(type: "INTEGER", nullable: false),
                    PrecioUnitario = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Subtotal = table.Column<decimal>(type: "decimal(10,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemsPedido", x => x.IdItemPedido);
                    table.ForeignKey(
                        name: "FK_ItemsPedido_Pedidos_IdPedido",
                        column: x => x.IdPedido,
                        principalTable: "Pedidos",
                        principalColumn: "IdPedido",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ItemsPedido_VariacionesProducto_IdVariacion",
                        column: x => x.IdVariacion,
                        principalTable: "VariacionesProducto",
                        principalColumn: "IdVariacion",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Categorias",
                columns: new[] { "IdCategoria", "Activa", "Descripcion", "Nombre", "TipoMascota" },
                values: new object[,]
                {
                    { 1, true, "Alimento balanceado para perros de todas las edades", "Alimento para Perros", "Perros" },
                    { 2, true, "Alimento balanceado para gatos de todas las edades", "Alimento para Gatos", "Gatos" },
                    { 3, true, "Snacks y premios para perros y gatos", "Snacks y Premios", "Ambos" },
                    { 4, true, "Accesorios para mascotas", "Accesorios", "Ambos" }
                });

            migrationBuilder.InsertData(
                table: "Proveedores",
                columns: new[] { "ProveedorId", "Activo", "Direccion", "Email", "FechaCreacion", "FechaModificacion", "NIT", "Nombre", "Notas", "PersonaContacto", "RazonSocial", "SitioWeb", "Telefono" },
                values: new object[,]
                {
                    { 1, true, "Av. Insurgentes Sur 1234, Ciudad de México", "contacto@royalcanin.com.mx", new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(4744), new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(4768), "900123456-7", "Royal Canin", "Proveedor principal de alimento premium", "María González", "Royal Canin México S.A. de C.V.", "https://www.royalcanin.com.mx", "55-1234-5678" },
                    { 2, true, "Blvd. Ávila Camacho 567, Estado de México", "ventas@hills.com.mx", new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(4782), new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(4783), "900987654-3", "Hill's Science Diet", "Especialistas en nutrición veterinaria", "Carlos Rodríguez", "Hill's Pet Nutrition México", "https://www.hills.com.mx", "55-9876-5432" },
                    { 3, true, "Carretera México-Toluca Km 15.5, Estado de México", "distribuidores@purina.com.mx", new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(4788), new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(4789), "900456789-1", "Purina Pro Plan", "Alimento de alta calidad para mascotas", "Ana Martínez", "Nestlé Purina PetCare México", "https://www.purina.com.mx", "55-4567-8912" }
                });

            migrationBuilder.InsertData(
                table: "Productos",
                columns: new[] { "IdProducto", "Activo", "Descripcion", "FechaActualizacion", "FechaCreacion", "IdCategoria", "NombreBase", "ProveedorId", "TipoMascota", "URLImagen" },
                values: new object[,]
                {
                    { 1, true, "Alimento balanceado para perros adultos de todas las razas", new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(4862), new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(4854), 1, "Royal Canin Adult", null, "Perros", "/images/productos/royal-canin-adult.jpg" },
                    { 2, true, "Alimento con balance adecuado de nutrientes que ayuda a reducir la formación de bolas de pelo", new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(4871), new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(4870), 2, "BR FOR CAT VET CONTROL DE PESO", null, "Gatos", "/images/productos/royal-canin-cat-weight.jpg" },
                    { 3, true, "Nutrición científicamente formulada para cachorros", new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(4877), new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(4876), 1, "Hill's Science Diet Puppy", null, "Perros", "/images/productos/hills-puppy.jpg" },
                    { 4, true, "Alimento completo y balanceado para gatos adultos", new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(4883), new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(4882), 2, "Purina Pro Plan Adult Cat", null, "Gatos", "/images/productos/purina-cat.jpg" },
                    { 5, true, "Premios naturales para perros y gatos", new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(4889), new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(4887), 3, "Snacks Naturales", null, "Ambos", "/images/productos/snacks.jpg" }
                });

            migrationBuilder.InsertData(
                table: "VariacionesProducto",
                columns: new[] { "IdVariacion", "Activa", "FechaCreacion", "IdProducto", "Peso", "Precio", "Stock" },
                values: new object[,]
                {
                    { 1, true, new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(5136), 1, "3 KG", 450.00m, 25 },
                    { 2, true, new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(5141), 1, "7.5 KG", 980.00m, 15 },
                    { 3, true, new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(5146), 1, "15 KG", 1850.00m, 10 },
                    { 4, true, new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(5150), 2, "500 GR", 204.00m, 50 },
                    { 5, true, new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(5154), 2, "1.5 KG", 582.00m, 30 },
                    { 6, true, new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(5158), 2, "3 KG", 1108.00m, 20 },
                    { 7, true, new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(5162), 3, "2 KG", 380.00m, 30 },
                    { 8, true, new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(5166), 3, "6 KG", 920.00m, 18 },
                    { 9, true, new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(5170), 4, "1 KG", 185.00m, 40 },
                    { 10, true, new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(5174), 4, "3 KG", 495.00m, 25 },
                    { 11, true, new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(5177), 5, "200 GR", 85.00m, 60 },
                    { 12, true, new DateTime(2025, 10, 4, 20, 5, 45, 297, DateTimeKind.Local).AddTicks(5181), 5, "500 GR", 195.00m, 35 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_CarritoCompras_IdUsuario",
                table: "CarritoCompras",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_CarritoCompras_IdVariacion",
                table: "CarritoCompras",
                column: "IdVariacion");

            migrationBuilder.CreateIndex(
                name: "IX_ItemsPedido_IdPedido",
                table: "ItemsPedido",
                column: "IdPedido");

            migrationBuilder.CreateIndex(
                name: "IX_ItemsPedido_IdVariacion",
                table: "ItemsPedido",
                column: "IdVariacion");

            migrationBuilder.CreateIndex(
                name: "IX_Pagos_IdPedido",
                table: "Pagos",
                column: "IdPedido");

            migrationBuilder.CreateIndex(
                name: "IX_Pedidos_IdUsuario",
                table: "Pedidos",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_Productos_IdCategoria",
                table: "Productos",
                column: "IdCategoria");

            migrationBuilder.CreateIndex(
                name: "IX_Productos_ProveedorId",
                table: "Productos",
                column: "ProveedorId");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Email",
                table: "Usuarios",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VariacionesProducto_IdProducto",
                table: "VariacionesProducto",
                column: "IdProducto");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CarritoCompras");

            migrationBuilder.DropTable(
                name: "ItemsPedido");

            migrationBuilder.DropTable(
                name: "Pagos");

            migrationBuilder.DropTable(
                name: "VariacionesProducto");

            migrationBuilder.DropTable(
                name: "Pedidos");

            migrationBuilder.DropTable(
                name: "Productos");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropTable(
                name: "Categorias");

            migrationBuilder.DropTable(
                name: "Proveedores");
        }
    }
}
