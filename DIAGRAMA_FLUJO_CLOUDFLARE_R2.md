# 🔄 Flujo de Integración Cloudflare R2

## Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                      USUARIO FINAL                               │
│                  (Navegador Web/Mobile)                          │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ 1. Request imagen
                     │    GET /productos/CHURU_ATUN.jpg
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│                  CLOUDFLARE CDN (Edge)                           │
│                  200+ ubicaciones globales                       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │           ¿Imagen en cache?                          │      │
│  └──────────────────┬───────────────────────────────────┘      │
│                     │                                            │
│          ┌──────────┴──────────┐                               │
│          │                     │                               │
│          ↓ SÍ                  ↓ NO                            │
│  ┌───────────────┐     ┌──────────────────┐                   │
│  │  Cache HIT    │     │   Cache MISS     │                   │
│  │  (< 50ms)     │     │   Obtener de R2  │                   │
│  └───────┬───────┘     └────────┬─────────┘                   │
│          │                      │                              │
│          │                      │ 2. Request a R2             │
│          │                      ↓                              │
│          │         ┌────────────────────────────┐             │
│          │         │   Cloudflare R2 Bucket     │             │
│          │         │   velykapet-products       │             │
│          │         │   /productos/...           │             │
│          │         └────────────┬───────────────┘             │
│          │                      │ 3. Return imagen            │
│          │                      ↓                              │
│          │         ┌────────────────────────────┐             │
│          │         │  Cachear en Edge           │             │
│          │         │  TTL: 1 mes                │             │
│          │         └────────────┬───────────────┘             │
│          │                      │                              │
│          └──────────┬───────────┘                              │
│                     │ 4. Return to user                        │
└─────────────────────┼────────────────────────────────────────┘
                      │
                      │ Headers:
                      │ - cf-cache-status: HIT/MISS
                      │ - cache-control: public, max-age=14400
                      │ - content-type: image/jpeg
                      ↓
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND REACT                                │
│                                                                  │
│  <img src="https://www.velykapet.com/productos/CHURU.jpg"       │
│       loading="lazy"                                            │
│       onError={fallback} />                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Flujo con Image Resizing (Opcional)

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND REACT                              │
│  window.transformImageUrl(url, {width: 300, quality: 80})       │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ Request transformada:
                     │ /cdn-cgi/image/width=300,quality=80/productos/CHURU.jpg
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│              CLOUDFLARE IMAGE RESIZING                           │
│                                                                  │
│  1. Obtener imagen original de R2                               │
│  2. Aplicar transformaciones:                                   │
│     - Resize: 300x300                                           │
│     - Quality: 80%                                              │
│     - Format: auto (WebP si es soportado)                       │
│  3. Cachear imagen transformada                                 │
│  4. Retornar al usuario                                         │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ Beneficios:
                     │ - Tamaño reducido (30-50% menos)
                     │ - Formato moderno (WebP/AVIF)
                     │ - Cache por variante
                     ↓
                   USUARIO
```

---

## Flujo de Datos - Base de Datos a Usuario

```
┌──────────────────────────────────────────────────────────────┐
│                    BASE DE DATOS                              │
│                                                               │
│  Productos Table:                                            │
│  ┌──────────┬─────────────┬──────────────────────────────┐  │
│  │ Id       │ Nombre      │ URLImagen                    │  │
│  ├──────────┼─────────────┼──────────────────────────────┤  │
│  │ 1        │ Churu Atún  │ https://www.velykapet.com/  │  │
│  │          │ 4 Piezas    │ productos/.../CHURU.jpg      │  │
│  └──────────┴─────────────┴──────────────────────────────┘  │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            │ 1. API Request
                            │    GET /api/productos
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                    BACKEND (.NET)                             │
│  ProductsController.GetAll()                                 │
│  → ProductService.GetProducts()                              │
│  → Repository.FindAll()                                      │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            │ 2. JSON Response
                            │    [{ Id: 1, URLImagen: "https://..." }]
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                           │
│                                                               │
│  1. Fetch productos                                          │
│  2. Mapear a ProductCard components                          │
│  3. Renderizar imágenes                                      │
│     <img src={product.URLImagen} ... />                      │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            │ 3. Browser hace request a imagen
                            │    GET https://www.velykapet.com/productos/...
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                CLOUDFLARE CDN + R2                            │
│  (Ver diagrama anterior para flujo de cache)                 │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            │ 4. Imagen mostrada al usuario
                            ↓
                      ┌──────────┐
                      │  IMAGEN  │
                      │ MOSTRADA │
                      └──────────┘
```

---

## Proceso de Migración desde Google Drive

```
┌─────────────────────────────────────────────────────────────┐
│                   GOOGLE DRIVE (Estado Actual)               │
│                                                              │
│  URL actual:                                                │
│  https://drive.google.com/uc?export=view&id=ABC123xyz       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ PASO 1: Descargar
                     │ - Manual desde Drive
                     │ - O usar Google Drive API
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                   LOCAL (Preparación)                        │
│                                                              │
│  1. Renombrar: IMG_001.jpg → CHURU_ATUN_4_PIEZAS_56_GR.jpg │
│  2. Optimizar: Comprimir a < 200KB                         │
│  3. Organizar: Mover a carpeta alimentos/gatos/            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ PASO 2: Subir a R2
                     │ - Wrangler CLI
                     │ - O interfaz web Cloudflare
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                CLOUDFLARE R2 (Estado Final)                  │
│                                                              │
│  Bucket: velykapet-products/productos/alimentos/gatos/      │
│  Archivo: CHURU_ATUN_4_PIEZAS_56_GR.jpg                     │
│  URL: https://www.velykapet.com/productos/.../CHURU.jpg     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ PASO 3: Actualizar BD
                     │ UPDATE Productos 
                     │ SET URLImagen = 'https://www.velykapet.com/...'
                     │ WHERE IdProducto = 1
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                  BASE DE DATOS (Actualizada)                 │
│                                                              │
│  URLImagen: https://www.velykapet.com/productos/...         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ PASO 4: Validar
                     │ - Test en desarrollo
                     │ - Verificar imagen carga
                     │ - Monitorear errores
                     ↓
                 ✅ MIGRACIÓN COMPLETA
```

---

## Detección Automática de URLs (Código)

```
┌─────────────────────────────────────────────────────────────┐
│            Frontend: ProductCard Component                   │
│                                                              │
│  const imageUrl = product.URLImagen;                        │
│  // Ejemplo: "https://www.velykapet.com/productos/..."     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Si se usa transformImageUrl()
                     ↓
┌─────────────────────────────────────────────────────────────┐
│         src/utils/image-url-transformer.js                   │
│                                                              │
│  1. ¿Es URL de velykapet.com?                               │
│     → SÍ: isCloudflareR2Url() = true                        │
│                                                              │
│  2. ¿Se pidió optimización?                                 │
│     → SÍ: Agregar /cdn-cgi/image/ con parámetros           │
│     → NO: Retornar URL directa                              │
│                                                              │
│  3. Normalizar URL                                          │
│     → HTTP → HTTPS                                          │
│     → Limpiar query params innecesarios                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ URL final procesada
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              Renderizar en el DOM                            │
│                                                              │
│  <img src="https://www.velykapet.com/..." />                │
└─────────────────────────────────────────────────────────────┘
```

---

## Comparativa de Performance: Antes vs Después

### ANTES (Google Drive)

```
Usuario Request → Google Drive Auth → Google Drive Servers → Image
                                       (latencia variable)
                                       (sin CDN)
                                       (sin cache)
Tiempo: 500-2000ms
Cache Hit Rate: 0%
```

### DESPUÉS (Cloudflare R2)

```
Usuario Request → Cloudflare Edge (200+ ubicaciones)
                  ↓
                  Cache HIT? → SÍ → Image (< 50ms) ✅
                  ↓
                  NO → R2 → Cache → Image (< 200ms)
                  
Tiempo primera carga: 100-200ms
Tiempo subsecuentes: < 50ms
Cache Hit Rate: > 95%
```

---

## Costos Comparados (Visual)

```
GOOGLE DRIVE:
├── Almacenamiento: $0 (hasta 15GB)
│   ❌ Límite de cuota
│   ❌ URLs no profesionales
│   ❌ Sin CDN
└── Total: ~$0 pero NO escalable

CLOUDFLARE R2 (100GB, 500GB egreso):
├── Almacenamiento: 100GB × $0.015 = $1.50
├── Egreso: 500GB × $0 = $0 ✅
└── Total: $1.50/mes
    ✅ Escalable
    ✅ URLs profesionales  
    ✅ CDN incluido

AWS S3 (mismo escenario):
├── Almacenamiento: 100GB × $0.023 = $2.30
├── Egreso: 500GB × $0.09 = $45.00
└── Total: $47.30/mes
    💸 31x más caro que R2
```

---

## Resumen Visual: ¿Por qué Cloudflare R2?

```
┌────────────────────────────────────────────────────────────┐
│                  CLOUDFLARE R2 WINS                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ✅ URLs Profesionales    www.velykapet.com/productos/... │
│  ✅ CDN Global            200+ ubicaciones edge           │
│  ✅ Performance           < 50ms (cache hit)              │
│  ✅ Costos Bajos          $1.50/mes (100GB + 500GB tx)   │
│  ✅ Sin Egreso            $0 transferencia               │
│  ✅ Escalable             Ilimitado                      │
│  ✅ Seguro                SSL/TLS automático             │
│  ✅ Simple                Más fácil que S3               │
│  ✅ Transformaciones      Image Resizing opcional        │
│  ✅ Compatible S3         Fácil migración                │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

**Documentación Completa:** [README_CLOUDFLARE_R2.md](./README_CLOUDFLARE_R2.md)  
**Última actualización:** Diciembre 2024  
**Proyecto:** VelyKapet E-commerce
