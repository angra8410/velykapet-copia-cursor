using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VentasPetApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProductImageUrlsToCloudflareR2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 1,
                columns: new[] { "FechaActualizacion", "FechaCreacion", "URLImagen" },
                values: new object[] { new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2500), new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2499), "https://www.velykapet.com/productos/alimentos/perros/ROYAL_CANIN_ADULT.jpg" });

            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 2,
                columns: new[] { "FechaActualizacion", "FechaCreacion" },
                values: new object[] { new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2504), new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2504) });

            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 3,
                columns: new[] { "FechaActualizacion", "FechaCreacion", "URLImagen" },
                values: new object[] { new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2508), new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2507), "https://www.velykapet.com/productos/alimentos/perros/HILLS_SCIENCE_DIET_PUPPY.jpg" });

            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 4,
                columns: new[] { "FechaActualizacion", "FechaCreacion", "URLImagen" },
                values: new object[] { new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2511), new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2511), "https://www.velykapet.com/productos/alimentos/gatos/PURINA_PRO_PLAN_ADULT_CAT.jpg" });

            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 5,
                columns: new[] { "FechaActualizacion", "FechaCreacion", "URLImagen" },
                values: new object[] { new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2514), new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2514), "https://www.velykapet.com/productos/snacks/SNACKS_NATURALES.jpg" });

            migrationBuilder.UpdateData(
                table: "Proveedores",
                keyColumn: "ProveedorId",
                keyValue: 1,
                columns: new[] { "FechaCreacion", "FechaModificacion" },
                values: new object[] { new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2428), new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2448) });

            migrationBuilder.UpdateData(
                table: "Proveedores",
                keyColumn: "ProveedorId",
                keyValue: 2,
                columns: new[] { "FechaCreacion", "FechaModificacion" },
                values: new object[] { new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2455), new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2455) });

            migrationBuilder.UpdateData(
                table: "Proveedores",
                keyColumn: "ProveedorId",
                keyValue: 3,
                columns: new[] { "FechaCreacion", "FechaModificacion" },
                values: new object[] { new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2458), new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2458) });

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 1,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2561));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 2,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2564));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 3,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2566));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 4,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2568));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 5,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2571));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 6,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2573));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 7,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2575));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 8,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2577));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 9,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2579));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 10,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2642));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 11,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2645));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 12,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2647));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 1,
                columns: new[] { "FechaActualizacion", "FechaCreacion", "URLImagen" },
                values: new object[] { new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6309), new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6309), "/images/productos/royal-canin-adult.jpg" });

            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 2,
                columns: new[] { "FechaActualizacion", "FechaCreacion" },
                values: new object[] { new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6313), new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6312) });

            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 3,
                columns: new[] { "FechaActualizacion", "FechaCreacion", "URLImagen" },
                values: new object[] { new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6316), new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6316), "/images/productos/hills-puppy.jpg" });

            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 4,
                columns: new[] { "FechaActualizacion", "FechaCreacion", "URLImagen" },
                values: new object[] { new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6320), new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6319), "/images/productos/purina-cat.jpg" });

            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 5,
                columns: new[] { "FechaActualizacion", "FechaCreacion", "URLImagen" },
                values: new object[] { new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6323), new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6322), "/images/productos/snacks.jpg" });

            migrationBuilder.UpdateData(
                table: "Proveedores",
                keyColumn: "ProveedorId",
                keyValue: 1,
                columns: new[] { "FechaCreacion", "FechaModificacion" },
                values: new object[] { new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6242), new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6260) });

            migrationBuilder.UpdateData(
                table: "Proveedores",
                keyColumn: "ProveedorId",
                keyValue: 2,
                columns: new[] { "FechaCreacion", "FechaModificacion" },
                values: new object[] { new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6267), new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6267) });

            migrationBuilder.UpdateData(
                table: "Proveedores",
                keyColumn: "ProveedorId",
                keyValue: 3,
                columns: new[] { "FechaCreacion", "FechaModificacion" },
                values: new object[] { new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6270), new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6270) });

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 1,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6366));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 2,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6369));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 3,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6372));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 4,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6374));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 5,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6376));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 6,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6379));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 7,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6381));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 8,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6383));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 9,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6385));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 10,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6445));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 11,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6447));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 12,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 5, 2, 4, 50, 45, DateTimeKind.Local).AddTicks(6449));
        }
    }
}
