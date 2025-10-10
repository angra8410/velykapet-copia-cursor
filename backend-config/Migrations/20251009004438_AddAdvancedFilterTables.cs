using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace VentasPetApi.Migrations
{
    /// <inheritdoc />
    public partial class AddAdvancedFilterTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IdCategoriaAlimento",
                table: "Productos",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IdMascotaTipo",
                table: "Productos",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IdPresentacion",
                table: "Productos",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IdSubcategoria",
                table: "Productos",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "MascotaTipo",
                columns: table => new
                {
                    IdMascotaTipo = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nombre = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Activo = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MascotaTipo", x => x.IdMascotaTipo);
                });

            migrationBuilder.CreateTable(
                name: "PresentacionEmpaque",
                columns: table => new
                {
                    IdPresentacion = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nombre = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Activa = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PresentacionEmpaque", x => x.IdPresentacion);
                });

            migrationBuilder.CreateTable(
                name: "CategoriaAlimento",
                columns: table => new
                {
                    IdCategoriaAlimento = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nombre = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    IdMascotaTipo = table.Column<int>(type: "INTEGER", nullable: true),
                    Activa = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoriaAlimento", x => x.IdCategoriaAlimento);
                    table.ForeignKey(
                        name: "FK_CategoriaAlimento_MascotaTipo_IdMascotaTipo",
                        column: x => x.IdMascotaTipo,
                        principalTable: "MascotaTipo",
                        principalColumn: "IdMascotaTipo",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SubcategoriaAlimento",
                columns: table => new
                {
                    IdSubcategoria = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nombre = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    IdCategoriaAlimento = table.Column<int>(type: "INTEGER", nullable: false),
                    Activa = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubcategoriaAlimento", x => x.IdSubcategoria);
                    table.ForeignKey(
                        name: "FK_SubcategoriaAlimento_CategoriaAlimento_IdCategoriaAlimento",
                        column: x => x.IdCategoriaAlimento,
                        principalTable: "CategoriaAlimento",
                        principalColumn: "IdCategoriaAlimento",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "CategoriaAlimento",
                columns: new[] { "IdCategoriaAlimento", "Activa", "IdMascotaTipo", "Nombre" },
                values: new object[] { 5, true, null, "SNACKS Y PREMIOS" });

            migrationBuilder.InsertData(
                table: "MascotaTipo",
                columns: new[] { "IdMascotaTipo", "Activo", "Nombre" },
                values: new object[,]
                {
                    { 1, true, "GATO" },
                    { 2, true, "PERRO" }
                });

            migrationBuilder.InsertData(
                table: "PresentacionEmpaque",
                columns: new[] { "IdPresentacion", "Activa", "Nombre" },
                values: new object[,]
                {
                    { 1, true, "BOLSA" },
                    { 2, true, "LATA" },
                    { 3, true, "SOBRE" },
                    { 4, true, "CAJA" },
                    { 5, true, "TUBO" }
                });

            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 1,
                columns: new[] { "FechaActualizacion", "FechaCreacion", "IdCategoriaAlimento", "IdMascotaTipo", "IdPresentacion", "IdSubcategoria" },
                values: new object[] { new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5175), new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5175), 1, 2, 1, 2 });

            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 2,
                columns: new[] { "FechaActualizacion", "FechaCreacion", "IdCategoriaAlimento", "IdMascotaTipo", "IdPresentacion", "IdSubcategoria" },
                values: new object[] { new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5181), new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5180), 5, 1, 3, 13 });

            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 3,
                columns: new[] { "FechaActualizacion", "FechaCreacion", "IdCategoriaAlimento", "IdMascotaTipo", "IdPresentacion", "IdSubcategoria" },
                values: new object[] { new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5186), new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5185), 1, 2, 1, 3 });

            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 4,
                columns: new[] { "FechaActualizacion", "FechaCreacion", "IdCategoriaAlimento", "IdMascotaTipo", "IdPresentacion", "IdSubcategoria" },
                values: new object[] { new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5190), new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5190), 2, 1, 1, 6 });

            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 5,
                columns: new[] { "FechaActualizacion", "FechaCreacion", "IdCategoriaAlimento", "IdMascotaTipo", "IdPresentacion", "IdSubcategoria" },
                values: new object[] { new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5194), new DateTime(2025, 10, 9, 0, 44, 37, 398, DateTimeKind.Local).AddTicks(5194), 5, null, 1, 13 });

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

            migrationBuilder.InsertData(
                table: "CategoriaAlimento",
                columns: new[] { "IdCategoriaAlimento", "Activa", "IdMascotaTipo", "Nombre" },
                values: new object[,]
                {
                    { 1, true, 2, "ALIMENTO SECO" },
                    { 2, true, 1, "ALIMENTO SECO" },
                    { 3, true, 2, "ALIMENTO HÚMEDO" },
                    { 4, true, 1, "ALIMENTO HÚMEDO" }
                });

            migrationBuilder.InsertData(
                table: "SubcategoriaAlimento",
                columns: new[] { "IdSubcategoria", "Activa", "IdCategoriaAlimento", "Nombre" },
                values: new object[,]
                {
                    { 13, true, 5, "SNACKS NATURALES" },
                    { 14, true, 5, "PREMIOS DE ENTRENAMIENTO" },
                    { 1, true, 1, "DIETA SECA PRESCRITA" },
                    { 2, true, 1, "ADULT" },
                    { 3, true, 1, "PUPPY" },
                    { 4, true, 1, "SENIOR" },
                    { 5, true, 2, "DIETA SECA PRESCRITA" },
                    { 6, true, 2, "ADULT" },
                    { 7, true, 2, "KITTEN" },
                    { 8, true, 2, "INDOOR" },
                    { 9, true, 3, "DIETA HÚMEDA PRESCRITA" },
                    { 10, true, 3, "ADULT HÚMEDO" },
                    { 11, true, 4, "DIETA HÚMEDA PRESCRITA" },
                    { 12, true, 4, "ADULT HÚMEDO" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Productos_IdCategoriaAlimento",
                table: "Productos",
                column: "IdCategoriaAlimento");

            migrationBuilder.CreateIndex(
                name: "IX_Productos_IdMascotaTipo",
                table: "Productos",
                column: "IdMascotaTipo");

            migrationBuilder.CreateIndex(
                name: "IX_Productos_IdPresentacion",
                table: "Productos",
                column: "IdPresentacion");

            migrationBuilder.CreateIndex(
                name: "IX_Productos_IdSubcategoria",
                table: "Productos",
                column: "IdSubcategoria");

            migrationBuilder.CreateIndex(
                name: "IX_CategoriaAlimento_IdMascotaTipo",
                table: "CategoriaAlimento",
                column: "IdMascotaTipo");

            migrationBuilder.CreateIndex(
                name: "IX_SubcategoriaAlimento_IdCategoriaAlimento",
                table: "SubcategoriaAlimento",
                column: "IdCategoriaAlimento");

            migrationBuilder.AddForeignKey(
                name: "FK_Productos_CategoriaAlimento_IdCategoriaAlimento",
                table: "Productos",
                column: "IdCategoriaAlimento",
                principalTable: "CategoriaAlimento",
                principalColumn: "IdCategoriaAlimento",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Productos_MascotaTipo_IdMascotaTipo",
                table: "Productos",
                column: "IdMascotaTipo",
                principalTable: "MascotaTipo",
                principalColumn: "IdMascotaTipo",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Productos_PresentacionEmpaque_IdPresentacion",
                table: "Productos",
                column: "IdPresentacion",
                principalTable: "PresentacionEmpaque",
                principalColumn: "IdPresentacion",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Productos_SubcategoriaAlimento_IdSubcategoria",
                table: "Productos",
                column: "IdSubcategoria",
                principalTable: "SubcategoriaAlimento",
                principalColumn: "IdSubcategoria",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Productos_CategoriaAlimento_IdCategoriaAlimento",
                table: "Productos");

            migrationBuilder.DropForeignKey(
                name: "FK_Productos_MascotaTipo_IdMascotaTipo",
                table: "Productos");

            migrationBuilder.DropForeignKey(
                name: "FK_Productos_PresentacionEmpaque_IdPresentacion",
                table: "Productos");

            migrationBuilder.DropForeignKey(
                name: "FK_Productos_SubcategoriaAlimento_IdSubcategoria",
                table: "Productos");

            migrationBuilder.DropTable(
                name: "PresentacionEmpaque");

            migrationBuilder.DropTable(
                name: "SubcategoriaAlimento");

            migrationBuilder.DropTable(
                name: "CategoriaAlimento");

            migrationBuilder.DropTable(
                name: "MascotaTipo");

            migrationBuilder.DropIndex(
                name: "IX_Productos_IdCategoriaAlimento",
                table: "Productos");

            migrationBuilder.DropIndex(
                name: "IX_Productos_IdMascotaTipo",
                table: "Productos");

            migrationBuilder.DropIndex(
                name: "IX_Productos_IdPresentacion",
                table: "Productos");

            migrationBuilder.DropIndex(
                name: "IX_Productos_IdSubcategoria",
                table: "Productos");

            migrationBuilder.DropColumn(
                name: "IdCategoriaAlimento",
                table: "Productos");

            migrationBuilder.DropColumn(
                name: "IdMascotaTipo",
                table: "Productos");

            migrationBuilder.DropColumn(
                name: "IdPresentacion",
                table: "Productos");

            migrationBuilder.DropColumn(
                name: "IdSubcategoria",
                table: "Productos");

            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 1,
                columns: new[] { "FechaActualizacion", "FechaCreacion" },
                values: new object[] { new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2500), new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2499) });

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
                columns: new[] { "FechaActualizacion", "FechaCreacion" },
                values: new object[] { new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2508), new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2507) });

            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 4,
                columns: new[] { "FechaActualizacion", "FechaCreacion" },
                values: new object[] { new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2511), new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2511) });

            migrationBuilder.UpdateData(
                table: "Productos",
                keyColumn: "IdProducto",
                keyValue: 5,
                columns: new[] { "FechaActualizacion", "FechaCreacion" },
                values: new object[] { new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2514), new DateTime(2025, 10, 6, 1, 11, 24, 857, DateTimeKind.Local).AddTicks(2514) });

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
    }
}
