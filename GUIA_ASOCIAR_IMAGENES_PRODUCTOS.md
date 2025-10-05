# 📸 Guía: Asociar Imágenes de Cloudflare R2 a Productos del Catálogo

**Fecha:** Diciembre 2024  
**Proyecto:** VelyKapet E-commerce  
**Tema:** Cómo asociar imágenes públicas desde Cloudflare R2 a productos

---

## 🎯 Objetivo

Esta guía explica paso a paso cómo asociar imágenes almacenadas en Cloudflare R2 a productos del catálogo, asegurando que se muestren correctamente en el frontend (React) con buenas prácticas de performance, cache y seguridad.

---

## 📋 Ejemplo Implementado

### Producto de Prueba Actualizado

Hemos actualizado el **producto IdProducto = 2** en la base de datos de semilla para usar la imagen de Cloudflare R2:

**Antes:**
```csharp
new Producto
{
    IdProducto = 2,
    NombreBase = "BR FOR CAT VET CONTROL DE PESO",
    URLImagen = "/images/productos/royal-canin-cat-weight.jpg",
    // ...
}
```

**Después:**
```csharp
new Producto
{
    IdProducto = 2,
    NombreBase = "Churu Atún 4 Piezas 56gr",
    Descripcion = "Snack cremoso para gatos sabor atún, presentación 4 piezas de 56 gramos. Irresistible para tu felino.",
    IdCategoria = 3, // Snacks y Premios
    TipoMascota = "Gatos",
    URLImagen = "https://www.velykapet.com/CHURU_ATUN_4_PIEZAS_56_GR.jpg",
    Activo = true,
    FechaCreacion = DateTime.Now,
    FechaActualizacion = DateTime.Now
}
```

**Ubicación del cambio:**
- Archivo: `backend-config/Data/VentasPetDbContext.cs`
- Método: `SeedData()` (líneas 263-274 aproximadamente)

---

## 🔧 Cómo Agregar la URL de Imagen a un Producto

### Opción 1: En los Datos de Semilla (Seed Data)

**Cuándo usar:** Para productos de prueba o datos iniciales del sistema.

**Archivo:** `backend-config/Data/VentasPetDbContext.cs`

**Pasos:**

1. Abre el archivo `backend-config/Data/VentasPetDbContext.cs`
2. Busca el método `SeedData(ModelBuilder modelBuilder)`
3. Encuentra el producto que deseas actualizar en la sección `modelBuilder.Entity<Producto>().HasData()`
4. Actualiza la propiedad `URLImagen` con la URL completa de Cloudflare R2:

```csharp
new Producto
{
    IdProducto = 5,
    NombreBase = "Nombre del Producto",
    Descripcion = "Descripción del producto",
    IdCategoria = 3,
    TipoMascota = "Gatos", // o "Perros" o "Ambos"
    URLImagen = "https://www.velykapet.com/productos/categoria/NOMBRE_ARCHIVO.jpg",
    Activo = true,
    FechaCreacion = DateTime.Now,
    FechaActualizacion = DateTime.Now
}
```

5. Guarda el archivo
6. Regenera la base de datos para aplicar los cambios:
   ```bash
   cd backend-config
   dotnet ef migrations add ActualizarImagenProducto
   dotnet ef database update
   ```

### Opción 2: Mediante la API (Para Productos Existentes)

**Cuándo usar:** Para actualizar productos ya existentes en la base de datos.

**Método:** PUT o PATCH al endpoint de productos

**Ejemplo con cURL:**
```bash
curl -X PUT "http://localhost:5135/api/productos/2" \
  -H "Content-Type: application/json" \
  -d '{
    "IdProducto": 2,
    "NombreBase": "Churu Atún 4 Piezas 56gr",
    "URLImagen": "https://www.velykapet.com/CHURU_ATUN_4_PIEZAS_56_GR.jpg",
    "Activo": true
  }'
```

**Ejemplo con JavaScript (fetch):**
```javascript
const actualizarImagenProducto = async (idProducto, urlImagen) => {
    const response = await fetch(`/api/productos/${idProducto}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            IdProducto: idProducto,
            URLImagen: urlImagen
        })
    });
    
    if (response.ok) {
        console.log('✅ Imagen actualizada correctamente');
    }
};

// Uso
await actualizarImagenProducto(2, 'https://www.velykapet.com/CHURU_ATUN_4_PIEZAS_56_GR.jpg');
```

### Opción 3: Mediante SQL Directo

**Cuándo usar:** Para actualizaciones masivas o migraciones desde otro servicio.

**Ejemplo SQL:**
```sql
-- Actualizar un solo producto
UPDATE Productos 
SET URLImagen = 'https://www.velykapet.com/CHURU_ATUN_4_PIEZAS_56_GR.jpg',
    FechaActualizacion = GETDATE()
WHERE IdProducto = 2;

-- Actualizar múltiples productos (migración masiva)
UPDATE Productos 
SET URLImagen = REPLACE(URLImagen, '/images/productos/', 'https://www.velykapet.com/productos/'),
    FechaActualizacion = GETDATE()
WHERE URLImagen LIKE '/images/productos/%';
```

---

## 📦 Estructura de Producto con Imagen Asociada

### Modelo Backend (C# - ProductoDto)

```csharp
public class ProductoDto
{
    public int IdProducto { get; set; }
    public string NombreBase { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public int IdCategoria { get; set; }
    public string NombreCategoria { get; set; } = string.Empty;
    public string TipoMascota { get; set; } = string.Empty;
    public string? URLImagen { get; set; } // ← Aquí va la URL de Cloudflare R2
    public bool Activo { get; set; }
    public List<VariacionProductoDto> Variaciones { get; set; } = new List<VariacionProductoDto>();
}
```

### Ejemplo JSON Completo

```json
{
  "IdProducto": 2,
  "NombreBase": "Churu Atún 4 Piezas 56gr",
  "Descripcion": "Snack cremoso para gatos sabor atún, presentación 4 piezas de 56 gramos. Irresistible para tu felino.",
  "IdCategoria": 3,
  "NombreCategoria": "Snacks y Premios",
  "TipoMascota": "Gatos",
  "URLImagen": "https://www.velykapet.com/CHURU_ATUN_4_PIEZAS_56_GR.jpg",
  "Activo": true,
  "Variaciones": [
    {
      "IdVariacion": 4,
      "IdProducto": 2,
      "Peso": "56 GR",
      "Precio": 85.00,
      "Stock": 50,
      "Activa": true
    },
    {
      "IdVariacion": 5,
      "IdProducto": 2,
      "Peso": "112 GR",
      "Precio": 160.00,
      "Stock": 30,
      "Activa": true
    },
    {
      "IdVariacion": 6,
      "IdProducto": 2,
      "Peso": "224 GR",
      "Precio": 295.00,
      "Stock": 20,
      "Activa": true
    }
  ]
}
```

---

## 💻 Consumo de Imagen en el Frontend (React)

### Implementación Actual en ProductCard.js

El componente `ProductCard` ya está preparado para consumir imágenes desde Cloudflare R2:

```javascript
// El componente detecta automáticamente la propiedad URLImagen
const imageUrl = product.URLImagen || product.ImageUrl || product.image;

// Se renderiza con lazy loading y fallback
<img 
    src={window.transformImageUrl ? 
        window.transformImageUrl(imageUrl) : 
        imageUrl
    }
    alt={product.NombreBase}
    loading="lazy"
    onLoad={handleImageLoad}
    onError={handleImageError}
    style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'opacity 0.3s ease'
    }}
/>
```

### Ejemplo Básico (Mínimo)

```javascript
function ProductImage({ product }) {
    return (
        <img 
            src={product.URLImagen} 
            alt={product.NombreBase}
            loading="lazy"
        />
    );
}
```

### Ejemplo con Mejores Prácticas

```javascript
function ProductImage({ product }) {
    const [imageError, setImageError] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    
    const handleImageLoad = () => {
        setIsLoading(false);
    };
    
    const handleImageError = () => {
        setIsLoading(false);
        setImageError(true);
    };
    
    return (
        <div className="product-image-container">
            {isLoading && <div className="image-loader">Cargando...</div>}
            
            <img 
                src={!imageError ? product.URLImagen : 'https://www.velykapet.com/sistema/placeholders/producto-sin-imagen.jpg'}
                alt={product.NombreBase || 'Producto'}
                loading="lazy"
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                    opacity: isLoading ? 0 : 1,
                    transition: 'opacity 0.3s ease'
                }}
            />
        </div>
    );
}
```

### Ejemplo con Optimización (Image Resizing)

```javascript
function ProductImageOptimized({ product, size = 'medium' }) {
    const sizes = {
        thumbnail: { width: 300, quality: 80 },
        medium: { width: 600, quality: 85 },
        large: { width: 1200, quality: 90 }
    };
    
    const options = sizes[size] || sizes.medium;
    
    // Usa transformImageUrl para optimización automática
    const imageUrl = window.transformImageUrl ? 
        window.transformImageUrl(product.URLImagen, options) : 
        product.URLImagen;
    
    return (
        <img 
            src={imageUrl}
            alt={product.NombreBase}
            loading="lazy"
            width={options.width}
        />
    );
}
```

---

## 🚀 Buenas Prácticas

### 1. Performance

✅ **Lazy Loading**
```javascript
// Siempre incluir loading="lazy" para imágenes below-the-fold
<img src={url} alt={alt} loading="lazy" />
```

✅ **Tamaño Apropiado**
```javascript
// Usar diferentes tamaños según el contexto
const thumbnailUrl = '/cdn-cgi/image/width=300/...';
const productUrl = '/cdn-cgi/image/width=800/...';
const zoomUrl = product.URLImagen; // Original
```

✅ **Preload de Imágenes Críticas**
```html
<!-- En <head> para imágenes above-the-fold -->
<link rel="preload" as="image" href="https://www.velykapet.com/producto-destacado.jpg">
```

### 2. Cache

✅ **Headers Automáticos de Cloudflare**
```
Cache-Control: public, max-age=14400
CF-Cache-Status: HIT
Age: 3600
```

✅ **Validación de Cache**
```javascript
// Verificar que las imágenes se sirven desde cache
fetch(imageUrl, { method: 'HEAD' })
    .then(res => {
        console.log('Cache Status:', res.headers.get('cf-cache-status'));
        console.log('Age:', res.headers.get('age'));
    });
```

### 3. Seguridad

✅ **HTTPS Obligatorio**
```javascript
// Cloudflare fuerza HTTPS automáticamente
// URLs http:// se redirigen a https://
const secureUrl = product.URLImagen.replace('http://', 'https://');
```

✅ **Validación de URLs**
```javascript
const isValidCloudflareUrl = (url) => {
    if (!url) return false;
    return url.startsWith('https://www.velykapet.com/');
};

// Uso
if (isValidCloudflareUrl(product.URLImagen)) {
    // Seguro de usar
}
```

✅ **Content Security Policy (CSP)**
```html
<!-- En el HTML principal -->
<meta http-equiv="Content-Security-Policy" 
      content="img-src 'self' https://www.velykapet.com data:;">
```

### 4. SEO y Accesibilidad

✅ **Alt Text Descriptivo**
```javascript
// ❌ Malo
<img src={url} alt="producto" />

// ✅ Bueno
<img src={url} alt={`${product.NombreBase} - ${product.TipoMascota}`} />

// ✅ Mejor
<img 
    src={url} 
    alt={`${product.NombreBase}, ${product.Descripcion}, para ${product.TipoMascota}`}
/>
```

✅ **Dimensiones Explícitas**
```javascript
// Previene layout shift
<img 
    src={url} 
    alt={alt}
    width="600"
    height="600"
    loading="lazy"
/>
```

---

## 🔄 Proceso Replicable para Otros Productos

### Checklist para Agregar Imagen a un Producto

- [ ] **1. Preparar la imagen**
  - Optimizar tamaño (< 200KB recomendado)
  - Dimensiones: 800x800px para productos
  - Formato: JPG o PNG (WebP se convierte automáticamente con Image Resizing)
  - Renombrar según convención: `NOMBRE_PRODUCTO_ATRIBUTOS.jpg`

- [ ] **2. Subir a Cloudflare R2**
  - Método A: Dashboard web de Cloudflare
  - Método B: Wrangler CLI: `wrangler r2 object put velykapet-products/productos/categoria/ARCHIVO.jpg --file=./ARCHIVO.jpg`
  - Verificar que la carpeta sea correcta: `/productos/alimentos/gatos/` por ejemplo

- [ ] **3. Obtener la URL pública**
  - Formato: `https://www.velykapet.com/productos/categoria/subcategoria/ARCHIVO.jpg`
  - Ejemplo: `https://www.velykapet.com/productos/alimentos/gatos/CHURU_ATUN_4_PIEZAS_56_GR.jpg`
  - Validar que la URL funciona (hacer petición HTTP HEAD)

- [ ] **4. Actualizar el producto**
  - Opción A: Seed data en `VentasPetDbContext.cs` (para nuevos productos)
  - Opción B: API PUT/PATCH (para productos existentes)
  - Opción C: SQL directo (para migraciones masivas)

- [ ] **5. Validar en el frontend**
  - Acceder al catálogo de productos
  - Verificar que la imagen se muestra correctamente
  - Comprobar que el lazy loading funciona
  - Validar el alt text

- [ ] **6. Verificar performance**
  - Cache Status debe ser "HIT" después de la primera carga
  - Response time < 100ms (desde cache)
  - Imagen se carga sin errores de CORS

---

## 📊 Convención de Nombres de Archivos

### Reglas

1. Solo usar: `A-Z`, `0-9`, `_` (guión bajo), `.` (punto)
2. Preferir MAYÚSCULAS para consistencia
3. Separar palabras con `_`
4. Incluir atributos importantes: peso, sabor, tamaño, cantidad
5. Ser descriptivo pero conciso

### Ejemplos Correctos ✅

```
CHURU_ATUN_4_PIEZAS_56_GR.jpg
ROYAL_CANIN_INDOOR_CAT_1_5KG.jpg
PELOTA_CAUCHO_PERRO_MEDIANO.jpg
COLLAR_ANTIPULGAS_GATO_8_MESES.jpg
SHAMPOO_PERRO_PELO_LARGO_500ML.jpg
```

### Ejemplos Incorrectos ❌

```
imagen1.jpg                    // No descriptivo
Producto Con Espacios.jpg      // Tiene espacios
producto-ñandú.jpg            // Caracteres especiales
IMG_20231215_123456.jpg       // Nombre genérico de cámara
royal-canin.jpg               // Falta información específica
```

---

## 🧪 Validación y Testing

### Test Manual

```javascript
// 1. Validar URL individual
const testImageUrl = async (url) => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        console.log(`✅ ${url}`);
        console.log('  Status:', response.status);
        console.log('  Cache:', response.headers.get('cf-cache-status'));
        console.log('  Age:', response.headers.get('age'));
    } catch (error) {
        console.error(`❌ ${url}:`, error.message);
    }
};

await testImageUrl('https://www.velykapet.com/CHURU_ATUN_4_PIEZAS_56_GR.jpg');
```

### Test de Todos los Productos

```javascript
// 2. Validar todas las imágenes del catálogo
const validarImagenesProductos = async () => {
    const productos = await fetch('/api/productos').then(r => r.json());
    
    let validas = 0, invalidas = 0, sinImagen = 0;
    
    for (const producto of productos) {
        if (!producto.URLImagen) {
            console.warn(`⚠️ ${producto.NombreBase}: Sin imagen`);
            sinImagen++;
            continue;
        }
        
        try {
            const response = await fetch(producto.URLImagen, { method: 'HEAD' });
            if (response.ok) {
                validas++;
            } else {
                console.error(`❌ ${producto.NombreBase}: ${response.status}`);
                invalidas++;
            }
        } catch (error) {
            console.error(`❌ ${producto.NombreBase}:`, error.message);
            invalidas++;
        }
    }
    
    console.log(`\n📊 Resumen:`);
    console.log(`  ✅ Válidas: ${validas}`);
    console.log(`  ❌ Inválidas: ${invalidas}`);
    console.log(`  ⚠️ Sin imagen: ${sinImagen}`);
    console.log(`  Total: ${productos.length}`);
};

await validarImagenesProductos();
```

---

## 🔧 Troubleshooting

### Problema: Imagen no se muestra

**Soluciones:**

1. **Verificar URL es correcta**
   ```javascript
   console.log('URL:', product.URLImagen);
   // Debe ser: https://www.velykapet.com/...
   ```

2. **Comprobar CORS**
   ```bash
   curl -I https://www.velykapet.com/CHURU_ATUN_4_PIEZAS_56_GR.jpg
   # Debe incluir: Access-Control-Allow-Origin: *
   ```

3. **Validar archivo existe en R2**
   ```bash
   wrangler r2 object get velykapet-products/CHURU_ATUN_4_PIEZAS_56_GR.jpg
   ```

### Problema: Imagen carga lenta

**Soluciones:**

1. **Verificar cache hit**
   ```javascript
   fetch(url, { method: 'HEAD' })
       .then(r => console.log('Cache:', r.headers.get('cf-cache-status')));
   // Debe ser: HIT (después de primera carga)
   ```

2. **Optimizar tamaño**
   ```bash
   # Usar herramientas de optimización
   # TinyPNG.com o ImageOptim
   # Objetivo: < 200KB
   ```

3. **Usar Image Resizing**
   ```javascript
   const url = '/cdn-cgi/image/width=600,quality=85,format=auto/productos/.../IMAGEN.jpg';
   ```

### Problema: Error 403 Forbidden

**Soluciones:**

1. Verificar que el bucket es público
2. Comprobar configuración de CORS en R2
3. Validar dominio personalizado en Cloudflare

---

## 📚 Recursos Adicionales

### Documentación del Proyecto

- `RESUMEN_EJECUTIVO_CLOUDFLARE_R2.md` - Visión general completa
- `GUIA_CLOUDFLARE_R2_IMAGENES.md` - Guía técnica detallada (50+ páginas)
- `CLOUDFLARE_R2_QUICK_REFERENCE.md` - Referencia rápida
- `CLOUDFLARE_R2_CONFIGURATION.md` - Configuración paso a paso
- `EJEMPLOS_PRODUCTOS_R2.json` - Ejemplos de productos

### Código Relevante

- `backend-config/Data/VentasPetDbContext.cs` - Datos de semilla
- `backend-config/Models/Producto.cs` - Modelo de producto
- `src/components/ProductCard.js` - Componente de tarjeta de producto
- `src/utils/image-url-transformer.js` - Transformador de URLs

### Enlaces Externos

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Cloudflare Image Resizing](https://developers.cloudflare.com/images/)
- [Cloudflare Dashboard](https://dash.cloudflare.com)

---

## ✅ Resumen Ejecutivo

### ¿Qué se hizo?

1. ✅ Actualizado producto `IdProducto = 2` con imagen de Cloudflare R2
2. ✅ URL: `https://www.velykapet.com/CHURU_ATUN_4_PIEZAS_56_GR.jpg`
3. ✅ Frontend ya soporta el campo `URLImagen` automáticamente
4. ✅ Documentado proceso completo para replicar en otros productos

### ¿Cómo funciona?

1. **Backend:** La propiedad `URLImagen` del modelo `Producto` almacena la URL completa
2. **API:** El endpoint `/api/productos` devuelve el JSON con `URLImagen`
3. **Frontend:** El componente `ProductCard` consume automáticamente `URLImagen`
4. **Cloudflare:** Sirve las imágenes con CDN global, cache y HTTPS

### Próximos pasos

1. Regenerar base de datos para aplicar cambios: `dotnet ef database update`
2. Reiniciar backend para cargar nuevos datos
3. Verificar en el catálogo que el producto se muestra con la imagen
4. Replicar proceso para los demás 4 productos de prueba
5. Validar performance y cache

---

**Preparado por:** GitHub Copilot  
**Fecha:** Diciembre 2024  
**Proyecto:** VelyKapet E-commerce Platform
