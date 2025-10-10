# 🗺️ Diagrama de Modelo de Datos - Filtros Avanzados

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                      MODELO DE DATOS NORMALIZADO                             │
│                   Sistema de Filtros Avanzados VelyKaPet                     │
└──────────────────────────────────────────────────────────────────────────────┘

┏━━━━━━━━━━━━━━━━━━━━┓
┃   MascotaTipo      ┃
┣━━━━━━━━━━━━━━━━━━━━┫
┃ IdMascotaTipo (PK) ┃
┃ Nombre             ┃  ← "GATO", "PERRO"
┃ Activo             ┃
┗━━━━━━━━━━━━━━━━━━━━┛
         │
         │ 1:N
         ├──────────────────────────────┐
         │                              │
         ↓                              ↓
┏━━━━━━━━━━━━━━━━━━━━━━━┓      ┏━━━━━━━━━━━━━━━━━━━━━┓
┃  CategoriaAlimento    ┃      ┃     Productos       ┃
┣━━━━━━━━━━━━━━━━━━━━━━━┫      ┣━━━━━━━━━━━━━━━━━━━━━┫
┃ IdCategoriaAlimento(PK)┃     ┃ IdProducto (PK)     ┃
┃ Nombre                ┃      ┃ NombreBase          ┃
┃ IdMascotaTipo (FK)    ┃──┐   ┃ Descripcion         ┃
┃ Activa                ┃  │   ┃ URLImagen           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━┛  │   ┃ Activo              ┃
         │                  │   ┃                     ┃
         │ 1:N              │   ┃ IdMascotaTipo (FK) ─┼───┐
         ↓                  │   ┃ IdCategoriaAlimento ┃   │
┏━━━━━━━━━━━━━━━━━━━━━━━┓  │   ┃   (FK) ─────────────┼───┼───┐
┃ SubcategoriaAlimento  ┃  │   ┃ IdSubcategoria (FK)─┼───┼───┼───┐
┣━━━━━━━━━━━━━━━━━━━━━━━┫  │   ┃ IdPresentacion (FK)─┼───┼───┼───┼───┐
┃ IdSubcategoria (PK)   ┃  │   ┃                     ┃   │   │   │   │
┃ Nombre                ┃  │   ┃ // Campos antiguos  ┃   │   │   │   │
┃ IdCategoriaAlimento   ┃  │   ┃ IdCategoria (FK)    ┃   │   │   │   │
┃   (FK) ───────────────┼──┘   ┃ TipoMascota         ┃   │   │   │   │
┃ Activa                ┃      ┗━━━━━━━━━━━━━━━━━━━━━┛   │   │   │   │
┗━━━━━━━━━━━━━━━━━━━━━━━┛                                │   │   │   │
                                                         │   │   │   │
┏━━━━━━━━━━━━━━━━━━━━━━━┓                              │   │   │   │
┃ PresentacionEmpaque   ┃                              │   │   │   │
┣━━━━━━━━━━━━━━━━━━━━━━━┫                              │   │   │   │
┃ IdPresentacion (PK)   ┃ ←────────────────────────────┘   │   │   │
┃ Nombre                ┃  ← "BOLSA", "LATA", "SOBRE"      │   │   │
┃ Activa                ┃                                  │   │   │
┗━━━━━━━━━━━━━━━━━━━━━━━┛                                  │   │   │
                                                           │   │   │
           Relaciones:                                     │   │   │
           ═══════════                                     │   │   │
           MascotaTipo ←──────────────────────────────────┘   │   │
           CategoriaAlimento ←────────────────────────────────┘   │
           SubcategoriaAlimento ←─────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│                         EJEMPLO DE DATOS                                     │
└──────────────────────────────────────────────────────────────────────────────┘

MascotaTipo:
┌────┬────────┐
│ ID │ Nombre │
├────┼────────┤
│ 1  │ GATO   │
│ 2  │ PERRO  │
└────┴────────┘

CategoriaAlimento:
┌────┬──────────────────┬──────────────┐
│ ID │ Nombre           │ IdMascotaTipo│
├────┼──────────────────┼──────────────┤
│ 1  │ ALIMENTO SECO    │ 2 (PERRO)    │
│ 2  │ ALIMENTO SECO    │ 1 (GATO)     │
│ 3  │ ALIMENTO HÚMEDO  │ 2 (PERRO)    │
│ 4  │ ALIMENTO HÚMEDO  │ 1 (GATO)     │
│ 5  │ SNACKS Y PREMIOS │ NULL (AMBOS) │
└────┴──────────────────┴──────────────┘

SubcategoriaAlimento:
┌────┬──────────────────────┬──────────────────────┐
│ ID │ Nombre               │ IdCategoriaAlimento  │
├────┼──────────────────────┼──────────────────────┤
│ 1  │ DIETA SECA PRESCRITA │ 1 (ALIMENTO SECO-P)  │
│ 2  │ ADULT                │ 1 (ALIMENTO SECO-P)  │
│ 3  │ PUPPY                │ 1 (ALIMENTO SECO-P)  │
│ 4  │ SENIOR               │ 1 (ALIMENTO SECO-P)  │
│ 5  │ DIETA SECA PRESCRITA │ 2 (ALIMENTO SECO-G)  │
│ 6  │ ADULT                │ 2 (ALIMENTO SECO-G)  │
│ 7  │ KITTEN               │ 2 (ALIMENTO SECO-G)  │
│ 8  │ INDOOR               │ 2 (ALIMENTO SECO-G)  │
└────┴──────────────────────┴──────────────────────┘

PresentacionEmpaque:
┌────┬────────┐
│ ID │ Nombre │
├────┼────────┤
│ 1  │ BOLSA  │
│ 2  │ LATA   │
│ 3  │ SOBRE  │
│ 4  │ CAJA   │
│ 5  │ TUBO   │
└────┴────────┘

Productos (ejemplo):
┌────┬─────────────────────┬─────────┬────────────┬─────────┬───────────┐
│ ID │ NombreBase          │ Mascota │ Categoría  │ Subcat. │ Present.  │
├────┼─────────────────────┼─────────┼────────────┼─────────┼───────────┤
│ 1  │ Royal Canin Adult   │ 2(PERRO)│ 1(AL.SECO) │ 2(ADULT)│ 1(BOLSA)  │
│ 2  │ Churu Atún          │ 1(GATO) │ 5(SNACKS)  │13(SNACK)│ 3(SOBRE)  │
│ 3  │ Hill's Puppy        │ 2(PERRO)│ 1(AL.SECO) │ 3(PUPPY)│ 1(BOLSA)  │
│ 4  │ Purina Adult Cat    │ 1(GATO) │ 2(AL.SECO) │ 6(ADULT)│ 1(BOLSA)  │
└────┴─────────────────────┴─────────┴────────────┴─────────┴───────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│                      FLUJO DE FILTRADO EN CASCADA                            │
└──────────────────────────────────────────────────────────────────────────────┘

PASO 1: Usuario selecciona tipo de mascota
┌─────────────┐
│ Seleccionar │ → Usuario elige: GATO (IdMascotaTipo = 1)
│  Mascota    │
└─────────────┘
      ↓
GET /api/Productos/filtros/categorias-alimento?idMascotaTipo=1
      ↓
┌─────────────────────────────────────┐
│ Categorías disponibles para GATO:  │
│ - ALIMENTO SECO (Id=2)              │
│ - ALIMENTO HÚMEDO (Id=4)            │
│ - SNACKS Y PREMIOS (Id=5)           │
└─────────────────────────────────────┘

PASO 2: Usuario selecciona categoría de alimento
┌─────────────┐
│ Seleccionar │ → Usuario elige: ALIMENTO SECO (IdCategoriaAlimento = 2)
│  Categoría  │
└─────────────┘
      ↓
GET /api/Productos/filtros/subcategorias?idCategoriaAlimento=2
      ↓
┌─────────────────────────────────────┐
│ Subcategorías disponibles:          │
│ - DIETA SECA PRESCRITA (Id=5)       │
│ - ADULT (Id=6)                      │
│ - KITTEN (Id=7)                     │
│ - INDOOR (Id=8)                     │
└─────────────────────────────────────┘

PASO 3: Usuario selecciona subcategoría
┌─────────────┐
│ Seleccionar │ → Usuario elige: ADULT (IdSubcategoria = 6)
│Subcategoría │
└─────────────┘

PASO 4: Usuario selecciona presentación (opcional)
┌─────────────┐
│ Seleccionar │ → Usuario elige: BOLSA (IdPresentacion = 1)
│Presentación │
└─────────────┘

PASO 5: Buscar productos
GET /api/Productos?idMascotaTipo=1&idCategoriaAlimento=2&idSubcategoria=6&idPresentacion=1
      ↓
┌─────────────────────────────────────┐
│ Resultado:                          │
│ - Purina Pro Plan Adult Cat (BOLSA) │
└─────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│                           VENTAJAS DEL MODELO                                │
└──────────────────────────────────────────────────────────────────────────────┘

✅ NORMALIZACIÓN
   • Elimina redundancia de datos
   • Un solo lugar para actualizar categorías
   • Datos consistentes en toda la aplicación

✅ ESCALABILIDAD
   • Fácil agregar nuevas categorías sin modificar código
   • Nuevas subcategorías sin impacto en estructura
   • Presentaciones se gestionan independientemente

✅ INTEGRIDAD REFERENCIAL
   • Claves foráneas garantizan consistencia
   • No se pueden asignar valores inválidos
   • Base de datos valida las relaciones

✅ FLEXIBILIDAD
   • Filtros en cascada o independientes
   • Categorías pueden ser específicas o genéricas (NULL en IdMascotaTipo)
   • Permite múltiples dimensiones de búsqueda

✅ RENDIMIENTO
   • Índices en columnas de búsqueda
   • Consultas optimizadas con JOINS
   • Filtrado en servidor, no en cliente

✅ MANTENIBILIDAD
   • Código más limpio y organizado
   • Fácil de entender y mantener
   • Cambios centralizados en tablas maestras

✅ COMPATIBILIDAD
   • Campos antiguos se mantienen
   • Migración gradual posible
   • Sin breaking changes


┌──────────────────────────────────────────────────────────────────────────────┐
│                      COMPARACIÓN: ANTES vs DESPUÉS                           │
└──────────────────────────────────────────────────────────────────────────────┘

ANTES:
┌────────────────────────────────┐
│ Tabla Productos                │
├────────────────────────────────┤
│ - IdCategoria (FK) → "Alimento"│
│ - TipoMascota → "Gatos"        │
│                                │
│ Limitaciones:                  │
│ ❌ Solo 2 dimensiones          │
│ ❌ Texto libre (inconsistente) │
│ ❌ Difícil de escalar          │
│ ❌ Sin jerarquías              │
└────────────────────────────────┘

DESPUÉS:
┌────────────────────────────────┐
│ Sistema Normalizado            │
├────────────────────────────────┤
│ - MascotaTipo                  │
│ - CategoriaAlimento            │
│ - SubcategoriaAlimento         │
│ - PresentacionEmpaque          │
│                                │
│ Ventajas:                      │
│ ✅ 4+ dimensiones de filtrado │
│ ✅ Datos consistentes          │
│ ✅ Fácil de escalar            │
│ ✅ Jerarquías claras           │
│ ✅ Filtros en cascada          │
└────────────────────────────────┘


═════════════════════════════════════════════════════════════════════════════
Fecha: 9 de octubre de 2025
Versión: 1.0
Proyecto: VelyKaPet - Sistema de Filtros Avanzados
═════════════════════════════════════════════════════════════════════════════
```
