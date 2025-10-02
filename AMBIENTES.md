# Configuración de Ambientes en VentasPet

Este documento describe cómo configurar y utilizar los diferentes ambientes (desarrollo, producción, etc.) en la aplicación VentasPet.

## Estructura de Ambientes

La aplicación ahora soporta múltiples ambientes mediante archivos de configuración `.env`. Los archivos disponibles son:

- `.env`: Configuración por defecto
- `.env.development`: Configuración para desarrollo
- `.env.production`: Configuración para producción
- Puedes crear archivos adicionales como `.env.staging`, `.env.test`, etc.

## Variables de Entorno Disponibles

| Variable | Descripción | Ejemplo | Notas |
|----------|-------------|---------|-------|
| `FRONTEND_PORT` | Puerto del servidor frontend | `3333` | Donde corre el proxy Node.js |
| `FRONTEND_HOST` | Host del servidor frontend | `localhost` | Usar `0.0.0.0` para acceso externo |
| `BACKEND_PORT` | Puerto del servidor backend | `5135` | Debe coincidir con appsettings.json |
| `BACKEND_HOST` | Host del servidor backend | `localhost` | En producción: dominio real |
| `APP_ENV` | Nombre del ambiente | `development` | Identificador del ambiente |
| `APP_DEBUG` | Modo debug (true/false) | `true` | Habilita logs detallados |
| `API_URL` | URL completa de la API | `http://localhost:5135` | ⚠️ Debe coincidir con configuración del backend |
| `FRONTEND_URL` | URL completa del frontend | `http://localhost:3333` | URL donde se accede al sitio |

⚠️ **IMPORTANTE:** 
- El puerto en `API_URL` debe coincidir con el puerto configurado en `backend-config/appsettings.Development.json`
- En desarrollo, se recomienda usar HTTP (no HTTPS) para evitar problemas con certificados
- Para más información sobre configuración de puertos, ver **[PORT_CONFIGURATION.md](./PORT_CONFIGURATION.md)**

## Scripts de Inicio

Se han creado varios scripts para facilitar el inicio de la aplicación en diferentes ambientes:

### Para Windows

- `start-dev.bat`: Inicia la aplicación en ambiente de desarrollo
- `start-prod.bat`: Inicia la aplicación en ambiente de producción
- `start-custom.bat [ambiente]`: Inicia la aplicación en un ambiente personalizado

### Ejemplos de Uso

```batch
# Iniciar en ambiente de desarrollo
start-dev.bat

# Iniciar en ambiente de producción
start-prod.bat

# Iniciar en ambiente personalizado
start-custom.bat staging
```

## Cómo Crear un Nuevo Ambiente

1. Crea un nuevo archivo `.env.[nombre_ambiente]` en la raíz del proyecto
2. Define las variables necesarias siguiendo el formato de los archivos existentes
3. Inicia la aplicación con `start-custom.bat [nombre_ambiente]`

## Notas Importantes

- Las variables definidas en los archivos específicos de ambiente tienen prioridad sobre las definidas en `.env`
- Si una variable no está definida en el archivo específico, se usará el valor de `.env`
- Para el ambiente de producción, asegúrate de configurar correctamente las URLs y puertos

## Solución de Problemas

- Si encuentras errores al iniciar, verifica que los archivos `.env` estén correctamente formateados
- Asegúrate de que los puertos especificados no estén siendo utilizados por otras aplicaciones
- Para depurar problemas, revisa los logs en la consola
- **Si experimentas ERR_CONNECTION_REFUSED:** Verifica que el puerto y protocolo en `API_URL` coincidan con la configuración del backend. Ver **[PORT_CONFIGURATION.md](./PORT_CONFIGURATION.md)** para guía completa.

### Configuración del Backend

El puerto del backend se configura en `backend-config/appsettings.Development.json`:

```json
{
  "Kestrel": {
    "Endpoints": {
      "Http": {
        "Url": "http://localhost:5135"
      }
    }
  }
}
```

**IMPORTANTE:** El puerto y protocolo (HTTP/HTTPS) configurado aquí **debe coincidir** con `API_URL` en el archivo `.env`.

**Ejemplo de configuración coherente:**

Si `appsettings.Development.json` tiene:
```json
"Url": "http://localhost:5135"
```

Entonces `.env.development` debe tener:
```bash
API_URL=http://localhost:5135
BACKEND_PORT=5135
```

Ver **[PORT_CONFIGURATION.md](./PORT_CONFIGURATION.md)** para más detalles sobre configuraciones de puertos y protocolos.