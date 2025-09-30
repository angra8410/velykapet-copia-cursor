# 🐾 VelyKapet - Tienda de Mascotas

[![Status](https://img.shields.io/badge/Status-Active-success.svg)](https://github.com/angra8410/velykapet)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)](https://github.com/angra8410/velykapet)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**VelyKapet** es una moderna tienda en línea especializada en productos para mascotas, desarrollada con React puro y diseño responsive.

## ✨ Características

### 🎨 **Diseño Moderno**
- **Header Elegante**: Logo prominente con esquema de colores blanco limpio
- **Navegación Intuitiva**: Menú hamburguesa responsive con animaciones suaves
- **Logos Gigantes**: Marca VelyKapet altamente visible (100px altura, 350px ancho)
- **Colores Profesionales**: Esquema blanco con acentos azules (#007bff)

### 📱 **Responsive Design**
- Optimizado para desktop, tablet y móvil
- Header adaptatío con altura de 120px
- Búsqueda expandible en dispositivos móviles
- Navegación lateral deslizante

### 🛒 **Funcionalidades de E-commerce**
- Catálogo de productos con filtros avanzados
- Carrito de compras interactivo
- Sistema de checkout moderno
- Gestión de usuarios y perfiles

### 🔒 **Privacidad y Seguridad**
- Política de privacidad completa y detallada
- Configuraciones de privacidad personalizables
- Términos y condiciones claros
- Componentes de autenticación segura

## 🚀 Tecnologías

- **Frontend**: React 18 (puro, sin JSX)
- **Backend**: .NET Core API con base de datos en español ([Ver análisis](./ANALISIS_BACKEND_DOTNET.md))
- **Estilos**: CSS3 con variables personalizadas
- **Assets**: Imágenes PNG sin fondo para mejor integración
- **Performance**: Optimizadores de imágenes y cache manager
- **API**: Sistema de conexión con backend RESTful
- **Seguridad**: Autenticación JWT para protección de endpoints

## 📁 Estructura del Proyecto

```
ventas_pet_new/
├── public/
│   └── images/
│       ├── logo_pagina_sinletras-removebg-preview.png
│       ├── velykapet_letras-removebg-preview.png
│       ├── perro_card_img.jpg
│       └── gato_card_img.jpg
├── src/
│   ├── components/
│   │   ├── Header.js                 # Header con logos gigantes
│   │   ├── HamburgerMenu.js         # Menú responsive
│   │   ├── PrivacyPolicy.js         # Política de privacidad
│   │   ├── PrivacySettings.js       # Configuraciones
│   │   ├── ModernLayout.js          # Layout principal
│   │   └── ...
│   ├── styles.css                   # Estilos globales
│   ├── app.js                       # Aplicación principal
│   └── api.js                       # Conexiones API
└── index.html                       # Punto de entrada
```

## 🎯 Categorías de Productos

### 🐕 **Perrolandia**
- Medicinas especializadas
- Alimentos premium
- Suplementos nutricionales  
- Accesorios y juguetes

### 🐱 **Gatolandia**
- Productos para felinos
- Alimentación especializada
- Accesorios para gatos
- Cuidado e higiene

## 🔧 Instalación y Uso

### Desarrollo Local
```bash
# Clonar el repositorio
git clone https://github.com/angra8410/velykapet.git

# Navegar al directorio
cd velykapet

# Servir con un servidor HTTP local
# Opción 1: Python
python -m http.server 8080

# Opción 2: Node.js
npx http-server . -p 8080

# Acceder a http://localhost:8080
```

### Producción
```bash
# Subir archivos a servidor web
# Asegurar configuración HTTPS
# Configurar dominio velykapet.com
```

## 🌟 Características Destacadas

### **Logos Prominentes**
- Logo principal: `logo_pagina_sinletras-removebg-preview.png` (100px)
- Letras VelyKapet: `velykapet_letras-removebg-preview.png` (100px × 350px)
- Sin fondos blancos para integración perfecta

### **Header Moderno**
- Fondo blanco con sombras sutiles
- Botones con estilo minimalista (#f8f9fa)
- Búsqueda interactiva con focus azul
- Altura de 120px para acomodar logos gigantes

### **Sistema de Navegación**
- Menú hamburguesa deslizante desde la izquierda
- Opciones dinámicas según estado de autenticación
- Animaciones CSS suaves
- Cierre automático al hacer click fuera

## 🎨 Guía de Colores

```css
/* Colores Principales */
--primary-white: #ffffff
--primary-gray: #f8f9fa
--border-gray: #e9ecef
--accent-blue: #007bff
--text-dark: #333333
--text-muted: #666666
```

## 📝 Componentes Clave

### **PrivacyPolicy.js**
- Política de privacidad completa
- Secciones organizadas y legibles
- Responsive design
- Colores actualizados al esquema blanco/azul

### **Header.js**
- Logos gigantes y prominentes
- Búsqueda responsiva
- Navegación intuitiva
- Esquema de colores blanco

### **HamburgerMenu.js**
- Menú lateral moderno
- Animaciones CSS
- Opciones contextuales
- Integración perfecta

## 🚀 Próximas Funcionalidades

- [ ] Integración con pasarelas de pago
- [ ] Sistema de reseñas y calificaciones
- [ ] Chat de soporte en vivo
- [ ] App móvil complementaria
- [ ] Sistema de recompensas para clientes

## 📚 Documentación del Backend

### Análisis y Arquitectura .NET
- **[Análisis Completo del Backend .NET](./ANALISIS_BACKEND_DOTNET.md)** - Documento exhaustivo de arquitectura, base de datos en español, y estrategia de implementación
- **[Guía Rápida de Implementación](./GUIA_RAPIDA_IMPLEMENTACION.md)** - Tutorial paso a paso para desarrolladores

### Características del Backend
- ✅ Base de datos en español (Usuarios, Productos, Ordenes, Categorias, Marcas)
- ✅ Autenticación JWT robusta
- ✅ API RESTful con documentación Swagger
- ✅ Arquitectura en capas (Controllers, Services, Repositories)
- ✅ Entity Framework Core con SQL Server
- ✅ Seguridad con hash de contraseñas
- ✅ CORS configurado para frontend

### Scripts y Configuración
- **[Scripts de Inicialización](./SCRIPTS_README.md)** - Cómo iniciar frontend y backend
- **[Configuración de Ambientes](./AMBIENTES.md)** - Variables de entorno
- **[Panel de Administración](./ADMIN_ACCESS.md)** - Acceso al panel admin

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

- **Desarrollo Frontend**: VelyKapet Team
- **Diseño UI/UX**: Especialistas en e-commerce para mascotas
- **Producto**: Enfoque en experiencia del usuario

## 📞 Contacto

- **Email**: info@velykapet.com
- **Soporte**: soporte@velykapet.com
- **Privacidad**: privacidad@velykapet.com
- **GitHub**: [@angra8410](https://github.com/angra8410)

---

**¡Todo para tu mascota en un solo lugar! 🐾**

*VelyKapet - Cuidamos lo que más amas*