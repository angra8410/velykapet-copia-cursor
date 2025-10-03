// VentasPet - Transformador de URLs de Imágenes
// Convierte URLs de diferentes servicios (Google Drive, Dropbox, etc.) a formato directo

console.log('🖼️ Cargando Image URL Transformer...');

/**
 * Transforma URL de Google Drive de formato "compartir" a formato "directo"
 * @param {string} url - URL de Google Drive
 * @returns {string} URL directa para usar en <img src="">
 * 
 * @example
 * // Entrada: https://drive.google.com/file/d/1ABC123xyz/view?usp=sharing
 * // Salida: https://drive.google.com/uc?export=view&id=1ABC123xyz
 */
function transformGoogleDriveUrl(url) {
    if (!url || typeof url !== 'string') {
        return '';
    }
    
    // Si ya es una URL directa (formato uc?export=view), retornarla
    if (url.includes('drive.google.com/uc?')) {
        return url;
    }
    
    // Si es una URL de compartir (formato /file/d/ID/view), transformarla
    // Patrones soportados:
    // - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    // - https://drive.google.com/file/d/FILE_ID/view
    // - https://drive.google.com/open?id=FILE_ID
    
    let fileId = null;
    
    // Patrón 1: /file/d/FILE_ID/view
    const patternFileD = /\/file\/d\/([a-zA-Z0-9_-]+)/;
    const matchFileD = url.match(patternFileD);
    if (matchFileD && matchFileD[1]) {
        fileId = matchFileD[1];
    }
    
    // Patrón 2: open?id=FILE_ID
    if (!fileId) {
        const patternOpenId = /[?&]id=([a-zA-Z0-9_-]+)/;
        const matchOpenId = url.match(patternOpenId);
        if (matchOpenId && matchOpenId[1]) {
            fileId = matchOpenId[1];
        }
    }
    
    // Si encontramos el ID, construir URL directa
    if (fileId) {
        const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
        console.log(`📸 Google Drive URL transformada: ${fileId.substring(0, 10)}...`);
        return directUrl;
    }
    
    // Si no pudimos extraer el ID, retornar URL original
    console.warn('⚠️ No se pudo transformar URL de Google Drive:', url);
    return url;
}

/**
 * Transforma URL de Dropbox a formato directo
 * @param {string} url - URL de Dropbox
 * @returns {string} URL directa
 * 
 * @example
 * // Entrada: https://www.dropbox.com/s/abc123/image.jpg?dl=0
 * // Salida: https://www.dropbox.com/s/abc123/image.jpg?dl=1
 */
function transformDropboxUrl(url) {
    if (!url || typeof url !== 'string') {
        return '';
    }
    
    // Cambiar dl=0 a dl=1 para descarga directa
    if (url.includes('dropbox.com')) {
        if (url.includes('dl=0')) {
            return url.replace('dl=0', 'dl=1');
        }
        if (!url.includes('dl=')) {
            const separator = url.includes('?') ? '&' : '?';
            return `${url}${separator}dl=1`;
        }
    }
    
    return url;
}

/**
 * Transforma URL de OneDrive a formato directo
 * @param {string} url - URL de OneDrive
 * @returns {string} URL directa
 * 
 * @example
 * // OneDrive compartido
 */
function transformOneDriveUrl(url) {
    if (!url || typeof url !== 'string') {
        return '';
    }
    
    // OneDrive requiere transformación específica
    // https://onedrive.live.com/?cid=XXX&id=YYY → embed URL
    if (url.includes('onedrive.live.com') && !url.includes('/embed')) {
        // Agregar /embed para obtener vista directa
        return url.replace('onedrive.live.com/', 'onedrive.live.com/embed?');
    }
    
    return url;
}

/**
 * Agrega parámetros de optimización a URLs de CDN conocidos
 * @param {string} url - URL de CDN
 * @param {object} options - Opciones de optimización
 * @returns {string} URL con parámetros de optimización
 */
function addCdnOptimization(url, options = {}) {
    const {
        width = 800,
        height = 800,
        quality = 80,
        format = 'auto'
    } = options;
    
    // Cloudinary
    if (url.includes('cloudinary.com/')) {
        if (url.includes('/upload/')) {
            // Insertar transformaciones antes del nombre del archivo
            return url.replace(
                '/upload/',
                `/upload/w_${width},h_${height},c_fill,q_${quality},f_${format}/`
            );
        }
    }
    
    // Imgix
    if (url.includes('imgix.net')) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}w=${width}&h=${height}&q=${quality}&auto=${format}`;
    }
    
    // Amazon S3 con CloudFront (si usa parámetros de transformación)
    if (url.includes('cloudfront.net') || url.includes('s3.amazonaws.com')) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}w=${width}&h=${height}&q=${quality}`;
    }
    
    return url;
}

/**
 * Función principal: Transforma cualquier URL de imagen a formato directo
 * @param {string} url - URL original de la imagen
 * @param {object} options - Opciones de optimización (opcional)
 * @returns {string} URL transformada y optimizada
 * 
 * @example
 * const imageUrl = transformImageUrl('https://drive.google.com/file/d/1ABC/view');
 * // Resultado: 'https://drive.google.com/uc?export=view&id=1ABC'
 * 
 * @example
 * const optimizedUrl = transformImageUrl(
 *     'https://res.cloudinary.com/demo/image/upload/sample.jpg',
 *     { width: 400, quality: 90 }
 * );
 * // Resultado: URL con parámetros de optimización
 */
window.transformImageUrl = function(url, options = {}) {
    if (!url || typeof url !== 'string') {
        console.warn('⚠️ transformImageUrl: URL inválida', url);
        return '';
    }
    
    let transformedUrl = url;
    
    // Transformar según el servicio
    if (url.includes('drive.google.com')) {
        transformedUrl = transformGoogleDriveUrl(url);
    } else if (url.includes('dropbox.com')) {
        transformedUrl = transformDropboxUrl(url);
    } else if (url.includes('onedrive.live.com')) {
        transformedUrl = transformOneDriveUrl(url);
    }
    
    // Aplicar optimizaciones de CDN si corresponde
    if (options.width || options.height || options.quality) {
        transformedUrl = addCdnOptimization(transformedUrl, options);
    }
    
    return transformedUrl;
};

/**
 * Función helper: Obtener URL de imagen con fallback
 * @param {string} primaryUrl - URL principal
 * @param {string} fallbackUrl - URL de respaldo
 * @returns {string} URL a usar
 */
window.getImageUrlWithFallback = function(primaryUrl, fallbackUrl = '/images/placeholder-product.jpg') {
    const transformed = window.transformImageUrl(primaryUrl);
    return transformed || fallbackUrl;
};

/**
 * Función helper: Validar si una URL es de Google Drive
 * @param {string} url - URL a validar
 * @returns {boolean} true si es de Google Drive
 */
window.isGoogleDriveUrl = function(url) {
    return url && typeof url === 'string' && url.includes('drive.google.com');
};

/**
 * Función helper: Extraer ID de archivo de Google Drive
 * @param {string} url - URL de Google Drive
 * @returns {string|null} ID del archivo o null si no se encuentra
 */
window.extractGoogleDriveId = function(url) {
    if (!window.isGoogleDriveUrl(url)) {
        return null;
    }
    
    // Patrón /file/d/FILE_ID/
    const patternFileD = /\/file\/d\/([a-zA-Z0-9_-]+)/;
    const matchFileD = url.match(patternFileD);
    if (matchFileD && matchFileD[1]) {
        return matchFileD[1];
    }
    
    // Patrón ?id=FILE_ID o &id=FILE_ID
    const patternId = /[?&]id=([a-zA-Z0-9_-]+)/;
    const matchId = url.match(patternId);
    if (matchId && matchId[1]) {
        return matchId[1];
    }
    
    // Patrón uc?export=view&id=FILE_ID
    const patternUc = /uc\?export=view&id=([a-zA-Z0-9_-]+)/;
    const matchUc = url.match(patternUc);
    if (matchUc && matchUc[1]) {
        return matchUc[1];
    }
    
    return null;
};

// Exportar funciones para uso interno (si se necesita en módulos)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        transformImageUrl: window.transformImageUrl,
        transformGoogleDriveUrl,
        transformDropboxUrl,
        transformOneDriveUrl,
        getImageUrlWithFallback: window.getImageUrlWithFallback,
        isGoogleDriveUrl: window.isGoogleDriveUrl,
        extractGoogleDriveId: window.extractGoogleDriveId
    };
}

console.log('✅ Image URL Transformer cargado');
console.log('📋 Funciones disponibles:');
console.log('   - window.transformImageUrl(url, options)');
console.log('   - window.getImageUrlWithFallback(url, fallback)');
console.log('   - window.isGoogleDriveUrl(url)');
console.log('   - window.extractGoogleDriveId(url)');
