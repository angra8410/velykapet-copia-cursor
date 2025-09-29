@echo off
echo.
echo ========================================
echo  🌐 VentasPet - Solo Frontend
echo ========================================
echo.

REM Verificar si Node.js está disponible
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error: Node.js no encontrado
    echo Por favor instala Node.js desde https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js disponible
echo 🌐 Iniciando Frontend Server en puerto 3333...
echo.
echo 💡 URLs disponibles:
echo    Frontend: http://localhost:3333
echo    Para conectar al backend: http://localhost:5135
echo.
echo ⏹️  Para detener: Ctrl+C
echo.

node simple-server.cjs