# 🔧 Panel de Administración - VelyKapet

## Acceso al Panel Administrativo

Para acceder al panel de administración, tienes varias opciones:

### Opción 1: Agregar botón al Header (Recomendado)

Modifica el archivo `src/components/Header.js` y agrega un botón de administración:

```javascript
// Agregar después del botón de usuario/carrito
React.createElement('button',
    {
        onClick: () => window.setCurrentView('admin'),
        style: {
            padding: '8px 16px',
            background: '#FF6B35',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
        }
    },
    '🔧', 'Admin'
)
```

### Opción 2: URL Directa

Accede directamente escribiendo en la consola del navegador:
```javascript
window.setCurrentView('admin')
```

### Opción 3: Modificar la navegación del Dashboard

En el dashboard, puedes agregar un botón adicional en las acciones rápidas.

## Funcionalidades del Panel de Administración

### 📊 Dashboard
- Estadísticas de productos totales
- Productos con stock bajo
- Número de categorías
- Órdenes pendientes
- Acciones rápidas

### 📦 Gestión de Productos
- Ver tabla completa de productos
- Editar información de productos
- Eliminar productos
- Ver estado de stock
- Filtrar y buscar productos

### 📄 Importar Catálogos
- Subir archivos PDF, Excel o CSV
- Procesamiento automático de productos
- Extracción de datos inteligente
- Guardado automático en base de datos

## Formatos Soportados para Importación

### PDF
- Catálogos con texto seleccionable
- Extracción automática de nombres, precios y descripciones

### Excel (.xlsx, .xls)
- Formato recomendado:
  - Columna A: Nombre
  - Columna B: Precio
  - Columna C: Stock
  - Columna D: Marca
  - Columna E: Descripción

### CSV
- Separado por comas
- Primera fila con encabezados
- Campos: Nombre,Precio,Stock,Marca,Descripción

## Ejemplo de CSV para Importar

```csv
Nombre,Precio,Stock,Marca,Descripción
"Royal Canin Adult Dog",89000,25,"Royal Canin","Alimento balanceado para perros adultos"
"Hills Science Diet Cat",95000,18,"Hills","Alimento premium para gatos"
"Pro Plan Puppy",75000,30,"Pro Plan","Alimento especial para cachorros"
```

## Configuraciones del Sistema

### Categorías Disponibles
- Alimento
- Snacks
- Juguetes
- Accesorios
- Higiene
- Transporte
- Salud

### Tipos de Mascota
- Perros
- Gatos
- General

## Próximas Funcionalidades

- [ ] Editor de productos individual
- [ ] Gestión de categorías personalizadas
- [ ] Análisis de ventas
- [ ] Gestión de órdenes
- [ ] Configuración de tienda
- [ ] Backup y restauración
- [ ] Reportes avanzados

## Soporte Técnico

Si necesitas ayuda con el panel de administración:

1. Verifica que todos los scripts estén cargados correctamente
2. Revisa la consola del navegador para errores
3. Asegúrate de estar autenticado en el sistema

## Seguridad

- El panel requiere autenticación
- Se recomienda implementar roles de usuario
- Los archivos subidos se procesan de forma segura
- Validación de formatos de archivo