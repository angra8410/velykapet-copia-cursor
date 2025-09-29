@echo off
echo.
echo ========================================
echo  🚀 VentasPet - Ambiente Personalizado
echo ========================================
echo.

REM Verificar si se proporcionó un ambiente
if "%1"=="" (
    echo ❌ Error: Debes especificar un ambiente
    echo Uso: start-custom.bat [nombre_ambiente]
    echo Ejemplo: start-custom.bat staging
    exit /b 1
)

REM Establecer ambiente personalizado
set NODE_ENV=%1
echo 🌍 Usando ambiente: %1

REM Verificar si existe el archivo .env para el ambiente
if not exist ".env.%1" (
    echo ⚠️ Advertencia: No se encontró archivo .env.%1
    echo 📝 Se usará la configuración por defecto (.env)
)

REM Iniciar el servidor
node simple-server.cjs