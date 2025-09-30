# 🔧 Análisis para Implementación de Backend .NET con Tablas en Español
## VentasPet - Proyecto de Modernización

---

**Fecha de Análisis:** 2024  
**Proyecto:** VentasPet (`ventas_pet_new`)  
**Objetivo:** Implementar nuevo backend en .NET con base de datos en español  
**Autor:** Equipo de Arquitectura VentasPet

---

## 📋 Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Análisis de la Arquitectura Actual](#análisis-de-la-arquitectura-actual)
3. [Endpoints Existentes del API](#endpoints-existentes-del-api)
4. [Estructura de Base de Datos Propuesta](#estructura-de-base-de-datos-propuesta)
5. [Arquitectura del Backend .NET](#arquitectura-del-backend-net)
6. [Seguridad y Autenticación JWT](#seguridad-y-autenticación-jwt)
7. [Convenciones y Estándares](#convenciones-y-estándares)
8. [Plan de Migración](#plan-de-migración)
9. [Riesgos y Mitigaciones](#riesgos-y-mitigaciones)
10. [Próximos Pasos](#próximos-pasos)

---

## 1. Resumen Ejecutivo

### 1.1 Contexto

El proyecto **VentasPet** actualmente cuenta con:
- ✅ Frontend desarrollado en React 18 (puro, sin JSX)
- ✅ Sistema de componentes modular y bien organizado
- ✅ API Service para comunicación con backend
- ✅ Sistema de autenticación con JWT
- ⚠️ Backend .NET existente en ruta externa (`../ventas_pet/ventas_pet_api_dotnet/`)
- 🎯 Necesidad de rediseñar backend con nomenclatura en español

### 1.2 Objetivos del Análisis

- Documentar la estructura actual del frontend y sus dependencias del backend
- Proponer arquitectura de base de datos con nomenclatura en español
- Diseñar estructura del backend .NET compatible con frontend existente
- Establecer estrategia de migración sin interrumpir servicios
- Implementar seguridad robusta con JWT
- Garantizar escalabilidad y mantenibilidad del sistema

### 1.3 Alcance

**Incluye:**
- Análisis completo de endpoints actuales
- Diseño de base de datos en español
- Arquitectura de backend .NET
- Estrategia de autenticación y autorización
- Plan de migración y testing

**Excluye:**
- Implementación del código (se proporciona estructura)
- Migración de datos existentes (se proporciona estrategia)
- Configuración de infraestructura en la nube

---

## 2. Análisis de la Arquitectura Actual

### 2.1 Estructura del Frontend

```
ventas_pet_new/
├── src/
│   ├── api.js                    # 🔴 CRÍTICO: Servicio de API
│   ├── auth.js                   # 🔴 CRÍTICO: Sistema de autenticación
│   ├── products.js               # Gestión de productos
│   ├── cart.js                   # Carrito de compras
│   ├── components/
│   │   ├── Header.js             # Header con navegación
│   │   ├── HamburgerMenu.js      # Menú responsive
│   │   ├── ModernLayout.js       # Layout principal
│   │   ├── AdminPanel.js         # Panel administrativo
│   │   ├── UserProfile.js        # Perfil de usuario
│   │   └── ...
│   └── ...
├── public/images/                # Assets estáticos
└── index.html                    # Punto de entrada
```

### 2.2 Configuración Actual del API

**Archivo:** `src/api.js`

```javascript
const API_CONFIG = {
    baseUrl: 'http://localhost:5135/api',
    timeout: 10000,
    retries: 3
};
```

**Características:**
- ✅ Gestión centralizada de tokens JWT en localStorage
- ✅ Interceptor de peticiones con headers de autorización
- ✅ Manejo de errores robusto
- ✅ Sistema de reintentos automáticos
- ✅ Logs detallados para debugging

### 2.3 Servidores Configurados

- **Frontend:** `http://localhost:3333`
- **Backend:** `http://localhost:5135`
- **Swagger UI:** `http://localhost:5135/swagger`

---

## 3. Endpoints Existentes del API

### 3.1 Módulo de Autenticación

#### POST `/api/Auth/register`
**Propósito:** Registro de nuevos usuarios

**Request Body:**
```json
{
  "email": "usuario@ventaspet.com",
  "password": "Password123!",
  "name": "Nombre Usuario"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@ventaspet.com",
    "name": "Nombre Usuario"
  }
}
```

---

#### POST `/api/Auth/login`
**Propósito:** Iniciar sesión

**Request Body:**
```json
{
  "email": "usuario@ventaspet.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@ventaspet.com",
    "name": "Nombre Usuario"
  }
}
```

---

#### GET `/api/Auth/me`
**Propósito:** Obtener información del usuario autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "email": "usuario@ventaspet.com",
  "name": "Nombre Usuario",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

### 3.2 Módulo de Productos

#### GET `/api/Products`
**Propósito:** Listar productos con filtros opcionales

**Query Parameters:**
- `search` (string): Búsqueda por nombre/descripción
- `category` (string): Filtro por categoría
- `minPrice` (decimal): Precio mínimo
- `maxPrice` (decimal): Precio máximo

**Response:**
```json
[
  {
    "id": 1,
    "name": "Royal Canin Adult",
    "description": "Alimento balanceado para perros adultos",
    "price": 89000,
    "stock": 25,
    "category": "Alimento",
    "brand": "Royal Canin",
    "imageUrl": "/images/products/royal-canin.jpg"
  }
]
```

---

#### GET `/api/Products/{id}`
**Propósito:** Obtener detalle de un producto específico

**Response:**
```json
{
  "id": 1,
  "name": "Royal Canin Adult",
  "description": "Alimento balanceado para perros adultos de todas las razas",
  "price": 89000,
  "stock": 25,
  "category": "Alimento",
  "brand": "Royal Canin",
  "imageUrl": "/images/products/royal-canin.jpg",
  "specifications": {
    "weight": "15kg",
    "petType": "Perro"
  }
}
```

---

#### POST `/api/Products/bulk`
**Propósito:** Importación masiva de productos (Panel Admin)

**Request Body:**
```json
[
  {
    "name": "Producto 1",
    "price": 50000,
    "stock": 10,
    "category": "Alimento",
    "brand": "Marca X"
  }
]
```

---

### 3.3 Módulo de Órdenes

#### POST `/api/Orders`
**Propósito:** Crear nueva orden de compra

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 89000
    }
  ],
  "total": 178000,
  "shippingAddress": {
    "street": "Calle 123",
    "city": "Bogotá",
    "postalCode": "110111"
  }
}
```

**Response:**
```json
{
  "id": 1,
  "orderNumber": "ORD-2024-001",
  "status": "Pendiente",
  "total": 178000,
  "createdAt": "2024-01-01T10:00:00Z"
}
```

---

#### GET `/api/Orders`
**Propósito:** Listar órdenes del usuario autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "orderNumber": "ORD-2024-001",
    "status": "Pendiente",
    "total": 178000,
    "createdAt": "2024-01-01T10:00:00Z"
  }
]
```

---

## 4. Estructura de Base de Datos Propuesta

### 4.1 Convenciones de Nomenclatura

**Reglas:**
1. ✅ Todos los nombres de tablas en **español** y **PascalCase**
2. ✅ Campos en **español** y **PascalCase**
3. ✅ Llaves primarias: `Id` (int, autoincremental)
4. ✅ Llaves foráneas: `{Tabla}Id` (ej: `UsuarioId`, `ProductoId`)
5. ✅ Campos de auditoría: `FechaCreacion`, `FechaActualizacion`, `FechaEliminacion`
6. ✅ Soft Delete: Campo `Eliminado` (bit/boolean)

### 4.2 Diagrama de Tablas

```
┌─────────────────────┐
│     Usuarios        │
├─────────────────────┤
│ Id (PK)             │
│ Email               │
│ Nombre              │
│ PasswordHash        │
│ PasswordSalt        │
│ Rol                 │
│ Activo              │
│ FechaCreacion       │
│ FechaActualizacion  │
│ Eliminado           │
└─────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────┐
│      Ordenes        │
├─────────────────────┤
│ Id (PK)             │
│ UsuarioId (FK)      │
│ NumeroOrden         │
│ EstadoOrden         │
│ Total               │
│ Subtotal            │
│ Impuestos           │
│ DireccionEnvio      │
│ Ciudad              │
│ CodigoPostal        │
│ FechaCreacion       │
│ FechaActualizacion  │
│ Eliminado           │
└─────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────┐
│   DetallesOrden     │
├─────────────────────┤
│ Id (PK)             │
│ OrdenId (FK)        │
│ ProductoId (FK)     │
│ Cantidad            │
│ PrecioUnitario      │
│ Subtotal            │
│ FechaCreacion       │
└─────────────────────┘
         │
         │ N:1
         ▼
┌─────────────────────┐
│     Productos       │
├─────────────────────┤
│ Id (PK)             │
│ Nombre              │
│ Descripcion         │
│ Precio              │
│ Stock               │
│ CategoriaId (FK)    │
│ MarcaId (FK)        │
│ UrlImagen           │
│ Peso                │
│ TipoMascota         │
│ Activo              │
│ FechaCreacion       │
│ FechaActualizacion  │
│ Eliminado           │
└─────────────────────┘
    │           │
    │ N:1       │ N:1
    ▼           ▼
┌──────────┐  ┌──────────┐
│Categorias│  │  Marcas  │
├──────────┤  ├──────────┤
│ Id (PK)  │  │ Id (PK)  │
│ Nombre   │  │ Nombre   │
│ Activo   │  │ Activo   │
└──────────┘  └──────────┘
```

### 4.3 Scripts SQL de Creación

#### Tabla: Usuarios

```sql
CREATE TABLE Usuarios (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Email NVARCHAR(255) NOT NULL UNIQUE,
    Nombre NVARCHAR(255) NOT NULL,
    PasswordHash NVARCHAR(500) NOT NULL,
    PasswordSalt NVARCHAR(500) NOT NULL,
    Rol NVARCHAR(50) NOT NULL DEFAULT 'Cliente',
    Activo BIT NOT NULL DEFAULT 1,
    FechaCreacion DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FechaActualizacion DATETIME2 NULL,
    Eliminado BIT NOT NULL DEFAULT 0,
    
    INDEX IX_Usuarios_Email (Email),
    INDEX IX_Usuarios_Eliminado (Eliminado)
);
```

#### Tabla: Categorias

```sql
CREATE TABLE Categorias (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL UNIQUE,
    Descripcion NVARCHAR(500) NULL,
    Activo BIT NOT NULL DEFAULT 1,
    FechaCreacion DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    Eliminado BIT NOT NULL DEFAULT 0
);
```

#### Tabla: Marcas

```sql
CREATE TABLE Marcas (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL UNIQUE,
    Descripcion NVARCHAR(500) NULL,
    Activo BIT NOT NULL DEFAULT 1,
    FechaCreacion DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    Eliminado BIT NOT NULL DEFAULT 0
);
```

#### Tabla: Productos

```sql
CREATE TABLE Productos (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(255) NOT NULL,
    Descripcion NVARCHAR(1000) NULL,
    Precio DECIMAL(18,2) NOT NULL,
    Stock INT NOT NULL DEFAULT 0,
    CategoriaId INT NOT NULL,
    MarcaId INT NULL,
    UrlImagen NVARCHAR(500) NULL,
    Peso NVARCHAR(50) NULL,
    TipoMascota NVARCHAR(50) NULL, -- 'Perro', 'Gato', 'General'
    Activo BIT NOT NULL DEFAULT 1,
    FechaCreacion DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FechaActualizacion DATETIME2 NULL,
    Eliminado BIT NOT NULL DEFAULT 0,
    
    CONSTRAINT FK_Productos_Categorias 
        FOREIGN KEY (CategoriaId) REFERENCES Categorias(Id),
    CONSTRAINT FK_Productos_Marcas 
        FOREIGN KEY (MarcaId) REFERENCES Marcas(Id),
    
    INDEX IX_Productos_Nombre (Nombre),
    INDEX IX_Productos_CategoriaId (CategoriaId),
    INDEX IX_Productos_MarcaId (MarcaId),
    INDEX IX_Productos_Eliminado (Eliminado)
);
```

#### Tabla: Ordenes

```sql
CREATE TABLE Ordenes (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UsuarioId INT NOT NULL,
    NumeroOrden NVARCHAR(50) NOT NULL UNIQUE,
    EstadoOrden NVARCHAR(50) NOT NULL DEFAULT 'Pendiente',
    Total DECIMAL(18,2) NOT NULL,
    Subtotal DECIMAL(18,2) NOT NULL,
    Impuestos DECIMAL(18,2) NOT NULL DEFAULT 0,
    DireccionEnvio NVARCHAR(500) NOT NULL,
    Ciudad NVARCHAR(100) NOT NULL,
    CodigoPostal NVARCHAR(20) NOT NULL,
    FechaCreacion DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FechaActualizacion DATETIME2 NULL,
    Eliminado BIT NOT NULL DEFAULT 0,
    
    CONSTRAINT FK_Ordenes_Usuarios 
        FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id),
    
    INDEX IX_Ordenes_UsuarioId (UsuarioId),
    INDEX IX_Ordenes_NumeroOrden (NumeroOrden),
    INDEX IX_Ordenes_EstadoOrden (EstadoOrden),
    INDEX IX_Ordenes_FechaCreacion (FechaCreacion),
    INDEX IX_Ordenes_Eliminado (Eliminado)
);
```

#### Tabla: DetallesOrden

```sql
CREATE TABLE DetallesOrden (
    Id INT PRIMARY KEY IDENTITY(1,1),
    OrdenId INT NOT NULL,
    ProductoId INT NOT NULL,
    Cantidad INT NOT NULL,
    PrecioUnitario DECIMAL(18,2) NOT NULL,
    Subtotal DECIMAL(18,2) NOT NULL,
    FechaCreacion DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    CONSTRAINT FK_DetallesOrden_Ordenes 
        FOREIGN KEY (OrdenId) REFERENCES Ordenes(Id),
    CONSTRAINT FK_DetallesOrden_Productos 
        FOREIGN KEY (ProductoId) REFERENCES Productos(Id),
    
    INDEX IX_DetallesOrden_OrdenId (OrdenId),
    INDEX IX_DetallesOrden_ProductoId (ProductoId)
);
```

### 4.4 Datos de Prueba (Seed Data)

```sql
-- Categorías
INSERT INTO Categorias (Nombre, Descripcion) VALUES
('Alimento', 'Alimentos balanceados y premium'),
('Snacks', 'Premios y golosinas'),
('Juguetes', 'Juguetes interactivos y recreativos'),
('Accesorios', 'Collares, correas y accesorios'),
('Higiene', 'Productos de limpieza y cuidado'),
('Transporte', 'Jaulas y transportadoras'),
('Salud', 'Medicinas y suplementos');

-- Marcas
INSERT INTO Marcas (Nombre) VALUES
('Royal Canin'),
('Hills Science Diet'),
('Pro Plan'),
('Pedigree'),
('Whiskas'),
('Dog Chow'),
('Cat Chow');

-- Productos de ejemplo
INSERT INTO Productos 
(Nombre, Descripcion, Precio, Stock, CategoriaId, MarcaId, TipoMascota) VALUES
('Royal Canin Adult Dog', 
 'Alimento balanceado para perros adultos de todas las razas', 
 89000, 25, 1, 1, 'Perro'),
('Hills Science Diet Cat', 
 'Alimento premium para gatos adultos', 
 95000, 18, 1, 2, 'Gato'),
('Pro Plan Puppy', 
 'Alimento especial para cachorros en crecimiento', 
 75000, 30, 1, 3, 'Perro');

-- Usuario administrador de prueba
-- Contraseña: Admin123! (deberá ser hasheada en el backend)
INSERT INTO Usuarios (Email, Nombre, Rol, PasswordHash, PasswordSalt) VALUES
('admin@ventaspet.com', 'Administrador VentasPet', 'Admin', 
 'HASH_PLACEHOLDER', 'SALT_PLACEHOLDER');
```

---

## 5. Arquitectura del Backend .NET

### 5.1 Estructura de Proyecto Recomendada

```
VentasPetApi/
├── VentasPetApi.sln
├── VentasPetApi/
│   ├── Program.cs
│   ├── appsettings.json
│   ├── appsettings.Development.json
│   │
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── ProductosController.cs
│   │   ├── OrdenesController.cs
│   │   └── CategoriasController.cs
│   │
│   ├── Models/
│   │   ├── Entities/            # Entidades de base de datos
│   │   │   ├── Usuario.cs
│   │   │   ├── Producto.cs
│   │   │   ├── Orden.cs
│   │   │   ├── DetalleOrden.cs
│   │   │   ├── Categoria.cs
│   │   │   └── Marca.cs
│   │   │
│   │   └── DTOs/                # Data Transfer Objects
│   │       ├── Auth/
│   │       │   ├── LoginDto.cs
│   │       │   ├── RegisterDto.cs
│   │       │   └── UsuarioDto.cs
│   │       ├── Productos/
│   │       │   ├── ProductoDto.cs
│   │       │   └── CrearProductoDto.cs
│   │       └── Ordenes/
│   │           ├── OrdenDto.cs
│   │           └── CrearOrdenDto.cs
│   │
│   ├── Data/
│   │   ├── VentasPetDbContext.cs
│   │   └── Configurations/
│   │       ├── UsuarioConfiguration.cs
│   │       ├── ProductoConfiguration.cs
│   │       └── OrdenConfiguration.cs
│   │
│   ├── Services/
│   │   ├── Interfaces/
│   │   │   ├── IAuthService.cs
│   │   │   ├── IProductoService.cs
│   │   │   └── IOrdenService.cs
│   │   │
│   │   └── Implementations/
│   │       ├── AuthService.cs
│   │       ├── ProductoService.cs
│   │       └── OrdenService.cs
│   │
│   ├── Repositories/
│   │   ├── Interfaces/
│   │   │   ├── IGenericRepository.cs
│   │   │   ├── IUsuarioRepository.cs
│   │   │   └── IProductoRepository.cs
│   │   │
│   │   └── Implementations/
│   │       ├── GenericRepository.cs
│   │       ├── UsuarioRepository.cs
│   │       └── ProductoRepository.cs
│   │
│   ├── Middleware/
│   │   ├── ErrorHandlingMiddleware.cs
│   │   └── JwtMiddleware.cs
│   │
│   ├── Helpers/
│   │   ├── JwtHelper.cs
│   │   ├── PasswordHelper.cs
│   │   └── MappingProfiles.cs
│   │
│   └── Migrations/
│       └── (generadas por EF Core)
│
└── VentasPetApi.Tests/
    ├── Unit/
    └── Integration/
```

### 5.2 Configuración del Proyecto

#### Program.cs (ASP.NET Core 6+)

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using VentasPetApi.Data;
using VentasPetApi.Services.Interfaces;
using VentasPetApi.Services.Implementations;
using VentasPetApi.Repositories.Interfaces;
using VentasPetApi.Repositories.Implementations;

var builder = WebApplication.CreateBuilder(args);

// ========================================
// 1. CONFIGURACIÓN DE SERVICIOS
// ========================================

// Configurar Base de Datos
builder.Services.AddDbContext<VentasPetDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure()
    )
);

// Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("VentasPetPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3333")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configurar JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey)
        ),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// Configurar AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// Registrar Servicios
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProductoService, ProductoService>();
builder.Services.AddScoped<IOrdenService, OrdenService>();

// Registrar Repositorios
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IProductoRepository, ProductoRepository>();

// Configurar Controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null; // PascalCase
        options.JsonSerializerOptions.WriteIndented = true;
    });

// Configurar Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "VentasPet API",
        Version = "v1",
        Description = "API para sistema de ventas de productos para mascotas",
        Contact = new OpenApiContact
        {
            Name = "VentasPet Team",
            Email = "soporte@ventaspet.com"
        }
    });

    // Configurar JWT en Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using Bearer scheme. Ejemplo: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// ========================================
// 2. CONFIGURACIÓN DE MIDDLEWARE
// ========================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "VentasPet API v1");
        options.RoutePrefix = "swagger";
    });
}

app.UseHttpsRedirection();

app.UseCors("VentasPetPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// ========================================
// 3. INICIAR APLICACIÓN
// ========================================

app.Run();
```

#### appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=VentasPetDB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  },
  "Jwt": {
    "Key": "SUPER_SECRET_KEY_MINIMO_32_CARACTERES_CAMBIAR_EN_PRODUCCION",
    "Issuer": "VentasPetAPI",
    "Audience": "VentasPetClients",
    "ExpiryMinutes": 1440
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  },
  "AllowedHosts": "*"
}
```

### 5.3 Entidades del Modelo

#### Usuario.cs

```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VentasPetApi.Models.Entities
{
    [Table("Usuarios")]
    public class Usuario
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string PasswordSalt { get; set; } = string.Empty;

        [StringLength(50)]
        public string Rol { get; set; } = "Cliente";

        public bool Activo { get; set; } = true;

        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        public DateTime? FechaActualizacion { get; set; }

        public bool Eliminado { get; set; } = false;

        // Navegación
        public virtual ICollection<Orden> Ordenes { get; set; } = new List<Orden>();
    }
}
```

#### Producto.cs

```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VentasPetApi.Models.Entities
{
    [Table("Productos")]
    public class Producto
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Nombre { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Descripcion { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Precio { get; set; }

        [Required]
        public int Stock { get; set; } = 0;

        [Required]
        public int CategoriaId { get; set; }

        public int? MarcaId { get; set; }

        [StringLength(500)]
        public string? UrlImagen { get; set; }

        [StringLength(50)]
        public string? Peso { get; set; }

        [StringLength(50)]
        public string? TipoMascota { get; set; }

        public bool Activo { get; set; } = true;

        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        public DateTime? FechaActualizacion { get; set; }

        public bool Eliminado { get; set; } = false;

        // Navegación
        [ForeignKey("CategoriaId")]
        public virtual Categoria Categoria { get; set; } = null!;

        [ForeignKey("MarcaId")]
        public virtual Marca? Marca { get; set; }

        public virtual ICollection<DetalleOrden> DetallesOrden { get; set; } = new List<DetalleOrden>();
    }
}
```

#### Orden.cs

```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VentasPetApi.Models.Entities
{
    [Table("Ordenes")]
    public class Orden
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UsuarioId { get; set; }

        [Required]
        [StringLength(50)]
        public string NumeroOrden { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string EstadoOrden { get; set; } = "Pendiente";

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Total { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Subtotal { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Impuestos { get; set; } = 0;

        [Required]
        [StringLength(500)]
        public string DireccionEnvio { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Ciudad { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string CodigoPostal { get; set; } = string.Empty;

        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        public DateTime? FechaActualizacion { get; set; }

        public bool Eliminado { get; set; } = false;

        // Navegación
        [ForeignKey("UsuarioId")]
        public virtual Usuario Usuario { get; set; } = null!;

        public virtual ICollection<DetalleOrden> Detalles { get; set; } = new List<DetalleOrden>();
    }
}
```

### 5.4 Data Transfer Objects (DTOs)

#### LoginDto.cs

```csharp
using System.ComponentModel.DataAnnotations;

namespace VentasPetApi.Models.DTOs.Auth
{
    public class LoginDto
    {
        [Required(ErrorMessage = "El email es requerido")]
        [EmailAddress(ErrorMessage = "Email inválido")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es requerida")]
        [MinLength(6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres")]
        public string Password { get; set; } = string.Empty;
    }
}
```

#### ProductoDto.cs

```csharp
namespace VentasPetApi.Models.DTOs.Productos
{
    public class ProductoDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public decimal Precio { get; set; }
        public int Stock { get; set; }
        public string Categoria { get; set; } = string.Empty;
        public string? Marca { get; set; }
        public string? UrlImagen { get; set; }
        public string? TipoMascota { get; set; }
    }
}
```

### 5.5 Ejemplo de Controller

#### AuthController.cs

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VentasPetApi.Models.DTOs.Auth;
using VentasPetApi.Services.Interfaces;

namespace VentasPetApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// Registrar nuevo usuario
        /// </summary>
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            try
            {
                var result = await _authService.RegisterAsync(dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en registro de usuario");
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Iniciar sesión
        /// </summary>
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            try
            {
                var result = await _authService.LoginAsync(dto);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Intento de login fallido para: {Email}", dto.Email);
                return Unauthorized(new { message = "Credenciales inválidas" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en login");
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Obtener usuario actual autenticado
        /// </summary>
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                var userId = int.Parse(User.FindFirst("Id")?.Value ?? "0");
                var user = await _authService.GetUserByIdAsync(userId);
                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error obteniendo usuario actual");
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
```

---

## 6. Seguridad y Autenticación JWT

### 6.1 Flujo de Autenticación

```
┌─────────┐                  ┌─────────┐                  ┌──────────┐
│ Cliente │                  │   API   │                  │    DB    │
└────┬────┘                  └────┬────┘                  └────┬─────┘
     │                            │                            │
     │  POST /api/Auth/login      │                            │
     ├───────────────────────────>│                            │
     │  { email, password }       │                            │
     │                            │                            │
     │                            │  Buscar usuario por email  │
     │                            ├──────────────────────────>│
     │                            │                            │
     │                            │  Usuario encontrado        │
     │                            │<──────────────────────────┤
     │                            │                            │
     │                            │  Verificar password hash   │
     │                            │  con PasswordHelper        │
     │                            │                            │
     │                            │  Generar JWT Token         │
     │                            │  con claims del usuario    │
     │                            │                            │
     │  { token, user }           │                            │
     │<───────────────────────────┤                            │
     │                            │                            │
     │  Guardar token en          │                            │
     │  localStorage              │                            │
     │                            │                            │
     │  GET /api/Products         │                            │
     │  Header: Authorization:    │                            │
     │  Bearer {token}            │                            │
     ├───────────────────────────>│                            │
     │                            │                            │
     │                            │  Validar JWT Token         │
     │                            │  Extraer claims            │
     │                            │                            │
     │                            │  Consultar productos       │
     │                            ├──────────────────────────>│
     │                            │                            │
     │                            │  Productos                 │
     │                            │<──────────────────────────┤
     │                            │                            │
     │  Productos JSON            │                            │
     │<───────────────────────────┤                            │
     │                            │                            │
```

### 6.2 Implementación de JWT Helper

```csharp
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using VentasPetApi.Models.Entities;

namespace VentasPetApi.Helpers
{
    public class JwtHelper
    {
        private readonly IConfiguration _configuration;

        public JwtHelper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerarToken(Usuario usuario)
        {
            var jwtKey = _configuration["Jwt:Key"];
            var jwtIssuer = _configuration["Jwt:Issuer"];
            var jwtAudience = _configuration["Jwt:Audience"];
            var expiryMinutes = int.Parse(_configuration["Jwt:ExpiryMinutes"] ?? "1440");

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("Id", usuario.Id.ToString()),
                new Claim(ClaimTypes.Email, usuario.Email),
                new Claim(ClaimTypes.Name, usuario.Nombre),
                new Claim(ClaimTypes.Role, usuario.Rol),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public ClaimsPrincipal? ValidarToken(string token)
        {
            var jwtKey = _configuration["Jwt:Key"];
            var jwtIssuer = _configuration["Jwt:Issuer"];
            var jwtAudience = _configuration["Jwt:Audience"];

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(jwtKey!);

            try
            {
                var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = jwtIssuer,
                    ValidateAudience = true,
                    ValidAudience = jwtAudience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                return principal;
            }
            catch
            {
                return null;
            }
        }
    }
}
```

### 6.3 Password Hashing

```csharp
using System.Security.Cryptography;
using System.Text;

namespace VentasPetApi.Helpers
{
    public class PasswordHelper
    {
        public static (string hash, string salt) HashPassword(string password)
        {
            // Generar salt aleatorio
            var saltBytes = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(saltBytes);
            }
            var salt = Convert.ToBase64String(saltBytes);

            // Hash del password con el salt
            var hash = HashPasswordWithSalt(password, salt);

            return (hash, salt);
        }

        public static bool VerifyPassword(string password, string hash, string salt)
        {
            var hashToVerify = HashPasswordWithSalt(password, salt);
            return hash == hashToVerify;
        }

        private static string HashPasswordWithSalt(string password, string salt)
        {
            using var sha256 = SHA256.Create();
            var saltedPassword = password + salt;
            var bytes = Encoding.UTF8.GetBytes(saltedPassword);
            var hashBytes = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hashBytes);
        }
    }
}
```

### 6.4 Roles y Autorización

```csharp
// Ejemplo de uso de roles en Controllers

[Authorize(Roles = "Admin")]
[HttpDelete("productos/{id}")]
public async Task<IActionResult> EliminarProducto(int id)
{
    // Solo admins pueden eliminar productos
}

[Authorize] // Cualquier usuario autenticado
[HttpGet("ordenes")]
public async Task<IActionResult> ObtenerOrdenes()
{
    // Usuarios autenticados pueden ver sus ordenes
}

[AllowAnonymous] // Público
[HttpGet("productos")]
public async Task<IActionResult> ListarProductos()
{
    // Cualquiera puede ver productos
}
```

---

## 7. Convenciones y Estándares

### 7.1 Nomenclatura de Endpoints

**Seguir convenciones RESTful en español:**

```
GET     /api/Productos              # Listar todos los productos
GET     /api/Productos/{id}         # Obtener un producto
POST    /api/Productos              # Crear producto
PUT     /api/Productos/{id}         # Actualizar producto
DELETE  /api/Productos/{id}         # Eliminar producto

GET     /api/Ordenes                # Listar ordenes
POST    /api/Ordenes                # Crear orden
GET     /api/Ordenes/{id}           # Detalle de orden

POST    /api/Auth/login             # Login
POST    /api/Auth/register          # Registro
GET     /api/Auth/me                # Usuario actual
```

### 7.2 Respuestas Estándar

#### Éxito (200 OK)

```json
{
  "id": 1,
  "nombre": "Producto",
  "precio": 50000
}
```

#### Creación Exitosa (201 Created)

```json
{
  "id": 5,
  "mensaje": "Producto creado exitosamente"
}
```

#### Error de Validación (400 Bad Request)

```json
{
  "message": "Error de validación",
  "errors": {
    "Nombre": ["El nombre es requerido"],
    "Precio": ["El precio debe ser mayor a 0"]
  }
}
```

#### No Autorizado (401 Unauthorized)

```json
{
  "message": "Token inválido o expirado"
}
```

#### No Encontrado (404 Not Found)

```json
{
  "message": "Producto no encontrado"
}
```

### 7.3 Paginación

```csharp
public class PaginatedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalItems { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalItems / (double)PageSize);
    public bool HasPrevious => PageNumber > 1;
    public bool HasNext => PageNumber < TotalPages;
}

// Uso en endpoint
[HttpGet("productos")]
public async Task<IActionResult> GetProductos(
    [FromQuery] int pageNumber = 1,
    [FromQuery] int pageSize = 10)
{
    var result = await _productoService.GetPaginatedAsync(pageNumber, pageSize);
    return Ok(result);
}
```

---

## 8. Plan de Migración

### 8.1 Fases del Proyecto

#### **Fase 1: Preparación (Semana 1)**

- [ ] Crear proyecto .NET
- [ ] Configurar Entity Framework Core
- [ ] Crear scripts de base de datos
- [ ] Configurar JWT
- [ ] Configurar CORS
- [ ] Documentar con Swagger

#### **Fase 2: Desarrollo Core (Semanas 2-3)**

- [ ] Implementar modelos de entidades
- [ ] Crear repositorios genéricos
- [ ] Implementar AuthController y AuthService
- [ ] Implementar ProductosController
- [ ] Implementar OrdenesController
- [ ] Testing unitario básico

#### **Fase 3: Integración con Frontend (Semana 4)**

- [ ] Verificar compatibilidad de endpoints
- [ ] Ajustar respuestas JSON
- [ ] Testing de integración
- [ ] Verificar flujo completo de autenticación
- [ ] Verificar flujo de compra

#### **Fase 4: Migración de Datos (Semana 5)**

- [ ] Exportar datos del sistema anterior (si existe)
- [ ] Crear scripts de migración
- [ ] Validar integridad de datos
- [ ] Backup completo

#### **Fase 5: Testing y QA (Semana 6)**

- [ ] Testing de carga
- [ ] Testing de seguridad
- [ ] Testing end-to-end
- [ ] Corrección de bugs

#### **Fase 6: Despliegue (Semana 7)**

- [ ] Configurar ambiente de producción
- [ ] Configurar SSL/HTTPS
- [ ] Configurar logging
- [ ] Configurar monitoring
- [ ] Despliegue gradual
- [ ] Monitoreo post-despliegue

### 8.2 Estrategia de Testing

```csharp
// Ejemplo de Test Unitario (xUnit)

public class ProductoServiceTests
{
    [Fact]
    public async Task CrearProducto_ConDatosValidos_RetornaProductoCreado()
    {
        // Arrange
        var mockRepo = new Mock<IProductoRepository>();
        var service = new ProductoService(mockRepo.Object);
        
        var dto = new CrearProductoDto
        {
            Nombre = "Producto Test",
            Precio = 50000,
            Stock = 10
        };

        // Act
        var resultado = await service.CrearProductoAsync(dto);

        // Assert
        Assert.NotNull(resultado);
        Assert.Equal("Producto Test", resultado.Nombre);
        mockRepo.Verify(r => r.AddAsync(It.IsAny<Producto>()), Times.Once);
    }
}
```

### 8.3 Checklist de Pre-Deployment

- [ ] Todas las pruebas pasan
- [ ] Documentación actualizada
- [ ] Secrets configurados correctamente (no en código)
- [ ] HTTPS configurado
- [ ] CORS configurado para dominio de producción
- [ ] Logs configurados
- [ ] Backup de base de datos realizado
- [ ] Plan de rollback definido
- [ ] Monitoreo configurado

---

## 9. Riesgos y Mitigaciones

### 9.1 Riesgos Técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **Incompatibilidad de datos entre frontend y backend** | Media | Alto | - Validar exhaustivamente todos los endpoints<br>- Crear DTOs que coincidan con estructuras del frontend<br>- Testing de integración |
| **Problemas de CORS** | Alta | Medio | - Configurar CORS correctamente en Program.cs<br>- Probar en diferentes navegadores<br>- Documentar configuración |
| **Tokens JWT expirados** | Media | Medio | - Implementar refresh tokens<br>- Manejar errores 401 en frontend<br>- Notificar al usuario |
| **Performance de base de datos** | Baja | Alto | - Crear índices apropiados<br>- Usar paginación<br>- Implementar caching |
| **Pérdida de datos en migración** | Baja | Crítico | - Backups completos antes de migrar<br>- Probar migración en ambiente de prueba<br>- Validar integridad post-migración |

### 9.2 Riesgos de Negocio

| Riesgo | Mitigación |
|--------|------------|
| **Downtime durante migración** | - Migración gradual<br>- Ventana de mantenimiento programada<br>- Comunicación clara con usuarios |
| **Rechazo de usuarios a cambios** | - No cambiar interfaz de usuario<br>- Mantener compatibilidad total<br>- Documentar cambios |
| **Costos no previstos** | - Estimación detallada<br>- Buffer del 20% en presupuesto<br>- Revisiones periódicas |

### 9.3 Plan de Contingencia

**Si algo sale mal:**

1. **Rollback inmediato** al sistema anterior
2. **Análisis de causa raíz**
3. **Comunicación a stakeholders**
4. **Corrección y nueva fecha de deployment**

---

## 10. Próximos Pasos

### 10.1 Acciones Inmediatas

1. ✅ **Revisar este documento** con el equipo técnico
2. ⏳ **Aprobar arquitectura propuesta**
3. ⏳ **Asignar recursos** (desarrolladores, DB admin, QA)
4. ⏳ **Crear proyecto en Azure DevOps/GitHub Projects**
5. ⏳ **Configurar ambiente de desarrollo**

### 10.2 Métricas de Éxito

- ✅ Todos los endpoints del frontend funcionando
- ✅ Autenticación JWT implementada correctamente
- ✅ Tiempo de respuesta < 500ms para endpoints críticos
- ✅ 100% de tests unitarios pasando
- ✅ 0 errores en producción en primera semana
- ✅ Feedback positivo de usuarios

### 10.3 Recursos Adicionales

**Documentación:**
- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

**Herramientas:**
- Visual Studio 2022 / VS Code
- SQL Server Management Studio (SSMS)
- Postman / Swagger
- Git

---

## 📞 Contacto del Equipo

**Arquitecto de Software:** [Nombre]  
**Email:** arquitectura@ventaspet.com  
**Tech Lead:** [Nombre]  
**Email:** tech@ventaspet.com  

---

## 📄 Control de Versiones del Documento

| Versión | Fecha | Autor | Cambios |
|---------|-------|-------|---------|
| 1.0 | 2024-XX-XX | Equipo Arquitectura | Versión inicial |

---

**🐾 VentasPet - Todo para tu mascota en un solo lugar**

*Este documento es confidencial y propiedad de VentasPet*
