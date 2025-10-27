// VentasPet - Category Card Component
// Reusable card component for homepage categories

console.log('🎴 Cargando Category Card Component...');

function CategoryCardComponent({ image, color, category, subtitle, onClick }) {
    const [isHovered, setIsHovered] = React.useState(false);
    
    return React.createElement('div',
        {
            className: 'category-card',
            onClick: onClick,
            onMouseEnter: () => setIsHovered(true),
            onMouseLeave: () => setIsHovered(false),
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
                isolation: 'isolate'
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
                    width: '180px',
                    height: '180px',
                    zIndex: 2,
                    transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
                    transition: 'all var(--transition-normal)',
                    filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2))'
                }
            },
            React.createElement('img',
                {
                    src: image,
                    alt: category,
                    style: {
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        borderRadius: '50%'
                    },
                    onError: (e) => {
                        console.error(`Failed to load image: ${image}`);
                        e.target.style.display = 'none';
                    }
                }
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

// Add responsive styles
const categoryCardStyles = document.createElement('style');
categoryCardStyles.textContent = `
    @media (max-width: 768px) {
        .category-card {
            min-height: 220px !important;
            padding: 25px !important;
        }
        
        .category-image-container {
            width: 140px !important;
            height: 140px !important;
            top: -30px !important;
            right: 15px !important;
        }
    }
    
    @media (max-width: 480px) {
        .category-card {
            min-height: 200px !important;
            padding: 20px !important;
        }
        
        .category-image-container {
            width: 120px !important;
            height: 120px !important;
            top: -25px !important;
            right: 10px !important;
        }
    }
`;
document.head.appendChild(categoryCardStyles);

console.log('✅ Category Card Component cargado');
