# 🚀 Guía Rápida de Implementación - Backend .NET VentasPet

**📖 Documento Completo:** Ver [ANALISIS_BACKEND_DOTNET.md](./ANALISIS_BACKEND_DOTNET.md) para análisis detallado

---

## ⚡ Inicio Rápido

### 1️⃣ Crear Proyecto .NET

```bash
# Crear solución y proyecto
dotnet new sln -n VentasPetApi
dotnet new webapi -n VentasPetApi
dotnet sln add VentasPetApi/VentasPetApi.csproj

# Instalar paquetes necesarios
cd VentasPetApi
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
dotnet add package Swashbuckle.AspNetCore
```

### 2️⃣ Configurar appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=VentasPetDB;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "Jwt": {
    "Key": "CAMBIAR_ESTA_CLAVE_SUPER_SECRETA_MINIMO_32_CARACTERES",
    "Issuer": "VentasPetAPI",
    "Audience": "VentasPetClients",
    "ExpiryMinutes": 1440
  }
}
```

### 3️⃣ Crear Base de Datos

```sql
-- Ejecutar scripts en orden:
-- 1. Crear base de datos
CREATE DATABASE VentasPetDB;
GO

USE VentasPetDB;
GO

-- 2. Crear tablas (ver scripts completos en ANALISIS_BACKEND_DOTNET.md)
CREATE TABLE Usuarios (...);
CREATE TABLE Categorias (...);
CREATE TABLE Marcas (...);
CREATE TABLE Productos (...);
CREATE TABLE Ordenes (...);
CREATE TABLE DetallesOrden (...);

-- 3. Insertar datos de prueba
INSERT INTO Categorias (...) VALUES (...);
INSERT INTO Marcas (...) VALUES (...);
```

---

## 📁 Estructura de Carpetas a Crear

```
VentasPetApi/
├── Controllers/
│   ├── AuthController.cs           ⭐ Prioritario
│   ├── ProductosController.cs      ⭐ Prioritario
│   └── OrdenesController.cs        ⭐ Prioritario
├── Models/
│   ├── Entities/
│   │   ├── Usuario.cs              ⭐ Prioritario
│   │   ├── Producto.cs             ⭐ Prioritario
│   │   └── Orden.cs                ⭐ Prioritario
│   └── DTOs/
│       ├── Auth/
│       ├── Productos/
│       └── Ordenes/
├── Data/
│   └── VentasPetDbContext.cs       ⭐ Prioritario
├── Services/
│   ├── Interfaces/
│   └── Implementations/
├── Repositories/
│   ├── Interfaces/
│   └── Implementations/
└── Helpers/
    ├── JwtHelper.cs                ⭐ Prioritario
    └── PasswordHelper.cs           ⭐ Prioritario
```

---

## 🎯 Endpoints Prioritarios a Implementar

### ✅ Fase 1 - Autenticación (Semana 1)

```
POST /api/Auth/register    - Registro de usuarios
POST /api/Auth/login       - Inicio de sesión
GET  /api/Auth/me          - Usuario actual
```

**Frontend espera:**
```javascript
// Login Response
{
  "token": "eyJhbGciOiJI...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Nombre Usuario"
  }
}
```

### ✅ Fase 2 - Productos (Semana 2)

```
GET  /api/Products              - Listar productos (con filtros)
GET  /api/Products/{id}         - Detalle de producto
POST /api/Products/bulk         - Importación masiva (admin)
```

**Frontend espera:**
```javascript
// Product Response
{
  "id": 1,
  "name": "Royal Canin Adult",
  "price": 89000,
  "stock": 25,
  "category": "Alimento",
  "brand": "Royal Canin"
}
```

### ✅ Fase 3 - Órdenes (Semana 3)

```
POST /api/Orders               - Crear orden
GET  /api/Orders               - Listar órdenes del usuario
GET  /api/Orders/{id}          - Detalle de orden
```

---

## 🔒 Configuración de Seguridad JWT

### Program.cs - Configuración Mínima

```csharp
// 1. Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("VentasPetPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3333")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 2. Configurar JWT
var jwtKey = builder.Configuration["Jwt:Key"];
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)
            ),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"]
        };
    });

// 3. Usar middleware
app.UseCors("VentasPetPolicy");
app.UseAuthentication();
app.UseAuthorization();
```

---

## 🧪 Testing Rápido con Postman/cURL

### 1. Registrar Usuario

```bash
curl -X POST http://localhost:5135/api/Auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@ventaspet.com",
    "password": "Test123!",
    "name": "Usuario Test"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5135/api/Auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@ventaspet.com",
    "password": "Test123!"
  }'
```

### 3. Obtener Productos (con token)

```bash
curl -X GET http://localhost:5135/api/Products \
  -H "Authorization: Bearer {TOKEN_AQUI}"
```

---

## ⚠️ Checklist Pre-Testing con Frontend

Antes de probar con el frontend, verificar:

- [ ] Backend corriendo en `http://localhost:5135`
- [ ] CORS configurado para `http://localhost:3333`
- [ ] Base de datos creada y con datos de prueba
- [ ] Endpoints de autenticación respondiendo
- [ ] JWT generándose correctamente
- [ ] Swagger funcionando en `http://localhost:5135/swagger`
- [ ] Respuestas JSON con estructura correcta (PascalCase)

---

## 🔧 Comandos Útiles

```bash
# Ejecutar backend
dotnet run

# Crear migración (si usas EF Migrations)
dotnet ef migrations add InitialCreate
dotnet ef database update

# Ver logs detallados
dotnet run --verbosity detailed

# Restaurar paquetes
dotnet restore

# Compilar
dotnet build
```

---

## 📊 Nomenclatura de Base de Datos

### Tablas Principales (en español)

| Tabla | Descripción | Campos Clave |
|-------|-------------|--------------|
| **Usuarios** | Usuarios del sistema | Email, PasswordHash, Rol |
| **Productos** | Catálogo de productos | Nombre, Precio, Stock, CategoriaId |
| **Categorias** | Categorías de productos | Nombre |
| **Marcas** | Marcas de productos | Nombre |
| **Ordenes** | Órdenes de compra | NumeroOrden, UsuarioId, Total |
| **DetallesOrden** | Items de cada orden | OrdenId, ProductoId, Cantidad |

### Convenciones

✅ **Usar:** `CategoriaId`, `UsuarioId`, `ProductoId`  
❌ **No usar:** `category_id`, `CategoryID`, `idCategoria`

✅ **Usar:** `FechaCreacion`, `FechaActualizacion`  
❌ **No usar:** `created_at`, `CreatedDate`

---

## 🎨 Ejemplo Completo: AuthController.cs

```csharp
[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        try
        {
            var result = await _authService.LoginAsync(dto);
            return Ok(result);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized(new { message = "Credenciales inválidas" });
        }
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = int.Parse(User.FindFirst("Id")?.Value ?? "0");
        var user = await _authService.GetUserByIdAsync(userId);
        return Ok(user);
    }
}
```

---

## 📚 Recursos Adicionales

- **Documento Completo:** [ANALISIS_BACKEND_DOTNET.md](./ANALISIS_BACKEND_DOTNET.md)
- **Scripts de Base de Datos:** Ver sección 4.3 del documento completo
- **Ejemplos de Código:** Ver sección 5 del documento completo
- **Plan de Migración:** Ver sección 8 del documento completo

---

## 🆘 Solución de Problemas Comunes

### Error de CORS

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solución:** Verificar configuración de CORS en Program.cs

### Token JWT inválido

```
401 Unauthorized
```

**Verificar:**
1. Token siendo enviado en header `Authorization: Bearer {token}`
2. Clave JWT coincide en appsettings.json
3. Token no ha expirado

### Frontend no conecta al backend

**Verificar:**
1. Backend corriendo en puerto 5135
2. Frontend apunta a `http://localhost:5135/api` en `api.js`
3. No hay errores en consola del navegador

---

## ✅ Próximos Pasos

1. ⏳ Crear proyecto .NET
2. ⏳ Configurar base de datos
3. ⏳ Implementar autenticación
4. ⏳ Implementar endpoints de productos
5. ⏳ Implementar endpoints de órdenes
6. ⏳ Testing con frontend
7. ⏳ Deployment

---

**🐾 VentasPet - Guía Rápida de Implementación**

*Para información detallada, consultar [ANALISIS_BACKEND_DOTNET.md](./ANALISIS_BACKEND_DOTNET.md)*
