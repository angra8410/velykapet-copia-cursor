# 🔍 Guía de Filtros Avanzados de Productos - VelyKaPet

## 📋 Resumen Ejecutivo

Esta guía documenta la implementación de un **sistema de filtros avanzados** para el catálogo de productos, permitiendo filtrar productos por múltiples dimensiones:

- **Tipo de Mascota** (GATO, PERRO)
- **Categoría de Alimento** (ALIMENTO SECO, ALIMENTO HÚMEDO, SNACKS Y PREMIOS)
- **Subcategoría** (DIETA SECA PRESCRITA, ADULT, PUPPY, KITTEN, INDOOR, etc.)
- **Presentación/Empaque** (BOLSA, LATA, SOBRE, CAJA, TUBO)

---

## 🏗️ Estructura de Datos

### Tablas Maestras Creadas

#### 1. **MascotaTipo**
```sql
CREATE TABLE MascotaTipo (
    IdMascotaTipo INT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Activo BIT DEFAULT 1
);
```

**Datos de ejemplo:**
```sql
INSERT INTO MascotaTipo VALUES (1, 'GATO', 1);
INSERT INTO MascotaTipo VALUES (2, 'PERRO', 1);
```

#### 2. **CategoriaAlimento**
```sql
CREATE TABLE CategoriaAlimento (
    IdCategoriaAlimento INT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    IdMascotaTipo INT NULL,
    Activa BIT DEFAULT 1,
    FOREIGN KEY (IdMascotaTipo) REFERENCES MascotaTipo(IdMascotaTipo)
);
```

**Datos de ejemplo:**
```sql
INSERT INTO CategoriaAlimento VALUES (1, 'ALIMENTO SECO', 2, 1);      -- Perros
INSERT INTO CategoriaAlimento VALUES (2, 'ALIMENTO SECO', 1, 1);      -- Gatos
INSERT INTO CategoriaAlimento VALUES (3, 'ALIMENTO HÚMEDO', 2, 1);    -- Perros
INSERT INTO CategoriaAlimento VALUES (4, 'ALIMENTO HÚMEDO', 1, 1);    -- Gatos
INSERT INTO CategoriaAlimento VALUES (5, 'SNACKS Y PREMIOS', NULL, 1); -- Ambos
```

#### 3. **SubcategoriaAlimento**
```sql
CREATE TABLE SubcategoriaAlimento (
    IdSubcategoria INT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    IdCategoriaAlimento INT NOT NULL,
    Activa BIT DEFAULT 1,
    FOREIGN KEY (IdCategoriaAlimento) REFERENCES CategoriaAlimento(IdCategoriaAlimento)
);
```

**Datos de ejemplo:**
```sql
-- Subcategorías de Alimento Seco para Perros (IdCategoriaAlimento = 1)
INSERT INTO SubcategoriaAlimento VALUES (1, 'DIETA SECA PRESCRITA', 1, 1);
INSERT INTO SubcategoriaAlimento VALUES (2, 'ADULT', 1, 1);
INSERT INTO SubcategoriaAlimento VALUES (3, 'PUPPY', 1, 1);
INSERT INTO SubcategoriaAlimento VALUES (4, 'SENIOR', 1, 1);

-- Subcategorías de Alimento Seco para Gatos (IdCategoriaAlimento = 2)
INSERT INTO SubcategoriaAlimento VALUES (5, 'DIETA SECA PRESCRITA', 2, 1);
INSERT INTO SubcategoriaAlimento VALUES (6, 'ADULT', 2, 1);
INSERT INTO SubcategoriaAlimento VALUES (7, 'KITTEN', 2, 1);
INSERT INTO SubcategoriaAlimento VALUES (8, 'INDOOR', 2, 1);

-- Subcategorías de Snacks (IdCategoriaAlimento = 5)
INSERT INTO SubcategoriaAlimento VALUES (13, 'SNACKS NATURALES', 5, 1);
INSERT INTO SubcategoriaAlimento VALUES (14, 'PREMIOS DE ENTRENAMIENTO', 5, 1);
```

#### 4. **PresentacionEmpaque**
```sql
CREATE TABLE PresentacionEmpaque (
    IdPresentacion INT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Activa BIT DEFAULT 1
);
```

**Datos de ejemplo:**
```sql
INSERT INTO PresentacionEmpaque VALUES (1, 'BOLSA', 1);
INSERT INTO PresentacionEmpaque VALUES (2, 'LATA', 1);
INSERT INTO PresentacionEmpaque VALUES (3, 'SOBRE', 1);
INSERT INTO PresentacionEmpaque VALUES (4, 'CAJA', 1);
INSERT INTO PresentacionEmpaque VALUES (5, 'TUBO', 1);
```

### Modificación de la Tabla Productos

Se agregaron **nuevas columnas** a la tabla `Productos` para vincular con las tablas maestras:

```sql
ALTER TABLE Productos
ADD IdMascotaTipo INT NULL,
    IdCategoriaAlimento INT NULL,
    IdSubcategoria INT NULL,
    IdPresentacion INT NULL,
    FOREIGN KEY (IdMascotaTipo) REFERENCES MascotaTipo(IdMascotaTipo),
    FOREIGN KEY (IdCategoriaAlimento) REFERENCES CategoriaAlimento(IdCategoriaAlimento),
    FOREIGN KEY (IdSubcategoria) REFERENCES SubcategoriaAlimento(IdSubcategoria),
    FOREIGN KEY (IdPresentacion) REFERENCES PresentacionEmpaque(IdPresentacion);
```

**Nota:** Los campos existentes `IdCategoria` y `TipoMascota` se mantienen para **compatibilidad hacia atrás**.

---

## 📝 Ejemplos de Uso

### Asociar Productos a Categorías, Subcategorías y Presentaciones

**Ejemplo 1: Producto de Alimento Seco para Perros Adultos**
```sql
UPDATE Productos
SET IdMascotaTipo = 2,           -- PERRO
    IdCategoriaAlimento = 1,      -- ALIMENTO SECO (Perros)
    IdSubcategoria = 2,           -- ADULT
    IdPresentacion = 1            -- BOLSA
WHERE IdProducto = 1;
```

**Ejemplo 2: Snack para Gatos en Sobre**
```sql
UPDATE Productos
SET IdMascotaTipo = 1,           -- GATO
    IdCategoriaAlimento = 5,      -- SNACKS Y PREMIOS
    IdSubcategoria = 13,          -- SNACKS NATURALES
    IdPresentacion = 3            -- SOBRE
WHERE IdProducto = 2;
```

**Ejemplo 3: Alimento Húmedo para Cachorros en Lata**
```sql
UPDATE Productos
SET IdMascotaTipo = 2,           -- PERRO
    IdCategoriaAlimento = 3,      -- ALIMENTO HÚMEDO (Perros)
    IdSubcategoria = 10,          -- ADULT HÚMEDO
    IdPresentacion = 2            -- LATA
WHERE IdProducto = 6;
```

### Consultas de Filtrado

**Filtrar productos por tipo de mascota:**
```sql
SELECT * FROM Productos
WHERE IdMascotaTipo = 1 AND Activo = 1;  -- Solo gatos
```

**Filtrar por categoría de alimento:**
```sql
SELECT * FROM Productos
WHERE IdCategoriaAlimento = 1 AND Activo = 1;  -- Solo alimento seco para perros
```

**Filtrar por presentación:**
```sql
SELECT * FROM Productos
WHERE IdPresentacion = 1 AND Activo = 1;  -- Solo productos en bolsa
```

**Filtrar por múltiples criterios:**
```sql
SELECT * FROM Productos
WHERE IdMascotaTipo = 1           -- GATO
  AND IdCategoriaAlimento = 2     -- ALIMENTO SECO
  AND IdSubcategoria = 6          -- ADULT
  AND IdPresentacion = 1          -- BOLSA
  AND Activo = 1;
```

---

## 🌐 API Endpoints

### Obtener Productos con Filtros Avanzados

**Endpoint:** `GET /api/Productos`

**Parámetros de consulta:**
- `idMascotaTipo` (int, opcional): Filtrar por tipo de mascota
- `idCategoriaAlimento` (int, opcional): Filtrar por categoría de alimento
- `idSubcategoria` (int, opcional): Filtrar por subcategoría
- `idPresentacion` (int, opcional): Filtrar por presentación
- `categoria` (string, opcional): Filtrar por categoría antigua (compatibilidad)
- `tipoMascota` (string, opcional): Filtrar por tipo de mascota antiguo (compatibilidad)
- `busqueda` (string, opcional): Búsqueda por texto

**Ejemplos de uso:**

```javascript
// Obtener todos los productos para gatos
GET /api/Productos?idMascotaTipo=1

// Obtener alimento seco para perros
GET /api/Productos?idMascotaTipo=2&idCategoriaAlimento=1

// Obtener productos en presentación de bolsa
GET /api/Productos?idPresentacion=1

// Filtrar por múltiples criterios
GET /api/Productos?idMascotaTipo=1&idCategoriaAlimento=2&idSubcategoria=6&idPresentacion=1
```

### Obtener Tablas Maestras para Filtros

**1. Obtener tipos de mascota:**
```javascript
GET /api/Productos/filtros/mascotas
```

**Respuesta:**
```json
[
  { "idMascotaTipo": 1, "nombre": "GATO", "activo": true },
  { "idMascotaTipo": 2, "nombre": "PERRO", "activo": true }
]
```

**2. Obtener categorías de alimento:**
```javascript
GET /api/Productos/filtros/categorias-alimento
GET /api/Productos/filtros/categorias-alimento?idMascotaTipo=1  // Filtrar por mascota
```

**Respuesta:**
```json
[
  {
    "idCategoriaAlimento": 1,
    "nombre": "ALIMENTO SECO",
    "idMascotaTipo": 2,
    "nombreMascotaTipo": "PERRO",
    "activa": true
  },
  {
    "idCategoriaAlimento": 2,
    "nombre": "ALIMENTO SECO",
    "idMascotaTipo": 1,
    "nombreMascotaTipo": "GATO",
    "activa": true
  }
]
```

**3. Obtener subcategorías:**
```javascript
GET /api/Productos/filtros/subcategorias
GET /api/Productos/filtros/subcategorias?idCategoriaAlimento=1  // Filtrar por categoría
```

**Respuesta:**
```json
[
  {
    "idSubcategoria": 1,
    "nombre": "DIETA SECA PRESCRITA",
    "idCategoriaAlimento": 1,
    "nombreCategoriaAlimento": "ALIMENTO SECO",
    "activa": true
  },
  {
    "idSubcategoria": 2,
    "nombre": "ADULT",
    "idCategoriaAlimento": 1,
    "nombreCategoriaAlimento": "ALIMENTO SECO",
    "activa": true
  }
]
```

**4. Obtener presentaciones de empaque:**
```javascript
GET /api/Productos/filtros/presentaciones
```

**Respuesta:**
```json
[
  { "idPresentacion": 1, "nombre": "BOLSA", "activa": true },
  { "idPresentacion": 2, "nombre": "LATA", "activa": true },
  { "idPresentacion": 3, "nombre": "SOBRE", "activa": true }
]
```

---

## 🎨 Integración Frontend

### Cargar Filtros Dinámicamente

```javascript
// Cargar tipos de mascota
const mascotas = await fetch('/api/Productos/filtros/mascotas').then(r => r.json());

// Cargar categorías de alimento
const categorias = await fetch('/api/Productos/filtros/categorias-alimento').then(r => r.json());

// Cargar subcategorías (filtradas por categoría)
const subcategorias = await fetch('/api/Productos/filtros/subcategorias?idCategoriaAlimento=1')
    .then(r => r.json());

// Cargar presentaciones
const presentaciones = await fetch('/api/Productos/filtros/presentaciones').then(r => r.json());
```

### Aplicar Filtros

```javascript
// Construir URL con filtros
const filtros = {
    idMascotaTipo: 1,         // GATO
    idCategoriaAlimento: 2,   // ALIMENTO SECO
    idSubcategoria: 6,        // ADULT
    idPresentacion: 1         // BOLSA
};

const params = new URLSearchParams(filtros);
const productos = await fetch(`/api/Productos?${params}`).then(r => r.json());
```

### Ejemplo de Componente de Filtros

```javascript
function AdvancedFilters({ onFilterChange }) {
    const [mascotas, setMascotas] = React.useState([]);
    const [categorias, setCategorias] = React.useState([]);
    const [subcategorias, setSubcategorias] = React.useState([]);
    const [presentaciones, setPresentaciones] = React.useState([]);
    
    const [selectedFilters, setSelectedFilters] = React.useState({
        idMascotaTipo: null,
        idCategoriaAlimento: null,
        idSubcategoria: null,
        idPresentacion: null
    });

    // Cargar datos de filtros al montar el componente
    React.useEffect(() => {
        loadFilterData();
    }, []);

    const loadFilterData = async () => {
        try {
            const [mascotasData, presentacionesData] = await Promise.all([
                fetch('/api/Productos/filtros/mascotas').then(r => r.json()),
                fetch('/api/Productos/filtros/presentaciones').then(r => r.json())
            ]);
            
            setMascotas(mascotasData);
            setPresentaciones(presentacionesData);
        } catch (error) {
            console.error('Error cargando filtros:', error);
        }
    };

    // Cargar categorías cuando cambia el tipo de mascota
    React.useEffect(() => {
        if (selectedFilters.idMascotaTipo) {
            fetch(`/api/Productos/filtros/categorias-alimento?idMascotaTipo=${selectedFilters.idMascotaTipo}`)
                .then(r => r.json())
                .then(setCategorias);
        } else {
            setCategorias([]);
        }
    }, [selectedFilters.idMascotaTipo]);

    // Cargar subcategorías cuando cambia la categoría de alimento
    React.useEffect(() => {
        if (selectedFilters.idCategoriaAlimento) {
            fetch(`/api/Productos/filtros/subcategorias?idCategoriaAlimento=${selectedFilters.idCategoriaAlimento}`)
                .then(r => r.json())
                .then(setSubcategorias);
        } else {
            setSubcategorias([]);
        }
    }, [selectedFilters.idCategoriaAlimento]);

    const handleFilterChange = (filterName, value) => {
        const newFilters = { ...selectedFilters, [filterName]: value };
        
        // Limpiar filtros dependientes
        if (filterName === 'idMascotaTipo') {
            newFilters.idCategoriaAlimento = null;
            newFilters.idSubcategoria = null;
        } else if (filterName === 'idCategoriaAlimento') {
            newFilters.idSubcategoria = null;
        }
        
        setSelectedFilters(newFilters);
        onFilterChange(newFilters);
    };

    return React.createElement('div', { className: 'advanced-filters' },
        // Filtro de tipo de mascota
        React.createElement('select', {
            value: selectedFilters.idMascotaTipo || '',
            onChange: (e) => handleFilterChange('idMascotaTipo', e.target.value ? parseInt(e.target.value) : null)
        },
            React.createElement('option', { value: '' }, 'Tipo de Mascota'),
            mascotas.map(m => React.createElement('option', { 
                key: m.idMascotaTipo, 
                value: m.idMascotaTipo 
            }, m.nombre))
        ),
        
        // Filtro de categoría de alimento
        React.createElement('select', {
            value: selectedFilters.idCategoriaAlimento || '',
            onChange: (e) => handleFilterChange('idCategoriaAlimento', e.target.value ? parseInt(e.target.value) : null),
            disabled: !selectedFilters.idMascotaTipo
        },
            React.createElement('option', { value: '' }, 'Categoría de Alimento'),
            categorias.map(c => React.createElement('option', { 
                key: c.idCategoriaAlimento, 
                value: c.idCategoriaAlimento 
            }, c.nombre))
        ),
        
        // Filtro de subcategoría
        React.createElement('select', {
            value: selectedFilters.idSubcategoria || '',
            onChange: (e) => handleFilterChange('idSubcategoria', e.target.value ? parseInt(e.target.value) : null),
            disabled: !selectedFilters.idCategoriaAlimento
        },
            React.createElement('option', { value: '' }, 'Subcategoría'),
            subcategorias.map(s => React.createElement('option', { 
                key: s.idSubcategoria, 
                value: s.idSubcategoria 
            }, s.nombre))
        ),
        
        // Filtro de presentación
        React.createElement('select', {
            value: selectedFilters.idPresentacion || '',
            onChange: (e) => handleFilterChange('idPresentacion', e.target.value ? parseInt(e.target.value) : null)
        },
            React.createElement('option', { value: '' }, 'Presentación'),
            presentaciones.map(p => React.createElement('option', { 
                key: p.idPresentacion, 
                value: p.idPresentacion 
            }, p.nombre))
        )
    );
}
```

---

## 🔄 Migración de Datos

### Script de Migración para Productos Existentes

```sql
-- Actualizar productos de perros con alimento seco
UPDATE Productos
SET IdMascotaTipo = 2,
    IdCategoriaAlimento = 1,
    IdSubcategoria = 2,
    IdPresentacion = 1
WHERE TipoMascota = 'Perros' 
  AND NombreBase LIKE '%Adult%'
  AND IdCategoriaAlimento IS NULL;

-- Actualizar productos de gatos con alimento seco
UPDATE Productos
SET IdMascotaTipo = 1,
    IdCategoriaAlimento = 2,
    IdSubcategoria = 6,
    IdPresentacion = 1
WHERE TipoMascota = 'Gatos' 
  AND NombreBase LIKE '%Adult%'
  AND IdCategoriaAlimento IS NULL;

-- Actualizar snacks para gatos
UPDATE Productos
SET IdMascotaTipo = 1,
    IdCategoriaAlimento = 5,
    IdSubcategoria = 13,
    IdPresentacion = 3
WHERE TipoMascota = 'Gatos' 
  AND (NombreBase LIKE '%Churu%' OR NombreBase LIKE '%Snack%')
  AND IdCategoriaAlimento IS NULL;
```

---

## ✅ Beneficios del Sistema

1. **Escalabilidad**: Fácil agregar nuevas categorías, subcategorías y presentaciones
2. **Flexibilidad**: Permite filtros combinados y jerárquicos
3. **Mantenibilidad**: Estructura normalizada facilita el mantenimiento
4. **Compatibilidad**: Los campos antiguos se mantienen para no romper funcionalidad existente
5. **Experiencia de Usuario**: Filtros más precisos mejoran la búsqueda de productos
6. **Integridad de Datos**: Claves foráneas garantizan consistencia

---

## 🔗 Relaciones entre Tablas

```
MascotaTipo (1) ─────< CategoriaAlimento (*)
                             │
                             │
                             v
                      SubcategoriaAlimento (*)
                             
Productos (*) ───────> MascotaTipo (1)
              ───────> CategoriaAlimento (1)
              ───────> SubcategoriaAlimento (1)
              ───────> PresentacionEmpaque (1)
```

---

## 📚 Documentación Adicional

- **Migración de Entity Framework**: `/backend-config/Migrations/20251009004438_AddAdvancedFilterTables.cs`
- **Modelos de datos**: `/backend-config/Models/Producto.cs`
- **Contexto de base de datos**: `/backend-config/Data/VentasPetDbContext.cs`
- **Controlador de API**: `/backend-config/Controllers/ProductosController.cs`

---

## 🎯 Próximos Pasos

1. ✅ Estructura de datos normalizada creada
2. ✅ API endpoints implementados
3. ✅ Migración de Entity Framework generada
4. ⏳ Actualizar frontend para usar filtros dinámicos
5. ⏳ Migrar datos de productos existentes
6. ⏳ Testing de filtros en producción
7. ⏳ Documentación de usuario final

---

**Fecha de creación**: 9 de octubre de 2025  
**Versión**: 1.0  
**Autor**: Copilot - GitHub Advanced Agent
