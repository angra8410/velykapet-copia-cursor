// VentasPet - Utilidades de Moneda Colombiana (COP)
// Funciones para formatear y manejar pesos colombianos

console.log('💰 Cargando utilidades de moneda colombiana...');

// ======================
// CONFIGURACIÓN DE MONEDA COLOMBIANA
// ======================

const CURRENCY_CONFIG = {
    currency: 'COP',
    locale: 'es-CO',
    symbol: '$',
    name: 'Peso Colombiano',
    decimals: 0, // Los pesos colombianos no usan decimales normalmente
    thousandSeparator: '.',
    decimalSeparator: ','
};

// ======================
// FUNCIONES DE FORMATEO
// ======================

/**
 * Formatea un número a pesos colombianos
 * @param {number} amount - Cantidad a formatear
 * @param {boolean} showDecimals - Si mostrar decimales (opcional)
 * @returns {string} - Cantidad formateada (ej: "$25.000")
 */
function formatCOP(amount, showDecimals = false) {
    if (typeof amount !== 'number' || isNaN(amount)) {
        return '$0';
    }

    // Redondear a entero si no se requieren decimales
    const roundedAmount = showDecimals ? amount : Math.round(amount);
    
    try {
        // Usar Intl.NumberFormat para formato colombiano
        const formatter = new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
            style: 'currency',
            currency: CURRENCY_CONFIG.currency,
            minimumFractionDigits: showDecimals ? 2 : 0,
            maximumFractionDigits: showDecimals ? 2 : 0
        });
        
        return formatter.format(roundedAmount);
    } catch (error) {
        // Fallback manual si Intl no está disponible
        console.warn('Usando formato manual para moneda:', error.message);
        return formatCOPManual(roundedAmount, showDecimals);
    }
}

/**
 * Formato manual de pesos colombianos (fallback)
 * @param {number} amount - Cantidad a formatear
 * @param {boolean} showDecimals - Si mostrar decimales
 * @returns {string} - Cantidad formateada
 */
function formatCOPManual(amount, showDecimals = false) {
    const roundedAmount = showDecimals ? amount : Math.round(amount);
    
    // Separar parte entera y decimal
    const parts = roundedAmount.toFixed(showDecimals ? 2 : 0).split('.');
    
    // Formatear parte entera con separadores de miles
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    // Construir resultado
    if (showDecimals && parts[1]) {
        return `$${parts[0]},${parts[1]}`;
    } else {
        return `$${parts[0]}`;
    }
}

/**
 * Formatea un número a pesos colombianos compactos
 * @param {number} amount - Cantidad a formatear
 * @returns {string} - Cantidad compacta (ej: "$25K", "$2.5M")
 */
function formatCOPCompact(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
        return '$0';
    }

    const roundedAmount = Math.round(amount);

    if (roundedAmount >= 1000000000) {
        return `$${(roundedAmount / 1000000000).toFixed(1)}MM`;
    } else if (roundedAmount >= 1000000) {
        return `$${(roundedAmount / 1000000).toFixed(1)}M`;
    } else if (roundedAmount >= 1000) {
        return `$${(roundedAmount / 1000).toFixed(1)}K`;
    } else {
        return `$${roundedAmount}`;
    }
}

/**
 * Convierte un string de pesos a número
 * @param {string} copString - String en formato COP (ej: "$25.000")
 * @returns {number} - Número convertido
 */
function parseCOP(copString) {
    if (typeof copString !== 'string') {
        return 0;
    }

    // Remover símbolos y separadores
    const cleaned = copString
        .replace(/[$\s]/g, '') // Quitar $ y espacios
        .replace(/\./g, '') // Quitar separadores de miles
        .replace(/,/g, '.'); // Convertir separador decimal

    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
}

/**
 * Valida si un string está en formato COP válido
 * @param {string} copString - String a validar
 * @returns {boolean} - Si es válido
 */
function isValidCOP(copString) {
    if (typeof copString !== 'string') {
        return false;
    }

    // Patrón para formato colombiano: $1.000 o $1.000,50
    const pattern = /^\$\d{1,3}(\.\d{3})*(\,\d{2})?$/;
    return pattern.test(copString.trim());
}

/**
 * Calcula el IVA colombiano (19%)
 * @param {number} amount - Cantidad base
 * @returns {number} - IVA calculado
 */
function calculateIVA(amount) {
    const IVA_RATE = 0.19; // 19% IVA en Colombia
    return Math.round(amount * IVA_RATE);
}

/**
 * Calcula el total con IVA incluido
 * @param {number} amount - Cantidad sin IVA
 * @returns {object} - {subtotal, iva, total}
 */
function calculateWithIVA(amount) {
    const subtotal = Math.round(amount);
    const iva = calculateIVA(subtotal);
    const total = subtotal + iva;

    return {
        subtotal,
        iva,
        total
    };
}

// ======================
// RANGOS DE PRECIOS COLOMBIANOS
// ======================

const PRICE_RANGES = {
    budget: { min: 0, max: 50000, label: 'Económico (hasta $50.000)' },
    medium: { min: 50000, max: 150000, label: 'Medio ($50.000 - $150.000)' },
    premium: { min: 150000, max: 500000, label: 'Premium ($150.000 - $500.000)' },
    luxury: { min: 500000, max: Infinity, label: 'Lujo (más de $500.000)' }
};

/**
 * Obtiene la categoría de precio para un producto
 * @param {number} price - Precio del producto
 * @returns {string} - Categoría de precio
 */
function getPriceCategory(price) {
    for (const [key, range] of Object.entries(PRICE_RANGES)) {
        if (price >= range.min && price < range.max) {
            return key;
        }
    }
    return 'budget';
}

// ======================
// EXPORTAR FUNCIONES GLOBALMENTE
// ======================

// Hacer disponible globalmente
window.CurrencyUtils = {
    formatCOP,
    formatCOPCompact,
    parseCOP,
    isValidCOP,
    calculateIVA,
    calculateWithIVA,
    getPriceCategory,
    PRICE_RANGES,
    CURRENCY_CONFIG
};

// Funciones directas para fácil acceso
window.formatCOP = formatCOP;
window.calculateIVA = calculateIVA;

console.log('✅ Utilidades de moneda colombiana cargadas');
console.log('💰 Configuración:', CURRENCY_CONFIG);
console.log('🧮 Funciones disponibles: formatCOP, calculateIVA, etc.');

// Ejemplos de uso para testing
if (typeof console !== 'undefined') {
    console.log('📝 Ejemplos de formato:');
    console.log('  $1234 →', formatCOP(1234));
    console.log('  $45000 →', formatCOP(45000));
    console.log('  $1234567 →', formatCOP(1234567));
    console.log('  IVA de $100000 →', formatCOP(calculateIVA(100000)));
}