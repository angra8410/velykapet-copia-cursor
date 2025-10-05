/**
 * ============================================================================
 * Script Node.js: Validación HTTP de Imágenes en Cloudflare R2
 * ============================================================================
 * Proyecto: VelyKapet E-commerce
 * Fecha: Enero 2025
 * Objetivo: Validar que las URLs de imágenes en R2 sean accesibles vía HTTP
 *
 * REQUISITOS:
 * - Node.js 14 o superior
 * - npm install mssql node-fetch
 * - Acceso a SQL Server con la base de datos VentasPet_Nueva
 * - Conexión a Internet para verificar URLs de R2
 *
 * USO:
 * node validate-r2-images.js
 * node validate-r2-images.js --export-json
 * node validate-r2-images.js --verbose
 * ============================================================================
 */

const sql = require('mssql');
const fetch = require('node-fetch');
const fs = require('fs').promises;

// Configuración
const config = {
    server: 'localhost',
    database: 'VentasPet_Nueva',
    options: {
        trustedConnection: true,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

// Colores para consola
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m'
};

// Función helper para logs con color
function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

// Función para formatear tamaño de archivo
function formatFileSize(bytes) {
    if (bytes >= 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } else if (bytes >= 1024) {
        return `${(bytes / 1024).toFixed(2)} KB`;
    } else {
        return `${bytes} bytes`;
    }
}

// Función para validar accesibilidad de una URL
async function validateImageUrl(url, timeout = 10000) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        return {
            success: response.ok,
            statusCode: response.status,
            contentType: response.headers.get('content-type'),
            contentLength: parseInt(response.headers.get('content-length') || '0'),
            cacheStatus: response.headers.get('cf-cache-status'),
            errorMessage: response.ok ? null : `HTTP ${response.status} ${response.statusText}`
        };
    } catch (error) {
        return {
            success: false,
            statusCode: 0,
            contentType: null,
            contentLength: 0,
            cacheStatus: null,
            errorMessage: error.message
        };
    }
}

// Función principal
async function main() {
    log('\n╔════════════════════════════════════════════════════════════════════════╗', colors.cyan);
    log('║  🔍 VALIDACIÓN HTTP DE IMÁGENES EN CLOUDFLARE R2                     ║', colors.cyan);
    log('║  Verificando accesibilidad de URLs en producción                      ║', colors.cyan);
    log('╚════════════════════════════════════════════════════════════════════════╝\n', colors.cyan);

    let pool;

    try {
        // Conectar a SQL Server
        log('📡 Conectando a SQL Server...', colors.cyan);
        log(`   Servidor: ${config.server}`, colors.gray);
        log(`   Base de datos: ${config.database}\n`, colors.gray);

        pool = await sql.connect(config);
        log('   ✅ Conexión establecida exitosamente\n', colors.green);

        // Obtener URLs de productos
        log('📋 Obteniendo URLs de productos...', colors.cyan);

        const result = await pool.request().query(`
            SELECT 
                p.IdProducto,
                p.NombreBase,
                p.TipoMascota,
                p.URLImagen,
                p.Activo
            FROM Productos p
            WHERE p.URLImagen IS NOT NULL 
              AND p.URLImagen != ''
              AND p.URLImagen LIKE 'https://www.velykapet.com/%'
            ORDER BY p.IdProducto;
        `);

        const productos = result.recordset;
        log(`   ✅ ${productos.length} productos encontrados con URLs de R2\n`, colors.green);

        if (productos.length === 0) {
            log('⚠️  No se encontraron productos con URLs de R2 para validar\n', colors.yellow);
            await pool.close();
            return;
        }

        // Validar cada URL
        log(`🔍 Validando accesibilidad de ${productos.length} URLs...\n`, colors.cyan);
        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        const resultados = [];
        let productosValidos = 0;
        let productosInvalidos = 0;

        for (let i = 0; i < productos.length; i++) {
            const producto = productos[i];
            const contador = i + 1;

            // Mostrar progreso
            process.stdout.write(`\r   Validando... ${contador}/${productos.length} (${Math.round((contador / productos.length) * 100)}%)`);

            // Validar URL
            const validacion = await validateImageUrl(producto.URLImagen);

            // Crear objeto de resultado
            const resultado = {
                idProducto: producto.IdProducto,
                nombreBase: producto.NombreBase,
                tipoMascota: producto.TipoMascota,
                url: producto.URLImagen,
                accesible: validacion.success,
                statusCode: validacion.statusCode,
                contentType: validacion.contentType,
                tamanoArchivo: validacion.contentLength > 0 ? formatFileSize(validacion.contentLength) : 'Desconocido',
                tamanoBytes: validacion.contentLength,
                cacheStatus: validacion.cacheStatus,
                errorMessage: validacion.errorMessage,
                activo: producto.Activo
            };

            resultados.push(resultado);

            // Actualizar contadores
            if (validacion.success) {
                productosValidos++;
            } else {
                productosInvalidos++;
            }
        }

        // Limpiar línea de progreso
        console.log('\n');

        // Mostrar resultados detallados
        log('\n📊 RESULTADOS DETALLADOS:\n', colors.cyan);

        resultados.forEach((resultado, index) => {
            const numero = `[${index + 1}/${resultados.length}]`;

            if (resultado.accesible) {
                log(`   ✅ ${numero} ID ${resultado.idProducto} - ${resultado.nombreBase}`, colors.green);
                log(`      URL: ${resultado.url}`, colors.gray);
                log(`      Tamaño: ${resultado.tamanoArchivo}, Tipo: ${resultado.contentType}`, colors.gray);
                if (resultado.cacheStatus) {
                    log(`      Cache: ${resultado.cacheStatus}`, colors.gray);
                }
                console.log('');
            } else if (resultado.statusCode === 404) {
                log(`   ❌ ${numero} ID ${resultado.idProducto} - ${resultado.nombreBase}`, colors.red);
                log(`      URL: ${resultado.url}`, colors.gray);
                log(`      Error: Imagen no encontrada (404 Not Found)`, colors.red);
                console.log('');
            } else {
                log(`   ⚠️  ${numero} ID ${resultado.idProducto} - ${resultado.nombreBase}`, colors.yellow);
                log(`      URL: ${resultado.url}`, colors.gray);
                log(`      Error: ${resultado.errorMessage}`, colors.yellow);
                console.log('');
            }
        });

        // Resumen
        log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        log('📊 RESUMEN DE VALIDACIÓN\n', colors.cyan);

        const totalProductos = resultados.length;
        const porcentajeValidos = ((productosValidos / totalProductos) * 100).toFixed(2);
        const porcentajeInvalidos = ((productosInvalidos / totalProductos) * 100).toFixed(2);

        log(`   Total de productos:        ${totalProductos}`);
        log(`   ✅ Imágenes accesibles:    ${productosValidos} (${porcentajeValidos}%)`, colors.green);
        log(`   ❌ Imágenes no accesibles: ${productosInvalidos} (${porcentajeInvalidos}%)`, 
            productosInvalidos === 0 ? colors.green : colors.red);

        // Estado general
        console.log('\n   Estado general: ', { end: '' });
        if (productosInvalidos === 0) {
            log('✅ EXCELENTE - Todas las imágenes son accesibles', colors.green);
        } else if (porcentajeValidos >= 80) {
            log('✅ BUENO - La mayoría de las imágenes son accesibles', colors.green);
        } else if (porcentajeValidos >= 50) {
            log('⚠️  REGULAR - Muchas imágenes requieren atención', colors.yellow);
        } else {
            log('❌ CRÍTICO - La mayoría de las imágenes no son accesibles', colors.red);
        }

        // Estadísticas adicionales
        const tamanoTotal = resultados.reduce((sum, r) => sum + r.tamanoBytes, 0);
        if (tamanoTotal > 0) {
            log(`\n   Tamaño total de imágenes: ${formatFileSize(tamanoTotal)}`, colors.gray);
        }

        // Recomendaciones
        if (productosInvalidos > 0) {
            log('\n📌 RECOMENDACIONES:\n', colors.cyan);

            const productos404 = resultados.filter(r => r.statusCode === 404);
            if (productos404.length > 0) {
                log('   1. Subir las siguientes imágenes a Cloudflare R2:', colors.yellow);
                productos404.forEach(p => {
                    const nombreArchivo = p.url.split('/').pop();
                    log(`      - ${nombreArchivo} (Producto: ${p.nombreBase})`, colors.gray);
                });
                console.log('');
            }

            log('   2. Verificar que las imágenes tengan los nombres correctos en R2');
            log('   3. Revisar configuración de CORS en Cloudflare R2');
            log('   4. Verificar permisos públicos del bucket R2\n');
        }

        // Exportar JSON si se solicita
        if (process.argv.includes('--export-json')) {
            const reportPath = './r2-image-validation-report.json';
            const report = {
                fecha: new Date().toISOString(),
                servidor: config.server,
                baseDatos: config.database,
                resumen: {
                    total: totalProductos,
                    validos: productosValidos,
                    invalidos: productosInvalidos,
                    porcentajeValidos: parseFloat(porcentajeValidos),
                    porcentajeInvalidos: parseFloat(porcentajeInvalidos),
                    tamanoTotal: formatFileSize(tamanoTotal)
                },
                productos: resultados
            };

            await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');
            log(`📄 Reporte JSON exportado a: ${reportPath}\n`, colors.green);
        }

        // Lista de URLs para validación manual
        if (process.argv.includes('--export-urls')) {
            const urlsPath = './r2-image-urls.txt';
            const urls = resultados.map(r => r.url).join('\n');
            await fs.writeFile(urlsPath, urls, 'utf8');
            log(`📄 Lista de URLs exportada a: ${urlsPath}\n`, colors.green);
        }

        // Cerrar conexión
        await pool.close();

        log('\n╔════════════════════════════════════════════════════════════════════════╗', colors.cyan);
        log('║  ✅ VALIDACIÓN COMPLETADA                                             ║', colors.cyan);
        log('╚════════════════════════════════════════════════════════════════════════╝\n', colors.cyan);

        // Exit code basado en resultados
        process.exit(productosInvalidos > 0 ? 1 : 0);

    } catch (error) {
        log(`\n❌ Error: ${error.message}\n`, colors.red);
        console.error(error);

        if (pool) {
            await pool.close();
        }

        process.exit(1);
    }
}

// Ejecutar si es el módulo principal
if (require.main === module) {
    main().catch(error => {
        log(`\n❌ Error fatal: ${error.message}\n`, colors.red);
        console.error(error);
        process.exit(1);
    });
}

module.exports = { validateImageUrl, formatFileSize };
