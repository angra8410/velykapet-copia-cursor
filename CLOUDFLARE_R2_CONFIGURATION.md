# Configuración Recomendada de Cloudflare R2 para VelyKapet

## 🎯 Configuración del Bucket

### Información del Bucket
```
Nombre: velykapet-products
Región: Automático (distribuido globalmente)
Acceso: Público (para imágenes de productos)
```

### CORS Configuration
```json
[
  {
    "AllowedOrigins": [
      "https://www.velykapet.com",
      "https://velykapet.com",
      "http://localhost:3333",
      "http://localhost:3000"
    ],
    "AllowedMethods": [
      "GET",
      "HEAD"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag",
      "Content-Length",
      "Content-Type"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

### Custom Domain Configuration
```
Domain: www.velykapet.com
SSL/TLS: Full (strict)
Always Use HTTPS: Yes
Automatic HTTPS Rewrites: Yes
```

---

## 🔧 Configuración de Cloudflare CDN

### Page Rules (Recomendadas)

#### Regla 1: Cache de Imágenes de Productos
```
URL Pattern: *velykapet.com/productos/*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Browser Cache TTL: 4 hours
```

#### Regla 2: Cache de Recursos del Sistema
```
URL Pattern: *velykapet.com/sistema/*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 year (inmutable)
  - Browser Cache TTL: 1 year
```

#### Regla 3: Cache de Categorías/Banners
```
URL Pattern: *velykapet.com/categorias/*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 week
  - Browser Cache TTL: 1 day
```

### Cache Rules (Cloudflare Dashboard)

```yaml
Cache Everything:
  - Match: *.jpg, *.jpeg, *.png, *.gif, *.webp, *.svg
  - Edge TTL: 1 month
  - Browser TTL: 4 hours
  - Respect origin cache headers: No
```

---

## 🖼️ Cloudflare Image Resizing (Opcional)

### Activación
```
Dashboard > Speed > Optimization > Image Resizing
Status: Enabled
```

### Configuración
```yaml
Resize Options:
  - Enable for all images: Yes
  - Default quality: 85
  - Auto format: Yes (WebP, AVIF when supported)
  - Auto compression: Yes
```

### Sintaxis de URLs

```javascript
// Formato general
/cdn-cgi/image/[options]/[image-path]

// Opciones disponibles
{
  width: 300,           // Ancho en píxeles
  height: 300,          // Alto en píxeles
  quality: 85,          // Calidad 1-100
  format: 'auto',       // auto, webp, avif, jpeg, png
  fit: 'cover',         // cover, contain, scale-down, crop, pad
  gravity: 'auto',      // auto, left, right, top, bottom, center
  background: 'white',  // Color de fondo para pad
  sharpen: 1.0          // Sharpening 0-10
}

// Ejemplos
/cdn-cgi/image/width=300,quality=80/productos/CHURU_ATUN.jpg
/cdn-cgi/image/width=800,quality=90,format=auto/productos/ROYAL_CANIN.jpg
/cdn-cgi/image/fit=cover,width=400,height=400/productos/WHISKAS.jpg
```

---

## 🔒 Configuración de Seguridad

### SSL/TLS
```
Mode: Full (strict)
Minimum TLS Version: 1.2
TLS 1.3: Enabled
Automatic HTTPS Rewrites: Enabled
Always Use HTTPS: Enabled
```

### Hotlink Protection
```
Dashboard > Scrape Shield > Hotlink Protection
Status: Enabled
Allowed Domains:
  - velykapet.com
  - www.velykapet.com
```

### Security Level
```
Security Level: Medium
Challenge Passage: 30 minutes
Browser Integrity Check: Enabled
```

### Bot Fight Mode
```
Status: Enabled (free tier)
Challenge malicious bots: Yes
```

---

## 📊 Configuración de Analytics

### Web Analytics
```
Dashboard > Analytics > Web Analytics
Status: Enabled
Track:
  - Page views
  - Unique visitors
  - Bandwidth
  - Cache performance
```

### Cache Analytics
```
Dashboard > Analytics > Cache
Monitor:
  - Cache hit ratio (target: > 95%)
  - Total requests
  - Cached requests vs uncached
  - Bandwidth saved
```

### Alerts (Recomendadas)

#### Alert 1: High Error Rate
```
Metric: HTTP 4xx/5xx errors
Threshold: > 5% of total requests
Duration: 5 minutes
Notification: Email
```

#### Alert 2: Low Cache Hit Rate
```
Metric: Cache hit ratio
Threshold: < 80%
Duration: 10 minutes
Notification: Email
```

#### Alert 3: Bandwidth Spike
```
Metric: Total bandwidth
Threshold: > 150% of average
Duration: 15 minutes
Notification: Email
```

---

## 🚀 Performance Optimization

### Brotli Compression
```
Dashboard > Speed > Optimization > Brotli
Status: Enabled
```

### Auto Minify
```
Dashboard > Speed > Optimization > Auto Minify
JavaScript: Enabled
CSS: Enabled
HTML: Enabled
```

### Rocket Loader™
```
Status: Disabled (puede interferir con React)
```

### Mirage (Mobile Optimization)
```
Status: Enabled (Pro plan+)
Lazy load images on mobile: Yes
```

---

## 📁 Estructura Recomendada del Bucket

```
velykapet-products/
│
├── productos/
│   ├── alimentos/
│   │   ├── gatos/
│   │   │   ├── CHURU_ATUN_4_PIEZAS_56_GR.jpg
│   │   │   ├── ROYAL_CANIN_INDOOR_1_5KG.jpg
│   │   │   └── WHISKAS_ADULTO_PESCADO_500G.jpg
│   │   ├── perros/
│   │   │   ├── PEDIGREE_ADULTO_POLLO_2KG.jpg
│   │   │   └── DOG_CHOW_CACHORRO_1KG.jpg
│   │   └── otros/
│   ├── juguetes/
│   │   ├── gatos/
│   │   ├── perros/
│   │   └── compartidos/
│   ├── accesorios/
│   │   ├── collares/
│   │   ├── correas/
│   │   └── comederos/
│   └── higiene/
│       ├── shampoo/
│       ├── cepillos/
│       └── arena/
│
├── categorias/
│   ├── gatos-banner-main.jpg
│   ├── perros-banner-main.jpg
│   ├── alimentos-banner.jpg
│   ├── juguetes-banner.jpg
│   └── promociones-banner.jpg
│
├── sistema/
│   ├── placeholders/
│   │   ├── producto-sin-imagen.jpg
│   │   ├── gato-placeholder.jpg
│   │   ├── perro-placeholder.jpg
│   │   └── default-avatar.jpg
│   ├── logos/
│   │   ├── logo-principal.png
│   │   ├── logo-footer.png
│   │   └── favicon.ico
│   └── iconos/
│       ├── cart-icon.svg
│       ├── search-icon.svg
│       └── user-icon.svg
│
└── temporal/
    └── uploads/
        └── [archivos temporales]
```

---

## 🎨 Headers Recomendados (Configuración R2)

### Para Imágenes de Productos
```
Cache-Control: public, max-age=14400, immutable
Content-Type: image/jpeg (o image/png, etc.)
Access-Control-Allow-Origin: *
X-Content-Type-Options: nosniff
```

### Para Logos y Assets del Sistema
```
Cache-Control: public, max-age=31536000, immutable
Content-Type: [appropriate type]
Access-Control-Allow-Origin: *
```

### Para Banners/Promociones (cambio frecuente)
```
Cache-Control: public, max-age=3600
Content-Type: image/jpeg
Access-Control-Allow-Origin: *
```

---

## 📝 Wrangler Configuration (wrangler.toml)

```toml
name = "velykapet-r2"
main = "src/index.js"
compatibility_date = "2024-12-01"

[[r2_buckets]]
binding = "PRODUCTS_BUCKET"
bucket_name = "velykapet-products"

[vars]
ENVIRONMENT = "production"
ALLOWED_ORIGINS = "https://www.velykapet.com,https://velykapet.com"

# Workers Routes (si se usan Workers)
[routes]
pattern = "www.velykapet.com/productos/*"
zone_name = "velykapet.com"
```

---

## 🔐 API Tokens y Permisos

### R2 API Token (para subida programática)
```yaml
Permissions:
  - R2: Edit (Read and Write)
Zone Resources:
  - Include: velykapet.com
Account Resources:
  - Include: All accounts

Token Name: velykapet-r2-upload
Use Cases:
  - Automated uploads
  - Image processing scripts
  - Bulk operations
```

### Analytics API Token (para monitoreo)
```yaml
Permissions:
  - Analytics: Read
Zone Resources:
  - Include: velykapet.com

Token Name: velykapet-analytics-read
Use Cases:
  - Performance monitoring
  - Custom dashboards
  - Automated reporting
```

---

## 📊 Métricas y KPIs

### Performance Targets
```yaml
Cache Hit Ratio: > 95%
Average Response Time: < 100ms
Error Rate: < 1%
Largest Contentful Paint (LCP): < 2.5s
First Input Delay (FID): < 100ms
Cumulative Layout Shift (CLS): < 0.1
```

### Bandwidth Targets
```yaml
Monthly Bandwidth: Track and optimize
Cost per GB: $0 (egreso gratuito de R2)
Cached vs Origin: > 95% from cache
```

### Availability Target
```yaml
Uptime: > 99.9%
Monthly Downtime: < 43 minutes
```

---

## 🛠️ Herramientas de Desarrollo

### Environment Variables (.env.production)
```bash
# Cloudflare R2
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=velykapet-products
R2_PUBLIC_URL=https://www.velykapet.com

# Cloudflare API
CLOUDFLARE_API_TOKEN=your-api-token
CLOUDFLARE_ZONE_ID=your-zone-id

# Image Resizing
IMAGE_RESIZING_ENABLED=true
DEFAULT_IMAGE_QUALITY=85
```

### NPM Scripts (package.json)
```json
{
  "scripts": {
    "r2:list": "wrangler r2 object list velykapet-products",
    "r2:upload": "wrangler r2 object put velykapet-products/$FILE --file=$FILE",
    "r2:delete": "wrangler r2 object delete velykapet-products/$FILE",
    "cache:purge": "node scripts/purge-cache.js",
    "images:validate": "node scripts/validate-images.js",
    "images:optimize": "node scripts/optimize-images.js"
  }
}
```

---

## 🎯 Best Practices Summary

### DO's ✅
- Use consistent naming convention (UPPERCASE_WITH_UNDERSCORES)
- Optimize images before upload (< 200KB)
- Enable lazy loading for images below the fold
- Use srcset for responsive images
- Implement error handling and fallbacks
- Monitor cache hit ratio weekly
- Keep backups of original images

### DON'Ts ❌
- Don't use spaces or special characters in filenames
- Don't upload huge unoptimized images (> 1MB)
- Don't disable cache for static images
- Don't hard-code URLs (use config/env vars)
- Don't forget alt text for accessibility
- Don't ignore error logs

---

## 📞 Soporte y Recursos

### Cloudflare Resources
- Dashboard: https://dash.cloudflare.com
- R2 Docs: https://developers.cloudflare.com/r2/
- Community: https://community.cloudflare.com/
- Discord: https://discord.gg/cloudflaredev

### Internal Documentation
- Guía Completa: [GUIA_CLOUDFLARE_R2_IMAGENES.md](./GUIA_CLOUDFLARE_R2_IMAGENES.md)
- Quick Reference: [CLOUDFLARE_R2_QUICK_REFERENCE.md](./CLOUDFLARE_R2_QUICK_REFERENCE.md)

---

**Última actualización:** Diciembre 2024  
**Versión:** 1.0  
**Configuración para:** VelyKapet Production Environment
