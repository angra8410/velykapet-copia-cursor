// VentasPet - Responsive Category Card Component (mejorado)
// Soporta webp, srcset, lazy-loading, accesibilidad
// Cambios principales:
// - image container (imageFrame) ahora tiene background igual al color de la card,
//   border-radius y overflow:hidden para que la imagen respete las esquinas redondeadas.
// - la capa de contenido (texto) tiene mayor z-index para evitar que la imagen "tapice" el título.
// - onError marca visualmente y oculta la <img> para que el frame/color o thumb sea visible.
// - soporta fit='cover'|'contain' como antes.
// - menos estilos inline conflictivos: la mayoría queda en clases CSS.

console.log('🎴 Cargando Responsive Category Card Component (mejorado)...');

function CategoryCardComponent({
  img1x,
  img2x,
  thumb,
  category,
  subtitle,
  color,
  onClick,
  fit = 'cover',
  alt
}) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = (e) => {
    console.warn(`❌ IMAGE LOAD ERROR: ${e.target.currentSrc || e.target.src}`);
    // marca visual para QA
    e.target.style.outline = '3px solid rgba(255,0,0,0.9)';
    // oculta la imagen rota para que el frame (color) o thumb se muestre
    e.target.style.opacity = '0';
    setImageError(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick && onClick();
    }
  };

  // Clases para el fit (cover / contain) — así el CSS puede aplicar object-fit sin abusar de inline styles
  const fitClass = fit === 'contain' ? 'fitContain' : 'fitCover';

  return React.createElement(
    'article',
    {
      className: `categoryCard category-card-responsive`,
      onClick: onClick,
      onKeyPress: handleKeyPress,
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      tabIndex: 0,
      role: 'button',
      'aria-label': `Explorar ${category}: ${subtitle}`,
      style: {
        // mantenemos color en inline para facilidad de uso; CSS hereda background en .imageContainer
        backgroundColor: color || '#4A90E2',
        boxShadow: isHovered ? '0 20px 40px rgba(0, 0, 0, 0.25)' : '0 10px 30px rgba(0, 0, 0, 0.15)',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
        minHeight: '320px'
      }
    },

    // Imagen - ahora dentro de un frame con border-radius y overflow:hidden
    React.createElement(
      'div',
      {
        className: `imageContainer ${fitClass}`,
        style: {
          position: 'absolute',
          top: '-36px',
          right: '20px',
          width: '200px',
          height: '200px',
          zIndex: 1, // 1 para que el contenido (zIndex 2) quede por encima
          pointerEvents: 'none', // evita que la imagen intercepte clicks del artículo
          borderRadius: '14px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: color || '#ffffff',
          padding: '8px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
        }
      },

      !imageError &&
        React.createElement(
          'picture',
          {
            className: 'category-picture',
            style: { display: 'block', width: '100%', height: '100%' }
          },
          React.createElement('source', {
            type: 'image/jpeg',
            srcSet: img2x ? `${img1x} 1x, ${img2x} 2x` : img1x
          }),
          React.createElement('img', {
            src: img1x || thumb,
            alt: alt || category,
            loading: 'lazy',
            onError: handleImageError,
            draggable: false,
            style: {
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: fit,
              borderRadius: '10px' // suaviza esquinas aún más dentro del frame
            }
          })
        ),

      imageError &&
        React.createElement(
          'div',
          {
            style: {
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '10px',
              fontSize: '2rem',
              color: 'rgba(255,255,255,0.85)'
            }
          },
          '🐾'
        )
    ),

    // Contenido textual (texto siempre en zIndex 2 para estar por encima de la imagen)
    React.createElement(
      'div',
      {
        className: 'content',
        style: {
          position: 'relative',
          zIndex: 2,
          marginTop: 'auto'
        }
      },
      React.createElement(
        'h2',
        {
          className: 'categoryName',
          style: {
            fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: '0 0 8px 0',
            textAlign: 'left',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            lineHeight: 1.2
          }
        },
        category
      ),
      React.createElement(
        'p',
        {
          className: 'subtitle',
          style: {
            fontSize: 'var(--font-size-lg, 1.125rem)',
            fontWeight: 500,
            color: '#FFFFFF',
            margin: 0,
            textAlign: 'left',
            opacity: 0.95,
            textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
            lineHeight: 1.4
          }
        },
        subtitle
      )
    ),

    // Flecha (sin cambios funcionales)
    React.createElement(
      'div',
      {
        className: 'arrow',
        'aria-hidden': 'true',
        style: {
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          color: '#FFFFFF',
          transform: isHovered ? 'translateX(5px)' : 'translateX(0)',
          transition: 'all 0.2s ease',
          backdropFilter: 'blur(10px)',
          zIndex: 2
        }
      },
      '→'
    )
  );
}

// Registrar componente globalmente (igual que antes)
window.CategoryCardComponent = CategoryCardComponent;

// Mantengo los estilos dinámicos inyectados (si quieres puedes moverlos al CSS de la app)
const categoryCardResponsiveStyles = document.createElement('style');
categoryCardResponsiveStyles.textContent = `
  /* Focus styles for accessibility */
  .categoryCard:focus {
    outline: 3px solid rgba(255, 255, 255, 0.8);
    outline-offset: 4px;
  }
  .categoryCard:focus-visible {
    outline: 3px solid rgba(255, 255, 255, 0.8);
    outline-offset: 4px;
  }

  /* Image container sits below content (content z-index is 2) */
  .imageContainer { z-index: 1; pointer-events: none; }

  /* Ensure the image is always block and fills container */
  .imageContainer img { display: block; width: 100%; height: 100%; }

  /* Fit classes (applied on container) */
  .imageContainer.fitContain img { object-fit: contain; }
  .imageContainer.fitCover img { object-fit: cover; }

  /* Hover improvements */
  .categoryCard:hover { box-shadow: 0 20px 40px rgba(0,0,0,0.25) !important; transform: translateY(-8px) !important; }
  .categoryCard:hover .imageContainer { transform: scale(1.06) rotate(4deg); }

  /* Responsive adjustments */
  @media (max-width: 1024px) {
    .imageContainer { width: 180px !important; height: 180px !important; top: -35px !important; right: 15px !important; }
  }
  @media (max-width: 768px) {
    .imageContainer { width: 160px !important; height: 160px !important; top: -30px !important; right: 15px !important; }
  }
  @media (max-width: 480px) {
    .imageContainer { width: 140px !important; height: 140px !important; top: -25px !important; right: 10px !important; }
  }

  /* reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .categoryCard, .imageContainer, .arrow { transition: none !important; transform: none !important; }
  }
`;
document.head.appendChild(categoryCardResponsiveStyles);

console.log('✅ Responsive Category Card Component (mejorado) cargado');