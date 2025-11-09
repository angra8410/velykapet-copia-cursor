// VentasPet - Responsive Category Card Component (CANONICAL VERSION)
// Supports srcset, lazy-loading, accessibility, and image frame with overflow control

console.log('🎴 Cargando Responsive Category Card Component (Canonical)...');

/**
 * CategoryCard Component - CANONICAL VERSION
 * 
 * Features:
 * - Image frame with border-radius and overflow:hidden
 * - Background color matching card color
 * - <picture> element with srcset for 1x and 2x (retina) images
 * - lazy loading for performance
 * - fit='cover' or fit='contain' to avoid cropping pets
 * - Full accessibility (aria-labels, keyboard navigation)
 * - onError handler with visual fallback
 * - Proper z-index hierarchy (content above image)
 * - Responsive styles
 * 
 * @param {Object} props
 * @param {string} props.img1x - 1x image URL (principal)
 * @param {string} props.img2x - 2x image URL (retina)
 * @param {string} props.thumb - Thumbnail image URL (fallback)
 * @param {string} props.category - Category name
 * @param {string} props.subtitle - Subtitle text
 * @param {string} props.color - Background color (for card and image frame)
 * @param {Function} props.onClick - Click handler
 * @param {string} props.fit - Image object-fit ('cover' or 'contain'), default 'cover'
 * @param {string} props.alt - Alternative text for image
 * @param {string} props.href - Optional link URL
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
    alt,
    href
}) {
    const [isHovered, setIsHovered] = React.useState(false);
    const [imageError, setImageError] = React.useState(false);
    
    const handleImageError = (e) => {
        const failedUrl = e.target.src || e.target.currentSrc;
        console.warn(`❌ IMAGE LOAD ERROR for ${category}:`, failedUrl);
        // Hide the broken image, let the frame background show
        e.target.style.display = 'none';
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
        
        // Image frame with background color and overflow control
        React.createElement('div',
            {
                className: 'category-image-frame',
                style: {
                    position: 'absolute',
                    top: '-40px',
                    right: '20px',
                    width: '200px',
                    height: '200px',
                    zIndex: 1,
                    backgroundColor: color || '#4A90E2',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    padding: '12px',
                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
                    transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
                    transition: 'all 0.3s ease'
                }
            },
            !imageError ? React.createElement('picture',
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
                        objectFit: fit,
                        borderRadius: '8px'
                    }
                })
            ) : (
                // Fallback for error state - show paw emoji or use thumb
                thumb ? React.createElement('img', {
                    src: thumb,
                    alt: alt || category,
                    loading: 'lazy',
                    style: {
                        display: 'block',
                        width: '100%',
                        height: '100%',
                        objectFit: fit,
                        borderRadius: '8px',
                        opacity: 0.7
                    }
                }) : React.createElement('div',
                    {
                        style: {
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(255, 255, 255, 0.15)',
                            borderRadius: '8px',
                            fontSize: '3rem'
                        }
                    },
                    '🐾'
                )
            )
        ),
        
        // Category content with higher z-index to stay above image
        React.createElement('div',
            {
                className: 'category-content-responsive',
                style: {
                    position: 'relative',
                    zIndex: 2,
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
                    zIndex: 2,
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
        
        .category-image-frame {
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
        
        .category-image-frame {
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
        
        .category-image-frame {
            width: 140px !important;
            height: 140px !important;
            top: -25px !important;
            right: 10px !important;
        }
    }
    
    /* Reduced motion for accessibility */
    @media (prefers-reduced-motion: reduce) {
        .category-card-responsive,
        .category-image-frame,
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

console.log('✅ Responsive Category Card Component (Canonical) cargado');
