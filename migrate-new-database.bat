@echo off
echo ========================================
echo 🔄 Migrando Nueva Base de Datos
echo ========================================
echo.

cd backend-config

echo 📦 Restaurando paquetes NuGet...
dotnet restore
if %errorlevel% neq 0 (
    echo ❌ Error al restaurar paquetes
    pause
    exit /b 1
)

echo ✅ Paquetes restaurados
echo.

echo 🗄️  Creando migración inicial...
dotnet ef migrations add InitialCreate --output-dir Migrations
if %errorlevel% neq 0 (
    echo ❌ Error al crear migración
    pause
    exit /b 1
)

echo ✅ Migración creada
echo.

echo 🚀 Aplicando migración a la nueva base de datos...
dotnet ef database update
if %errorlevel% neq 0 (
    echo ❌ Error al aplicar migración
    pause
    exit /b 1
)

echo ✅ Migración aplicada exitosamente
echo.

echo 📊 Verificando tablas creadas...
sqlcmd -S localhost -E -d VentasPet_Nueva -Q "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'"

echo.
echo 🎉 ¡Base de datos nueva completamente configurada!
echo.
echo 📋 Tablas creadas:
echo    - Usuarios
echo    - Categorias  
echo    - Proveedores
echo    - Productos
echo    - VariacionesProducto
echo    - Pedidos
echo    - ItemsPedido
echo    - Pagos
echo    - CarritoCompras
echo.
echo 📝 Datos iniciales incluidos:
echo    - 4 Categorías (Alimento Perros, Gatos, Snacks, Accesorios)
echo    - 3 Proveedores (Royal Canin, Hill's, Purina)
echo.
pause
