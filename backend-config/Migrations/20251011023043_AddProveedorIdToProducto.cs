using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VentasPetApi.Migrations
{
    /// <inheritdoc />
    public partial class AddProveedorIdToProducto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Productos_Proveedores_ProveedorId",
                table: "Productos");

            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 1,
                columns: new[] { "FechaActualizacion", "FechaCreacion" },
                values: new object[] { new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9736), new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9736) });

            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 2,
                columns: new[] { "FechaActualizacion", "FechaCreacion" },
                values: new object[] { new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9742), new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9741) });

            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 3,
                columns: new[] { "FechaActualizacion", "FechaCreacion" },
                values: new object[] { new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9747), new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9746) });

            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 4,
                columns: new[] { "FechaActualizacion", "FechaCreacion" },
                values: new object[] { new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9751), new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9750) });

            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 5,
                columns: new[] { "FechaActualizacion", "FechaCreacion" },
                values: new object[] { new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9755), new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9755) });

            migrationBuilder.UpdateData(
                table: "Proveedores",
                keyColumn: "ProveedorId",
                keyValue: 1,
                columns: new[] { "FechaCreacion", "FechaModificacion" },
                values: new object[] { new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9668), new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9687) });

            migrationBuilder.UpdateData(
                table: "Proveedores",
                keyColumn: "ProveedorId",
                keyValue: 2,
                columns: new[] { "FechaCreacion", "FechaModificacion" },
                values: new object[] { new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9692), new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9693) });

            migrationBuilder.UpdateData(
                table: "Proveedores",
                keyColumn: "ProveedorId",
                keyValue: 3,
                columns: new[] { "FechaCreacion", "FechaModificacion" },
                values: new object[] { new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9695), new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9696) });

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 1,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9796));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 2,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9799));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 3,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9801));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 4,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9804));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 5,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9806));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 6,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9808));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 7,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9811));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 8,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9813));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 9,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9815));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 10,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9818));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 11,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9820));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 12,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 11, 2, 30, 42, 810, DateTimeKind.Local).AddTicks(9823));

            migrationBuilder.AddForeignKey(
                name: "FK_Productos_Proveedores_ProveedorId",
                table: "Productos",
                column: "ProveedorId",
                principalTable: "Proveedores",
                principalColumn: "ProveedorId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Productos_Proveedores_ProveedorId",
                table: "Productos");

            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 1,
                columns: new[] { "FechaActualizacion", "FechaCreacion" },
                values: new object[] { new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5175), new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5175) });

            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 2,
                columns: new[] { "FechaActualizacion", "FechaCreacion" },
                values: new object[] { new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5181), new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5180) });

            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 3,
                columns: new[] { "FechaActualizacion", "FechaCreacion" },
                values: new object[] { new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5186), new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5185) });

            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 4,
                columns: new[] { "FechaActualizacion", "FechaCreacion" },
                values: new object[] { new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5190), new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5190) });

            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 5,
                columns: new[] { "FechaActualizacion", "FechaCreacion" },
                values: new object[] { new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5194), new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5194) });

            migrationBuilder.UpdateData(
                table: "Proveedores",
                keyColumn: "ProveedorId",
                keyValue: 1,
                columns: new[] { "FechaCreacion", "FechaModificacion" },
                values: new object[] { new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5111), new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5128) });

            migrationBuilder.UpdateData(
                table: "Proveedores",
                keyColumn: "ProveedorId",
                keyValue: 2,
                columns: new[] { "FechaCreacion", "FechaModificacion" },
                values: new object[] { new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5133), new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5134) });

            migrationBuilder.UpdateData(
                table: "Proveedores",
                keyColumn: "ProveedorId",
                keyValue: 3,
                columns: new[] { "FechaCreacion", "FechaModificacion" },
                values: new object[] { new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5137), new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5137) });

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 1,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5239));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 2,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5243));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 3,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5246));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 4,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5248));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 5,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5251));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 6,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5253));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 7,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5255));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 8,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5258));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 9,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5260));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 10,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5262));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 11,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5265));

            migrationBuilder.UpdateData(
                table: "VariacionesProducto",
                keyColumn: "IdVariacion",
                keyValue: 12,
                column: "FechaCreacion",
                value: new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5267));

            migrationBuilder.AddForeignKey(
                name: "FK_Productos_Proveedores_ProveedorId",
                table: "Productos",
                column: "ProveedorId",
                principalTable: "Proveedores",
                principalColumn: "ProveedorId");
        }
    }
}
