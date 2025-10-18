# 🚀 Guía Rápida - Importación de Productos CSV

## ⚡ Quick Start (3 Pasos)

### 1️⃣ Preprocesar CSV
```powershell
cd backend-config
.\preprocesar-csv.ps1
```

### 2️⃣ Validar
```powershell
.\test-importacion-csv.ps1
```

### 3️⃣ Importar
```powershell
.\importar-masivo.ps1
```

---

## 📋 Formato CSV Requerido

### Campos Obligatorios
- `NAME` - Nombre del producto
- `CATEGORIA` - Categoría (debe existir en BD)
- `PRICE` - Precio (formato: $20,400.00)

### Ejemplo Mínimo
```csv
NAME,CATEGORIA,PRICE,presentacion,stock
BR FOR CAT VET X 500 GR,Alimento para Gatos,$20400.00,500 GR,10
BR FOR CAT VET X 1.5 KG,Alimento para Gatos,$58200.00,1.5 KG,15
```

---

## 💡 Comandos Útiles

### Iniciar Backend
```powershell
cd backend-config
dotnet run
```

### Ver Logs del Backend
El backend muestra logs en consola automáticamente.

### Limpiar Productos de Prueba
```powershell
.\limpiar-productos-prueba.ps1
```

---

## ⚠️ Errores Comunes

### Error: "Categoría no encontrada"
**Solución:** Verificar categorías disponibles en la BD
```
GET http://localhost:5135/api/Productos/categorias
```

### Error: "Producto duplicado"
**Solución:** El producto ya existe. Use otro nombre o actualice manualmente.

### Error: "Precio inválido"
**Solución:** Ejecutar preprocesador antes de importar
```powershell
.\preprocesar-csv.ps1
```

### Error: "Conexión rechazada"
**Solución:** Asegurar que el backend está corriendo
```powershell
cd backend-config
dotnet run
```

---

## 📊 Formatos de Precio Soportados

| Formato | Ejemplo | ✅ Soportado |
|---------|---------|-------------|
| US con miles | $20,400.00 | ✅ |
| US sin miles | $20400.00 | ✅ |
| EU con miles | $20.400,00 | ✅ |
| EU sin miles | $20400,00 | ✅ |
| Simple | 20400 | ✅ |
| Euro | €15,99 | ✅ |

---

## 🔧 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| Backend no responde | `dotnet run` en backend-config |
| CSV con errores | Ejecutar `.\preprocesar-csv.ps1` |
| Caracteres raros | `chcp 65001` en PowerShell |
| Categoría inválida | Verificar nombre exacto en BD |
| Producto ya existe | Cambiar nombre o eliminar existente |

---

## 📞 Ayuda Adicional

Ver documentación completa: [SOLUCION_BUG_IMPORTACION_CSV.md](./SOLUCION_BUG_IMPORTACION_CSV.md)

---

**Tip:** Siempre ejecutar el preprocesador antes de importar para evitar errores de formato. 🎯
