/**
 * Módulo para cargar variables de entorno
 * Este módulo permite cargar configuraciones según el ambiente (development, production)
 */

const fs = require('fs');
const path = require('path');

// Función para parsear un archivo .env
function parseEnvFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ Archivo no encontrado: ${filePath}`);
      return {};
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const env = {};

    content.split('\n').forEach(line => {
      // Ignorar comentarios y líneas vacías
      if (!line || line.trim() === '' || line.trim().startsWith('#')) {
        return;
      }

      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        // Unir el resto en caso de que el valor contenga signos =
        const value = parts.slice(1).join('=').trim();
        if (key && value) {
          env[key] = value;
        }
      }
    });

    return env;
  } catch (error) {
    console.error(`❌ Error al parsear archivo ${filePath}:`, error.message);
    return {};
  }
}

// Cargar variables de entorno según el ambiente
function loadEnv(environment) {
  try {
    // Ambiente por defecto: development
    const env = environment || process.env.NODE_ENV || 'development';
    console.log(`🌍 Cargando configuración para ambiente: ${env}`);

    // Cargar archivo .env por defecto
    const defaultEnvPath = path.join(__dirname, '.env');
    const defaultEnv = parseEnvFile(defaultEnvPath);
    console.log(`✅ Configuración base cargada de: ${defaultEnvPath}`);

    // Cargar archivo .env específico del ambiente
    const envFilePath = path.join(__dirname, `.env.${env}`);
    const specificEnv = parseEnvFile(envFilePath);
    
    if (Object.keys(specificEnv).length > 0) {
      console.log(`✅ Configuración específica cargada de: ${envFilePath}`);
    }

    // Combinar configuraciones (las específicas tienen prioridad)
    const config = { ...defaultEnv, ...specificEnv };

    // Establecer variables en process.env
    Object.keys(config).forEach(key => {
      process.env[key] = config[key];
    });

    return config;
  } catch (error) {
    console.error('❌ Error al cargar configuración:', error.message);
    return {};
  }
}

module.exports = { loadEnv };