// ProductReviews.js - Sistema de reseñas y calificaciones para productos

// Verificar si React está disponible
if (typeof React === 'undefined') {
    console.error('React no está disponible. El componente ProductReviews no funcionará correctamente.');
}

// Datos de ejemplo para reseñas (en producción, estos datos vendrían del backend)
const EXAMPLE_REVIEWS = [
    {
        id: 1,
        userId: 101,
        userName: 'María García',
        userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        rating: 5,
        title: 'Excelente producto',
        comment: 'Mi mascota adora este producto. La calidad es excepcional y el envío fue muy rápido.',
        date: '2023-10-15',
        photos: ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'],
        likes: 12,
        dislikes: 1,
        isVerifiedPurchase: true,
        isModerated: true
    },
    {
        id: 2,
        userId: 102,
        userName: 'Carlos Rodríguez',
        userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        rating: 4,
        title: 'Muy bueno, pero podría mejorar',
        comment: 'El producto es de buena calidad, pero el tamaño es un poco más pequeño de lo que esperaba. Aun así, mi perro está contento con él.',
        date: '2023-09-28',
        photos: [],
        likes: 5,
        dislikes: 0,
        isVerifiedPurchase: true,
        isModerated: true
    },
    {
        id: 3,
        userId: 103,
        userName: 'Ana Martínez',
        userAvatar: 'https://randomuser.me/api/portraits/women/63.jpg',
        rating: 2,
        title: 'No cumplió mis expectativas',
        comment: 'La calidad no es la que esperaba para el precio. Además, mi gato no mostró interés en el producto.',
        date: '2023-10-05',
        photos: [
            'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        ],
        likes: 2,
        dislikes: 3,
        isVerifiedPurchase: true,
        isModerated: true
    },
    {
        id: 4,
        userId: 104,
        userName: 'Javier López',
        userAvatar: 'https://randomuser.me/api/portraits/men/11.jpg',
        rating: 5,
        title: '¡Increíble!',
        comment: 'Superó todas mis expectativas. Mi perro no deja de jugar con él. Definitivamente compraré más productos de esta marca.',
        date: '2023-10-10',
        photos: [],
        likes: 8,
        dislikes: 0,
        isVerifiedPurchase: true,
        isModerated: true
    },
    {
        id: 5,
        userId: 105,
        userName: 'Laura Sánchez',
        userAvatar: 'https://randomuser.me/api/portraits/women/26.jpg',
        rating: 3,
        title: 'Producto aceptable',
        comment: 'Es un producto normal, nada extraordinario. Cumple su función pero no me sorprendió.',
        date: '2023-09-20',
        photos: [],
        likes: 1,
        dislikes: 1,
        isVerifiedPurchase: false,
        isModerated: true
    }
];

// Componente para mostrar una estrella (llena, media o vacía)
function Star({ filled, half }) {
    const starStyle = {
        color: filled ? '#FFD700' : half ? 'linear-gradient(to right, #FFD700 50%, #e4e5e9 50%)' : '#e4e5e9',
        fontSize: '20px',
        marginRight: '2px'
    };
    
    return React.createElement('span', { style: starStyle }, '★');
}

// Componente para mostrar la calificación con estrellas
function StarRating({ rating }) {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars.push(React.createElement(Star, { key: i, filled: true }));
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars.push(React.createElement(Star, { key: i, half: true }));
        } else {
            stars.push(React.createElement(Star, { key: i, filled: false }));
        }
    }
    
    return React.createElement('div', { className: 'star-rating' }, ...stars);
}

// Componente para mostrar una reseña individual
function ReviewItem({ review, onLike, onDislike }) {
    const {
        userName,
        userAvatar,
        rating,
        title,
        comment,
        date,
        photos,
        likes,
        dislikes,
        isVerifiedPurchase
    } = review;
    
    const reviewItemStyle = {
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        backgroundColor: '#fff'
    };
    
    const headerStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '12px'
    };
    
    const avatarStyle = {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        marginRight: '12px',
        objectFit: 'cover'
    };
    
    const userInfoStyle = {
        display: 'flex',
        flexDirection: 'column'
    };
    
    const userNameStyle = {
        fontWeight: 'bold',
        marginBottom: '4px'
    };
    
    const dateStyle = {
        fontSize: '0.8rem',
        color: '#666'
    };
    
    const titleStyle = {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        marginBottom: '8px',
        marginTop: '8px'
    };
    
    const commentStyle = {
        lineHeight: '1.5',
        marginBottom: '12px'
    };
    
    const photosContainerStyle = {
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
        flexWrap: 'wrap'
    };
    
    const photoStyle = {
        width: '80px',
        height: '80px',
        borderRadius: '4px',
        objectFit: 'cover',
        cursor: 'pointer'
    };
    
    const actionsStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };
    
    const reactionStyle = {
        display: 'flex',
        gap: '16px'
    };
    
    const buttonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#666',
        padding: '4px 8px',
        borderRadius: '4px',
        transition: 'background-color 0.2s'
    };
    
    const verifiedBadgeStyle = {
        backgroundColor: '#e8f5e9',
        color: '#2e7d32',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
    };
    
    // Formatear la fecha
    const formattedDate = new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    return React.createElement('div', { style: reviewItemStyle },
        // Cabecera con avatar y nombre de usuario
        React.createElement('div', { style: headerStyle },
            React.createElement('img', { src: userAvatar, alt: userName, style: avatarStyle }),
            React.createElement('div', { style: userInfoStyle },
                React.createElement('div', { style: userNameStyle }, userName),
                React.createElement('div', { style: dateStyle }, formattedDate)
            )
        ),
        
        // Calificación con estrellas
        React.createElement(StarRating, { rating }),
        
        // Título de la reseña
        React.createElement('h4', { style: titleStyle }, title),
        
        // Contenido de la reseña
        React.createElement('p', { style: commentStyle }, comment),
        
        // Fotos (si hay)
        photos && photos.length > 0 && React.createElement('div', { style: photosContainerStyle },
            photos.map((photo, index) => 
                React.createElement('img', {
                    key: index,
                    src: photo,
                    alt: `Foto de reseña ${index + 1}`,
                    style: photoStyle,
                    onClick: () => window.open(photo, '_blank')
                })
            )
        ),
        
        // Acciones (likes, dislikes, etc.)
        React.createElement('div', { style: actionsStyle },
            React.createElement('div', { style: reactionStyle },
                React.createElement('button', {
                    style: buttonStyle,
                    onClick: () => onLike(review.id)
                }, '👍 ', likes),
                React.createElement('button', {
                    style: buttonStyle,
                    onClick: () => onDislike(review.id)
                }, '👎 ', dislikes)
            ),
            isVerifiedPurchase && React.createElement('div', { style: verifiedBadgeStyle },
                '✓ Compra verificada'
            )
        )
    );
}

// Función para verificar si un usuario ha comprado el producto
function checkVerifiedPurchase(productId, userId) {
    // En un entorno real, esta verificación se haría contra una base de datos
    // o un servicio de backend que verifique las compras del usuario
    
    // Para este ejemplo, simulamos la verificación con una probabilidad
    // En producción, esto sería reemplazado por una llamada a la API
    if (!productId || !userId) return false;
    
    // Simulación: 70% de probabilidad de que la compra esté verificada
    return Math.random() > 0.3;
}

// Componente principal de reseñas de productos
function ProductReviews({ productId }) {
    // Estados para manejar las reseñas, filtros, etc.
    const [reviews, setReviews] = React.useState(EXAMPLE_REVIEWS);
    const [filteredReviews, setFilteredReviews] = React.useState(EXAMPLE_REVIEWS);
    const [activeFilter, setActiveFilter] = React.useState(0); // 0 = Todas las reseñas
    const [sortBy, setSortBy] = React.useState('recent'); // 'recent', 'helpful', 'highest', 'lowest'
    const [newReview, setNewReview] = React.useState({
        rating: 5,
        title: '',
        comment: '',
        photos: []
    });
    const [showReviewForm, setShowReviewForm] = React.useState(false);
    const [photoPreview, setPhotoPreview] = React.useState(null);
    
    // Calcular estadísticas de reseñas
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0;
    
    // Contar reseñas por calificación
    const ratingCounts = [5, 4, 3, 2, 1].map(rating => 
        reviews.filter(review => Math.floor(review.rating) === rating).length
    );
    
    // Aplicar filtros y ordenamiento
    React.useEffect(() => {
        let filtered = [...reviews];
        
        // Aplicar filtro por calificación
        if (activeFilter > 0) {
            filtered = filtered.filter(review => Math.floor(review.rating) === activeFilter);
        }
        
        // Aplicar ordenamiento
        switch (sortBy) {
            case 'recent':
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'helpful':
                filtered.sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes));
                break;
            case 'highest':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'lowest':
                filtered.sort((a, b) => a.rating - b.rating);
                break;
            default:
                break;
        }
        
        setFilteredReviews(filtered);
    }, [reviews, activeFilter, sortBy]);
    
    // Manejar likes y dislikes
    const handleLike = (reviewId) => {
        setReviews(reviews.map(review => 
            review.id === reviewId ? { ...review, likes: review.likes + 1 } : review
        ));
    };
    
    const handleDislike = (reviewId) => {
        setReviews(reviews.map(review => 
            review.id === reviewId ? { ...review, dislikes: review.dislikes + 1 } : review
        ));
    };
    
    // Manejar cambios en el formulario de nueva reseña
    const handleReviewChange = (field, value) => {
        setNewReview({ ...newReview, [field]: value });
    };
    
    // Manejar la subida de fotos
    const handlePhotoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            // En un entorno real, aquí se subiría la foto a un servidor
            // Para este ejemplo, creamos una URL local
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    // Añadir la foto a la reseña
    const addPhotoToReview = () => {
        if (photoPreview) {
            setNewReview({
                ...newReview,
                photos: [...newReview.photos, photoPreview]
            });
            setPhotoPreview(null);
        }
    };
    
    // Enviar nueva reseña
    const submitReview = () => {
        // Validar que la reseña tenga título y comentario
        if (!newReview.title.trim() || !newReview.comment.trim()) {
            alert('Por favor, completa el título y el comentario de tu reseña.');
            return;
        }
        
        // En un entorno real, aquí se enviaría la reseña al backend
        const currentUser = window.currentUser || {
            id: 999,
            name: 'Usuario Anónimo',
            avatar: 'https://randomuser.me/api/portraits/lego/1.jpg'
        };
        
        // Verificar si el usuario ha comprado el producto
        const hasVerifiedPurchase = checkVerifiedPurchase(productId, currentUser.id);
        
        if (!hasVerifiedPurchase) {
            alert('Solo los usuarios que han comprado este producto pueden dejar reseñas.');
            return;
        }
        
        const newReviewObject = {
            id: Date.now(), // ID temporal
            userId: currentUser.id,
            userName: currentUser.name,
            userAvatar: currentUser.avatar,
            rating: newReview.rating,
            title: newReview.title,
            comment: newReview.comment,
            date: new Date().toISOString().split('T')[0],
            photos: newReview.photos,
            likes: 0,
            dislikes: 0,
            isVerifiedPurchase: hasVerifiedPurchase, // Basado en la verificación
            isModerated: false // Pendiente de moderación
        };
        
        // Añadir la nueva reseña al estado
        setReviews([newReviewObject, ...reviews]);
        
        // Resetear el formulario
        setNewReview({
            rating: 5,
            title: '',
            comment: '',
            photos: []
        });
        setShowReviewForm(false);
        
        // Mostrar mensaje de éxito
        alert('¡Gracias por tu reseña! Será revisada por nuestro equipo de moderación.');
    };
    
    // Estilos para el componente
    const containerStyle = {
        fontFamily: 'Arial, sans-serif',
        maxWidth: '100%',
        margin: '0 auto',
        padding: '20px 0'
    };
    
    const infoMessageStyle = {
        backgroundColor: '#e8f5e9',
        border: '1px solid #c8e6c9',
        borderRadius: '8px',
        padding: '12px 16px',
        marginBottom: '20px',
        fontSize: '0.9rem',
        color: '#2e7d32',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    };
    
    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
    };
    
    const titleStyle = {
        fontSize: '1.5rem',
        margin: '0'
    };
    
    const buttonStyle = {
        padding: '8px 16px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold'
    };
    
    const statsContainerStyle = {
        display: 'flex',
        gap: '30px',
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
    };
    
    const averageRatingStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    };
    
    const bigRatingStyle = {
        fontSize: '3rem',
        fontWeight: 'bold',
        marginBottom: '8px'
    };
    
    const ratingDistributionStyle = {
        flex: 1
    };
    
    const ratingBarContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '8px'
    };
    
    const ratingLabelStyle = {
        width: '30px',
        marginRight: '8px',
        display: 'flex',
        alignItems: 'center'
    };
    
    const ratingBarStyle = (percentage) => ({
        height: '8px',
        backgroundColor: '#007bff',
        width: `${percentage}%`,
        borderRadius: '4px'
    });
    
    const ratingBarBackgroundStyle = {
        height: '8px',
        backgroundColor: '#e0e0e0',
        width: '100%',
        borderRadius: '4px',
        position: 'relative'
    };
    
    const ratingCountStyle = {
        marginLeft: '8px',
        fontSize: '0.9rem',
        color: '#666',
        width: '30px'
    };
    
    const filtersContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '16px'
    };
    
    const filterButtonsStyle = {
        display: 'flex',
        gap: '8px'
    };
    
    const filterButtonStyle = (isActive) => ({
        padding: '6px 12px',
        backgroundColor: isActive ? '#007bff' : '#f8f9fa',
        color: isActive ? 'white' : '#333',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        cursor: 'pointer'
    });
    
    const sortSelectStyle = {
        padding: '6px 12px',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        backgroundColor: '#fff'
    };
    
    const reviewFormStyle = {
        backgroundColor: '#f8f9fa',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '24px'
    };
    
    const formGroupStyle = {
        marginBottom: '16px'
    };
    
    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'bold'
    };
    
    const inputStyle = {
        width: '100%',
        padding: '8px',
        border: '1px solid #dee2e6',
        borderRadius: '4px'
    };
    
    const textareaStyle = {
        width: '100%',
        padding: '8px',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        minHeight: '100px',
        resize: 'vertical'
    };
    
    const photoUploadStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '16px'
    };
    
    const photoPreviewStyle = {
        width: '80px',
        height: '80px',
        borderRadius: '4px',
        objectFit: 'cover'
    };
    
    const submitButtonStyle = {
        padding: '10px 20px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold'
    };
    
    const noReviewsStyle = {
        textAlign: 'center',
        padding: '40px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        color: '#666'
    };
    
    // Renderizar el componente
    return React.createElement('div', { style: containerStyle },
        // Encabezado con título y botón para añadir reseña
        React.createElement('div', { style: headerStyle },
            React.createElement('h2', { style: titleStyle }, 'Reseñas de clientes'),
            React.createElement('button', {
                style: buttonStyle,
                onClick: () => {
                    if (!showReviewForm) {
                        // Verificar si el usuario ha comprado el producto antes de mostrar el formulario
                        const currentUser = window.currentUser || {
                            id: 999,
                            name: 'Usuario Anónimo',
                            avatar: 'https://randomuser.me/api/portraits/lego/1.jpg'
                        };
                        
                        const hasVerifiedPurchase = checkVerifiedPurchase(productId, currentUser.id);
                        
                        if (!hasVerifiedPurchase) {
                            alert('Solo los usuarios que han comprado este producto pueden dejar reseñas.');
                            return;
                        }
                    }
                    setShowReviewForm(!showReviewForm);
                }
            }, showReviewForm ? 'Cancelar' : 'Escribir una reseña')
        ),
        
        // Mensaje informativo sobre reseñas verificadas
        React.createElement('div', { style: infoMessageStyle },
            React.createElement('span', { style: { fontWeight: 'bold' } }, '✓ Información:'),
            'Solo los usuarios que han comprado este producto pueden dejar reseñas. Las reseñas con el distintivo "Compra verificada" son de clientes que han adquirido el producto.'
        ),
        
        // Estadísticas de reseñas
        totalReviews > 0 && React.createElement('div', { style: statsContainerStyle },
            // Calificación promedio
            React.createElement('div', { style: averageRatingStyle },
                React.createElement('div', { style: bigRatingStyle }, averageRating.toFixed(1)),
                React.createElement(StarRating, { rating: averageRating }),
                React.createElement('div', null, `${totalReviews} reseñas`)
            ),
            
            // Distribución de calificaciones
            React.createElement('div', { style: ratingDistributionStyle },
                [5, 4, 3, 2, 1].map(rating => {
                    const count = ratingCounts[5 - rating];
                    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                    
                    return React.createElement('div', { key: rating, style: ratingBarContainerStyle },
                        React.createElement('div', { style: ratingLabelStyle }, `${rating} ★`),
                        React.createElement('div', { style: ratingBarBackgroundStyle },
                            React.createElement('div', { style: ratingBarStyle(percentage) })
                        ),
                        React.createElement('div', { style: ratingCountStyle }, count)
                    );
                })
            )
        ),
        
        // Formulario para añadir una nueva reseña
        showReviewForm && React.createElement('div', { style: reviewFormStyle },
            React.createElement('h3', null, 'Escribe tu reseña'),
            
            // Calificación con estrellas
            React.createElement('div', { style: formGroupStyle },
                React.createElement('label', { style: labelStyle }, 'Calificación'),
                React.createElement('div', { style: { display: 'flex', gap: '8px' } },
                    [1, 2, 3, 4, 5].map(rating => 
                        React.createElement('span', {
                            key: rating,
                            style: {
                                cursor: 'pointer',
                                fontSize: '24px',
                                color: rating <= newReview.rating ? '#FFD700' : '#e4e5e9'
                            },
                            onClick: () => handleReviewChange('rating', rating)
                        }, '★')
                    )
                )
            ),
            
            // Título de la reseña
            React.createElement('div', { style: formGroupStyle },
                React.createElement('label', { style: labelStyle }, 'Título'),
                React.createElement('input', {
                    type: 'text',
                    style: inputStyle,
                    value: newReview.title,
                    onChange: (e) => handleReviewChange('title', e.target.value),
                    placeholder: 'Resume tu experiencia en una frase'
                })
            ),
            
            // Comentario de la reseña
            React.createElement('div', { style: formGroupStyle },
                React.createElement('label', { style: labelStyle }, 'Comentario'),
                React.createElement('textarea', {
                    style: textareaStyle,
                    value: newReview.comment,
                    onChange: (e) => handleReviewChange('comment', e.target.value),
                    placeholder: 'Cuéntanos más sobre tu experiencia con este producto'
                })
            ),
            
            // Subida de fotos
            React.createElement('div', { style: formGroupStyle },
                React.createElement('label', { style: labelStyle }, 'Añadir fotos (opcional)'),
                React.createElement('div', { style: photoUploadStyle },
                    React.createElement('input', {
                        type: 'file',
                        accept: 'image/*',
                        onChange: handlePhotoUpload
                    }),
                    photoPreview && React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                        React.createElement('img', { src: photoPreview, alt: 'Vista previa', style: photoPreviewStyle }),
                        React.createElement('button', {
                            onClick: addPhotoToReview,
                            style: {
                                padding: '4px 8px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }
                        }, 'Añadir')
                    )
                ),
                
                // Mostrar fotos añadidas
                newReview.photos.length > 0 && React.createElement('div', { style: { display: 'flex', gap: '8px', marginTop: '8px' } },
                    newReview.photos.map((photo, index) => 
                        React.createElement('img', {
                            key: index,
                            src: photo,
                            alt: `Foto ${index + 1}`,
                            style: photoPreviewStyle
                        })
                    )
                )
            ),
            
            // Botón para enviar la reseña
            React.createElement('button', {
                style: submitButtonStyle,
                onClick: submitReview
            }, 'Publicar reseña')
        ),
        
        // Filtros y ordenamiento
        totalReviews > 0 && React.createElement('div', { style: filtersContainerStyle },
            // Botones de filtro por calificación
            React.createElement('div', { style: filterButtonsStyle },
                React.createElement('button', {
                    style: filterButtonStyle(activeFilter === 0),
                    onClick: () => setActiveFilter(0)
                }, 'Todas'),
                [5, 4, 3, 2, 1].map(rating => 
                    React.createElement('button', {
                        key: rating,
                        style: filterButtonStyle(activeFilter === rating),
                        onClick: () => setActiveFilter(rating)
                    }, `${rating} ★`)
                )
            ),
            
            // Selector de ordenamiento
            React.createElement('select', {
                style: sortSelectStyle,
                value: sortBy,
                onChange: (e) => setSortBy(e.target.value)
            },
                React.createElement('option', { value: 'recent' }, 'Más recientes'),
                React.createElement('option', { value: 'helpful' }, 'Más útiles'),
                React.createElement('option', { value: 'highest' }, 'Mayor calificación'),
                React.createElement('option', { value: 'lowest' }, 'Menor calificación')
            )
        ),
        
        // Lista de reseñas
        filteredReviews.length > 0 ?
            filteredReviews.map(review => 
                React.createElement(ReviewItem, {
                    key: review.id,
                    review,
                    onLike: handleLike,
                    onDislike: handleDislike
                })
            ) :
            React.createElement('div', { style: noReviewsStyle },
                React.createElement('h3', null, 'No hay reseñas disponibles'),
                activeFilter > 0 ?
                    React.createElement('p', null, `No hay reseñas con ${activeFilter} estrellas. Prueba con otro filtro.`) :
                    React.createElement('p', null, '¡Sé el primero en dejar una reseña para este producto!')
            )
    );
}

// Exportar el componente para su uso en la aplicación
if (typeof window !== 'undefined') {
    window.ProductReviewsWrapper = function({ productId }) {
        return React.createElement(ProductReviews, { productId });
    };
}