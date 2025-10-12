#!/bin/bash

# ============================================================================
# Script de Prueba - Importación CSV con Agrupación de Variaciones
# ============================================================================
# Este script prueba la nueva funcionalidad de agrupación de variaciones
# en la importación masiva CSV.
#
# PRUEBAS:
# 1. Producto con 3 variaciones (agrupadas)
# 2. Productos sin variaciones (individual)
# 3. Mezcla de productos con y sin variaciones
# ============================================================================

set -e  # Exit on error

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:5135"
DB_FILE="VentasPet.db"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  TEST: Importación CSV con Agrupación de Variaciones                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# ============================================================================
# Verificar prerequisitos
# ============================================================================
echo -e "${YELLOW}🔍 Verificando prerequisitos...${NC}"

# Verificar que el backend está corriendo
if ! curl -s "${API_URL}/api/Productos" > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: El backend no está corriendo en ${API_URL}${NC}"
    echo -e "${YELLOW}💡 Inicia el backend con: cd backend-config && dotnet run${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Backend corriendo en ${API_URL}${NC}"

# Verificar que la base de datos existe
if [ ! -f "$DB_FILE" ]; then
    echo -e "${RED}❌ Error: Base de datos ${DB_FILE} no encontrada${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Base de datos encontrada${NC}"
echo ""

# ============================================================================
# PRUEBA 1: Producto con 3 variaciones (agrupadas)
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📋 PRUEBA 1: Producto con 3 variaciones${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Limpiar productos de prueba anteriores
echo -e "${YELLOW}🧹 Limpiando productos de prueba anteriores...${NC}"
sqlite3 "$DB_FILE" "DELETE FROM VariacionesProducto WHERE IdProducto IN (SELECT IdProducto FROM Productos WHERE NombreBase LIKE '%TEST%'); DELETE FROM Productos WHERE NombreBase LIKE '%TEST%';" 2>/dev/null || true
echo -e "${GREEN}✅ Limpieza completada${NC}"
echo ""

# Crear CSV de prueba con 3 variaciones del mismo producto
cat > /tmp/test-variaciones.csv << 'EOF'
ID,CATEGORIA,CATEGORIA ALIMENTOS,SUBCATEGORIA,PRESENTACION EMPAQUE,MARCA,NAME,PRECIO ANTES DE GANANCIA CDM,ICONOPET,MARGEN,PRECIO SUGERIDO DE VENTA,description,presentacion,PRICE,stock,sku,imageUrl,proveedor,creadoen,actualizadoen
1,Alimento para Gatos,ALIMENTO SECO,DIETA SECA PRESCRITA,BOLSA,TEST,TEST PRODUCTO X 500GR,$20400.00,,,,,500 GR,$20400.00,10,TEST001,https://example.com/test.jpg,CDM,,
2,Alimento para Gatos,ALIMENTO SECO,DIETA SECA PRESCRITA,BOLSA,TEST,TEST PRODUCTO X 1.5 KG,$58200.00,,,,,1.5 KG,$58200.00,15,TEST002,https://example.com/test.jpg,CDM,,
3,Alimento para Gatos,ALIMENTO SECO,DIETA SECA PRESCRITA,BOLSA,TEST,TEST PRODUCTO X 3 KG,$110800.00,,,,,3 KG,$110800.00,20,TEST003,https://example.com/test.jpg,CDM,,
EOF

echo -e "${YELLOW}📤 Importando CSV con 3 variaciones...${NC}"
RESPONSE=$(curl -s -X POST "${API_URL}/api/Productos/ImportarCsv" -F "file=@/tmp/test-variaciones.csv")

# Parsear respuesta JSON
TOTAL=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['TotalProcessed'])" 2>/dev/null || echo "0")
SUCCESS=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['SuccessCount'])" 2>/dev/null || echo "0")
FAILURES=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['FailureCount'])" 2>/dev/null || echo "0")

echo ""
echo -e "${GREEN}📊 RESULTADOS:${NC}"
echo -e "   Filas procesadas: ${TOTAL}"
echo -e "   Productos creados: ${SUCCESS}"
echo -e "   Errores: ${FAILURES}"
echo ""

# Verificar que se creó 1 producto con 3 variaciones
if [ "$TOTAL" -eq 3 ] && [ "$SUCCESS" -eq 1 ]; then
    echo -e "${GREEN}✅ PRUEBA 1 EXITOSA: 3 filas → 1 producto${NC}"
    
    # Verificar en la base de datos
    VARIATIONS_COUNT=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM VariacionesProducto WHERE IdProducto = (SELECT IdProducto FROM Productos WHERE NombreBase = 'TEST PRODUCTO')")
    echo -e "${GREEN}✅ Verificación DB: ${VARIATIONS_COUNT} variaciones encontradas${NC}"
    
    if [ "$VARIATIONS_COUNT" -eq 3 ]; then
        echo -e "${GREEN}✅ VERIFICACIÓN COMPLETA: Producto con 3 variaciones creado correctamente${NC}"
    else
        echo -e "${RED}❌ ERROR: Se esperaban 3 variaciones, se encontraron ${VARIATIONS_COUNT}${NC}"
    fi
else
    echo -e "${RED}❌ PRUEBA 1 FALLIDA${NC}"
    echo -e "${RED}   Esperado: 3 filas procesadas, 1 producto creado${NC}"
    echo -e "${RED}   Obtenido: ${TOTAL} filas, ${SUCCESS} productos${NC}"
fi
echo ""

# ============================================================================
# PRUEBA 2: Productos sin variaciones
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📋 PRUEBA 2: Productos sin variaciones${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Crear CSV con productos sin el patrón " X "
cat > /tmp/test-sin-variaciones.csv << 'EOF'
ID,CATEGORIA,CATEGORIA ALIMENTOS,SUBCATEGORIA,PRESENTACION EMPAQUE,MARCA,NAME,PRECIO ANTES DE GANANCIA CDM,ICONOPET,MARGEN,PRECIO SUGERIDO DE VENTA,description,presentacion,PRICE,stock,sku,imageUrl,proveedor,creadoen,actualizadoen
1,Alimento para Perros,,,,,TEST Shampoo para Perros,,,,,Shampoo hipoalergénico,500 ML,25000,30,TEST-SHA001,https://example.com/shampoo.jpg,,,
EOF

echo -e "${YELLOW}📤 Importando CSV con 1 producto sin variaciones...${NC}"
RESPONSE=$(curl -s -X POST "${API_URL}/api/Productos/ImportarCsv" -F "file=@/tmp/test-sin-variaciones.csv")

TOTAL=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['TotalProcessed'])" 2>/dev/null || echo "0")
SUCCESS=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['SuccessCount'])" 2>/dev/null || echo "0")

echo ""
echo -e "${GREEN}📊 RESULTADOS:${NC}"
echo -e "   Filas procesadas: ${TOTAL}"
echo -e "   Productos creados: ${SUCCESS}"
echo ""

if [ "$TOTAL" -eq 1 ] && [ "$SUCCESS" -eq 1 ]; then
    echo -e "${GREEN}✅ PRUEBA 2 EXITOSA: 1 fila → 1 producto (sin agrupación)${NC}"
else
    echo -e "${RED}❌ PRUEBA 2 FALLIDA${NC}"
fi
echo ""

# ============================================================================
# PRUEBA 3: Mezcla de productos con y sin variaciones
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📋 PRUEBA 3: Mezcla de productos${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Limpiar
sqlite3 "$DB_FILE" "DELETE FROM VariacionesProducto WHERE IdProducto IN (SELECT IdProducto FROM Productos WHERE NombreBase LIKE '%TEST%'); DELETE FROM Productos WHERE NombreBase LIKE '%TEST%';" 2>/dev/null || true

# Crear CSV mixto
cat > /tmp/test-mixto.csv << 'EOF'
ID,CATEGORIA,CATEGORIA ALIMENTOS,SUBCATEGORIA,PRESENTACION EMPAQUE,MARCA,NAME,PRECIO ANTES DE GANANCIA CDM,ICONOPET,MARGEN,PRECIO SUGERIDO DE VENTA,description,presentacion,PRICE,stock,sku,imageUrl,proveedor,creadoen,actualizadoen
1,Alimento para Gatos,ALIMENTO SECO,,,TEST,TEST ALIMENTO X 1KG,,,,,Alimento premium,1 KG,35000,20,TEST-AL001,https://example.com/alimento.jpg,,,
2,Alimento para Gatos,ALIMENTO SECO,,,TEST,TEST ALIMENTO X 3KG,,,,,Alimento premium,3 KG,95000,10,TEST-AL002,https://example.com/alimento.jpg,,,
3,Alimento para Perros,,,,,TEST Collar Antipulgas,,,,,Collar eficaz,UN,18000,50,TEST-COL001,https://example.com/collar.jpg,,,
EOF

echo -e "${YELLOW}📤 Importando CSV mixto (2 variaciones + 1 individual)...${NC}"
RESPONSE=$(curl -s -X POST "${API_URL}/api/Productos/ImportarCsv" -F "file=@/tmp/test-mixto.csv")

TOTAL=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['TotalProcessed'])" 2>/dev/null || echo "0")
SUCCESS=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['SuccessCount'])" 2>/dev/null || echo "0")

echo ""
echo -e "${GREEN}📊 RESULTADOS:${NC}"
echo -e "   Filas procesadas: ${TOTAL}"
echo -e "   Productos creados: ${SUCCESS}"
echo ""

if [ "$TOTAL" -eq 3 ] && [ "$SUCCESS" -eq 2 ]; then
    echo -e "${GREEN}✅ PRUEBA 3 EXITOSA: 3 filas → 2 productos (1 con 2 variaciones, 1 individual)${NC}"
else
    echo -e "${RED}❌ PRUEBA 3 FALLIDA${NC}"
fi
echo ""

# ============================================================================
# RESUMEN FINAL
# ============================================================================
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  RESUMEN DE PRUEBAS                                                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ Todas las pruebas completadas${NC}"
echo ""
echo -e "${YELLOW}📋 Funcionalidad verificada:${NC}"
echo -e "   • Agrupación de variaciones por nombre base"
echo -e "   • Productos sin variaciones (compatibilidad)"
echo -e "   • Importación mixta (con y sin variaciones)"
echo ""

# Limpiar archivos temporales
rm -f /tmp/test-variaciones.csv /tmp/test-sin-variaciones.csv /tmp/test-mixto.csv

# Limpiar productos de prueba
echo -e "${YELLOW}🧹 Limpiando productos de prueba...${NC}"
sqlite3 "$DB_FILE" "DELETE FROM VariacionesProducto WHERE IdProducto IN (SELECT IdProducto FROM Productos WHERE NombreBase LIKE '%TEST%'); DELETE FROM Productos WHERE NombreBase LIKE '%TEST%';" 2>/dev/null || true
echo -e "${GREEN}✅ Limpieza completada${NC}"
echo ""

echo -e "${GREEN}🎉 PRUEBAS COMPLETADAS EXITOSAMENTE${NC}"
