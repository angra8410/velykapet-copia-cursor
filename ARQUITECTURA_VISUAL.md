# 🏗️ Arquitectura Visual - Sistema VentasPet

Este documento proporciona diagramas visuales de la arquitectura del sistema completo.

---

## 📊 Vista General del Sistema

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SISTEMA VENTASPET                            │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐         ┌─────────────────────┐         ┌──────────────┐
│                     │         │                     │         │              │
│   FRONTEND          │◄───────►│   BACKEND .NET      │◄───────►│  BASE DE     │
│   React 18          │  HTTP/  │   ASP.NET Core      │  EF     │  DATOS       │
│   Port: 3333        │  REST   │   Port: 5135        │  Core   │  SQL Server  │
│                     │         │                     │         │              │
└─────────────────────┘         └─────────────────────┘         └──────────────┘
         │                               │
         │                               │
         ▼                               ▼
  ┌──────────────┐              ┌──────────────┐
  │ localStorage │              │   Swagger    │
  │   - Token    │              │   /swagger   │
  │   - Usuario  │              │              │
  └──────────────┘              └──────────────┘
```

---

## 🔐 Flujo de Autenticación JWT

```
USUARIO                 FRONTEND                BACKEND                 BASE DE DATOS
  │                        │                       │                          │
  │  1. Ingresa email/pwd  │                       │                          │
  ├───────────────────────►│                       │                          │
  │                        │                       │                          │
  │                        │  2. POST /Auth/login  │                          │
  │                        ├──────────────────────►│                          │
  │                        │  {email, password}    │                          │
  │                        │                       │                          │
  │                        │                       │  3. SELECT * FROM        │
  │                        │                       │     Usuarios WHERE       │
  │                        │                       │     Email = @email       │
  │                        │                       ├─────────────────────────►│
  │                        │                       │                          │
  │                        │                       │  4. Usuario encontrado   │
  │                        │                       │◄─────────────────────────┤
  │                        │                       │                          │
  │                        │                       │  5. VerifyPassword()     │
  │                        │                       │     PasswordHash +       │
  │                        │                       │     PasswordSalt         │
  │                        │                       │                          │
  │                        │                       │  6. GenerarToken()       │
  │                        │                       │     Claims: Id, Email    │
  │                        │                       │     Expiry: 24h          │
  │                        │                       │                          │
  │                        │  7. Response:         │                          │
  │                        │  { token, user }      │                          │
  │                        │◄──────────────────────┤                          │
  │                        │                       │                          │
  │                        │  8. Save to           │                          │
  │                        │     localStorage      │                          │
  │                        │                       │                          │
  │  9. Usuario logueado   │                       │                          │
  │◄───────────────────────┤                       │                          │
  │                        │                       │                          │
  │                        │  10. GET /Products    │                          │
  │                        │  Header: Bearer JWT   │                          │
  │                        ├──────────────────────►│                          │
  │                        │                       │                          │
  │                        │                       │  11. Validate JWT        │
  │                        │                       │      Extract Claims      │
  │                        │                       │                          │
  │                        │                       │  12. SELECT FROM         │
  │                        │                       │      Productos           │
  │                        │                       ├─────────────────────────►│
  │                        │                       │                          │
  │                        │                       │  13. Productos           │
  │                        │                       │◄─────────────────────────┤
  │                        │                       │                          │
  │                        │  14. Productos JSON   │                          │
  │                        │◄──────────────────────┤                          │
  │                        │                       │                          │
  │  15. Muestra productos │                       │                          │
  │◄───────────────────────┤                       │                          │
  │                        │                       │                          │
```

---

## 🏛️ Arquitectura en Capas del Backend

```
┌───────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                         │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │     Auth     │  │  Productos   │  │   Ordenes    │           │
│  │  Controller  │  │  Controller  │  │  Controller  │  + More    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
│         │                 │                 │                     │
└─────────┼─────────────────┼─────────────────┼─────────────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌───────────────────────────────────────────────────────────────────┐
│                        BUSINESS LOGIC LAYER                        │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │     Auth     │  │  Productos   │  │   Ordenes    │           │
│  │   Service    │  │   Service    │  │   Service    │  + More    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
│         │                 │                 │                     │
│         │  ┌──────────────────────────┐     │                     │
│         └─►│    JWT Helper            │     │                     │
│            │    Password Helper       │◄────┘                     │
│            └──────────────────────────┘                           │
│                     │                                              │
└─────────────────────┼──────────────────────────────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────────────────────────────┐
│                        DATA ACCESS LAYER                           │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Usuario    │  │  Producto    │  │    Orden     │           │
│  │  Repository  │  │  Repository  │  │  Repository  │  + More    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
│         │                 │                 │                     │
│         └─────────────────┴─────────────────┘                     │
│                           │                                       │
│                 ┌─────────▼─────────┐                            │
│                 │   DbContext       │                            │
│                 │  (EF Core)        │                            │
│                 └─────────┬─────────┘                            │
└───────────────────────────┼───────────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────────────┐
│                         DATABASE LAYER                             │
│                                                                    │
│     ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│     │ Usuarios │  │Productos │  │ Ordenes  │  │Categorias│      │
│     └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                    │
│     ┌──────────┐  ┌──────────────┐                               │
│     │  Marcas  │  │DetallesOrden │                               │
│     └──────────┘  └──────────────┘                               │
│                                                                    │
│                      SQL Server Database                           │
└───────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Modelo de Datos Relacional

```
┌─────────────────────┐
│     USUARIOS        │
├─────────────────────┤
│ • Id (PK)           │
│ • Email (UQ)        │
│ • Nombre            │
│ • PasswordHash      │
│ • PasswordSalt      │
│ • Rol               │
│ • Activo            │
│ • FechaCreacion     │
└──────────┬──────────┘
           │
           │ 1
           │
           │ N
           │
┌──────────▼──────────┐                    ┌─────────────────────┐
│      ORDENES        │                    │    CATEGORIAS       │
├─────────────────────┤                    ├─────────────────────┤
│ • Id (PK)           │                    │ • Id (PK)           │
│ • UsuarioId (FK)    │                    │ • Nombre (UQ)       │
│ • NumeroOrden (UQ)  │                    │ • Descripcion       │
│ • EstadoOrden       │                    │ • Activo            │
│ • Total             │                    └──────────┬──────────┘
│ • Subtotal          │                               │
│ • DireccionEnvio    │                               │ 1
│ • Ciudad            │                               │
│ • FechaCreacion     │                               │ N
└──────────┬──────────┘                               │
           │                                          │
           │ 1                    ┌───────────────────▼──────────┐
           │                      │       PRODUCTOS              │
           │ N                    ├──────────────────────────────┤
           │                      │ • Id (PK)                    │
┌──────────▼──────────┐           │ • Nombre                     │
│  DETALLES ORDEN     │           │ • Descripcion                │
├─────────────────────┤           │ • Precio                     │
│ • Id (PK)           │           │ • Stock                      │
│ • OrdenId (FK) ─────┘           │ • CategoriaId (FK) ──────────┘
│ • ProductoId (FK) ──────────────► • MarcaId (FK) ────────┐
│ • Cantidad          │           │ • UrlImagen              │
│ • PrecioUnitario    │           │ • TipoMascota            │
│ • Subtotal          │           │ • Activo                 │
└─────────────────────┘           │ • FechaCreacion          │
                                  └──────────────────────────┘
                                             │
                                             │ N
                                             │
                                             │ 1
                                             │
                                  ┌──────────▼──────────┐
                                  │      MARCAS         │
                                  ├─────────────────────┤
                                  │ • Id (PK)           │
                                  │ • Nombre (UQ)       │
                                  │ • Descripcion       │
                                  │ • Activo            │
                                  └─────────────────────┘
```

**Leyenda:**
- `PK` = Primary Key (Llave Primaria)
- `FK` = Foreign Key (Llave Foránea)
- `UQ` = Unique (Único)
- `1` = Relación Uno
- `N` = Relación Muchos

---

## 📂 Estructura de Directorios del Backend

```
VentasPetApi/
│
├── 📁 Controllers/                    # API Endpoints
│   ├── 🎯 AuthController.cs          # Autenticación y registro
│   ├── 🎯 ProductosController.cs     # CRUD de productos
│   ├── 🎯 OrdenesController.cs       # Gestión de órdenes
│   ├── 🎯 CategoriasController.cs    # Categorías
│   └── 🎯 MarcasController.cs        # Marcas
│
├── 📁 Models/
│   ├── 📁 Entities/                   # Entidades de base de datos
│   │   ├── 📄 Usuario.cs
│   │   ├── 📄 Producto.cs
│   │   ├── 📄 Orden.cs
│   │   ├── 📄 DetalleOrden.cs
│   │   ├── 📄 Categoria.cs
│   │   └── 📄 Marca.cs
│   │
│   └── 📁 DTOs/                       # Data Transfer Objects
│       ├── 📁 Auth/
│       │   ├── LoginDto.cs
│       │   ├── RegisterDto.cs
│       │   └── UsuarioDto.cs
│       ├── 📁 Productos/
│       │   ├── ProductoDto.cs
│       │   └── CrearProductoDto.cs
│       └── 📁 Ordenes/
│           ├── OrdenDto.cs
│           └── CrearOrdenDto.cs
│
├── 📁 Data/                           # Acceso a datos
│   ├── 📄 VentasPetDbContext.cs      # DbContext principal
│   └── 📁 Configurations/
│       ├── UsuarioConfiguration.cs
│       ├── ProductoConfiguration.cs
│       └── OrdenConfiguration.cs
│
├── 📁 Services/                       # Lógica de negocio
│   ├── 📁 Interfaces/
│   │   ├── IAuthService.cs
│   │   ├── IProductoService.cs
│   │   └── IOrdenService.cs
│   └── 📁 Implementations/
│       ├── 🔧 AuthService.cs
│       ├── 🔧 ProductoService.cs
│       └── 🔧 OrdenService.cs
│
├── 📁 Repositories/                   # Acceso a datos
│   ├── 📁 Interfaces/
│   │   ├── IGenericRepository.cs
│   │   ├── IUsuarioRepository.cs
│   │   └── IProductoRepository.cs
│   └── 📁 Implementations/
│       ├── 💾 GenericRepository.cs
│       ├── 💾 UsuarioRepository.cs
│       └── 💾 ProductoRepository.cs
│
├── 📁 Middleware/                     # Middleware personalizado
│   ├── ErrorHandlingMiddleware.cs
│   └── JwtMiddleware.cs
│
├── 📁 Helpers/                        # Utilidades
│   ├── 🔐 JwtHelper.cs               # Generación y validación de JWT
│   ├── 🔐 PasswordHelper.cs          # Hash y verificación de passwords
│   └── 🗺️ MappingProfiles.cs        # AutoMapper profiles
│
├── 📁 Migrations/                     # Migraciones EF Core
│   └── (generadas automáticamente)
│
├── ⚙️ Program.cs                      # Configuración principal
├── ⚙️ appsettings.json               # Configuración de aplicación
├── ⚙️ appsettings.Development.json   # Config de desarrollo
└── 📦 VentasPetApi.csproj            # Archivo de proyecto
```

---

## 🔄 Flujo de una Petición HTTP Completo

```
1. CLIENTE ENVÍA REQUEST
   │
   │  GET /api/Products
   │  Authorization: Bearer eyJhbGc...
   │
   ▼
2. MIDDLEWARE PIPELINE
   │
   ├─► Error Handling Middleware
   ├─► CORS Middleware
   ├─► Authentication Middleware
   │    │
   │    ├─► Validar JWT Token
   │    ├─► Extraer Claims (Id, Email, Rol)
   │    └─► Crear ClaimsPrincipal
   │
   └─► Authorization Middleware
        │
        └─► Verificar permisos/roles
   │
   ▼
3. ROUTING
   │
   └─► ProductosController.GetProductos()
   │
   ▼
4. CONTROLLER
   │
   │  [Authorize]
   │  public async Task<IActionResult> GetProductos(
   │      [FromQuery] string? search,
   │      [FromQuery] int? categoriaId
   │  )
   │  {
   │      var productos = await _productoService
   │          .GetProductosAsync(search, categoriaId);
   │      return Ok(productos);
   │  }
   │
   ▼
5. SERVICE LAYER
   │
   │  public async Task<List<ProductoDto>> 
   │      GetProductosAsync(string? search, int? categoriaId)
   │  {
   │      var productos = await _repository
   │          .GetFilteredAsync(search, categoriaId);
   │      
   │      return _mapper.Map<List<ProductoDto>>(productos);
   │  }
   │
   ▼
6. REPOSITORY LAYER
   │
   │  public async Task<List<Producto>> 
   │      GetFilteredAsync(string? search, int? categoriaId)
   │  {
   │      var query = _context.Productos
   │          .Include(p => p.Categoria)
   │          .Include(p => p.Marca)
   │          .Where(p => !p.Eliminado);
   │      
   │      if (!string.IsNullOrEmpty(search))
   │          query = query.Where(p => p.Nombre.Contains(search));
   │      
   │      if (categoriaId.HasValue)
   │          query = query.Where(p => p.CategoriaId == categoriaId);
   │      
   │      return await query.ToListAsync();
   │  }
   │
   ▼
7. DATABASE
   │
   │  SELECT p.*, c.*, m.*
   │  FROM Productos p
   │  LEFT JOIN Categorias c ON p.CategoriaId = c.Id
   │  LEFT JOIN Marcas m ON p.MarcaId = m.Id
   │  WHERE p.Eliminado = 0
   │    AND (p.Nombre LIKE '%search%' OR @search IS NULL)
   │    AND (p.CategoriaId = @categoriaId OR @categoriaId IS NULL)
   │
   ▼
8. RESULTADO REGRESA
   │
   │  List<Producto> → Service
   │                 ↓
   │  AutoMapper convierte a List<ProductoDto>
   │                 ↓
   │  Service → Controller
   │                 ↓
   │  Controller serializa a JSON
   │                 ↓
   │  Response HTTP 200 OK
   │
   ▼
9. CLIENTE RECIBE
   │
   │  {
   │    "id": 1,
   │    "nombre": "Royal Canin Adult",
   │    "precio": 89000,
   │    "stock": 25,
   │    "categoria": "Alimento",
   │    "marca": "Royal Canin"
   │  }
```

---

## 🌐 Endpoints RESTful del API

```
╔═══════════════════════════════════════════════════════════════════╗
║                      ENDPOINTS DE AUTENTICACIÓN                    ║
╚═══════════════════════════════════════════════════════════════════╝

┌──────────┬─────────────────────┬──────────────┬─────────────────┐
│  Método  │      Endpoint       │     Auth     │   Descripción   │
├──────────┼─────────────────────┼──────────────┼─────────────────┤
│  POST    │ /api/Auth/register  │ Anónimo      │ Registrar user  │
│  POST    │ /api/Auth/login     │ Anónimo      │ Iniciar sesión  │
│  GET     │ /api/Auth/me        │ JWT Required │ Usuario actual  │
└──────────┴─────────────────────┴──────────────┴─────────────────┘


╔═══════════════════════════════════════════════════════════════════╗
║                      ENDPOINTS DE PRODUCTOS                        ║
╚═══════════════════════════════════════════════════════════════════╝

┌──────────┬─────────────────────┬──────────────┬─────────────────┐
│  Método  │      Endpoint       │     Auth     │   Descripción   │
├──────────┼─────────────────────┼──────────────┼─────────────────┤
│  GET     │ /api/Products       │ Público      │ Listar todos    │
│  GET     │ /api/Products/{id}  │ Público      │ Obtener por ID  │
│  POST    │ /api/Products       │ Admin        │ Crear producto  │
│  PUT     │ /api/Products/{id}  │ Admin        │ Actualizar      │
│  DELETE  │ /api/Products/{id}  │ Admin        │ Eliminar        │
│  POST    │ /api/Products/bulk  │ Admin        │ Importar varios │
└──────────┴─────────────────────┴──────────────┴─────────────────┘


╔═══════════════════════════════════════════════════════════════════╗
║                       ENDPOINTS DE ÓRDENES                         ║
╚═══════════════════════════════════════════════════════════════════╝

┌──────────┬─────────────────────┬──────────────┬─────────────────┐
│  Método  │      Endpoint       │     Auth     │   Descripción   │
├──────────┼─────────────────────┼──────────────┼─────────────────┤
│  GET     │ /api/Orders         │ JWT Required │ Mis órdenes     │
│  GET     │ /api/Orders/{id}    │ JWT Required │ Detalle orden   │
│  POST    │ /api/Orders         │ JWT Required │ Crear orden     │
│  PUT     │ /api/Orders/{id}    │ JWT Required │ Actualizar      │
└──────────┴─────────────────────┴──────────────┴─────────────────┘


╔═══════════════════════════════════════════════════════════════════╗
║                    ENDPOINTS DE CATEGORÍAS                         ║
╚═══════════════════════════════════════════════════════════════════╝

┌──────────┬─────────────────────┬──────────────┬─────────────────┐
│  Método  │      Endpoint       │     Auth     │   Descripción   │
├──────────┼─────────────────────┼──────────────┼─────────────────┤
│  GET     │ /api/Categorias     │ Público      │ Listar todas    │
│  GET     │ /api/Categorias/{id}│ Público      │ Obtener por ID  │
│  POST    │ /api/Categorias     │ Admin        │ Crear categoría │
└──────────┴─────────────────────┴──────────────┴─────────────────┘
```

---

## 🔐 Seguridad - Flujo de Tokens JWT

```
╔══════════════════════════════════════════════════════════════════╗
║                    ESTRUCTURA DEL JWT TOKEN                       ║
╚══════════════════════════════════════════════════════════════════╝

Header (Base64 encoded)
┌────────────────────────────┐
│ {                          │
│   "alg": "HS256",          │  ◄─── Algoritmo de firma
│   "typ": "JWT"             │  ◄─── Tipo de token
│ }                          │
└────────────────────────────┘

Payload (Base64 encoded)
┌────────────────────────────┐
│ {                          │
│   "Id": "1",               │  ◄─── Claims del usuario
│   "email": "user@ex.com",  │
│   "name": "Usuario",       │
│   "role": "Cliente",       │
│   "exp": 1234567890,       │  ◄─── Fecha de expiración
│   "iss": "VentasPetAPI",   │  ◄─── Emisor
│   "aud": "VentasPetClients"│  ◄─── Audiencia
│ }                          │
└────────────────────────────┘

Signature (HMACSHA256)
┌────────────────────────────┐
│ HMACSHA256(                │
│   base64(header) + "." +   │
│   base64(payload),         │
│   secret_key               │  ◄─── Llave secreta
│ )                          │
└────────────────────────────┘

RESULTADO: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjEi...
```

**Validación del Token:**
1. ✅ Firma válida (con secret key)
2. ✅ No ha expirado (exp claim)
3. ✅ Emisor correcto (iss claim)
4. ✅ Audiencia correcta (aud claim)

---

## 📈 Plan de Implementación en Fases

```
FASE 1: PREPARACIÓN                    [Semana 1]
├── Crear proyecto .NET
├── Configurar Entity Framework
├── Crear scripts de base de datos
├── Configurar JWT y CORS
└── Documentar con Swagger
    │
    ▼
FASE 2: DESARROLLO CORE                [Semanas 2-3]
├── Implementar modelos de entidades
├── Crear repositorios genéricos
├── AuthController y AuthService
├── ProductosController
├── OrdenesController
└── Testing unitario básico
    │
    ▼
FASE 3: INTEGRACIÓN FRONTEND          [Semana 4]
├── Verificar compatibilidad endpoints
├── Ajustar respuestas JSON
├── Testing de integración
├── Verificar flujo autenticación
└── Verificar flujo de compra
    │
    ▼
FASE 4: MIGRACIÓN DE DATOS            [Semana 5]
├── Exportar datos sistema anterior
├── Crear scripts de migración
├── Validar integridad de datos
└── Backup completo
    │
    ▼
FASE 5: TESTING Y QA                  [Semana 6]
├── Testing de carga
├── Testing de seguridad
├── Testing end-to-end
└── Corrección de bugs
    │
    ▼
FASE 6: DESPLIEGUE                    [Semana 7]
├── Configurar ambiente producción
├── Configurar SSL/HTTPS
├── Configurar logging y monitoring
├── Despliegue gradual
└── Monitoreo post-despliegue
```

---

## 📚 Referencias Rápidas

### Documentos del Proyecto
- 📖 [Análisis Completo](./ANALISIS_BACKEND_DOTNET.md) - 1668 líneas de análisis detallado
- 🚀 [Guía Rápida](./GUIA_RAPIDA_IMPLEMENTACION.md) - Tutorial paso a paso
- 📜 [Scripts de Inicio](./SCRIPTS_README.md) - Iniciar servidores
- ⚙️ [Configuración de Ambientes](./AMBIENTES.md) - Variables de entorno

### Puertos del Sistema
- Frontend: `http://localhost:3333`
- Backend: `http://localhost:5135`
- Swagger: `http://localhost:5135/swagger`

### Credenciales de Prueba
- Email: `admin@ventaspet.com`
- Password: `Admin123!`

---

**🐾 VentasPet - Arquitectura Visual**

*Última actualización: 2024*
