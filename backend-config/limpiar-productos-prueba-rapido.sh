#!/bin/bash

# ==============================================================================
# Script wrapper simple para limpiar productos de prueba (SQLite)
# ==============================================================================
# Este script ejecuta el SQL de limpieza de forma simple y directa
# ==============================================================================

echo ""
echo "╔════════════════════════════════════════════════════════════════════════╗"
echo "║     LIMPIEZA RÁPIDA DE PRODUCTOS DE PRUEBA - VelyKapet (SQLite)       ║"
echo "╚════════════════════════════════════════════════════════════════════════╝"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "VentasPet.db" ]; then
    echo "❌ Error: No se encontró VentasPet.db"
    echo ""
    echo "💡 Asegúrese de ejecutar este script desde el directorio backend-config"
    echo "   cd backend-config && ./limpiar-productos-prueba-rapido.sh"
    echo ""
    exit 1
fi

# Verificar que existe el script SQL
if [ ! -f "Data/limpiar-productos-prueba-sqlite.sql" ]; then
    echo "❌ Error: No se encontró el script SQL"
    exit 1
fi

# Ejecutar el script SQL
echo "🗑️  Ejecutando limpieza..."
echo ""

sqlite3 VentasPet.db < Data/limpiar-productos-prueba-sqlite.sql 2>&1 | grep -E "🔍|✅|❌|📊|Total_Productos|Variaciones"

echo ""
echo "════════════════════════════════════════════════════════════════════════"
echo ""
echo "✅ Limpieza completada. Puede ejecutar una nueva importación con:"
echo "   ./test-importar-csv.sh"
echo ""
