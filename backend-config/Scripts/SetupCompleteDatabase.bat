@echo off
REM ============================================================================
REM SCRIPT MAESTRO: Setup Completo de Base de Datos VentasPet_Nueva
REM ============================================================================
REM Este script ejecuta el proceso completo de configuración en el orden correcto:
REM 1. Seed de datos iniciales (categorías, proveedores, productos, variaciones)
REM 2. Actualización de imágenes de R2 (URLs de Cloudflare)
REM
REM USAR ESTE SCRIPT cuando:
REM - La base de datos está vacía
REM - No hay productos en la tabla Productos
REM - Quiere configurar todo desde cero
REM ============================================================================

echo.
echo ============================================================================
echo SETUP COMPLETO DE BASE DE DATOS - VentasPet_Nueva
echo ============================================================================
echo.
echo Este script ejecutara:
echo   1. Seed de datos iniciales (Categorias, Proveedores, Productos, Variaciones)
echo   2. Actualizacion de URLs de imagenes de Cloudflare R2
echo.
echo Tiempo estimado: 5-10 segundos
echo.
pause

REM Cambiar al directorio de Scripts
cd /d %~dp0

echo.
echo ============================================================================
echo ETAPA 1: SEED DE DATOS INICIALES
echo ============================================================================
echo.

sqlcmd -S localhost -d VentasPet_Nueva -E -i SeedInitialProducts.sql

if errorlevel 1 (
    echo.
    echo ERROR: El script SeedInitialProducts.sql fallo
    echo Por favor revise los errores anteriores
    pause
    exit /b 1
)

echo.
echo ============================================================================
echo ETAPA 2: ACTUALIZACION DE IMAGENES R2
echo ============================================================================
echo.

sqlcmd -S localhost -d VentasPet_Nueva -E -i AddSampleProductImages.sql

if errorlevel 1 (
    echo.
    echo ERROR: El script AddSampleProductImages.sql fallo
    echo Por favor revise los errores anteriores
    pause
    exit /b 1
)

echo.
echo ============================================================================
echo SETUP COMPLETO FINALIZADO
echo ============================================================================
echo.
echo Proximos pasos:
echo   1. Iniciar el backend: cd backend-config ^&^& dotnet run --urls="http://localhost:5135"
echo   2. Iniciar el frontend: npm start (puerto 3333)
echo   3. Abrir navegador en http://localhost:3333
echo   4. Navegar al catalogo (Gatolandia o Perrolandia)
echo   5. Verificar que las imagenes se muestran correctamente
echo.
echo NOTA: Si las imagenes no se ven, verificar que existen en Cloudflare R2
echo.

pause
