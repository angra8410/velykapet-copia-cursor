#!/bin/bash

# ============================================================================
# Script de Demostración: Problema y Solución de Imágenes de Productos
# ============================================================================
# Este script demuestra:
# 1. El problema: Productos sin URLImagen → Images array vacío
# 2. La solución: Poblar URLImagen → Images array con URLs
# ============================================================================

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

BACKEND_DIR="backend-config"
DB_FILE="${BACKEND_DIR}/VentasPet.db"

echo ""
echo "╔════════════════════════════════════════════════════════════════════════╗"
echo "║  🎬 DEMOSTRACIÓN: Problema y Solución de Imágenes de Productos        ║"
echo "╚════════════════════════════════════════════════════════════════════════╝"
echo ""

# ============================================================================
# PARTE 1: Crear base de datos con productos SIN imágenes
# ============================================================================
echo -e "${BLUE}📋 PARTE 1: Creando base de datos SQLite con productos SIN imágenes...${NC}"
echo ""

# Limpiar base de datos anterior si existe
if [ -f "$DB_FILE" ]; then
    echo "   Eliminando base de datos anterior..."
    rm -f "$DB_FILE"
fi

# Crear base de datos y tablas
echo "   Creando estructura de base de datos..."

sqlite3 "$DB_FILE" <<'EOF'
-- Crear tablas
CREATE TABLE Categorias (
    IdCategoria INTEGER PRIMARY KEY AUTOINCREMENT,
    Nombre TEXT NOT NULL,
    Descripcion TEXT,
    TipoMascota TEXT,
    Activa INTEGER DEFAULT 1
);

CREATE TABLE Productos (
    IdProducto INTEGER PRIMARY KEY AUTOINCREMENT,
    NombreBase TEXT NOT NULL,
    Descripcion TEXT,
    IdCategoria INTEGER NOT NULL,
    TipoMascota TEXT NOT NULL,
    URLImagen TEXT,  -- Este campo está vacío inicialmente
    Activo INTEGER DEFAULT 1,
    FechaCreacion TEXT DEFAULT CURRENT_TIMESTAMP,
    FechaActualizacion TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IdCategoria) REFERENCES Categorias(IdCategoria)
);

CREATE TABLE VariacionesProducto (
    IdVariacion INTEGER PRIMARY KEY AUTOINCREMENT,
    IdProducto INTEGER NOT NULL,
    Peso TEXT NOT NULL,
    Precio REAL NOT NULL,
    Stock INTEGER DEFAULT 0,
    Activa INTEGER DEFAULT 1,
    FechaCreacion TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IdProducto) REFERENCES Productos(IdProducto)
);

-- Insertar categorías
INSERT INTO Categorias (Nombre, Descripcion, TipoMascota, Activa) VALUES
('Alimento para Perros', 'Alimentos balanceados para perros', 'Perros', 1),
('Alimento para Gatos', 'Alimentos balanceados para gatos', 'Gatos', 1),
('Snacks y Premios', 'Golosinas y premios', 'Ambos', 1);

-- Insertar productos SIN URLImagen (NULL o vacío)
INSERT INTO Productos (NombreBase, Descripcion, IdCategoria, TipoMascota, URLImagen) VALUES
('Churu Atún 4 Piezas 56gr', 'Snack cremoso para gatos sabor atún', 3, 'Gatos', NULL),
('Royal Canin Adult', 'Alimento balanceado para perros adultos', 1, 'Perros', ''),
('BR for Cat Vet', 'Alimento veterinario para gatos', 2, 'Gatos', NULL),
('Hills Science Diet Puppy', 'Nutrición científicamente formulada para cachorros', 1, 'Perros', ''),
('Purina Pro Plan Adult Cat', 'Alimento completo y balanceado para gatos adultos', 2, 'Gatos', NULL);

-- Insertar variaciones
INSERT INTO VariacionesProducto (IdProducto, Peso, Precio, Stock) VALUES
-- Churu Atún
(1, '56 GR', 85.00, 50),
(1, '112 GR', 160.00, 30),

-- Royal Canin Adult
(2, '3 KG', 450.00, 25),
(2, '7.5 KG', 980.00, 15),

-- BR for Cat Vet
(3, '1.5 KG', 320.00, 20),
(3, '3 KG', 580.00, 10),

-- Hills Science Diet Puppy
(4, '2 KG', 380.00, 30),
(4, '6 KG', 995.00, 12),

-- Purina Pro Plan Adult Cat
(5, '1 KG', 185.00, 40),
(5, '3 KG', 495.00, 22);
EOF

echo -e "${GREEN}   ✅ Base de datos creada con 5 productos SIN imágenes${NC}"
echo ""

# Verificar productos sin imagen
echo -e "${YELLOW}   📊 Estado inicial (productos SIN URLImagen):${NC}"
echo ""
sqlite3 -header -column "$DB_FILE" "SELECT IdProducto, NombreBase, URLImagen FROM Productos;"
echo ""

# ============================================================================
# PARTE 2: Iniciar backend y mostrar el problema
# ============================================================================
echo -e "${BLUE}📋 PARTE 2: Iniciando backend para demostrar el problema...${NC}"
echo ""

cd "$BACKEND_DIR"

# Verificar si dotnet está disponible
if ! command -v dotnet &> /dev/null; then
    echo -e "${RED}❌ dotnet no está instalado${NC}"
    exit 1
fi

echo "   Restaurando dependencias..."
dotnet restore > /dev/null 2>&1

echo "   Compilando aplicación..."
dotnet build > /dev/null 2>&1

echo -e "${GREEN}   ✅ Backend compilado exitosamente${NC}"
echo ""

# Iniciar backend en segundo plano con entorno de desarrollo
echo "   Iniciando backend en http://localhost:5135 (Development mode)..."
export ASPNETCORE_ENVIRONMENT=Development
dotnet run --urls="http://localhost:5135" > /tmp/backend.log 2>&1 &
BACKEND_PID=$!

echo -e "${GREEN}   ✅ Backend iniciado (PID: $BACKEND_PID)${NC}"
echo ""

# Esperar a que el backend esté listo
echo "   Esperando a que el backend esté listo..."
sleep 5

# Verificar que el backend está corriendo
if ! curl -s --fail http://localhost:5135/api/Productos > /dev/null 2>&1; then
    echo -e "${RED}❌ El backend no pudo iniciar correctamente${NC}"
    echo "   Logs del backend:"
    cat /tmp/backend.log
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

echo -e "${GREEN}   ✅ Backend está listo y respondiendo${NC}"
echo ""

# ============================================================================
# PARTE 3: Demostrar el problema
# ============================================================================
echo -e "${RED}╔════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║  ❌ PROBLEMA: Campo Images está vacío                                 ║${NC}"
echo -e "${RED}╚════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}   📡 Llamando a la API: GET /api/Productos${NC}"
echo ""

# Obtener primer producto
FIRST_PRODUCT=$(curl -s http://localhost:5135/api/Productos | jq '.[0]')

echo "   Primer producto de la API:"
echo ""
echo "$FIRST_PRODUCT" | jq '.'
echo ""

# Verificar campo Images
IMAGES_FIELD=$(echo "$FIRST_PRODUCT" | jq '.Images')
echo -e "${YELLOW}   Campo Images del primer producto:${NC}"
echo "$IMAGES_FIELD"
echo ""

if [ "$IMAGES_FIELD" == "[]" ]; then
    echo -e "${RED}   ❌ PROBLEMA CONFIRMADO: El campo Images está vacío []${NC}"
    echo ""
    echo -e "${YELLOW}   💡 Causa: URLImagen está vacío en la base de datos${NC}"
    echo ""
else
    echo -e "${GREEN}   ✅ El campo Images tiene valores${NC}"
    echo ""
fi

# ============================================================================
# PARTE 4: Aplicar la solución
# ============================================================================
cd ..

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🔧 SOLUCIÓN: Poblar campo URLImagen                                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo "   Ejecutando UPDATEs en la base de datos..."
echo ""

# Actualizar productos con URLs de imágenes
sqlite3 "$DB_FILE" <<'EOF'
UPDATE Productos 
SET URLImagen = 'https://www.velykapet.com/productos/alimentos/gatos/CHURU_ATUN_4_PIEZAS_56_GR.jpg',
    FechaActualizacion = CURRENT_TIMESTAMP
WHERE IdProducto = 1;

UPDATE Productos 
SET URLImagen = 'https://www.velykapet.com/productos/alimentos/perros/ROYAL_CANIN_ADULT.jpg',
    FechaActualizacion = CURRENT_TIMESTAMP
WHERE IdProducto = 2;

UPDATE Productos 
SET URLImagen = 'https://www.velykapet.com/productos/alimentos/gatos/BR_FOR_CAT_VET.jpg',
    FechaActualizacion = CURRENT_TIMESTAMP
WHERE IdProducto = 3;

UPDATE Productos 
SET URLImagen = 'https://www.velykapet.com/productos/alimentos/perros/HILLS_SCIENCE_DIET_PUPPY.jpg',
    FechaActualizacion = CURRENT_TIMESTAMP
WHERE IdProducto = 4;

UPDATE Productos 
SET URLImagen = 'https://www.velykapet.com/productos/alimentos/gatos/PURINA_PRO_PLAN_ADULT_CAT.jpg',
    FechaActualizacion = CURRENT_TIMESTAMP
WHERE IdProducto = 5;
EOF

echo -e "${GREEN}   ✅ URLs de imágenes actualizadas en la base de datos${NC}"
echo ""

# Verificar cambios
echo -e "${YELLOW}   📊 Estado después de la actualización:${NC}"
echo ""
sqlite3 -header -column "$DB_FILE" "SELECT IdProducto, NombreBase, SUBSTR(URLImagen, 1, 60) AS URLImagen FROM Productos;"
echo ""

# ============================================================================
# PARTE 5: Verificar la solución
# ============================================================================
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ VERIFICACIÓN: Campo Images ahora tiene valores                    ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo "   Esperando a que Entity Framework actualice el caché..."
sleep 2

echo -e "${YELLOW}   📡 Llamando a la API nuevamente: GET /api/Productos${NC}"
echo ""

# Obtener primer producto nuevamente
FIRST_PRODUCT_UPDATED=$(curl -s http://localhost:5135/api/Productos | jq '.[0]')

echo "   Primer producto (actualizado):"
echo ""
echo "$FIRST_PRODUCT_UPDATED" | jq '.'
echo ""

# Verificar campo Images
IMAGES_FIELD_UPDATED=$(echo "$FIRST_PRODUCT_UPDATED" | jq '.Images')
echo -e "${YELLOW}   Campo Images del primer producto (actualizado):${NC}"
echo "$IMAGES_FIELD_UPDATED"
echo ""

if [ "$IMAGES_FIELD_UPDATED" != "[]" ]; then
    echo -e "${GREEN}   ✅ ¡ÉXITO! El campo Images ahora tiene la URL de la imagen${NC}"
    echo ""
    echo -e "${GREEN}   🎉 Las imágenes ahora se mostrarían en el catálogo${NC}"
    echo -e "${YELLOW}   (Siempre y cuando las imágenes existan en Cloudflare R2)${NC}"
    echo ""
else
    echo -e "${YELLOW}   ⚠️  El campo Images aún está vacío${NC}"
    echo ""
    echo -e "${YELLOW}   Esto puede deberse a que Entity Framework tiene cacheados los datos.${NC}"
    echo -e "${YELLOW}   En producción, reiniciar el backend resolvería esto.${NC}"
    echo ""
fi

# ============================================================================
# PARTE 6: Resumen y limpieza
# ============================================================================
echo "╔════════════════════════════════════════════════════════════════════════╗"
echo "║  📊 RESUMEN DE LA DEMOSTRACIÓN                                        ║"
echo "╚════════════════════════════════════════════════════════════════════════╝"
echo ""

echo -e "${YELLOW}ANTES de ejecutar el script SQL:${NC}"
echo "   - URLImagen: NULL o vacío"
echo "   - Images: [] (array vacío)"
echo "   - Resultado: Placeholders en el catálogo ❌"
echo ""

echo -e "${GREEN}DESPUÉS de ejecutar el script SQL:${NC}"
echo "   - URLImagen: https://www.velykapet.com/..."
echo "   - Images: [\"https://www.velykapet.com/...\"]"
echo "   - Resultado: Imágenes en el catálogo ✅"
echo ""

echo -e "${BLUE}📝 Archivos importantes creados:${NC}"
echo "   1. FIX_IMAGENES_PRODUCTOS.md - Resumen del problema y solución"
echo "   2. SOLUCION_PASO_A_PASO.md - Guía detallada"
echo "   3. backend-config/Scripts/FIX_POPULATE_PRODUCT_IMAGES.sql - Script SQL"
echo "   4. verify-product-images.sh - Script de diagnóstico"
echo ""

# Limpiar
echo -e "${BLUE}🧹 Deteniendo backend y limpiando...${NC}"
kill $BACKEND_PID 2>/dev/null || true
echo ""

echo "╔════════════════════════════════════════════════════════════════════════╗"
echo "║  ✅ DEMOSTRACIÓN COMPLETADA                                           ║"
echo "╚════════════════════════════════════════════════════════════════════════╝"
echo ""

echo -e "${GREEN}🎯 Conclusión:${NC}"
echo "   El problema NO es el código (backend y frontend están correctos)."
echo "   El problema es que falta poblar el campo URLImagen en la base de datos."
echo ""
echo -e "${YELLOW}📋 Para resolver en tu entorno:${NC}"
echo "   1. Ejecutar: backend-config/Scripts/FIX_POPULATE_PRODUCT_IMAGES.sql"
echo "   2. Reiniciar el backend"
echo "   3. Verificar con: bash verify-product-images.sh"
echo ""
