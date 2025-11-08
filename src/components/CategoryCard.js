// VentasPet - Category Card Component
// Reusable card component for homepage categories with R2 image support

console.log('🎴 Cargando Category Card Component...');

function CategoryCardComponent({ img1x, img2x, thumb, image, color, category, subtitle, onClick, fit = 'cover', alt }) {
    const [isHovered, setIsHovered] = React.useState(false);
    const [imageError, setImageError] = React.useState(false);
    
    // Support both old 'image' prop and new img1x/img2x props for backward compatibility
    const imageSrc = img1x || image || thumb;
    
    return React.createElement('div',
        {
            className: 'category-card',
            onClick: onClick,
            onMouseEnter: () => setIsHovered(true),
            onMouseLeave: () => setIsHovered(false),
            tabIndex: 0,
            role: 'button',
            'aria-label': `Explorar ${category}: ${subtitle}`,
            onKeyPress: (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick && onClick();
                }
            },
            style: {
                position: 'relative',
                backgroundColor: color,
                borderRadius: 'var(--border-radius-2xl)',
                padding: '30px',
                cursor: 'pointer',
                overflow: 'visible',
                minHeight: '280px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                boxShadow: isHovered ? 
                    '0 20px 40px rgba(0, 0, 0, 0.25)' : 
                    '0 10px 30px rgba(0, 0, 0, 0.15)',
                transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                transition: 'all var(--transition-normal)',
                isolation: 'isolate',
                outline: 'none'
            }
        },
        
        // Pet image that overlaps the card
        React.createElement('div',
            {
                className: 'category-image-container',
                style: {
                    position: 'absolute',
                    top: '-40px',
                    right: '20px',
                    width: '200px',
                    height: '200px',
                    zIndex: 2,
                    transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
                    transition: 'all var(--transition-normal)',
                    filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2))'
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
                    srcSet: (img1x && img2x) ? `${img1x} 1x, ${img2x} 2x` : (imageSrc || '')
                }),
                // Fallback img element
                React.createElement('img',
                    {
                        src: imageSrc || '',
                        alt: alt || category,
                        loading: 'lazy',
                        style: {
                            display: 'block',
                            width: '100%',
                            height: '100%',
                            objectFit: fit || 'cover',
                            borderRadius: '12px'
                        },
                        onError: (e) => {
                            console.warn(`❌ IMAGE LOAD ERROR: ${e.target.src || e.target.currentSrc}`);
                            e.target.style.outline = '3px solid red';
                            e.target.style.background = '#f3f3f3';
                            setImageError(true);
                        }
                    }
                )
            ),
            // Fallback for error state - show emoji
            imageError && React.createElement('div',
                {
                    style: {
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        fontSize: '3rem'
                    }
                },
                '🐾'
            )
        ),
        
        // Category content
        React.createElement('div',
            {
                className: 'category-content',
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
                        fontFamily: 'var(--font-family-secondary)',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
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
                        fontSize: 'var(--font-size-lg)',
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
        
        // Arrow indicator
        React.createElement('div',
            {
                className: 'category-arrow',
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
                    transition: 'all var(--transition-fast)',
                    backdropFilter: 'blur(10px)'
                }
            },
            '→'
        )
    );
}

// Register the component globally
window.CategoryCardComponent = CategoryCardComponent;

// Add responsive styles and picture element support
const categoryCardStyles = document.createElement('style');
categoryCardStyles.textContent = `
    /* Ensure picture element takes full space */
    .category-picture {
        display: block;
        width: 100%;
        height: 100%;
    }
    
    .category-picture img {
        display: block;
        width: 100%;
        height: 100%;
    }
    
    /* Focus styles for accessibility */
    .category-card:focus {
        outline: 3px solid rgba(255, 255, 255, 0.8);
        outline-offset: 4px;
    }
    
    @media (max-width: 1024px) {
        .category-card {
            min-height: 280px !important;
            padding: 25px !important;
        }
        
        .category-image-container {
            width: 180px !important;
            height: 180px !important;
            top: -35px !important;
            right: 15px !important;
        }
    }
    
    @media (max-width: 768px) {
        .category-card {
            min-height: 250px !important;
            padding: 25px !important;
        }
        
        .category-image-container {
            width: 160px !important;
            height: 160px !important;
            top: -30px !important;
            right: 15px !important;
        }
    }
    
    @media (max-width: 480px) {
        .category-card {
            min-height: 220px !important;
            padding: 20px !important;
        }
        
        .category-image-container {
            width: 140px !important;
            height: 140px !important;
            top: -25px !important;
            right: 10px !important;
        }
    }
    
    /* Accessibility - Reduced motion */
    @media (prefers-reduced-motion: reduce) {
        .category-card,
        .category-image-container,
        .category-arrow {
            transition: none !important;
            transform: none !important;
        }
    }
`;
document.head.appendChild(categoryCardStyles);

console.log('✅ Category Card Component cargado');
