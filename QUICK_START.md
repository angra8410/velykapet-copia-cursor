# 🚀 Guía de Inicio Rápido - VelyKapet

## TL;DR - Inicio Rápido

```bash
# Terminal 1 - Backend
cd backend-config
ASPNETCORE_ENVIRONMENT=Development dotnet run

# Terminal 2 - Frontend
NODE_ENV=development npm start

# Navegador
# Abrir: http://localhost:3333
```

## ✅ Verificación Rápida

### Backend funcionando:
```bash
curl http://localhost:5135/api/Productos
# Debe retornar JSON con productos
```

### Proxy funcionando:
```bash
curl http://localhost:3333/api/Productos
# Debe retornar JSON con productos
```

### Frontend funcionando:
- Abrir: http://localhost:3333
- Debe mostrar homepage con categorías
- Click en "Perrolandia" o "Gatolandia"
- Debe mostrar catálogo con productos

## 📋 Checklist de Verificación

- [ ] Backend corre en puerto 5135
- [ ] Frontend/Proxy corre en puerto 3333
- [ ] Base de datos SQLite creada (VentasPet.db)
- [ ] 5 productos cargados en la base de datos
- [ ] Endpoint /api/Productos responde 200 OK
- [ ] Frontend muestra productos en el catálogo
- [ ] Carrito funciona (agregar productos)

## 🔍 Logs Esperados

### Backend:
```
✅ Base de datos inicializada exitosamente
   📦 Productos en DB: 5
Now listening on: http://localhost:5135
```

### Frontend:
```
🌐 Servidor corriendo en http://localhost:3333
🔀 Proxy configurado para backend en http://localhost:5135
```

### Consola del Navegador:
```
✅ Productos mapeados: 5
📦 Primer producto con variaciones: {...}
```

## ⚠️ Si algo falla

1. **Backend no inicia:**
   - Verificar que .NET 8.0 esté instalado
   - Verificar puerto 5135 esté libre
   - Usar: `ASPNETCORE_ENVIRONMENT=Development`

2. **Frontend no conecta:**
   - Verificar que el backend esté corriendo
   - Verificar puerto 3333 esté libre
   - Revisar logs del proxy

3. **Error 500:**
   - Ver `TROUBLESHOOTING_API.md`
   - Verificar logs del backend
   - Verificar base de datos SQLite

## 📚 Más Información

- Verificación completa: `VERIFICACION_ERROR_500_COMPLETA.md`
- Troubleshooting: `TROUBLESHOOTING_API.md`
- Solución original: `SOLUCION_ERROR_500.md`
