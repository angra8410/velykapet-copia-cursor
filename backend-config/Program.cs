using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using VentasPetApi.Data;
using VentasPetApi.Controllers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configurar Entity Framework con soporte para SQLite y SQL Server
var databaseProvider = builder.Configuration["DatabaseProvider"] ?? "SqlServer";
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

Console.WriteLine($"🔧 Configurando base de datos:");
Console.WriteLine($"   📌 Proveedor: {databaseProvider}");
Console.WriteLine($"   📌 Connection: {connectionString}");

builder.Services.AddDbContext<VentasPetDbContext>(options =>
{
    if (databaseProvider == "Sqlite")
    {
        options.UseSqlite(connectionString);
        Console.WriteLine("   ✅ Usando SQLite (ideal para desarrollo)");
    }
    else
    {
        options.UseSqlServer(connectionString);
        Console.WriteLine("   ✅ Usando SQL Server (ideal para producción)");
    }
});

// Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3333", "http://localhost:3000", "http://127.0.0.1:3333")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configurar JWT
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
        };
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "VelyKapet API", Version = "v1" });
    
    // Configurar JWT en Swagger
    c.AddSecurityDefinition("Bearer", new()
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme."
    });
    
    c.AddSecurityRequirement(new()
    {
        {
            new()
            {
                Reference = new()
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "VelyKapet API v1");
        c.RoutePrefix = string.Empty; // Swagger UI en la raíz
    });
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Crear la base de datos si no existe
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<VentasPetDbContext>();
    var dbProvider = builder.Configuration["DatabaseProvider"] ?? "SqlServer";
    
    try
    {
        Console.WriteLine($"📊 Inicializando base de datos ({dbProvider})...");
        context.Database.EnsureCreated();
        
        // Contar productos para verificar que hay datos
        var productCount = context.Productos.Count();
        Console.WriteLine($"✅ Base de datos inicializada exitosamente");
        Console.WriteLine($"   📦 Productos en DB: {productCount}");
        
        if (productCount == 0)
        {
            Console.WriteLine("   ⚠️  No hay productos en la base de datos. Se crearán con el seed data.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Error inicializando la base de datos: {ex.Message}");
        Console.WriteLine($"   💡 Sugerencia: Si estás usando SQL Server, verifica que:");
        Console.WriteLine($"      - SQL Server está instalado y corriendo");
        Console.WriteLine($"      - La cadena de conexión es correcta");
        Console.WriteLine($"   💡 Para desarrollo, considera usar SQLite:");
        Console.WriteLine($"      - Crea appsettings.Development.json");
        Console.WriteLine($"      - Configura DatabaseProvider: 'Sqlite'");
        Console.WriteLine($"      - Configura ConnectionString: 'Data Source=VentasPet.db'");
        Console.WriteLine($"   ⚠️  El API seguirá corriendo pero las peticiones fallarán sin base de datos.");
    }
}

// Obtener configuración de endpoints
var httpEndpoint = builder.Configuration["Kestrel:Endpoints:Http:Url"];
var httpsEndpoint = builder.Configuration["Kestrel:Endpoints:Https:Url"];
var apiUrl = httpEndpoint ?? httpsEndpoint ?? "http://localhost:5135";

Console.WriteLine("");
Console.WriteLine("═══════════════════════════════════════════════════════");
Console.WriteLine("🚀 VelyKapet API Backend");
Console.WriteLine("═══════════════════════════════════════════════════════");
Console.WriteLine($"   📡 API: {apiUrl}");
Console.WriteLine($"   📚 Swagger: {apiUrl}");
Console.WriteLine("   🔗 Frontend esperado: http://localhost:3333");
Console.WriteLine("");
Console.WriteLine("💡 Configuración actual:");
if (httpEndpoint != null)
    Console.WriteLine($"   ✅ HTTP: {httpEndpoint}");
if (httpsEndpoint != null)
    Console.WriteLine($"   ✅ HTTPS: {httpsEndpoint}");
Console.WriteLine($"   📦 Base de datos: {databaseProvider}");
Console.WriteLine("");
Console.WriteLine("⚠️  Para evitar ERR_CONNECTION_REFUSED en el frontend:");
Console.WriteLine($"   → Verificar que .env.development tenga: API_URL={apiUrl}");
Console.WriteLine("   → Ver PORT_CONFIGURATION.md para más información");
Console.WriteLine("═══════════════════════════════════════════════════════");
Console.WriteLine("");

app.Run();
