#!/bin/bash

# Test script para el endpoint POST /api/Productos
# Este script demuestra el uso correcto del endpoint y los errores comunes

echo "═══════════════════════════════════════════════════════"
echo "🧪 Test del Endpoint POST /api/Productos"
echo "═══════════════════════════════════════════════════════"
echo ""

# Configuración
BASE_URL="http://localhost:5000"
ENDPOINT="$BASE_URL/api/Productos"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Test 1: JSON Correcto
echo -e "${GREEN}📝 Test 1: Request CORRECTO${NC}"
echo -e "${GRAY}   Este es el formato esperado por el endpoint${NC}"
echo ""

CORRECT_BODY='{
  "nombreBase": "Test Producto cURL",
  "descripcion": "Producto de prueba creado con cURL",
  "idCategoria": 2,
  "tipoMascota": "Gatos",
  "urlImagen": "https://ejemplo.com/imagen.jpg",
  "idMascotaTipo": 1,
  "idCategoriaAlimento": 2,
  "idSubcategoria": 5,
  "idPresentacion": 1,
  "proveedorId": 1,
  "variacionesProducto": [
    {
      "presentacion": "500 GR",
      "precio": 15000,
      "stock": 10
    },
    {
      "presentacion": "1 KG",
      "precio": 28000,
      "stock": 5
    }
  ]
}'

echo -e "${CYAN}Request body:${NC}"
echo -e "${GRAY}$CORRECT_BODY${NC}"
echo ""

echo -e "${CYAN}Enviando request...${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "$CORRECT_BODY")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d':' -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS:/d')

if [ "$HTTP_STATUS" -eq 201 ] || [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅ SUCCESS - Producto creado exitosamente${NC}"
    echo -e "${CYAN}Respuesta:${NC}"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
else
    echo -e "${RED}❌ FAIL - Error al crear producto (HTTP $HTTP_STATUS)${NC}"
    echo -e "${YELLOW}Respuesta del servidor:${NC}"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
fi

echo ""
echo "───────────────────────────────────────────────────────"
echo ""

# Test 2: JSON con wrapper INCORRECTO (productoDto)
echo -e "${RED}📝 Test 2: Request INCORRECTO - Usando wrapper 'productoDto'${NC}"
echo -e "${GRAY}   ❌ Este formato NO es soportado y causará error 400${NC}"
echo ""

INCORRECT_BODY='{
  "productoDto": {
    "nombreBase": "Test Producto Incorrecto",
    "descripcion": "Este formato está mal",
    "idCategoria": 2,
    "tipoMascota": "Gatos",
    "variacionesProducto": [
      {
        "presentacion": "500 GR",
        "precio": 15000,
        "stock": 10
      }
    ]
  }
}'

echo -e "${CYAN}Request body:${NC}"
echo -e "${GRAY}$INCORRECT_BODY${NC}"
echo ""

echo -e "${CYAN}Enviando request...${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "$INCORRECT_BODY")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d':' -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS:/d')

if [ "$HTTP_STATUS" -eq 400 ]; then
    echo -e "${YELLOW}❌ EXPECTED FAIL - Como se esperaba, el request falló (HTTP $HTTP_STATUS):${NC}"
    echo -e "${YELLOW}Respuesta del servidor:${NC}"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
    echo ""
    echo -e "${CYAN}💡 Solución: Envía el JSON directamente sin wrapper 'productoDto'${NC}"
else
    echo -e "${YELLOW}✅ SUCCESS (inesperado) - El request debería haber fallado (HTTP $HTTP_STATUS)${NC}"
fi

echo ""
echo "───────────────────────────────────────────────────────"
echo ""

# Test 3: JSON con tipos incorrectos
echo -e "${RED}📝 Test 3: Request INCORRECTO - Tipos de datos incorrectos${NC}"
echo -e "${GRAY}   ❌ Strings donde deben ir números${NC}"
echo ""

INCORRECT_TYPES_BODY='{
  "nombreBase": "Test Producto Tipos Incorrectos",
  "descripcion": "Tipos de datos mal definidos",
  "idCategoria": "2",
  "tipoMascota": "Gatos",
  "variacionesProducto": [
    {
      "presentacion": "500 GR",
      "precio": "15000",
      "stock": "10"
    }
  ]
}'

echo -e "${CYAN}Request body:${NC}"
echo -e "${GRAY}$INCORRECT_TYPES_BODY${NC}"
echo ""

echo -e "${CYAN}Enviando request...${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "$INCORRECT_TYPES_BODY")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d':' -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS:/d')

if [ "$HTTP_STATUS" -eq 400 ]; then
    echo -e "${YELLOW}❌ EXPECTED FAIL - Como se esperaba, el request falló (HTTP $HTTP_STATUS):${NC}"
    echo -e "${YELLOW}Respuesta del servidor:${NC}"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
    echo ""
    echo -e "${CYAN}💡 Solución: Usa números sin comillas para campos numéricos${NC}"
elif [ "$HTTP_STATUS" -eq 201 ] || [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${YELLOW}✅ SUCCESS - ASP.NET convirtió automáticamente los strings a números${NC}"
    echo -e "${GRAY}(Aunque funciona, es mejor usar el tipo correcto desde el inicio)${NC}"
else
    echo -e "${RED}❌ FAIL - Error inesperado (HTTP $HTTP_STATUS)${NC}"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
fi

echo ""
echo "───────────────────────────────────────────────────────"
echo ""

# Test 4: JSON sin variaciones
echo -e "${RED}📝 Test 4: Request INCORRECTO - Sin variaciones${NC}"
echo -e "${GRAY}   ❌ El array variacionesProducto está vacío${NC}"
echo ""

NO_VARIATIONS_BODY='{
  "nombreBase": "Test Producto Sin Variaciones",
  "descripcion": "Este producto no tiene variaciones",
  "idCategoria": 2,
  "tipoMascota": "Gatos",
  "variacionesProducto": []
}'

echo -e "${CYAN}Request body:${NC}"
echo -e "${GRAY}$NO_VARIATIONS_BODY${NC}"
echo ""

echo -e "${CYAN}Enviando request...${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "$NO_VARIATIONS_BODY")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d':' -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS:/d')

if [ "$HTTP_STATUS" -eq 400 ]; then
    echo -e "${YELLOW}❌ EXPECTED FAIL - Como se esperaba, el request falló (HTTP $HTTP_STATUS):${NC}"
    echo -e "${YELLOW}Respuesta del servidor:${NC}"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
    echo ""
    echo -e "${CYAN}💡 Solución: Incluye al menos una variación en el array 'variacionesProducto'${NC}"
else
    echo -e "${YELLOW}✅ SUCCESS (inesperado) - El request debería haber fallado (HTTP $HTTP_STATUS)${NC}"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "🎯 Resumen de Tests"
echo "═══════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}✅ Test 1: Request correcto - Debería crear el producto${NC}"
echo -e "${YELLOW}❌ Test 2: Wrapper 'productoDto' - Debería fallar con 400${NC}"
echo -e "${YELLOW}❌ Test 3: Tipos incorrectos - Puede fallar o convertirse automáticamente${NC}"
echo -e "${YELLOW}❌ Test 4: Sin variaciones - Debería fallar con 400${NC}"
echo ""
echo -e "${CYAN}📚 Ver documentación completa en:${NC}"
echo -e "${GRAY}   backend-config/API_ENDPOINT_CREAR_PRODUCTO.md${NC}"
echo ""
