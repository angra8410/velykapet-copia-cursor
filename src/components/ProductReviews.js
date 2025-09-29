// Sistema de Reviews y Ratings para VentasPet
// Permite a usuarios calificar productos con estrellas, agregar reseñas con fotos y reaccionar a comentarios

console.log('⭐ Cargando Product Reviews Component...');

// Componente principal de Reviews
window.ProductReviews = function({ productId, initialReviews = [] }) {
    // Estados
    const [reviews, setReviews] = React.useState(initialReviews);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [userReview, setUserReview] = React.useState({
        rating: 5,
        comment: '',
        photos: []
    });
    const [showReviewForm, setShowReviewForm] = React.useState(false);
    const [activeFilter, setActiveFilter] = React.useState('all'); // 'all', '5', '4', '3', '2', '1'
    const [sortBy, setSortBy] = React.useState('helpful'); // 'helpful', 'recent', 'highest', 'lowest'
    const [photoPreview, setPhotoPreview] = React.useState(null);
    
    // Referencia para el input de archivos
    const fileInputRef = React.useRef(null);
    
    // Cargar reviews al montar el componente
    React.useEffect(() => {
        loadReviews();
    }, [productId]);
    
    // Función para cargar reviews desde la API
    const loadReviews = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Simulación de carga de reviews desde API
            // En producción, esto se reemplazaría por una llamada real a la API
            setTimeout(() => {
                // Datos de ejemplo para desarrollo
                const mockReviews = generateMockReviews();
                setReviews(mockReviews);
                setLoading(false);
            }, 1000);
        } catch (err) {
            console.error('Error cargando reviews:', err);
            setError('No se pudieron cargar las reseñas. Intente nuevamente.');
            setLoading(false);
        }
    };
    
    // Función para generar reviews de ejemplo
    const generateMockReviews = () => {
        return [
            {
                id: '1',
                userId: 'user1',
                userName: 'María García',
                rating: 5,
                comment: 'Excelente producto para mi mascota. Lo recomiendo totalmente, mi perro está muy feliz con este alimento.',
                date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 días atrás
                photos: ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'],
                helpful: 12,
                notHelpful: 1,
                verified: true,
                status: 'approved'
            },
            {
                id: '2',
                userId: 'user2',
                userName: 'Carlos Rodríguez',
                rating: 4,
                comment: 'Buen producto, pero el envío tardó más de lo esperado. La calidad es buena.',
                date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 días atrás
                photos: [],
                helpful: 5,
                notHelpful: 0,
                verified: true,
                status: 'approved'
            },
            {
                id: '3',
                userId: 'user3',
                userName: 'Ana Martínez',
                rating: 2,
                comment: 'No cumplió mis expectativas. Mi gato no quiso comer este alimento.',
                date: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 días atrás
                photos: ['https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'],
                helpful: 3,
                notHelpful: 2,
                verified: false,
                status: 'approved'
            },
            {
                id: '4',
                userId: 'user4',
                userName: 'Juan López',
                rating: 5,
                comment: '¡Increíble! Mi mascota adora este producto. Definitivamente compraré más.',
                date: new Date(Date.now() - 86400000 * 15).toISOString(), // 15 días atrás
                photos: [],
                helpful: 8,
                notHelpful: 0,
                verified: true,
                status: 'approved'
            },
            {
                id: '5',
                userId: 'user5',
                userName: 'Laura Sánchez',
                rating: 3,
                comment: 'Producto regular. No es malo, pero tampoco excepcional.',
                date: new Date(Date.now() - 86400000 * 20).toISOString(), // 20 días atrás
                photos: [],
                helpful: 1,
                notHelpful: 1,
                verified: true,
                status: 'approved'
            },
            {
                id: '6',
                userId: 'user6',
                userName: 'Pedro Gómez',
                rating: 1,
                comment: 'Pésimo producto. No lo recomiendo para nada.',
                date: new Date(Date.now() - 86400000 * 25).toISOString(), // 25 días atrás
                photos: [],
                helpful: 2,
                notHelpful: 5,
                verified: false,
                status: 'approved'
            },
            {
                id: '7',
                userId: 'user7',
                userName: 'Sofía Ramírez',
                rating: 5,
                comment: 'Excelente calidad y precio. Mi mascota está encantada.',
                date: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 días atrás
                photos: ['https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'],
                helpful: 15,
                notHelpful: 0,
                verified: true,
                status: 'approved'
            }
        ];
    };
    
    // Función para manejar cambio en el rating
    const handleRatingChange = (newRating) => {
        setUserReview({ ...userReview, rating: newRating });
    };
    
    // Función para manejar cambio en el comentario
    const handleCommentChange = (e) => {
        setUserReview({ ...userReview, comment: e.target.value });
    };
    
    // Función para manejar carga de fotos
    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        
        // Previsualización de la primera foto
        const reader = new FileReader();
        reader.onload = (e) => {
            setPhotoPreview(e.target.result);
        };
        reader.readAsDataURL(files[0]);
        
        // En un entorno real, aquí se subirían las fotos a un servidor
        // y se obtendrían las URLs para guardarlas en el estado
        const mockUploadedUrls = files.map(file => URL.createObjectURL(file));
        setUserReview({ ...userReview, photos: mockUploadedUrls });
    };
    
    // Función para eliminar foto
    const handleRemovePhoto = () => {
        setUserReview({ ...userReview, photos: [] });
        setPhotoPreview(null);
    };
    
    // Función para enviar review
    const handleSubmitReview = (e) => {
        e.preventDefault();
        
        if (!userReview.comment.trim()) {
            alert('Por favor, escriba un comentario');
            return;
        }
        
        // En un entorno real, aquí se enviaría la review a la API
        const newReview = {
            id: Date.now().toString(),
            userId: 'current-user', // En producción, se obtendría del usuario autenticado
            userName: 'Usuario Actual', // En producción, se obtendría del usuario autenticado
            rating: userReview.rating,
            comment: userReview.comment,
            date: new Date().toISOString(),
            photos: userReview.photos,
            helpful: 0,
            notHelpful: 0,
            verified: true,
            status: 'pending' // Las reviews nuevas quedan pendientes de moderación
        };
        
        // Agregar la nueva review al estado
        setReviews([newReview, ...reviews]);
        
        // Resetear el formulario
        setUserReview({
            rating: 5,
            comment: '',
            photos: []
        });
        setPhotoPreview(null);
        setShowReviewForm(false);
        
        // Mostrar mensaje de éxito
        alert('¡Gracias por su reseña! Será revisada antes de publicarse.');
    };
    
    // Función para marcar una review como útil o no útil
    const handleHelpfulVote = (reviewId, isHelpful) => {
        setReviews(reviews.map(review => {
            if (review.id === reviewId) {
                if (isHelpful) {
                    return { ...review, helpful: review.helpful + 1 };
                } else {
                    return { ...review, notHelpful: review.notHelpful + 1 };
                }
            }
            return review;
        }));
    };
    
    // Función para filtrar reviews por rating
    const filterReviews = () => {
        if (activeFilter === 'all') {
            return reviews.filter(review => review.status === 'approved');
        }
        return reviews.filter(review => 
            review.status === 'approved' && 
            review.rating === parseInt(activeFilter)
        );
    };
    
    // Función para ordenar reviews
    const sortReviews = (filteredReviews) => {
        switch (sortBy) {
            case 'helpful':
                return [...filteredReviews].sort((a, b) => b.helpful - a.helpful);
            case 'recent':
                return [...filteredReviews].sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'highest':
                return [...filteredReviews].sort((a, b) => b.rating - a.rating);
            case 'lowest':
                return [...filteredReviews].sort((a, b) => a.rating - b.rating);
            default:
                return filteredReviews;
        }
    };
    
    // Obtener reviews filtradas y ordenadas
    const filteredAndSortedReviews = sortReviews(filterReviews());
    
    // Calcular estadísticas de reviews
    const calculateStats = () => {
        const approvedReviews = reviews.filter(review => review.status === 'approved');
        if (approvedReviews.length === 0) return { average: 0, total: 0, distribution: [0, 0, 0, 0, 0] };
        
        const total = approvedReviews.length;
        const sum = approvedReviews.reduce((acc, review) => acc + review.rating, 0);
        const average = sum / total;
        
        // Distribución de ratings (5, 4, 3, 2, 1)
        const distribution = [5, 4, 3, 2, 1].map(rating => {
            const count = approvedReviews.filter(review => review.rating === rating).length;
            return Math.round((count / total) * 100);
        });
        
        return { average, total, distribution };
    };
    
    const stats = calculateStats();
    
    // Componente para mostrar estrellas
    const StarRating = ({ rating, onChange, interactive = false }) => {
        return React.createElement('div', 
            { className: 'star-rating' },
            [...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return React.createElement('span', 
                    { 
                        key: index,
                        className: 'star',
                        style: {
                            color: ratingValue <= rating ? '#FFD700' : '#e4e5e9',
                            cursor: interactive ? 'pointer' : 'default',
                            fontSize: '24px',
                            marginRight: '2px'
                        },
                        onClick: interactive ? () => onChange(ratingValue) : undefined,
                        onMouseEnter: interactive ? (e) => {
                            e.target.style.transform = 'scale(1.2)';
                        } : undefined,
                        onMouseLeave: interactive ? (e) => {
                            e.target.style.transform = 'scale(1)';
                        } : undefined
                    },
                    '★'
                );
            })
        );
    };
    
    // Componente para mostrar una review individual
    const ReviewItem = ({ review }) => {
        const [showFullComment, setShowFullComment] = React.useState(false);
        const longComment = review.comment.length > 200;
        
        return React.createElement('div',
            {
                className: 'review-item',
                style: {
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '16px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }
            },
            // Header de la review
            React.createElement('div',
                {
                    className: 'review-header',
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px'
                    }
                },
                // Información del usuario y rating
                React.createElement('div',
                    {
                        style: {
                            display: 'flex',
                            alignItems: 'center'
                        }
                    },
                    // Avatar (placeholder)
                    React.createElement('div',
                        {
                            style: {
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: '#4A90E2',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '12px',
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }
                        },
                        review.userName.charAt(0)
                    ),
                    // Nombre y verificación
                    React.createElement('div',
                        null,
                        React.createElement('div',
                            {
                                style: {
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center'
                                }
                            },
                            review.userName,
                            review.verified && React.createElement('span',
                                {
                                    style: {
                                        marginLeft: '8px',
                                        color: '#28a745',
                                        fontSize: '12px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }
                                },
                                '✓ Compra verificada'
                            )
                        ),
                        React.createElement('div',
                            {
                                style: {
                                    fontSize: '12px',
                                    color: '#666'
                                }
                            },
                            new Date(review.date).toLocaleDateString()
                        )
                    )
                ),
                // Rating
                React.createElement(StarRating, { rating: review.rating })
            ),
            // Contenido de la review
            React.createElement('div',
                {
                    className: 'review-content',
                    style: {
                        marginBottom: '12px'
                    }
                },
                React.createElement('p',
                    {
                        style: {
                            margin: '0 0 12px 0',
                            lineHeight: '1.5'
                        }
                    },
                    longComment && !showFullComment
                        ? review.comment.substring(0, 200) + '...'
                        : review.comment
                ),
                longComment && React.createElement('button',
                    {
                        onClick: () => setShowFullComment(!showFullComment),
                        style: {
                            background: 'none',
                            border: 'none',
                            color: '#4A90E2',
                            cursor: 'pointer',
                            padding: '0',
                            fontSize: '14px'
                        }
                    },
                    showFullComment ? 'Ver menos' : 'Ver más'
                )
            ),
            // Fotos de la review
            review.photos.length > 0 && React.createElement('div',
                {
                    className: 'review-photos',
                    style: {
                        display: 'flex',
                        gap: '8px',
                        marginBottom: '12px',
                        flexWrap: 'wrap'
                    }
                },
                review.photos.map((photo, index) =>
                    React.createElement('img',
                        {
                            key: index,
                            src: photo,
                            alt: `Foto de review ${index + 1}`,
                            style: {
                                width: '80px',
                                height: '80px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            },
                            onClick: () => window.open(photo, '_blank')
                        }
                    )
                )
            ),
            // Footer de la review (votos de utilidad)
            React.createElement('div',
                {
                    className: 'review-footer',
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid #e0e0e0',
                        paddingTop: '12px',
                        marginTop: '8px'
                    }
                },
                // Texto de utilidad
                React.createElement('div',
                    null,
                    '¿Te resultó útil esta reseña?'
                ),
                // Botones de voto
                React.createElement('div',
                    {
                        style: {
                            display: 'flex',
                            gap: '8px'
                        }
                    },
                    // Botón de útil
                    React.createElement('button',
                        {
                            onClick: () => handleHelpfulVote(review.id, true),
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '6px 12px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '16px',
                                background: 'white',
                                cursor: 'pointer'
                            }
                        },
                        React.createElement('span', null, '👍'),
                        React.createElement('span', null, 'Sí'),
                        React.createElement('span',
                            {
                                style: {
                                    marginLeft: '4px',
                                    color: '#666',
                                    fontSize: '12px'
                                }
                            },
                            `(${review.helpful})`
                        )
                    ),
                    // Botón de no útil
                    React.createElement('button',
                        {
                            onClick: () => handleHelpfulVote(review.id, false),
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '6px 12px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '16px',
                                background: 'white',
                                cursor: 'pointer'
                            }
                        },
                        React.createElement('span', null, '👎'),
                        React.createElement('span', null, 'No'),
                        React.createElement('span',
                            {
                                style: {
                                    marginLeft: '4px',
                                    color: '#666',
                                    fontSize: '12px'
                                }
                            },
                            `(${review.notHelpful})`
                        )
                    )
                )
            )
        );
    };
    
    // Renderizar el componente principal
    return React.createElement('div',
        {
            className: 'product-reviews-container',
            style: {
                fontFamily: 'Arial, sans-serif',
                maxWidth: '800px',
                margin: '0 auto',
                padding: '20px'
            }
        },
        // Título y resumen
        React.createElement('div',
            {
                className: 'reviews-header',
                style: {
                    marginBottom: '24px'
                }
            },
            React.createElement('h2',
                {
                    style: {
                        fontSize: '24px',
                        marginBottom: '16px'
                    }
                },
                'Opiniones de clientes'
            ),
            // Resumen de calificaciones
            React.createElement('div',
                {
                    className: 'ratings-summary',
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '24px',
                        padding: '16px',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '12px',
                        marginBottom: '24px'
                    }
                },
                // Calificación promedio
                React.createElement('div',
                    {
                        style: {
                            textAlign: 'center'
                        }
                    },
                    React.createElement('div',
                        {
                            style: {
                                fontSize: '48px',
                                fontWeight: 'bold',
                                color: '#4A90E2',
                                lineHeight: '1'
                            }
                        },
                        stats.average.toFixed(1)
                    ),
                    React.createElement(StarRating, { rating: stats.average }),
                    React.createElement('div',
                        {
                            style: {
                                marginTop: '4px',
                                fontSize: '14px',
                                color: '#666'
                            }
                        },
                        `${stats.total} opiniones`
                    )
                ),
                // Distribución de calificaciones
                React.createElement('div',
                    {
                        style: {
                            flex: 1
                        }
                    },
                    [5, 4, 3, 2, 1].map(rating => 
                        React.createElement('div',
                            {
                                key: rating,
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '4px'
                                }
                            },
                            // Número de estrellas
                            React.createElement('div',
                                {
                                    style: {
                                        width: '80px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }
                                },
                                `${rating} `,
                                React.createElement('span',
                                    {
                                        style: {
                                            color: '#FFD700',
                                            marginLeft: '4px'
                                        }
                                    },
                                    '★'
                                )
                            ),
                            // Barra de progreso
                            React.createElement('div',
                                {
                                    style: {
                                        flex: 1,
                                        height: '8px',
                                        backgroundColor: '#e0e0e0',
                                        borderRadius: '4px',
                                        overflow: 'hidden',
                                        margin: '0 8px'
                                    }
                                },
                                React.createElement('div',
                                    {
                                        style: {
                                            width: `${stats.distribution[5 - rating]}%`,
                                            height: '100%',
                                            backgroundColor: '#4A90E2'
                                        }
                                    }
                                )
                            ),
                            // Porcentaje
                            React.createElement('div',
                                {
                                    style: {
                                        width: '40px',
                                        fontSize: '14px',
                                        color: '#666',
                                        textAlign: 'right'
                                    }
                                },
                                `${stats.distribution[5 - rating]}%`
                            )
                        )
                    )
                )
            )
        ),
        // Botón para escribir una review
        !showReviewForm && React.createElement('button',
            {
                onClick: () => setShowReviewForm(true),
                style: {
                    backgroundColor: '#4A90E2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }
            },
            React.createElement('span', null, '✏️'),
            'Escribir una opinión'
        ),
        // Formulario para escribir una review
        showReviewForm && React.createElement('div',
            {
                className: 'review-form',
                style: {
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    padding: '24px',
                    marginBottom: '24px',
                    backgroundColor: '#f9f9f9'
                }
            },
            React.createElement('h3',
                {
                    style: {
                        marginTop: 0,
                        marginBottom: '16px'
                    }
                },
                'Escribir una opinión'
            ),
            React.createElement('form',
                {
                    onSubmit: handleSubmitReview
                },
                // Selección de rating
                React.createElement('div',
                    {
                        style: {
                            marginBottom: '16px'
                        }
                    },
                    React.createElement('label',
                        {
                            style: {
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: 'bold'
                            }
                        },
                        'Calificación'
                    ),
                    React.createElement(StarRating, {
                        rating: userReview.rating,
                        onChange: handleRatingChange,
                        interactive: true
                    })
                ),
                // Campo de comentario
                React.createElement('div',
                    {
                        style: {
                            marginBottom: '16px'
                        }
                    },
                    React.createElement('label',
                        {
                            htmlFor: 'review-comment',
                            style: {
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: 'bold'
                            }
                        },
                        'Comentario'
                    ),
                    React.createElement('textarea',
                        {
                            id: 'review-comment',
                            value: userReview.comment,
                            onChange: handleCommentChange,
                            placeholder: 'Comparte tu experiencia con este producto...',
                            style: {
                                width: '100%',
                                minHeight: '120px',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #e0e0e0',
                                resize: 'vertical'
                            }
                        }
                    )
                ),
                // Subida de fotos
                React.createElement('div',
                    {
                        style: {
                            marginBottom: '16px'
                        }
                    },
                    React.createElement('label',
                        {
                            style: {
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: 'bold'
                            }
                        },
                        'Fotos (opcional)'
                    ),
                    !photoPreview && React.createElement('button',
                        {
                            type: 'button',
                            onClick: () => fileInputRef.current.click(),
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px',
                                border: '1px dashed #e0e0e0',
                                borderRadius: '8px',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                width: '100%',
                                justifyContent: 'center'
                            }
                        },
                        React.createElement('span', null, '📷'),
                        'Agregar fotos'
                    ),
                    React.createElement('input',
                        {
                            type: 'file',
                            ref: fileInputRef,
                            onChange: handlePhotoUpload,
                            accept: 'image/*',
                            multiple: true,
                            style: {
                                display: 'none'
                            }
                        }
                    ),
                    photoPreview && React.createElement('div',
                        {
                            style: {
                                position: 'relative',
                                display: 'inline-block',
                                marginTop: '8px'
                            }
                        },
                        React.createElement('img',
                            {
                                src: photoPreview,
                                alt: 'Preview',
                                style: {
                                    width: '100px',
                                    height: '100px',
                                    objectFit: 'cover',
                                    borderRadius: '8px'
                                }
                            }
                        ),
                        React.createElement('button',
                            {
                                type: 'button',
                                onClick: handleRemovePhoto,
                                style: {
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: '#ff4d4f',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px'
                                }
                            },
                            '×'
                        )
                    )
                ),
                // Botones de acción
                React.createElement('div',
                    {
                        style: {
                            display: 'flex',
                            gap: '12px'
                        }
                    },
                    React.createElement('button',
                        {
                            type: 'submit',
                            style: {
                                backgroundColor: '#4A90E2',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '12px 24px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }
                        },
                        'Enviar opinión'
                    ),
                    React.createElement('button',
                        {
                            type: 'button',
                            onClick: () => {
                                setShowReviewForm(false);
                                setUserReview({
                                    rating: 5,
                                    comment: '',
                                    photos: []
                                });
                                setPhotoPreview(null);
                            },
                            style: {
                                backgroundColor: 'white',
                                color: '#666',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                padding: '12px 24px',
                                fontSize: '16px',
                                cursor: 'pointer'
                            }
                        },
                        'Cancelar'
                    )
                )
            )
        ),
        // Filtros y ordenamiento
        React.createElement('div',
            {
                className: 'reviews-filters',
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px',
                    flexWrap: 'wrap',
                    gap: '12px'
                }
            },
            // Filtros por rating
            React.createElement('div',
                {
                    style: {
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap'
                    }
                },
                ['all', '5', '4', '3', '2', '1'].map(filter => 
                    React.createElement('button',
                        {
                            key: filter,
                            onClick: () => setActiveFilter(filter),
                            style: {
                                padding: '8px 16px',
                                borderRadius: '16px',
                                border: '1px solid #e0e0e0',
                                backgroundColor: activeFilter === filter ? '#4A90E2' : 'white',
                                color: activeFilter === filter ? 'white' : '#666',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }
                        },
                        filter === 'all' ? 'Todas' : (
                            React.createElement(React.Fragment, null,
                                filter,
                                React.createElement('span',
                                    {
                                        style: {
                                            color: activeFilter === filter ? 'white' : '#FFD700'
                                        }
                                    },
                                    '★'
                                )
                            )
                        )
                    )
                )
            ),
            // Ordenamiento
            React.createElement('div',
                null,
                React.createElement('select',
                    {
                        value: sortBy,
                        onChange: (e) => setSortBy(e.target.value),
                        style: {
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: '1px solid #e0e0e0',
                            backgroundColor: 'white',
                            fontSize: '14px'
                        }
                    },
                    React.createElement('option', { value: 'helpful' }, 'Más útiles'),
                    React.createElement('option', { value: 'recent' }, 'Más recientes'),
                    React.createElement('option', { value: 'highest' }, 'Mayor calificación'),
                    React.createElement('option', { value: 'lowest' }, 'Menor calificación')
                )
            )
        ),
        // Lista de reviews
        loading ? (
            React.createElement('div',
                {
                    style: {
                        textAlign: 'center',
                        padding: '40px 0'
                    }
                },
                React.createElement('div',
                    {
                        style: {
                            width: '40px',
                            height: '40px',
                            border: '4px solid #f3f3f3',
                            borderTop: '4px solid #4A90E2',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto'
                        }
                    }
                ),
                React.createElement('p',
                    {
                        style: {
                            marginTop: '16px',
                            color: '#666'
                        }
                    },
                    'Cargando opiniones...'
                )
            )
        ) : error ? (
            React.createElement('div',
                {
                    style: {
                        textAlign: 'center',
                        padding: '40px 0',
                        color: '#ff4d4f'
                    }
                },
                React.createElement('p', null, error),
                React.createElement('button',
                    {
                        onClick: loadReviews,
                        style: {
                            marginTop: '16px',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#4A90E2',
                            color: 'white',
                            cursor: 'pointer'
                        }
                    },
                    'Reintentar'
                )
            )
        ) : filteredAndSortedReviews.length === 0 ? (
            React.createElement('div',
                {
                    style: {
                        textAlign: 'center',
                        padding: '40px 0',
                        color: '#666'
                    }
                },
                React.createElement('p', null, 'No hay opiniones que coincidan con el filtro seleccionado.'),
                activeFilter !== 'all' && React.createElement('button',
                    {
                        onClick: () => setActiveFilter('all'),
                        style: {
                            marginTop: '16px',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#4A90E2',
                            color: 'white',
                            cursor: 'pointer'
                        }
                    },
                    'Ver todas las opiniones'
                )
            )
        ) : (
            React.createElement('div',
                { className: 'reviews-list' },
                filteredAndSortedReviews.map(review => 
                    React.createElement(ReviewItem, { key: review.id, review })
                )
            )
        )
    );
};

// Componente wrapper para integración con la aplicación
window.ProductReviewsWrapper = function({ productId }) {
    return window.ProductReviews({ productId });
};

// Componente de moderación para administradores
window.ProductReviewsModeration = function() {
    const [pendingReviews, setPendingReviews] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    
    // Cargar reviews pendientes al montar el componente
    React.useEffect(() => {
        loadPendingReviews();
    }, []);
    
    // Función para cargar reviews pendientes
    const loadPendingReviews = async () => {
        setLoading(true);
        
        try {
            // Simulación de carga de reviews pendientes
            setTimeout(() => {
                const mockPendingReviews = [
                    {
                        id: 'pending1',
                        productId: 'product1',
                        productName: 'Alimento Premium para Perros',
                        userId: 'user10',
                        userName: 'Roberto Pérez',
                        rating: 4,
                        comment: 'Buen producto, mi perro lo disfruta mucho. Recomendado para mascotas exigentes.',
                        date: new Date().toISOString(),
                        photos: ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'],
                        status: 'pending'
                    },
                    {
                        id: 'pending2',
                        productId: 'product2',
                        productName: 'Juguete Interactivo para Gatos',
                        userId: 'user11',
                        userName: 'Lucía Fernández',
                        rating: 1,
                        comment: 'Pésimo producto, se rompió al primer uso. No lo recomiendo para nada.',
                        date: new Date().toISOString(),
                        photos: [],
                        status: 'pending'
                    },
                    {
                        id: 'pending3',
                        productId: 'product3',
                        productName: 'Cama para Mascotas',
                        userId: 'user12',
                        userName: 'Diego Torres',
                        rating: 5,
                        comment: 'Excelente calidad, mi mascota duerme muy cómoda. El material es resistente y fácil de lavar.',
                        date: new Date().toISOString(),
                        photos: ['https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'],
                        status: 'pending'
                    }
                ];
                
                setPendingReviews(mockPendingReviews);
                setLoading(false);
            }, 1000);
        } catch (err) {
            console.error('Error cargando reviews pendientes:', err);
            setLoading(false);
        }
    };
    
    // Función para aprobar una review
    const handleApproveReview = (reviewId) => {
        setPendingReviews(pendingReviews.filter(review => review.id !== reviewId));
        // En producción, aquí se enviaría una solicitud a la API para aprobar la review
        console.log('Review aprobada:', reviewId);
    };
    
    // Función para rechazar una review
    const handleRejectReview = (reviewId) => {
        setPendingReviews(pendingReviews.filter(review => review.id !== reviewId));
        // En producción, aquí se enviaría una solicitud a la API para rechazar la review
        console.log('Review rechazada:', reviewId);
    };
    
    // Renderizar el componente de moderación
    return React.createElement('div',
        {
            className: 'reviews-moderation',
            style: {
                fontFamily: 'Arial, sans-serif',
                maxWidth: '800px',
                margin: '0 auto',
                padding: '20px'
            }
        },
        React.createElement('h2',
            {
                style: {
                    marginBottom: '24px'
                }
            },
            'Moderación de Reseñas'
        ),
        loading ? (
            React.createElement('div',
                {
                    style: {
                        textAlign: 'center',
                        padding: '40px 0'
                    }
                },
                React.createElement('div',
                    {
                        style: {
                            width: '40px',
                            height: '40px',
                            border: '4px solid #f3f3f3',
                            borderTop: '4px solid #4A90E2',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto'
                        }
                    }
                ),
                React.createElement('p',
                    {
                        style: {
                            marginTop: '16px',
                            color: '#666'
                        }
                    },
                    'Cargando reseñas pendientes...'
                )
            )
        ) : pendingReviews.length === 0 ? (
            React.createElement('div',
                {
                    style: {
                        textAlign: 'center',
                        padding: '40px 0',
                        color: '#666'
                    }
                },
                React.createElement('p', null, 'No hay reseñas pendientes de moderación.'),
                React.createElement('button',
                    {
                        onClick: loadPendingReviews,
                        style: {
                            marginTop: '16px',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#4A90E2',
                            color: 'white',
                            cursor: 'pointer'
                        }
                    },
                    'Actualizar'
                )
            )
        ) : (
            React.createElement('div',
                { className: 'pending-reviews-list' },
                pendingReviews.map(review => 
                    React.createElement('div',
                        {
                            key: review.id,
                            className: 'pending-review-item',
                            style: {
                                border: '1px solid #e0e0e0',
                                borderRadius: '12px',
                                padding: '16px',
                                marginBottom: '16px',
                                backgroundColor: '#fff'
                            }
                        },
                        // Información del producto
                        React.createElement('div',
                            {
                                style: {
                                    marginBottom: '12px',
                                    padding: '8px',
                                    backgroundColor: '#f9f9f9',
                                    borderRadius: '8px'
                                }
                            },
                            React.createElement('strong', null, 'Producto: '),
                            review.productName
                        ),
                        // Información del usuario y fecha
                        React.createElement('div',
                            {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '12px'
                                }
                            },
                            React.createElement('div',
                                null,
                                React.createElement('strong', null, 'Usuario: '),
                                review.userName
                            ),
                            React.createElement('div',
                                null,
                                React.createElement('strong', null, 'Fecha: '),
                                new Date(review.date).toLocaleDateString()
                            )
                        ),
                        // Rating
                        React.createElement('div',
                            {
                                style: {
                                    marginBottom: '12px'
                                }
                            },
                            React.createElement('strong', null, 'Calificación: '),
                            [...Array(5)].map((_, index) => 
                                React.createElement('span',
                                    {
                                        key: index,
                                        style: {
                                            color: index < review.rating ? '#FFD700' : '#e4e5e9'
                                        }
                                    },
                                    '★'
                                )
                            )
                        ),
                        // Comentario
                        React.createElement('div',
                            {
                                style: {
                                    marginBottom: '12px'
                                }
                            },
                            React.createElement('strong', null, 'Comentario:'),
                            React.createElement('p',
                                {
                                    style: {
                                        padding: '12px',
                                        backgroundColor: '#f9f9f9',
                                        borderRadius: '8px',
                                        margin: '8px 0'
                                    }
                                },
                                review.comment
                            )
                        ),
                        // Fotos
                        review.photos.length > 0 && React.createElement('div',
                            {
                                style: {
                                    marginBottom: '16px'
                                }
                            },
                            React.createElement('strong', null, 'Fotos:'),
                            React.createElement('div',
                                {
                                    style: {
                                        display: 'flex',
                                        gap: '8px',
                                        marginTop: '8px'
                                    }
                                },
                                review.photos.map((photo, index) =>
                                    React.createElement('img',
                                        {
                                            key: index,
                                            src: photo,
                                            alt: `Foto de review ${index + 1}`,
                                            style: {
                                                width: '80px',
                                                height: '80px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                cursor: 'pointer'
                                            },
                                            onClick: () => window.open(photo, '_blank')
                                        }
                                    )
                                )
                            )
                        ),
                        // Botones de acción
                        React.createElement('div',
                            {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '12px',
                                    marginTop: '16px'
                                }
                            },
                            React.createElement('button',
                                {
                                    onClick: () => handleRejectReview(review.id),
                                    style: {
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: '#ff4d4f',
                                        color: 'white',
                                        cursor: 'pointer'
                                    }
                                },
                                'Rechazar'
                            ),
                            React.createElement('button',
                                {
                                    onClick: () => handleApproveReview(review.id),
                                    style: {
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: '#52c41a',
                                        color: 'white',
                                        cursor: 'pointer'
                                    }
                                },
                                'Aprobar'
                            )
                        )
                    )
                )
            )
        )
    );
};

console.log('✅ Product Reviews Component cargado');