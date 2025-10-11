#!/bin/bash

# ==============================================================================
# Script de Prueba - Importación Masiva de Productos desde CSV
# ==============================================================================
# Este script prueba el endpoint POST /api/Productos/ImportarCsv
# 
# Uso:
#   bash test-importar-csv.sh
#
# Requisitos:
#   - El backend debe estar ejecutándose en http://localhost:5122
#   - Debe existir el archivo sample-products.csv en el directorio actual
# ==============================================================================

echo "======================================================================"
echo "  TEST: Importación Masiva de Productos desde CSV"
echo "======================================================================"
echo ""

# Configuración
API_URL="http://localhost:5135/api/Productos/ImportarCsv"
CSV_FILE="sample-products.csv"

# Verificar que el archivo CSV existe
if [ ! -f "$CSV_FILE" ]; then
    echo "❌ Error: No se encontró el archivo $CSV_FILE"
    exit 1
fi

echo "📄 Archivo CSV: $CSV_FILE"
echo "🌐 URL del API: $API_URL"
echo ""
echo "----------------------------------------------------------------------"
echo "  Enviando archivo CSV al endpoint..."
echo "----------------------------------------------------------------------"
echo ""

# Realizar la petición POST con el archivo CSV
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@$CSV_FILE")

# Separar el código de estado HTTP del cuerpo de la respuesta
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "📊 Código de respuesta HTTP: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" -eq 200 ]; then
    echo "✅ ÉXITO: La importación se completó correctamente"
    echo ""
    echo "📋 Respuesta del servidor:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
    echo ""
    echo "----------------------------------------------------------------------"
    echo "  Resumen de Resultados"
    echo "----------------------------------------------------------------------"
    
    # Extraer métricas si jq está disponible
    if command -v jq &> /dev/null; then
        TOTAL=$(echo "$BODY" | jq -r '.totalProcessed // 0')
        SUCCESS=$(echo "$BODY" | jq -r '.successCount // 0')
        FAILURES=$(echo "$BODY" | jq -r '.failureCount // 0')
        
        echo "📊 Total procesados: $TOTAL"
        echo "✅ Exitosos: $SUCCESS"
        echo "❌ Errores: $FAILURES"
        
        # Mostrar errores si existen
        ERRORS=$(echo "$BODY" | jq -r '.errors[]?' 2>/dev/null)
        if [ ! -z "$ERRORS" ]; then
            echo ""
            echo "⚠️  Errores encontrados:"
            echo "$ERRORS" | while read -r error; do
                echo "   - $error"
            done
        fi
        
        # Mostrar productos creados
        CREATED=$(echo "$BODY" | jq -r '.createdProducts[]?.nombreBase' 2>/dev/null)
        if [ ! -z "$CREATED" ]; then
            echo ""
            echo "✅ Productos creados:"
            echo "$CREATED" | while read -r producto; do
                echo "   - $producto"
            done
        fi
    fi
else
    echo "❌ ERROR: La importación falló"
    echo ""
    echo "📋 Respuesta del servidor:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
fi

echo ""
echo "======================================================================"
echo "  Fin del Test"
echo "======================================================================"
echo ""

# Verificar productos creados
echo "----------------------------------------------------------------------"
echo "  Verificando productos creados en la base de datos..."
echo "----------------------------------------------------------------------"
echo ""

VERIFY_RESPONSE=$(curl -s "http://localhost:5135/api/Productos")
PRODUCT_COUNT=$(echo "$VERIFY_RESPONSE" | jq 'length' 2>/dev/null || echo "N/A")

echo "📊 Total de productos en la base de datos: $PRODUCT_COUNT"
echo ""

exit 0
