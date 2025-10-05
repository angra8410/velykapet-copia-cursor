# 🆘 SOLUCIÓN RÁPIDA: Tabla Productos Vacía

## El Problema

Ejecutaste `AddSampleProductImages.sql` y obtuviste:

```
IdProducto  NombreBase  URLImagen
----------- ----------- ---------
(0 rows affected)
```

## La Causa

**Tu tabla `Productos` está VACÍA.** No se puede actualizar lo que no existe.

## La Solución (3 Opciones)

### 🚀 Opción 1: Automático Todo-en-Uno (RECOMENDADO)

```bash
# Desde cmd o PowerShell en Windows
cd backend-config\Scripts
SetupCompleteDatabase.bat
```

✅ Esto hace TODO:
- Crea categorías
- Crea proveedores  
- Crea 5 productos
- Crea 15 variaciones
- Agrega URLs de imágenes R2

### ⚙️ Opción 2: Manual Paso a Paso

```bash
# Paso 1: Poblar productos
sqlcmd -S localhost -d VentasPet_Nueva -E -i backend-config/Scripts/SeedInitialProducts.sql

# Paso 2: Agregar imágenes
sqlcmd -S localhost -d VentasPet_Nueva -E -i backend-config/Scripts/AddSampleProductImages.sql
```

### 🔧 Opción 3: Entity Framework Migrations

```bash
cd backend-config
dotnet ef database update
```

## Verificar Que Funcionó

```bash
sqlcmd -S localhost -d VentasPet_Nueva -E -i backend-config/Scripts/VerifyDatabaseState.sql
```

Deberías ver:
```
Productos:               5
Productos con imágenes:  5 de 5
```

## Siguiente Paso

```bash
# 1. Iniciar backend
cd backend-config
dotnet run --urls="http://localhost:5135"

# 2. En otra terminal, iniciar frontend
npm start

# 3. Abrir navegador
# http://localhost:3333
```

## ¿Aún No Funciona?

Ver guía completa: `backend-config/Scripts/README_DATABASE_SETUP.md`

---

**TL;DR:** No puedes actualizar imágenes de productos que no existen. Primero crea los productos con `SeedInitialProducts.sql`, luego agrega imágenes con `AddSampleProductImages.sql`.
