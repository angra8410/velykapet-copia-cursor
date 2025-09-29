@echo off
echo.
echo ========================================
echo  🚀 VentasPet - Ambiente de PRODUCCIÓN
echo ========================================
echo.

REM Establecer ambiente de producción
set NODE_ENV=production

REM Iniciar el servidor
node simple-server.cjs