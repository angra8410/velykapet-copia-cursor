#!/bin/bash

# ============================================================================
# Script de Verificación y Diagnóstico: Imágenes de Productos
# ============================================================================
# Proyecto: VelyKapet E-commerce
# Objetivo: Diagnosticar por qué las imágenes no se muestran en el catálogo
# ============================================================================

set -e

BACKEND_URL="http://localhost:5135"
BACKEND_DIR="backend-config"
FRONTEND_PORT="3333"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "╔════════════════════════════════════════════════════════════════════════╗"
echo "║  🔍 DIAGNÓSTICO: Imágenes de Productos VelyKapet                      ║"
echo "╚════════════════════════════════════════════════════════════════════════╝"
echo ""

# ============================================================================
# PASO 1: Verificar que el backend está corriendo
# ============================================================================
echo -e "${BLUE}📋 PASO 1: Verificando que el backend está corriendo...${NC}"
echo ""

if curl -s --fail "${BACKEND_URL}/api/Productos" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend está corriendo en ${BACKEND_URL}${NC}"
else
    echo -e "${RED}❌ Backend NO está corriendo en ${BACKEND_URL}${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Necesitas iniciar el backend primero:${NC}"
    echo "   cd ${BACKEND_DIR}"
    echo "   dotnet run --urls=\"${BACKEND_URL}\""
    echo ""
    exit 1
fi

echo ""

# ============================================================================
# PASO 2: Verificar respuesta de la API
# ============================================================================
echo -e "${BLUE}📋 PASO 2: Verificando respuesta de la API...${NC}"
echo ""

# Obtener productos de la API
RESPONSE=$(curl -s "${BACKEND_URL}/api/Productos")

# Contar productos
PRODUCT_COUNT=$(echo "$RESPONSE" | jq '. | length')
echo -e "   📦 Total de productos en la API: ${GREEN}${PRODUCT_COUNT}${NC}"

if [ "$PRODUCT_COUNT" -eq 0 ]; then
    echo -e "${RED}❌ No hay productos en la base de datos${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Necesitas insertar productos en la base de datos${NC}"
    exit 1
fi

echo ""

# ============================================================================
# PASO 3: Verificar campo URLImagen en la respuesta
# ============================================================================
echo -e "${BLUE}📋 PASO 3: Verificando campo URLImagen...${NC}"
echo ""

# Contar productos con URLImagen
PRODUCTS_WITH_IMAGE=$(echo "$RESPONSE" | jq '[.[] | select(.URLImagen != null and .URLImagen != "")] | length')
PRODUCTS_WITHOUT_IMAGE=$((PRODUCT_COUNT - PRODUCTS_WITH_IMAGE))

echo -e "   ✅ Productos con URLImagen: ${GREEN}${PRODUCTS_WITH_IMAGE}${NC}"
echo -e "   ❌ Productos sin URLImagen: ${RED}${PRODUCTS_WITHOUT_IMAGE}${NC}"
echo ""

if [ "$PRODUCTS_WITHOUT_IMAGE" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  PROBLEMA ENCONTRADO: Productos sin URLImagen${NC}"
    echo ""
    echo "   Productos sin imagen:"
    echo "$RESPONSE" | jq -r '.[] | select(.URLImagen == null or .URLImagen == "") | "   - [\(.IdProducto)] \(.NombreBase)"'
    echo ""
    echo -e "${YELLOW}📌 SOLUCIÓN:${NC}"
    echo "   Ejecutar el script SQL para poblar las imágenes:"
    echo "   ${BACKEND_DIR}/Scripts/FIX_POPULATE_PRODUCT_IMAGES.sql"
    echo ""
    echo "   Opción 1 (sqlcmd):"
    echo "   sqlcmd -S localhost -d VentasPet_Nueva -E -i ${BACKEND_DIR}/Scripts/FIX_POPULATE_PRODUCT_IMAGES.sql"
    echo ""
    echo "   Opción 2 (SSMS o Azure Data Studio):"
    echo "   Abrir el archivo SQL y ejecutarlo manualmente"
    echo ""
fi

# ============================================================================
# PASO 4: Verificar campo Images en la respuesta
# ============================================================================
echo -e "${BLUE}📋 PASO 4: Verificando campo Images (calculado)...${NC}"
echo ""

# Verificar si el primer producto tiene el campo Images
FIRST_PRODUCT_HAS_IMAGES=$(echo "$RESPONSE" | jq '.[0] | has("Images")')

if [ "$FIRST_PRODUCT_HAS_IMAGES" == "true" ]; then
    echo -e "${GREEN}✅ Campo Images está presente en la respuesta de la API${NC}"
    
    # Mostrar el campo Images del primer producto
    FIRST_PRODUCT_IMAGES=$(echo "$RESPONSE" | jq -r '.[0].Images[]' 2>/dev/null || echo "")
    
    if [ -n "$FIRST_PRODUCT_IMAGES" ]; then
        echo -e "${GREEN}✅ Campo Images tiene valores:${NC}"
        echo "$RESPONSE" | jq '.[0].Images'
    else
        echo -e "${YELLOW}⚠️  Campo Images está vacío (array vacío)${NC}"
        echo ""
        echo "   Esto es normal si URLImagen está vacío en la base de datos."
        echo "   El campo Images se calcula a partir de URLImagen."
    fi
else
    echo -e "${RED}❌ Campo Images NO está presente en la respuesta de la API${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  El modelo ProductoDto no tiene la propiedad Images implementada${NC}"
    echo "   Verifica el archivo: ${BACKEND_DIR}/Models/Producto.cs"
fi

echo ""

# ============================================================================
# PASO 5: Verificar accesibilidad de las imágenes en R2
# ============================================================================
if [ "$PRODUCTS_WITH_IMAGE" -gt 0 ]; then
    echo -e "${BLUE}📋 PASO 5: Verificando accesibilidad de imágenes en Cloudflare R2...${NC}"
    echo ""
    
    # Obtener URLs de imágenes únicas
    IMAGE_URLS=$(echo "$RESPONSE" | jq -r '[.[] | select(.URLImagen != null and .URLImagen != "") | .URLImagen] | unique | .[]')
    
    ACCESSIBLE_COUNT=0
    NOT_FOUND_COUNT=0
    ERROR_COUNT=0
    
    while IFS= read -r url; do
        if [ -n "$url" ]; then
            HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
            
            if [ "$HTTP_STATUS" == "200" ]; then
                echo -e "   ${GREEN}✅ 200${NC} $url"
                ((ACCESSIBLE_COUNT++))
            elif [ "$HTTP_STATUS" == "404" ]; then
                echo -e "   ${RED}❌ 404${NC} $url"
                ((NOT_FOUND_COUNT++))
            else
                echo -e "   ${YELLOW}⚠️  ${HTTP_STATUS}${NC} $url"
                ((ERROR_COUNT++))
            fi
        fi
    done <<< "$IMAGE_URLS"
    
    echo ""
    echo -e "   Resumen:"
    echo -e "   - Imágenes accesibles (200 OK): ${GREEN}${ACCESSIBLE_COUNT}${NC}"
    echo -e "   - Imágenes no encontradas (404): ${RED}${NOT_FOUND_COUNT}${NC}"
    echo -e "   - Otros errores: ${YELLOW}${ERROR_COUNT}${NC}"
    echo ""
    
    if [ "$NOT_FOUND_COUNT" -gt 0 ]; then
        echo -e "${YELLOW}⚠️  PROBLEMA: Algunas imágenes no existen en Cloudflare R2${NC}"
        echo ""
        echo -e "${YELLOW}📌 SOLUCIÓN:${NC}"
        echo "   Opción 1: Subir las imágenes a Cloudflare R2 con los nombres esperados"
        echo "   Opción 2: Cambiar las URLs en la base de datos a imágenes que sí existen"
        echo ""
    fi
fi

# ============================================================================
# PASO 6: Mostrar primer producto completo para referencia
# ============================================================================
echo -e "${BLUE}📋 PASO 6: Mostrando primer producto (referencia)...${NC}"
echo ""
echo "$RESPONSE" | jq '.[0]'
echo ""

# ============================================================================
# RESUMEN FINAL
# ============================================================================
echo "╔════════════════════════════════════════════════════════════════════════╗"
echo "║  📊 RESUMEN DEL DIAGNÓSTICO                                           ║"
echo "╚════════════════════════════════════════════════════════════════════════╝"
echo ""

if [ "$PRODUCTS_WITHOUT_IMAGE" -eq 0 ] && [ "$NOT_FOUND_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✅ TODO ESTÁ CORRECTO${NC}"
    echo ""
    echo "   - Backend está corriendo ✅"
    echo "   - Todos los productos tienen URLImagen ✅"
    echo "   - Campo Images está presente ✅"
    echo "   - Todas las imágenes son accesibles ✅"
    echo ""
    echo -e "${GREEN}🎉 Las imágenes deberían mostrarse correctamente en el catálogo${NC}"
    echo ""
    echo "   Si aún no ves las imágenes, verifica:"
    echo "   1. Frontend está corriendo: npm start"
    echo "   2. Navegador: http://localhost:${FRONTEND_PORT}"
    echo "   3. DevTools Console (F12) para ver logs"
    echo ""
elif [ "$PRODUCTS_WITHOUT_IMAGE" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  ACCIÓN REQUERIDA: Poblar campo URLImagen${NC}"
    echo ""
    echo "   📝 Pasos a seguir:"
    echo "   1. Ejecutar el script SQL:"
    echo "      ${BACKEND_DIR}/Scripts/FIX_POPULATE_PRODUCT_IMAGES.sql"
    echo ""
    echo "   2. Reiniciar el backend (Ctrl+C y volver a ejecutar dotnet run)"
    echo ""
    echo "   3. Ejecutar este script nuevamente para verificar:"
    echo "      bash verify-product-images.sh"
    echo ""
elif [ "$NOT_FOUND_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  ACCIÓN REQUERIDA: Subir imágenes a Cloudflare R2${NC}"
    echo ""
    echo "   📝 Pasos a seguir:"
    echo "   1. Subir las imágenes faltantes a tu bucket de Cloudflare R2"
    echo "   2. Asegurarte de que los nombres coincidan exactamente"
    echo "   3. Verificar que las imágenes sean públicamente accesibles"
    echo ""
else
    echo -e "${YELLOW}⚠️  HAY PROBLEMAS QUE REQUIEREN ATENCIÓN${NC}"
    echo ""
    echo "   Revisa los pasos anteriores para más detalles."
    echo ""
fi

echo "╔════════════════════════════════════════════════════════════════════════╗"
echo "║  ✅ DIAGNÓSTICO COMPLETADO                                            ║"
echo "╚════════════════════════════════════════════════════════════════════════╝"
echo ""
