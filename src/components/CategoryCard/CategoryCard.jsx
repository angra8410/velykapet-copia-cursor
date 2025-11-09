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
 * @param {string} props.img1x - 1x image URL (principal)
 * @param {string} props.img2x - 2x image URL (retina)
 * @param {string} props.thumb - Thumbnail image URL
 * @param {string} props.category - Category name
 * @param {string} props.subtitle - Subtitle text
 * @param {string} props.color - Background color
 * @param {Function} props.onClick - Click handler
 * @param {string} props.fit - Image object-fit ('cover' or 'contain'), default 'cover'
 * @param {string} props.alt - Alternative text for image
 */
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
        console.warn(`❌ IMAGE LOAD ERROR: ${e.target.src || e.target.currentSrc}`);
        // Add visual indicator for QA
        e.target.style.outline = '3px solid red';
        e.target.style.background = '#f3f3f3';
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
        
        // Image frame with background matching card color
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
            // Image frame with card color background and overflow hidden
            React.createElement('div',
                {
                    className: 'imageFrame',
                    style: {
                        width: '100%',
                        height: '100%',
                        backgroundColor: color || '#4A90E2',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative'
                    }
                },
                !imageError && React.createElement('picture',
                    {
                        className: 'category-picture',
                        style: {
                            display: 'block',
                            width: '100%',
                            height: '100%'
                        }
                    },
                    // JPEG source with srcset for retina (R2 URLs)
                    React.createElement('source', {
                        type: 'image/jpeg',
                        srcSet: img2x ? `${img1x} 1x, ${img2x} 2x` : img1x
                    }),
                    // Fallback img element
                    React.createElement('img', {
                        src: img1x || thumb,
                        alt: alt || category,
                        loading: 'lazy',
                        onError: handleImageError,
                        style: {
                            display: 'block',
                            width: '100%',
                            height: '100%',
                            objectFit: fit
                        }
                    })
                ),
                // Fallback for error state - show thumb or colored background
                imageError && React.createElement('div',
                    {
                        style: {
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem'
                        }
                    },
                    thumb ? React.createElement('img', {
                        src: thumb,
                        alt: alt || category,
                        style: {
                            display: 'block',
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                        }
                    }) : '🐾'
                )
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
