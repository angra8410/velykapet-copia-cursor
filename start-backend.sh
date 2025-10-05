#!/bin/bash

echo ""
echo "========================================"
echo " 🔧 VentasPet - Backend API"
echo "========================================"
echo ""

# Verificar si .NET está disponible
if ! command -v dotnet &> /dev/null; then
    echo "❌ Error: .NET no encontrado"
    echo "Por favor instala .NET desde https://dotnet.microsoft.com"
    exit 1
fi

echo "✅ .NET disponible: $(dotnet --version)"

# Buscar el directorio backend-config
if [ -d "backend-config" ]; then
    BACKEND_PATH="backend-config"
    echo "✅ Backend encontrado en: $BACKEND_PATH"
elif [ -d "../backend-config" ]; then
    BACKEND_PATH="../backend-config"
    echo "✅ Backend encontrado en: $BACKEND_PATH"
else
    echo "❌ No se encontró el directorio backend-config"
    echo "💡 Ejecuta este script desde la raíz del proyecto"
    exit 1
fi

echo ""
echo "🔧 Iniciando Backend API en modo Development..."
echo "💡 URLs disponibles:"
echo "   📡 Backend: http://localhost:5135"
echo "   📚 Swagger: http://localhost:5135"
echo "   🔗 Frontend esperado: http://localhost:3333"
echo ""
echo "⏹️  Para detener: Ctrl+C"
echo ""

# Cambiar al directorio del backend y ejecutar
cd "$BACKEND_PATH"

# Configurar el entorno a Development para usar SQLite
export ASPNETCORE_ENVIRONMENT=Development

dotnet run
