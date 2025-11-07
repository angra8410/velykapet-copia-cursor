// VentasPet - Responsive Category Card Component
// Supports webp, srcset, lazy-loading, and accessibility

console.log('🎴 Cargando Responsive Category Card Component...');

/**
 * CategoryCard Component
 * 
 * Features:
 * - <picture> element with webp source + jpg fallback
 * - srcset for 1x and 2x (retina) images
 * - lazy loading for performance
 * - fit='cover' or fit='contain' to avoid cropping pets
 * - Full accessibility (aria-labels, keyboard navigation)
 * - Responsive styles
 * 
 * @param {Object} props
 * @param {string} props.baseImage - Base image name (e.g., 'imagen01-perroygato')
 * @param {string} props.category - Category name
 * @param {string} props.subtitle - Subtitle text
 * @param {string} props.color - Background color
 * @param {Function} props.onClick - Click handler
 * @param {string} props.fit - Image object-fit ('cover' or 'contain'), default 'cover'
 * @param {string} props.alt - Alternative text for image
 */
function CategoryCardComponent({ 
    baseImage, 
    category, 
    subtitle, 
    color, 
    onClick, 
    fit = 'cover',
    alt
}) {
    const [isHovered, setIsHovered] = React.useState(false);
    const [imageError, setImageError] = React.useState(false);
    
    // Image paths
    const imagePaths = {
        // Principal images (1120x640)
        jpg1x: `/images/gallery/principal/${baseImage}-gallery-1120x640.jpg`,
        webp1x: `/images/webp/${baseImage}-gallery-1120x640.webp`,
        // Retina images (2240x1280)
        jpg2x: `/images/gallery/retina/${baseImage}-gallery-2240x1280@2x.jpg`,
        webp2x: `/images/webp/${baseImage}-gallery-2240x1280@2x.webp`,
        // Thumbnail (420x240)
        thumb: `/images/gallery/miniatura/${baseImage}-thumb-420x240.jpg`,
    };
    
    const handleImageError = (e) => {
        console.warn(`Failed to load image: ${e.target.src}`);
        setImageError(true);
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick && onClick();
        }
    };
    
    return React.createElement('article',
        {
            className: 'category-card-responsive',
            onClick: onClick,
            onKeyPress: handleKeyPress,
            onMouseEnter: () => setIsHovered(true),
            onMouseLeave: () => setIsHovered(false),
            tabIndex: 0,
            role: 'button',
            'aria-label': `Explorar ${category}: ${subtitle}`,
            style: {
                position: 'relative',
                backgroundColor: color || '#4A90E2',
                borderRadius: 'var(--border-radius-2xl, 24px)',
                padding: '30px',
                cursor: 'pointer',
                overflow: 'hidden',
                minHeight: '320px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                boxShadow: isHovered ? 
                    '0 20px 40px rgba(0, 0, 0, 0.25)' : 
                    '0 10px 30px rgba(0, 0, 0, 0.15)',
                transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                transition: 'all 0.3s ease',
                isolation: 'isolate',
                outline: 'none'
            }
        },
        
        // Responsive image with picture element
        React.createElement('div',
            {
                className: 'category-image-container-responsive',
                style: {
                    position: 'absolute',
                    top: '-40px',
                    right: '20px',
                    width: '200px',
                    height: '200px',
                    zIndex: 2,
                    transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
                    transition: 'all 0.3s ease',
                    filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2))'
                }
            },
            !imageError && React.createElement('picture',
                null,
                // WebP source with srcset for retina
                React.createElement('source', {
                    type: 'image/webp',
                    srcSet: `${imagePaths.webp1x} 1x, ${imagePaths.webp2x} 2x`
                }),
                // JPEG source with srcset for retina
                React.createElement('source', {
                    type: 'image/jpeg',
                    srcSet: `${imagePaths.jpg1x} 1x, ${imagePaths.jpg2x} 2x`
                }),
                // Fallback img element
                React.createElement('img', {
                    src: imagePaths.jpg1x,
                    alt: alt || category,
                    loading: 'lazy',
                    onError: handleImageError,
                    style: {
                        width: '100%',
                        height: '100%',
                        objectFit: fit,
                        borderRadius: '12px'
                    }
                })
            )
        ),
        
        // Category content
        React.createElement('div',
            {
                className: 'category-content-responsive',
                style: {
                    position: 'relative',
                    zIndex: 1,
                    marginTop: 'auto'
                }
            },
            
            // Category name
            React.createElement('h2',
                {
                    className: 'category-name',
                    style: {
                        fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
                        fontWeight: '800',
                        color: '#FFFFFF',
                        margin: '0 0 8px 0',
                        textAlign: 'left',
                        fontFamily: 'var(--font-family-secondary, "Poppins", sans-serif)',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                        lineHeight: '1.2'
                    }
                },
                category
            ),
            
            // Subtitle
            React.createElement('p',
                {
                    className: 'category-subtitle',
                    style: {
                        fontSize: 'var(--font-size-lg, 1.125rem)',
                        fontWeight: '500',
                        color: '#FFFFFF',
                        margin: '0',
                        textAlign: 'left',
                        opacity: 0.95,
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                        lineHeight: '1.4'
                    }
                },
                subtitle
            )
        ),
        
        // Arrow indicator with focus styles
        React.createElement('div',
            {
                className: 'category-arrow',
                'aria-hidden': 'true',
                style: {
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    color: '#FFFFFF',
                    transform: isHovered ? 'translateX(5px)' : 'translateX(0)',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(10px)'
                }
            },
            '→'
        )
    );
}

// Register the component globally
window.CategoryCardComponent = CategoryCardComponent;

// Add responsive styles and accessibility
const categoryCardResponsiveStyles = document.createElement('style');
categoryCardResponsiveStyles.textContent = `
    /* Focus styles for accessibility */
    .category-card-responsive:focus {
        outline: 3px solid rgba(255, 255, 255, 0.8);
        outline-offset: 4px;
    }
    
    .category-card-responsive:focus-visible {
        outline: 3px solid rgba(255, 255, 255, 0.8);
        outline-offset: 4px;
    }
    
    /* Hover state improvements */
    .category-card-responsive:hover {
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25) !important;
    }
    
    /* Tablet responsive */
    @media (max-width: 1024px) {
        .category-card-responsive {
            min-height: 280px !important;
            padding: 25px !important;
        }
        
        .category-image-container-responsive {
            width: 180px !important;
            height: 180px !important;
            top: -35px !important;
            right: 15px !important;
        }
    }
    
    /* Mobile responsive */
    @media (max-width: 768px) {
        .category-card-responsive {
            min-height: 250px !important;
            padding: 25px !important;
        }
        
        .category-image-container-responsive {
            width: 160px !important;
            height: 160px !important;
            top: -30px !important;
            right: 15px !important;
        }
    }
    
    /* Small mobile responsive */
    @media (max-width: 480px) {
        .category-card-responsive {
            min-height: 220px !important;
            padding: 20px !important;
        }
        
        .category-image-container-responsive {
            width: 140px !important;
            height: 140px !important;
            top: -25px !important;
            right: 10px !important;
        }
    }
    
    /* Reduced motion for accessibility */
    @media (prefers-reduced-motion: reduce) {
        .category-card-responsive,
        .category-image-container-responsive,
        .category-arrow {
            transition: none !important;
            transform: none !important;
        }
    }
    
    /* High contrast mode support */
    @media (prefers-contrast: high) {
        .category-card-responsive:focus {
            outline: 3px solid currentColor;
        }
    }
`;
document.head.appendChild(categoryCardResponsiveStyles);

console.log('✅ Responsive Category Card Component cargado');
