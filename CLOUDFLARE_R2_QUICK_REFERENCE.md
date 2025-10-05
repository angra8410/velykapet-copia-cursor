# 🚀 Cloudflare R2 - Referencia Rápida

## ⚡ Acciones Comunes

### Subir Nueva Imagen de Producto

**1. Preparar la imagen:**
```bash
# Nombrar según convención
NOMBRE_PRODUCTO_ATRIBUTOS.jpg
Ejemplo: CHURU_ATUN_4_PIEZAS_56_GR.jpg

# Optimizar (opcional pero recomendado)
# Usar TinyPNG.com o similar
# Tamaño objetivo: < 200KB
# Dimensiones: 800x800px para productos
```

**2. Subir a R2:**
```
Método A - Web Interface:
1. Ir a Cloudflare Dashboard > R2
2. Abrir bucket "velykapet-products"
3. Navegar a carpeta: productos/[categoria]/
4. Click "Upload"
5. Seleccionar archivo(s)

Método B - Wrangler CLI:
wrangler r2 object put velykapet-products/productos/alimentos/gatos/CHURU_ATUN.jpg \
  --file=./CHURU_ATUN.jpg
```

**3. Obtener URL:**
```
Formato:
https://www.velykapet.com/productos/[categoria]/[subcategoria]/NOMBRE_ARCHIVO.jpg

Ejemplo:
https://www.velykapet.com/productos/alimentos/gatos/CHURU_ATUN_4_PIEZAS_56_GR.jpg
```

**4. Agregar a producto en base de datos:**
```json
{
  "IdProducto": 123,
  "NombreBase": "Churu Atún 4 Piezas 56gr",
  "URLImagen": "https://www.velykapet.com/productos/alimentos/gatos/CHURU_ATUN_4_PIEZAS_56_GR.jpg",
  ...
}
```

**5. Verificar:**
```bash
# Probar URL directamente
curl -I https://www.velykapet.com/productos/alimentos/gatos/CHURU_ATUN_4_PIEZAS_56_GR.jpg

# Debe retornar: HTTP/2 200
```

---

## 📁 Estructura de Carpetas

```
velykapet-products/
├── productos/
│   ├── alimentos/
│   │   ├── gatos/
│   │   └── perros/
│   ├── juguetes/
│   ├── accesorios/
│   └── higiene/
├── categorias/
│   └── [banners de categorías]
└── sistema/
    ├── placeholders/
    └── logos/
```

---

## 🎯 Convenciones de Nombres

### ✅ Correcto
```
CHURU_ATUN_4_PIEZAS_56_GR.jpg
ROYAL_CANIN_INDOOR_CAT_1_5KG.jpg
COLLAR_ANTIPULGAS_GATO_ROJO.jpg
PELOTA_CAUCHO_PERRO_MEDIANO.jpg
```

### ❌ Incorrecto
```
imagen1.jpg                    # No descriptivo
Producto Con Espacios.jpg      # Tiene espacios
ÑANDÚ.jpg                      # Caracteres especiales
IMG_20231215_123456.jpg        # Nombre genérico
```

### Reglas
- Solo usar: A-Z, 0-9, guión bajo (_)
- Preferir MAYÚSCULAS
- Incluir atributos importantes (tamaño, sabor, color)
- Mantener consistencia

---

## 🔍 Verificación de Imágenes

### Test Individual
```bash
# Ver headers
curl -I https://www.velykapet.com/productos/test.jpg

# Verificar que incluya:
HTTP/2 200                          # Status OK
content-type: image/jpeg            # Tipo correcto
cache-control: public, max-age=...  # Cache configurado
cf-cache-status: HIT                # En cache (después de 1era request)
```

### Test Desde el Navegador
```javascript
// En consola del navegador
const testImage = (url) => {
  const img = new Image();
  const start = performance.now();
  
  img.onload = () => {
    console.log(`✅ Imagen cargada en ${(performance.now() - start).toFixed(0)}ms`);
    console.log(`   Tamaño: ${img.naturalWidth}x${img.naturalHeight}px`);
  };
  
  img.onerror = () => {
    console.error('❌ Error cargando imagen');
  };
  
  img.src = url;
};

// Usar
testImage('https://www.velykapet.com/productos/test.jpg');
```

### Test Batch
```javascript
// Validar todas las imágenes de productos
async function validateAllProductImages() {
  const products = await fetch('http://localhost:5135/api/productos')
    .then(r => r.json());
  
  let valid = 0, invalid = 0;
  
  for (const product of products) {
    if (!product.URLImagen) {
      console.warn(`⚠️ ${product.NombreBase}: Sin imagen`);
      invalid++;
      continue;
    }
    
    try {
      const response = await fetch(product.URLImagen, { method: 'HEAD' });
      if (response.ok) {
        valid++;
      } else {
        console.error(`❌ ${product.NombreBase}: ${response.status}`);
        invalid++;
      }
    } catch (error) {
      console.error(`❌ ${product.NombreBase}: ${error.message}`);
      invalid++;
    }
  }
  
  console.log(`\n✅ Válidas: ${valid}`);
  console.log(`❌ Inválidas: ${invalid}`);
  console.log(`📊 Tasa de éxito: ${(valid/(valid+invalid)*100).toFixed(1)}%`);
}

validateAllProductImages();
```

---

## 🎨 Uso en el Frontend

### Básico (ya implementado)
```javascript
// En ProductCard.js - automático
const imageUrl = product.URLImagen;
// https://www.velykapet.com/productos/alimentos/gatos/CHURU_ATUN.jpg

// Se transforma automáticamente con transformImageUrl()
<img src={imageUrl} alt={product.NombreBase} loading="lazy" />
```

### Con Optimización (si Image Resizing está activo)
```javascript
// Thumbnail 300x300
const thumbnailUrl = window.transformImageUrl(product.URLImagen, {
  width: 300,
  quality: 80
});
// https://www.velykapet.com/cdn-cgi/image/width=300,quality=80/productos/...

// Producto completo 800x800
const productUrl = window.transformImageUrl(product.URLImagen, {
  width: 800,
  quality: 90
});
```

### Con Fallback
```javascript
<img 
  src={product.URLImagen}
  alt={product.NombreBase}
  loading="lazy"
  onError={(e) => {
    // Fallback a placeholder
    e.target.src = 'https://www.velykapet.com/sistema/placeholders/producto-sin-imagen.jpg';
  }}
/>
```

### Responsive Images
```javascript
<img 
  src={product.URLImagen}
  srcSet={`
    ${product.URLImagen} 1x,
    ${product.URLImagen} 2x
  `}
  alt={product.NombreBase}
  loading="lazy"
/>
```

---

## 🔧 Configuración de Cache

### Headers Recomendados

**En Cloudflare Dashboard > R2 > Settings:**
```
Browser Cache TTL: 4 hours (14400 seconds)
Edge Cache TTL: 1 month (2592000 seconds)
```

**Resultado en headers:**
```
cache-control: public, max-age=14400
cf-cache-status: HIT
age: 3600
```

### Limpiar Cache

**Opción A - Cloudflare Dashboard:**
```
1. Ir a Caching > Configuration
2. Click "Purge Everything" (para todo)
   O
   Click "Custom Purge" > Ingresar URLs específicas
```

**Opción B - API:**
```bash
# Purge URL específica
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://www.velykapet.com/productos/test.jpg"]}'
```

**Opción C - Versioning (recomendado):**
```javascript
// Agregar version query param para forzar refresh
const imageUrl = `${product.URLImagen}?v=2`;
// https://www.velykapet.com/productos/test.jpg?v=2
```

---

## 📊 Monitoreo Rápido

### Ver Métricas en Cloudflare

```
Dashboard > Analytics > Caching

Métricas clave:
- Cache Hit Ratio: > 95% (bueno)
- Total Requests: Trending
- Bandwidth Saved: $$ ahorrado
```

### Alertas Configuradas

```
1. Error rate > 5%
   → Revisar imágenes faltantes

2. Cache hit rate < 80%
   → Revisar configuración de cache

3. Bandwidth spike > 150% promedio
   → Verificar hotlinking
```

### Quick Debug

```javascript
// En consola del navegador - ver todas las imágenes cargadas
performance.getEntriesByType('resource')
  .filter(r => r.initiatorType === 'img')
  .forEach(img => {
    console.log(`${img.name}: ${img.duration.toFixed(0)}ms`);
  });
```

---

## ⚠️ Problemas Comunes

### Imagen no carga (404)
```bash
✓ Verificar que archivo existe en R2
✓ Verificar nombre exacto (case-sensitive)
✓ Verificar ruta completa
✓ Probar URL directamente en navegador
```

### CORS Error
```bash
✓ Verificar configuración CORS en bucket R2
✓ Asegurar que dominio está en AllowedOrigins
✓ Verificar que método es GET o HEAD
```

### Imagen lenta
```bash
✓ Verificar tamaño de archivo (< 200KB ideal)
✓ Verificar cache hit (cf-cache-status: HIT)
✓ Optimizar imagen (TinyPNG)
✓ Considerar Image Resizing
```

### Cache no funciona
```bash
✓ Verificar headers cache-control
✓ Verificar Page Rules en Cloudflare
✓ Esperar 1-2 requests para warming
✓ Evitar query params cambiantes
```

---

## 🛠️ Herramientas Útiles

### CLI - Wrangler
```bash
# Instalar
npm install -g wrangler

# Login
wrangler login

# Listar objetos
wrangler r2 object list velykapet-products --prefix=productos/

# Subir archivo
wrangler r2 object put velykapet-products/productos/test.jpg --file=./test.jpg

# Descargar archivo
wrangler r2 object get velykapet-products/productos/test.jpg --file=./downloaded.jpg

# Eliminar archivo
wrangler r2 object delete velykapet-products/productos/test.jpg
```

### Optimización de Imágenes

**Online:**
- [TinyPNG](https://tinypng.com/) - Compresión inteligente
- [Squoosh](https://squoosh.app/) - Herramienta web de Google
- [Compressor.io](https://compressor.io/) - Compresión online

**CLI:**
```bash
# ImageMagick
convert input.jpg -quality 85 -resize 800x800\> output.jpg

# OptiPNG (para PNG)
optipng -o7 input.png

# JPEGoptim
jpegoptim --size=200k input.jpg
```

### Testing Performance

**Lighthouse (Chrome DevTools):**
```
F12 > Lighthouse > Generate Report
```

**WebPageTest:**
```
https://www.webpagetest.org/
- Ingresar URL del sitio
- Analizar waterfall
- Ver oportunidades de optimización
```

**GTmetrix:**
```
https://gtmetrix.com/
- Análisis completo de performance
- Recomendaciones específicas
```

---

## 📋 Checklist Diario

### Al subir nueva imagen
- [ ] Nombre sigue convención
- [ ] Tamaño optimizado (< 200KB)
- [ ] Subida a carpeta correcta en R2
- [ ] URL agregada a producto en BD
- [ ] Verificada en navegador
- [ ] Probada en modo móvil

### Al actualizar imagen existente
- [ ] Mismo nombre de archivo
- [ ] Subir con reemplazo
- [ ] Limpiar cache de Cloudflare (si necesario)
- [ ] Verificar cambios visibles

### Mantenimiento semanal
- [ ] Revisar error logs
- [ ] Verificar cache hit rate (> 95%)
- [ ] Validar nuevas imágenes funcionan
- [ ] Revisar métricas de performance

---

## 🔗 Enlaces Rápidos

**Dashboards:**
- [Cloudflare R2](https://dash.cloudflare.com/?to=/:account/r2)
- [Cloudflare Analytics](https://dash.cloudflare.com/?to=/:account/analytics)
- [Cache Settings](https://dash.cloudflare.com/?to=/:account/:zone/caching)

**Documentación:**
- [R2 Docs](https://developers.cloudflare.com/r2/)
- [Image Resizing](https://developers.cloudflare.com/images/)
- [Guía Completa](./GUIA_CLOUDFLARE_R2_IMAGENES.md)

**Herramientas:**
- [TinyPNG](https://tinypng.com/)
- [WebPageTest](https://www.webpagetest.org/)
- [GTmetrix](https://gtmetrix.com/)

---

## 💡 Tips Pro

### Performance
```javascript
// Preload imágenes críticas (above the fold)
<link rel="preload" as="image" href="https://www.velykapet.com/productos/hero.jpg">

// Lazy load imágenes below the fold
<img loading="lazy" src="..." />

// Use responsive images
<img srcset="imagen-300.jpg 300w, imagen-600.jpg 600w" sizes="(max-width: 600px) 300px, 600px" />
```

### SEO
```javascript
// Siempre incluir alt descriptivo
<img src="..." alt="Churu Atún 4 Piezas 56gr - Snack para Gatos" />

// Nombres de archivo descriptivos
CHURU_ATUN_4_PIEZAS_56_GR.jpg  // ✅ SEO friendly
img001.jpg                      // ❌ No SEO
```

### Debugging
```javascript
// Ver todas las imágenes y su estado
Array.from(document.images).forEach(img => {
  console.log({
    src: img.src,
    loaded: img.complete,
    size: `${img.naturalWidth}x${img.naturalHeight}`,
    error: !img.complete && img.naturalHeight === 0
  });
});
```

---

**Última actualización:** Diciembre 2024  
**Versión:** 1.0
