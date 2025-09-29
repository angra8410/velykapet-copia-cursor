# Configuración de Ambientes en VentasPet

Este documento describe cómo configurar y utilizar los diferentes ambientes (desarrollo, producción, etc.) en la aplicación VentasPet.

## Estructura de Ambientes

La aplicación ahora soporta múltiples ambientes mediante archivos de configuración `.env`. Los archivos disponibles son:

- `.env`: Configuración por defecto
- `.env.development`: Configuración para desarrollo
- `.env.production`: Configuración para producción
- Puedes crear archivos adicionales como `.env.staging`, `.env.test`, etc.

## Variables de Entorno Disponibles

| Variable | Descripción | Ejemplo |
|----------|-------------|--------|
| `FRONTEND_PORT` | Puerto del servidor frontend | `3333` |
| `FRONTEND_HOST` | Host del servidor frontend | `localhost` |
| `BACKEND_PORT` | Puerto del servidor backend | `5135` |
| `BACKEND_HOST` | Host del servidor backend | `localhost` |
| `APP_ENV` | Nombre del ambiente | `development` |
| `APP_DEBUG` | Modo debug (true/false) | `true` |
| `API_URL` | URL completa de la API | `http://localhost:5135` |
| `FRONTEND_URL` | URL completa del frontend | `http://localhost:3333` |

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