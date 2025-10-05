# 🚀 Quick Start - Cloudflare R2 Images

## ⚡ 5-Minute Setup

### 1. Start the Application

```bash
# Terminal 1: Backend
cd backend-config
ASPNETCORE_ENVIRONMENT=Development dotnet run

# Terminal 2: Frontend
npm start
```

### 2. Verify Product with R2 Image

```bash
# Check API response
curl http://localhost:5135/api/productos/2 | jq

# Output should include:
# "URLImagen": "https://www.velykapet.com/CHURU_ATUN_4_PIEZAS_56_GR.jpg"
```

### 3. View in Browser

1. Open: http://localhost:3333
2. Click on "Gatolandia"
3. Find "Churu Atún 4 Piezas 56gr" (pink card)
4. ✅ Product displays with R2 image URL configured

---

## 📝 Add Image to Another Product

### Option A: Via API (Recommended)

```bash
curl -X PUT "http://localhost:5135/api/productos/3" \
  -H "Content-Type: application/json" \
  -d '{
    "IdProducto": 3,
    "NombreBase": "Hill'"'"'s Science Diet Puppy",
    "URLImagen": "https://www.velykapet.com/HILLS_PUPPY.jpg",
    "Activo": true
  }'
```

### Option B: Via SQL

```bash
cd backend-config

# Open SQLite database
sqlite3 VentasPet.db

# Update product
UPDATE Productos 
SET URLImagen = 'https://www.velykapet.com/HILLS_PUPPY.jpg'
WHERE IdProducto = 3;

# Verify
SELECT IdProducto, NombreBase, URLImagen FROM Productos WHERE IdProducto = 3;
```

### Option C: Update Seed Data

Edit `backend-config/Data/VentasPetDbContext.cs`:

```csharp
new Producto
{
    IdProducto = 3,
    NombreBase = "Hill's Science Diet Puppy",
    URLImagen = "https://www.velykapet.com/HILLS_PUPPY.jpg", // ← Add this
    // ... rest of properties
}
```

Then recreate database:

```bash
cd backend-config
dotnet ef database drop -f
dotnet ef database update
```

---

## 🖼️ Image Naming Convention

```
PRODUCT_NAME_ATTRIBUTES.jpg
```

**Examples:**
- `CHURU_ATUN_4_PIEZAS_56_GR.jpg` ✅
- `ROYAL_CANIN_ADULT_DOG_3KG.jpg` ✅
- `HILLS_SCIENCE_DIET_PUPPY.jpg` ✅

**Rules:**
- UPPERCASE letters
- Underscores instead of spaces
- No special characters (ñ, á, etc.)
- File extension: .jpg, .png, or .webp

---

## 🔍 Verify Image URL

### In Database

```bash
sqlite3 backend-config/VentasPet.db "SELECT IdProducto, NombreBase, URLImagen FROM Productos;"
```

### In API

```bash
# All products
curl http://localhost:5135/api/productos | jq '.[] | {id: .IdProducto, name: .NombreBase, image: .URLImagen}'

# Single product
curl http://localhost:5135/api/productos/2 | jq '.URLImagen'
```

### In Browser Console

```javascript
// Open http://localhost:3333 and run in console:
fetch('/api/productos/2')
  .then(r => r.json())
  .then(p => console.log('Image URL:', p.URLImagen));
```

---

## ✅ Current Status

| Product ID | Name | Image URL | Status |
|------------|------|-----------|--------|
| 1 | Royal Canin Adult | `/images/productos/royal-canin-adult.jpg` | ⏳ Local path |
| 2 | Churu Atún 4 Piezas 56gr | `https://www.velykapet.com/CHURU_ATUN_4_PIEZAS_56_GR.jpg` | ✅ **R2 URL** |
| 3 | Hill's Science Diet Puppy | `/images/productos/hills-puppy.jpg` | ⏳ Local path |
| 4 | Purina Pro Plan Adult Cat | `/images/productos/purina-cat.jpg` | ⏳ Local path |
| 5 | Snacks Naturales | `/images/productos/snacks.jpg` | ⏳ Local path |

---

## 🎯 What's Working

- ✅ Database created with migrations
- ✅ Product #2 configured with Cloudflare R2 URL
- ✅ API returns image URL in ProductoDto
- ✅ Frontend ProductCard component renders images
- ✅ Lazy loading enabled
- ✅ Error handling with placeholder
- ✅ Alt text for SEO/accessibility

---

## 🐛 Troubleshooting

### Image not appearing?

**Check 1: Is the URL in the database?**
```bash
sqlite3 backend-config/VentasPet.db "SELECT URLImagen FROM Productos WHERE IdProducto = 2;"
```

**Check 2: Is the API returning it?**
```bash
curl http://localhost:5135/api/productos/2 | jq '.URLImagen'
```

**Check 3: Is the image accessible?**
```bash
curl -I https://www.velykapet.com/CHURU_ATUN_4_PIEZAS_56_GR.jpg
```

### API not responding?

**Check if backend is running:**
```bash
curl http://localhost:5135/api/productos
```

**If not running, start it:**
```bash
cd backend-config
ASPNETCORE_ENVIRONMENT=Development dotnet run
```

### Frontend not loading?

**Check if frontend is running:**
```bash
curl http://localhost:3333
```

**If not running, start it:**
```bash
npm start
```

---

## 📚 Full Documentation

For complete details, see:
- `CLOUDFLARE_R2_IMPLEMENTACION_COMPLETA.md` - Complete implementation guide
- `GUIA_ASOCIAR_IMAGENES_PRODUCTOS.md` - Step-by-step guide
- `EJEMPLO_VISUAL_PRODUCTO_R2.md` - Visual examples

---

## 🚀 Next Steps

1. **Upload Images to R2**
   - Optimize images (< 200KB, 800x800px)
   - Upload to Cloudflare R2 bucket
   - Get public URLs

2. **Update All Products**
   - Use SQL script or API to update URLs
   - Test each product in catalog
   - Verify images load correctly

3. **Production Deployment**
   - Configure custom domain
   - Enable CDN caching
   - Monitor performance

---

**Need Help?** Check the troubleshooting section above or refer to the complete documentation.

**Quick Access:**
- Backend: http://localhost:5135
- Frontend: http://localhost:3333
- API Docs: http://localhost:5135/swagger (if enabled)
