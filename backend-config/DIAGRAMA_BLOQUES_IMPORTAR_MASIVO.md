# 📊 Diagrama Visual de Bloques - importar-masivo.ps1

## 🎯 Estructura de Control Completa

```
importar-masivo.ps1
│
├── [Líneas 1-49] 📖 DOCUMENTACIÓN POWERSHELL HELP
│   ├── .SYNOPSIS
│   ├── .DESCRIPTION
│   ├── .NOTES
│   │   ├── Recomendaciones de herramientas
│   │   └── Estructura de bloques documentada
│   └── .EXAMPLE
│
├── [Líneas 51-55] ⚙️ CONFIGURACIÓN INICIAL
│   ├── $ApiUrl = "http://localhost:5135/api/Productos/ImportarCsv"
│   └── $CsvFile = "sample-products.csv"
│
├── [Líneas 57-65] 🔍 VALIDACIÓN DE PREREQUISITOS
│   └── if (-not (Test-Path $CsvFile)) {                    ← Llave #1 ABRE
│           Write-Host "Error..."
│           exit 1
│       }                                                    ← Llave #1 CIERRA
│
├── [Líneas 67-78] 🎨 BANNER DE INICIO
│   └── Write-Host (mensajes de bienvenida)
│
└── [Líneas 80-265] 🔄 BLOQUE PRINCIPAL TRY-CATCH
    │
    ├── try {                                                ← Llave #2 ABRE (nivel 1)
    │   │
    │   ├── [Líneas 89-105] 📦 PREPARACIÓN DEL ARCHIVO
    │   │   ├── $fileBin = [System.IO.File]::ReadAllBytes(...)
    │   │   ├── $boundary = [System.Guid]::NewGuid()
    │   │   └── $bodyLines = (...) -join $LF
    │   │
    │   ├── [Líneas 107-111] 🌐 ENVÍO HTTP POST
    │   │   └── $response = Invoke-WebRequest -Uri $ApiUrl ...
    │   │
    │   └── [Líneas 113-157] 📊 PROCESAMIENTO DE RESPUESTA
    │       │
    │       ├── [Líneas 119-157] 🔄 BLOQUE TRY-CATCH ANIDADO (Parsing JSON)
    │       │   │
    │       │   ├── try {                                    ← Llave #3 ABRE (nivel 2)
    │       │   │   │
    │       │   │   ├── $jsonObject = $response.Content | ConvertFrom-Json
    │       │   │   │
    │       │   │   └── if ($jsonObject.totalProcessed ...) { ← Llave #4 ABRE
    │       │   │       │
    │       │   │       ├── [Líneas 131-134] 🔄 NORMALIZACIÓN
    │       │   │       │   ├── $totalProcessed = if (...) {...} else {...}  ← Llaves #5,#6
    │       │   │       │   ├── $successCount = if (...) {...} else {...}    ← Llaves #7,#8
    │       │   │       │   └── $failureCount = if (...) {...} else {...}    ← Llaves #9,#10
    │       │   │       │       └── if ($failureCount -gt 0) {...} else {...} ← Llaves #11,#12
    │       │   │       │
    │       │   │       └── [Líneas 136-145] 📊 MOSTRAR RESUMEN
    │       │   │           └── Write-Host (múltiples líneas)
    │       │   │       }                                    ← Llave #4 CIERRA
    │       │   │       │
    │       │   │       else {                               ← Llave #13 ABRE
    │       │   │           Write-Host $response.Content
    │       │   │       }                                    ← Llave #13 CIERRA
    │       │   │   }                                        ← Llave #3 CIERRA (nivel 2)
    │       │   │   │
    │       │   │   catch {                                  ← Llave #14 ABRE (nivel 2)
    │       │   │       Write-Host $response.Content
    │       │   │   }                                        ← Llave #14 CIERRA (nivel 2)
    │       │   │
    │       └── [Fin del bloque try-catch anidado]
    │   }                                                    ← Llave #2 CIERRA (nivel 1)
    │   │
    └── catch {                                              ← Llave #15 ABRE (nivel 1)
        │
        ├── [Líneas 168-173] ❌ MENSAJE DE ERROR
        │   └── Write-Host "Error al realizar la petición: $_"
        │
        └── [Líneas 175-204] 💡 SUGERENCIAS CONTEXTUALES
            │
            └── if ($_.Exception.Response) {                 ← Llave #16 ABRE
                │
                ├── $statusCode = [int]$_.Exception.Response.StatusCode
                │
                └── switch ($statusCode) {                   ← Llave #17 ABRE
                    │
                    ├── 400 {                                ← Llave #18 ABRE
                    │       Write-Host "Revise el formato CSV"
                    │   }                                    ← Llave #18 CIERRA
                    │
                    ├── 404 {                                ← Llave #19 ABRE
                    │       Write-Host "Endpoint no encontrado"
                    │   }                                    ← Llave #19 CIERRA
                    │
                    └── default {                            ← Llave #20 ABRE
                            Write-Host "Código HTTP: $statusCode"
                        }                                    ← Llave #20 CIERRA
                    }                                        ← Llave #17 CIERRA
                }                                            ← Llave #16 CIERRA
                │
                else {                                       ← Llave #21 ABRE
                    Write-Host "Verifique que el backend esté ejecutándose"
                }                                            ← Llave #21 CIERRA
        }                                                    ← Llave #15 CIERRA (nivel 1)
```

---

## 📊 Tabla de Resumen de Bloques

| # | Tipo de Bloque | Línea Inicio | Línea Fin | Nivel | Propósito |
|---|----------------|--------------|-----------|-------|-----------|
| 1 | `if` | 62 | 65 | 0 | Validación de archivo CSV |
| 2 | `try` | 88 | 158 | 1 | Bloque principal de ejecución |
| 3 | `try` | 124 | 152 | 2 | Parsing de JSON (anidado) |
| 4 | `if` | 130 | 146 | 3 | Mostrar resumen si existe |
| 5-12 | `if/else` | 132-144 | - | 4 | Normalización inline (8 llaves) |
| 13 | `else` | 147 | 151 | 3 | Mostrar JSON completo |
| 14 | `catch` | 153 | 157 | 2 | Manejo de error JSON |
| 15 | `catch` | 159 | 205 | 1 | Manejo de error principal |
| 16 | `if` | 178 | 198 | 2 | Si hay respuesta HTTP |
| 17 | `switch` | 185 | 197 | 3 | Casos según código HTTP |
| 18 | `case 400` | 186 | 189 | 4 | Caso error 400 |
| 19 | `case 404` | 190 | 193 | 4 | Caso error 404 |
| 20 | `case default` | 194 | 196 | 4 | Caso por defecto |
| 21 | `else` | 199 | 204 | 2 | Sin respuesta HTTP |

**Total: 21 llaves de apertura + 21 llaves de cierre = 42 llaves totales** ✅

---

## 🎨 Diagrama de Flujo de Ejecución

```
                    ┌─────────────────────────┐
                    │   INICIO DEL SCRIPT     │
                    └──────────┬──────────────┘
                               │
                               ▼
                    ┌──────────────────────────┐
                    │ Configurar Variables     │
                    │ $ApiUrl, $CsvFile        │
                    └──────────┬───────────────┘
                               │
                               ▼
                    ┌──────────────────────────┐
                    │ ¿Existe archivo CSV?     │
                    └──────┬─────────┬─────────┘
                           │ NO      │ SÍ
                           ▼         ▼
                    ┌─────────┐  ┌─────────────────┐
                    │ Error   │  │ Mostrar Banner  │
                    │ exit 1  │  └────────┬────────┘
                    └─────────┘           │
                                          ▼
                           ┌──────────────────────────────┐
                           │ TRY Principal                │
                           └──────────┬───────────────────┘
                                      │
                        ┌─────────────┴─────────────┐
                        │                           │
                        ▼                           ▼
            ┌────────────────────┐      ┌──────────────────────┐
            │ Preparar archivo   │      │ CATCH Principal      │
            │ multipart/form-data│◄─────┤ Mostrar error        │
            └─────────┬──────────┘  ❌  │ Sugerencias          │
                      │                 └──────────────────────┘
                      ▼
            ┌────────────────────┐
            │ Enviar HTTP POST   │
            └─────────┬──────────┘
                      │
                      ▼
            ┌────────────────────┐
            │ ¿Éxito HTTP?       │
            └──────┬─────┬───────┘
                   │ NO  │ SÍ
                   │     ▼
                   │  ┌──────────────────────┐
                   │  │ TRY Anidado (JSON)   │
                   │  └──────┬─────┬─────────┘
                   │         │ ❌  │ ✅
                   │         │     │
                   │         ▼     ▼
                   │  ┌──────┐  ┌─────────────────┐
                   │  │CATCH │  │ ¿Hay resumen?   │
                   │  │JSON  │  └────┬─────┬──────┘
                   │  │      │       │ NO  │ SÍ
                   │  └──────┘       │     │
                   │                 ▼     ▼
                   │         ┌────────┐ ┌──────────┐
                   │         │ JSON   │ │ Mostrar  │
                   │         │completo│ │ resumen  │
                   │         └────────┘ └──────────┘
                   │
                   └─────────────────────┐
                                         │
                                         ▼
                              ┌──────────────────────┐
                              │ ¿Hay Response HTTP?  │
                              └────┬──────────┬──────┘
                                   │ NO       │ SÍ
                                   │          │
                                   ▼          ▼
                       ┌──────────────┐  ┌────────────────┐
                       │ Sugerencias  │  │ Switch HTTP    │
                       │ conexión     │  │ Status Code    │
                       │ backend      │  │ (400/404/etc)  │
                       └──────────────┘  └────────────────┘
                                         │
                                         ▼
                              ┌──────────────────────┐
                              │ Fin del script       │
                              └──────────────────────┘
```

---

## 🔍 Análisis de Profundidad de Anidamiento

```
Nivel 0 (Global):
├── Documentación
├── Configuración
├── if (validación CSV) ────────────────────────────────── Profundidad: 1
│
└── try-catch principal ────────────────────────────────── Profundidad: 1
    ├── try {
    │   ├── Preparación
    │   ├── HTTP POST
    │   └── try-catch anidado ──────────────────────────── Profundidad: 2
    │       ├── try {
    │       │   ├── Parse JSON
    │       │   └── if-else (resumen) ──────────────────── Profundidad: 3
    │       │       ├── if {
    │       │       │   ├── if-else (normalización) ────── Profundidad: 4
    │       │       │   │   └── if-else (color) ────────── Profundidad: 5 (MAX)
    │       │       │   └── Mostrar resumen
    │       │       │   }
    │       │       └── else {
    │       │           └── Mostrar JSON completo
    │       │           }
    │       │       }
    │       └── catch {
    │           └── Mostrar contenido sin formato
    │           }
    │   }
    └── catch {
        ├── Mensaje error
        └── if-else (tipo error) ───────────────────────── Profundidad: 2
            ├── if {
            │   └── switch (status codes) ──────────────── Profundidad: 3
            │       ├── 400 { } ────────────────────────── Profundidad: 4
            │       ├── 404 { }
            │       └── default { }
            │   }
            └── else {
                └── Sugerencias conexión
                }
        }
```

**Profundidad máxima de anidamiento**: 5 niveles ✅ (Aceptable, <6)

---

## 📈 Métricas de Complejidad

| Métrica | Valor | Estado | Recomendación |
|---------|-------|--------|---------------|
| Líneas totales | 247 | ✅ OK | < 500 líneas |
| Líneas de código | 99 | ✅ OK | < 300 líneas |
| Líneas de comentarios | 148 | ✅ Excelente | >40% del total |
| Bloques de control | 13 | ✅ OK | < 20 bloques |
| Profundidad máxima | 5 | ✅ OK | < 6 niveles |
| Try-catch anidados | 2 | ✅ OK | < 3 niveles |
| Llaves totales | 42 (21+21) | ✅ Balanceado | Debe ser par |
| Complejidad ciclomática | ~12 | ✅ OK | < 15 |

---

## 🎯 Puntos de Entrada y Salida

### Puntos de Entrada:
1. **Línea 1**: Inicio del script
2. **Línea 54**: Primera línea ejecutable (asignación $ApiUrl)

### Puntos de Salida:
1. **Línea 64**: `exit 1` (si no existe CSV) ❌ Salida de error
2. **Línea 210**: `Write-Host "Fin de la prueba"` ✅ Salida normal
3. **Línea 247**: Fin del archivo ✅ Salida implícita

### Flujos de Error:
- **Path 1**: CSV no existe → exit 1 (línea 64)
- **Path 2**: Error HTTP/Red → catch principal → sugerencias → fin normal
- **Path 3**: Error JSON parsing → catch anidado → mostrar texto plano → fin normal
- **Path 4**: Éxito completo → resumen o JSON → fin normal

---

## 💡 Recomendaciones de Lectura del Código

Para entender mejor el código, seguir este orden:

1. **Primero**: Leer la documentación (líneas 1-49)
2. **Segundo**: Ver el diagrama de estructura (este documento)
3. **Tercero**: Leer la configuración (líneas 51-55)
4. **Cuarto**: Entender la validación (líneas 57-65)
5. **Quinto**: Seguir el flujo try-catch principal (líneas 80-205)
6. **Sexto**: Estudiar el try-catch anidado (líneas 119-157)
7. **Séptimo**: Revisar el manejo de errores (líneas 159-205)
8. **Octavo**: Leer las notas finales (líneas 212-265)

---

## 🔗 Referencias Cruzadas

- **Script principal**: `importar-masivo.ps1`
- **Guía de validación**: `GUIA_VALIDACION_POWERSHELL.md`
- **Resumen de mejoras**: `RESUMEN_MEJORAS_IMPORTAR_MASIVO.md`
- **Este diagrama**: `DIAGRAMA_BLOQUES_IMPORTAR_MASIVO.md`

---

**Creado**: 2025-10-12  
**Versión del script**: 1.1  
**Propósito**: Documentación visual de la estructura de control
