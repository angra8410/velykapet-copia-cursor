# Scripts de Prueba para el Endpoint POST /api/Productos

## Descripción

Estos scripts demuestran el uso correcto del endpoint `POST /api/Productos` y los errores comunes que pueden ocurrir al integrarse con él.

## Scripts Disponibles

### 1. `test-crear-producto.ps1` (PowerShell)

**Para:** Windows con PowerShell

**Uso:**
```powershell
cd backend-config
.\test-crear-producto.ps1
```

### 2. `test-crear-producto.sh` (Bash)

**Para:** Linux, macOS, WSL, Git Bash

**Uso:**
```bash
cd backend-config
chmod +x test-crear-producto.sh  # Solo la primera vez
./test-crear-producto.sh
```

## Prerequisitos

1. **Backend debe estar corriendo:**
   ```bash
   cd backend-config
   dotnet run
   ```
   El backend debe estar disponible en `http://localhost:5000`

2. **Base de datos configurada:**
   - El backend debe tener acceso a la base de datos
   - Las tablas maestras deben estar pobladas (categorías, tipos de mascota, etc.)

## Qué Testean los Scripts

Los scripts ejecutan 4 tests diferentes:

### ✅ Test 1: Request CORRECTO
- **Propósito:** Demostrar el formato correcto esperado por el endpoint
- **Resultado esperado:** `201 Created` o `200 OK`
- **Ejemplo de uso:** Este es el formato que debes usar en producción

### ❌ Test 2: Request INCORRECTO - Wrapper 'productoDto'
- **Propósito:** Demostrar el error común de envolver el JSON en `{ "productoDto": {...} }`
- **Resultado esperado:** `400 Bad Request`
- **Error esperado:** `"The productoDto field is required"`
- **Lección:** No uses wrappers, envía el JSON directamente

### ❌ Test 3: Request INCORRECTO - Tipos de datos
- **Propósito:** Demostrar qué pasa cuando se envían números como strings
- **Resultado esperado:** `400 Bad Request` o conversión automática
- **Lección:** Usa tipos correctos (números sin comillas para integers y decimals)

### ❌ Test 4: Request INCORRECTO - Sin variaciones
- **Propósito:** Demostrar que el array de variaciones no puede estar vacío
- **Resultado esperado:** `400 Bad Request`
- **Error esperado:** `"Debe incluir al menos una variación"`
- **Lección:** Siempre incluye al menos una variación

## Salida Esperada

Los scripts producen una salida coloreada que muestra:
- ✅ Tests exitosos en verde
- ❌ Tests fallidos esperados en amarillo
- ❌ Errores inesperados en rojo
- 💡 Soluciones sugeridas en cyan

Ejemplo:
```
═══════════════════════════════════════════════════════
🧪 Test del Endpoint POST /api/Productos
═══════════════════════════════════════════════════════

📝 Test 1: Request CORRECTO
   Este es el formato esperado por el endpoint

Request body:
{
  "nombreBase": "Test Producto PowerShell",
  ...
}

Enviando request...
✅ SUCCESS - Producto creado exitosamente
   ID Producto: 42
   Nombre: Test Producto PowerShell
   Variaciones creadas: 2
      - 500 GR: $15000 (Stock: 10)
      - 1 KG: $28000 (Stock: 5)

───────────────────────────────────────────────────────

📝 Test 2: Request INCORRECTO - Usando wrapper 'productoDto'
   ❌ Este formato NO es soportado y causará error 400
...
```

## Documentación Relacionada

Para más información sobre el endpoint, consulta:
- **Documentación completa:** `API_ENDPOINT_CREAR_PRODUCTO.md`
- **Sección de Troubleshooting:** Ver sección "🔧 Troubleshooting - Errores Comunes"
- **Ejemplos de integración:** Ver secciones de PowerShell, cURL y Postman

## Notas

- Los scripts NO eliminan los productos creados durante las pruebas
- Si el Test 1 es exitoso, se creará un producto de prueba en la base de datos
- Puedes modificar los scripts para usar diferentes datos de prueba
- Los scripts asumen que el backend está en `http://localhost:5000` (puedes cambiar la variable `BASE_URL` o `$baseUrl`)

## Troubleshooting

### Error: "Connection refused" o "No such host"
- **Causa:** El backend no está corriendo o está en un puerto diferente
- **Solución:** Inicia el backend con `dotnet run` en la carpeta `backend-config`

### Error: "Categoría inválida" o "Tipo de mascota inválido"
- **Causa:** La base de datos no tiene las entidades maestras necesarias
- **Solución:** Ejecuta las migraciones o verifica que el seed data se haya ejecutado

### Todos los tests fallan con 500
- **Causa:** Error en el backend (base de datos no disponible, configuración incorrecta, etc.)
- **Solución:** Revisa los logs del backend en la consola donde está corriendo

## Personalización

Puedes personalizar los scripts modificando:
- `$baseUrl` o `BASE_URL`: Para cambiar el endpoint del backend
- Los cuerpos JSON de los tests: Para probar con diferentes datos
- Agregar más tests: Copia y pega un test existente y modifica según necesites
