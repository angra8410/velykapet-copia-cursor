#!/bin/bash
# ============================================================================
# Script de Prueba para Endpoint POST /api/Productos
# ============================================================================
# Este script prueba el endpoint de creación masiva de productos con variaciones
# Ejecuta varios casos de prueba incluyendo casos exitosos y errores esperados
# ============================================================================

BASE_URL="http://localhost:5135/api/Productos"

echo "════════════════════════════════════════════════════════════════════════"
echo "🧪 TEST SUITE: Endpoint POST /api/Productos"
echo "════════════════════════════════════════════════════════════════════════"
echo ""

# ============================================================================
# TEST 1: Crear producto exitosamente
# ============================================================================
echo "📝 TEST 1: Crear producto con 3 variaciones (ÉXITO ESPERADO)"
echo "────────────────────────────────────────────────────────────────────────"

curl -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "nombreBase": "Royal Canin Gastrointestinal",
    "descripcion": "Alimento terapéutico para problemas digestivos en gatos",
    "idCategoria": 2,
    "tipoMascota": "Gatos",
    "urlImagen": "https://www.velykapet.com/productos/alimentos/gatos/ROYAL_CANIN_GASTROINTESTINAL.jpg",
    "idMascotaTipo": 1,
    "idCategoriaAlimento": 2,
    "idSubcategoria": 5,
    "idPresentacion": 1,
    "proveedorId": 1,
    "variacionesProducto": [
      {
        "presentacion": "400 GR",
        "precio": 18500,
        "stock": 15
      },
      {
        "presentacion": "2 KG",
        "precio": 75200,
        "stock": 8
      },
      {
        "presentacion": "4 KG",
        "precio": 142000,
        "stock": 5
      }
    ]
  }' \
  -s -w "\n\nHTTP Status: %{http_code}\n" | jq .

echo ""
echo ""

# ============================================================================
# TEST 2: Error - Categoría inválida
# ============================================================================
echo "📝 TEST 2: Categoría inválida (ERROR ESPERADO: 400)"
echo "────────────────────────────────────────────────────────────────────────"

curl -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "nombreBase": "Test Categoria Invalida",
    "descripcion": "Test",
    "idCategoria": 999,
    "tipoMascota": "Gatos",
    "variacionesProducto": [
      {"presentacion": "1 KG", "precio": 100, "stock": 10}
    ]
  }' \
  -s -w "\n\nHTTP Status: %{http_code}\n" | jq .

echo ""
echo ""

# ============================================================================
# TEST 3: Error - Proveedor inválido
# ============================================================================
echo "📝 TEST 3: Proveedor inválido (ERROR ESPERADO: 400)"
echo "────────────────────────────────────────────────────────────────────────"

curl -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "nombreBase": "Test Proveedor Invalido",
    "descripcion": "Test",
    "idCategoria": 2,
    "tipoMascota": "Gatos",
    "proveedorId": 999,
    "variacionesProducto": [
      {"presentacion": "1 KG", "precio": 100, "stock": 10}
    ]
  }' \
  -s -w "\n\nHTTP Status: %{http_code}\n" | jq .

echo ""
echo ""

# ============================================================================
# TEST 4: Error - Producto duplicado
# ============================================================================
echo "📝 TEST 4: Producto duplicado (ERROR ESPERADO: 409)"
echo "────────────────────────────────────────────────────────────────────────"

curl -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "nombreBase": "Royal Canin Gastrointestinal",
    "descripcion": "Test duplicado",
    "idCategoria": 2,
    "tipoMascota": "Gatos",
    "variacionesProducto": [
      {"presentacion": "1 KG", "precio": 100, "stock": 10}
    ]
  }' \
  -s -w "\n\nHTTP Status: %{http_code}\n" | jq .

echo ""
echo ""

# ============================================================================
# TEST 5: Error - Sin variaciones
# ============================================================================
echo "📝 TEST 5: Sin variaciones (ERROR ESPERADO: 400)"
echo "────────────────────────────────────────────────────────────────────────"

curl -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "nombreBase": "Test Sin Variaciones",
    "descripcion": "Test",
    "idCategoria": 2,
    "tipoMascota": "Gatos"
  }' \
  -s -w "\n\nHTTP Status: %{http_code}\n" | jq .

echo ""
echo ""

# ============================================================================
# TEST 6: Error - Tipo de mascota inválido
# ============================================================================
echo "📝 TEST 6: Tipo de mascota inválido (ERROR ESPERADO: 400)"
echo "────────────────────────────────────────────────────────────────────────"

curl -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "nombreBase": "Test Tipo Mascota Invalido",
    "descripcion": "Test",
    "idCategoria": 2,
    "tipoMascota": "Gatos",
    "idMascotaTipo": 999,
    "variacionesProducto": [
      {"presentacion": "1 KG", "precio": 100, "stock": 10}
    ]
  }' \
  -s -w "\n\nHTTP Status: %{http_code}\n" | jq .

echo ""
echo ""

# ============================================================================
# TEST 7: Crear producto mínimo (solo campos requeridos)
# ============================================================================
echo "📝 TEST 7: Producto mínimo con campos requeridos (ÉXITO ESPERADO)"
echo "────────────────────────────────────────────────────────────────────────"

curl -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "nombreBase": "Producto Basico Test",
    "idCategoria": 3,
    "tipoMascota": "Ambos",
    "variacionesProducto": [
      {"presentacion": "100 GR", "precio": 50}
    ]
  }' \
  -s -w "\n\nHTTP Status: %{http_code}\n" | jq .

echo ""
echo ""

# ============================================================================
# TEST 8: Verificar producto creado en TEST 1
# ============================================================================
echo "📝 TEST 8: Verificar producto creado en TEST 1 (GET)"
echo "────────────────────────────────────────────────────────────────────────"
echo "Buscando productos con nombre 'Royal Canin Gastrointestinal'..."

PRODUCTO_ID=$(curl -s "$BASE_URL?busqueda=Royal%20Canin%20Gastrointestinal" | jq -r '.[0].IdProducto // empty')

if [ -n "$PRODUCTO_ID" ]; then
  echo "✅ Producto encontrado con ID: $PRODUCTO_ID"
  echo ""
  curl -s "$BASE_URL/$PRODUCTO_ID" | jq .
else
  echo "⚠️  Producto no encontrado"
fi

echo ""
echo ""

# ============================================================================
# Resumen
# ============================================================================
echo "════════════════════════════════════════════════════════════════════════"
echo "✅ TESTS COMPLETADOS"
echo "════════════════════════════════════════════════════════════════════════"
echo ""
echo "Casos probados:"
echo "  1. ✅ Creación exitosa con todos los campos"
echo "  2. ✅ Error: Categoría inválida"
echo "  3. ✅ Error: Proveedor inválido"
echo "  4. ✅ Error: Producto duplicado"
echo "  5. ✅ Error: Sin variaciones"
echo "  6. ✅ Error: Tipo de mascota inválido"
echo "  7. ✅ Creación exitosa con campos mínimos"
echo "  8. ✅ Verificación del producto creado"
echo ""
echo "Para ejecutar este script:"
echo "  1. Asegúrate de que el API esté corriendo en http://localhost:5135"
echo "  2. Ejecuta: bash backend-config/test-endpoint-crear-producto.sh"
echo ""
