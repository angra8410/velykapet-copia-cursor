#!/bin/bash

# ==============================================================================
# Script para eliminar productos de prueba de la base de datos
# ==============================================================================
# Este script elimina todos los productos que fueron importados desde CSV
# de prueba, permitiendo empezar con un entorno limpio.
#
# Uso:
#   bash limpiar-productos-prueba.sh              # Elimina sin confirmar
#   bash limpiar-productos-prueba.sh --confirmar  # Solicita confirmación
# ==============================================================================

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

# ══════════════════════════════════════════════════════════════════════════════
# CONFIGURACIÓN
# ══════════════════════════════════════════════════════════════════════════════
API_URL="http://localhost:5135/api/Productos"
CONFIRMAR=false

# Procesar parámetros
if [ "$1" == "--confirmar" ]; then
    CONFIRMAR=true
fi

# Productos de prueba a eliminar (nombres base)
PRODUCTOS_PRUEBA=(
    "BR FOR CAT VET CONTROL DE PESO"
)

# ══════════════════════════════════════════════════════════════════════════════
# BANNER
# ══════════════════════════════════════════════════════════════════════════════
echo ""
echo -e "${RED}╔════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║        LIMPIEZA DE PRODUCTOS DE PRUEBA - VelyKapet                    ║${NC}"
echo -e "${RED}╚════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}⚠️  ADVERTENCIA: Este script eliminará productos de la base de datos${NC}"
echo ""

# ══════════════════════════════════════════════════════════════════════════════
# VERIFICAR BACKEND
# ══════════════════════════════════════════════════════════════════════════════
echo -e "${YELLOW}🔍 Verificando conexión con el backend...${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL")

if [ "$HTTP_CODE" != "200" ] && [ "$HTTP_CODE" != "401" ]; then
    echo -e "${RED}❌ ERROR: No se puede conectar con el backend (código: $HTTP_CODE)${NC}"
    echo ""
    echo -e "${YELLOW}💡 SOLUCIÓN:${NC}"
    echo -e "${GRAY}   1. Asegúrese de que el backend esté ejecutándose: dotnet run${NC}"
    echo -e "${GRAY}   2. Verifique que esté en http://localhost:5135${NC}"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Backend está ejecutándose${NC}"
echo ""

# ══════════════════════════════════════════════════════════════════════════════
# OBTENER PRODUCTOS ACTUALES
# ══════════════════════════════════════════════════════════════════════════════
echo -e "${YELLOW}📦 Obteniendo productos de la base de datos...${NC}"

PRODUCTOS=$(curl -s "$API_URL")
if [ -z "$PRODUCTOS" ]; then
    echo -e "${RED}❌ ERROR: No se pudieron obtener los productos${NC}"
    exit 1
fi

# Contar productos si jq está disponible
if command -v jq &> /dev/null; then
    TOTAL_PRODUCTOS=$(echo "$PRODUCTOS" | jq 'length')
    echo -e "${GREEN}✅ Se encontraron $TOTAL_PRODUCTOS productos en total${NC}"
else
    echo -e "${GREEN}✅ Productos obtenidos (instale jq para ver el conteo)${NC}"
fi
echo ""

# ══════════════════════════════════════════════════════════════════════════════
# BUSCAR PRODUCTOS DE PRUEBA
# ══════════════════════════════════════════════════════════════════════════════
echo -e "${YELLOW}🔍 Buscando productos de prueba para eliminar...${NC}"
echo ""

# Array para almacenar IDs de productos a eliminar
declare -a PRODUCTOS_A_ELIMINAR_IDS
declare -a PRODUCTOS_A_ELIMINAR_NOMBRES

if command -v jq &> /dev/null; then
    # Si jq está disponible, usar filtrado JSON
    for NOMBRE_PRUEBA in "${PRODUCTOS_PRUEBA[@]}"; do
        # Buscar productos que contengan el nombre de prueba
        IDS=$(echo "$PRODUCTOS" | jq -r ".[] | select(.NombreBase | contains(\"$NOMBRE_PRUEBA\")) | .IdProducto")
        NOMBRES=$(echo "$PRODUCTOS" | jq -r ".[] | select(.NombreBase | contains(\"$NOMBRE_PRUEBA\")) | .NombreBase")
        
        # Agregar a los arrays
        while IFS= read -r id; do
            if [ ! -z "$id" ]; then
                PRODUCTOS_A_ELIMINAR_IDS+=("$id")
            fi
        done <<< "$IDS"
        
        while IFS= read -r nombre; do
            if [ ! -z "$nombre" ]; then
                PRODUCTOS_A_ELIMINAR_NOMBRES+=("$nombre")
            fi
        done <<< "$NOMBRES"
    done
else
    echo -e "${YELLOW}⚠️  jq no está instalado. No se puede filtrar automáticamente.${NC}"
    echo -e "${YELLOW}   Para usar esta funcionalidad, instale jq: sudo apt install jq${NC}"
    echo ""
    exit 1
fi

# Verificar si se encontraron productos
if [ ${#PRODUCTOS_A_ELIMINAR_IDS[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ No se encontraron productos de prueba para eliminar${NC}"
    echo ""
    exit 0
fi

echo -e "${CYAN}📋 Se encontraron ${#PRODUCTOS_A_ELIMINAR_IDS[@]} productos de prueba:${NC}"
echo ""

for i in "${!PRODUCTOS_A_ELIMINAR_IDS[@]}"; do
    echo -e "${GRAY}   • ID: ${PRODUCTOS_A_ELIMINAR_IDS[$i]} - ${PRODUCTOS_A_ELIMINAR_NOMBRES[$i]}${NC}"
done
echo ""

# ══════════════════════════════════════════════════════════════════════════════
# CONFIRMACIÓN
# ══════════════════════════════════════════════════════════════════════════════
if [ "$CONFIRMAR" = true ]; then
    read -p "¿Desea eliminar estos productos? (S/N): " respuesta
    if [ "$respuesta" != "S" ] && [ "$respuesta" != "s" ]; then
        echo ""
        echo -e "${YELLOW}❌ Operación cancelada por el usuario${NC}"
        echo ""
        exit 0
    fi
    echo ""
fi

# ══════════════════════════════════════════════════════════════════════════════
# ELIMINAR PRODUCTOS
# ══════════════════════════════════════════════════════════════════════════════
echo -e "${YELLOW}🗑️  Eliminando productos de prueba...${NC}"
echo ""

ELIMINADOS_EXITOSOS=0
ELIMINADOS_FALLIDOS=0

for i in "${!PRODUCTOS_A_ELIMINAR_IDS[@]}"; do
    ID="${PRODUCTOS_A_ELIMINAR_IDS[$i]}"
    NOMBRE="${PRODUCTOS_A_ELIMINAR_NOMBRES[$i]}"
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$API_URL/$ID")
    
    if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "204" ]; then
        echo -e "${GREEN}   ✅ Eliminado: $NOMBRE${NC}"
        ((ELIMINADOS_EXITOSOS++))
    else
        echo -e "${RED}   ❌ Error eliminando: $NOMBRE (código: $HTTP_CODE)${NC}"
        ((ELIMINADOS_FALLIDOS++))
    fi
done

# ══════════════════════════════════════════════════════════════════════════════
# RESUMEN
# ══════════════════════════════════════════════════════════════════════════════
echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}📊 RESUMEN DE LIMPIEZA:${NC}"
echo ""
echo -e "${GREEN}   ✅ Eliminados exitosamente: $ELIMINADOS_EXITOSOS${NC}"
if [ $ELIMINADOS_FALLIDOS -gt 0 ]; then
    echo -e "${RED}   ❌ Fallos: $ELIMINADOS_FALLIDOS${NC}"
else
    echo -e "${GREEN}   ❌ Fallos: $ELIMINADOS_FALLIDOS${NC}"
fi
echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════════════════${NC}"
echo ""

if [ $ELIMINADOS_EXITOSOS -gt 0 ]; then
    echo -e "${GREEN}✅ Base de datos limpiada. Ahora puede ejecutar una nueva importación.${NC}"
else
    echo -e "${YELLOW}⚠️  No se eliminó ningún producto${NC}"
fi
echo ""

exit 0
