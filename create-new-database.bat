@echo off
echo ========================================
echo 🗄️  Creando Nueva Base de Datos SQL Server
echo ========================================
echo.

echo 📋 Verificando SQL Server...
sqlcmd -S localhost -E -Q "SELECT @@VERSION" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: No se puede conectar a SQL Server
    echo    Asegúrate de que SQL Server esté ejecutándose
    echo    y que la autenticación de Windows esté habilitada
    pause
    exit /b 1
)

echo ✅ SQL Server está disponible
echo.

echo 🗄️  Creando base de datos 'VentasPet_Nueva'...
sqlcmd -S localhost -E -Q "IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'VentasPet_Nueva') CREATE DATABASE VentasPet_Nueva"

if %errorlevel% neq 0 (
    echo ❌ Error al crear la base de datos
    pause
    exit /b 1
)

echo ✅ Base de datos 'VentasPet_Nueva' creada exitosamente
echo.

echo 📊 Verificando la nueva base de datos...
sqlcmd -S localhost -E -d VentasPet_Nueva -Q "SELECT 'Base de datos creada correctamente' as Mensaje"

echo.
echo 🎉 ¡Base de datos nueva lista para usar!
echo.
echo 📝 Próximos pasos:
echo    1. Ejecutar: install-backend.bat
echo    2. Ejecutar: setup-complete-backend.bat
echo    3. Iniciar el servidor: start-backend.bat
echo.
pause
