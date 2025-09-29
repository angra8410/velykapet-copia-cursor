// VelyKapet - User Profile Component
// Sistema completo de perfiles de usuario con dashboard y gestión personal

console.log('👤 Cargando User Profile Component...');

function UserProfile() {
    const [activeTab, setActiveTab] = React.useState('dashboard');
    const [userProfile, setUserProfile] = React.useState({
        personalInfo: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            birthDate: '',
            avatar: null
        },
        pets: [],
        addresses: [],
        preferences: {
            notifications: {
                email: true,
                sms: false,
                push: true,
                promotions: true
            },
            favoriteBrands: [],
            favoriteCategories: []
        },
        stats: {
            totalOrders: 0,
            totalSpent: 0,
            favoriteProducts: 0,
            memberSince: new Date()
        }
    });
    
    const [isEditing, setIsEditing] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    // Cargar datos del perfil desde el backend
    React.useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            setLoading(true);
            
            // Obtener usuario actual del authManager
            if (window.authManager && window.authManager.isAuthenticated()) {
                const currentUser = window.authManager.getUser();
                
                // Simular carga de datos adicionales del perfil
                // En una implementación real, esto vendría del backend
                setUserProfile(prev => ({
                    ...prev,
                    personalInfo: {
                        ...prev.personalInfo,
                        firstName: currentUser.name?.split(' ')[0] || '',
                        lastName: currentUser.name?.split(' ').slice(1).join(' ') || '',
                        email: currentUser.email || ''
                    },
                    stats: {
                        ...prev.stats,
                        totalOrders: Math.floor(Math.random() * 15) + 1,
                        totalSpent: Math.floor(Math.random() * 500000) + 50000,
                        favoriteProducts: Math.floor(Math.random() * 20) + 5,
                        memberSince: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
                    }
                }));
            }
        } catch (error) {
            console.error('❌ Error cargando perfil:', error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'personal', label: 'Info Personal', icon: '👤' },
        { id: 'pets', label: 'Mis Mascotas', icon: '🐾' },
        { id: 'addresses', label: 'Direcciones', icon: '📍' },
        { id: 'preferences', label: 'Preferencias', icon: '⚙️' }
    ];

    const renderDashboard = () => {
        return React.createElement('div',
            { className: 'profile-dashboard' },
            
            // Banner eliminado por solicitud del usuario
            React.createElement('div', 
                {
                    style: {
                        marginBottom: '20px',
                        textAlign: 'center'
                    }
                },
                React.createElement('h2',
                    {
                        style: {
                            fontSize: '1.8rem',
                            marginBottom: '10px',
                            color: '#4A90E2'
                        }
                    },
                    `👋 ¡Hola, ${userProfile.personalInfo.firstName || 'Usuario'}!`
                )
            ),

            // Estadísticas principales
            React.createElement('div',
                {
                    className: 'stats-grid',
                    style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '20px',
                        marginBottom: '30px'
                    }
                },
                
                // Total de órdenes
                React.createElement('div',
                    {
                        className: 'stat-card',
                        style: {
                            background: 'white',
                            borderRadius: '12px',
                            padding: '25px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            textAlign: 'center',
                            border: '1px solid #f0f0f0'
                        }
                    },
                    React.createElement('div',
                        { style: { fontSize: '2.5rem', marginBottom: '10px' } },
                        '🛍️'
                    ),
                    React.createElement('h3',
                        { style: { fontSize: '2rem', margin: '0 0 5px', color: '#333' } },
                        userProfile.stats.totalOrders
                    ),
                    React.createElement('p',
                        { style: { margin: 0, color: '#666' } },
                        'Órdenes realizadas'
                    )
                ),

                // Total gastado
                React.createElement('div',
                    {
                        className: 'stat-card',
                        style: {
                            background: 'white',
                            borderRadius: '12px',
                            padding: '25px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            textAlign: 'center',
                            border: '1px solid #f0f0f0'
                        }
                    },
                    React.createElement('div',
                        { style: { fontSize: '2.5rem', marginBottom: '10px' } },
                        '💰'
                    ),
                    React.createElement('h3',
                        { style: { fontSize: '1.5rem', margin: '0 0 5px', color: '#28a745' } },
                        window.formatCOP ? window.formatCOP(userProfile.stats.totalSpent) : `$${userProfile.stats.totalSpent.toLocaleString()}`
                    ),
                    React.createElement('p',
                        { style: { margin: 0, color: '#666' } },
                        'Total invertido'
                    )
                ),

                // Productos favoritos
                React.createElement('div',
                    {
                        className: 'stat-card',
                        style: {
                            background: 'white',
                            borderRadius: '12px',
                            padding: '25px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            textAlign: 'center',
                            border: '1px solid #f0f0f0'
                        }
                    },
                    React.createElement('div',
                        { style: { fontSize: '2.5rem', marginBottom: '10px' } },
                        '⭐'
                    ),
                    React.createElement('h3',
                        { style: { fontSize: '2rem', margin: '0 0 5px', color: '#333' } },
                        userProfile.stats.favoriteProducts
                    ),
                    React.createElement('p',
                        { style: { margin: 0, color: '#666' } },
                        'Productos favoritos'
                    )
                ),

                // Tiempo como miembro
                React.createElement('div',
                    {
                        className: 'stat-card',
                        style: {
                            background: 'white',
                            borderRadius: '12px',
                            padding: '25px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            textAlign: 'center',
                            border: '1px solid #f0f0f0'
                        }
                    },
                    React.createElement('div',
                        { style: { fontSize: '2.5rem', marginBottom: '10px' } },
                        '🎉'
                    ),
                    React.createElement('h3',
                        { style: { fontSize: '1.3rem', margin: '0 0 5px', color: '#333' } },
                        `Desde ${userProfile.stats.memberSince.toLocaleDateString()}`
                    ),
                    React.createElement('p',
                        { style: { margin: 0, color: '#666' } },
                        'Miembro VelyKapet'
                    )
                )
            ),

            // Acciones rápidas
            React.createElement('div',
                {
                    className: 'quick-actions',
                    style: {
                        background: 'white',
                        borderRadius: '12px',
                        padding: '25px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        border: '1px solid #f0f0f0'
                    }
                },
                React.createElement('h3',
                    {
                        style: {
                            fontSize: '1.3rem',
                            marginBottom: '20px',
                            color: '#333',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }
                    },
                    '⚡', 'Acciones Rápidas'
                ),
                React.createElement('div',
                    {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '15px'
                        }
                    },
                    
                    React.createElement('button',
                        {
                            onClick: () => setActiveTab('pets'),
                            style: {
                                background: 'linear-gradient(135deg, #4A90E2, #357ABD)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '15px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                fontSize: '14px',
                                fontWeight: '600'
                            }
                        },
                        '🐾', 'Gestionar Mascotas'
                    ),
                    
                    React.createElement('button',
                        {
                            onClick: () => window.setCurrentView('catalog'),
                            style: {
                                background: '#f8f9fa',
                                color: '#333',
                                border: '1px solid #dee2e6',
                                borderRadius: '8px',
                                padding: '15px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                fontSize: '14px',
                                fontWeight: '600'
                            }
                        },
                        '🛍️', 'Explorar Catálogo'
                    ),
                    
                    React.createElement('button',
                        {
                            onClick: () => setActiveTab('addresses'),
                            style: {
                                background: '#f8f9fa',
                                color: '#333',
                                border: '1px solid #dee2e6',
                                borderRadius: '8px',
                                padding: '15px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                fontSize: '14px',
                                fontWeight: '600'
                            }
                        },
                        '📍', 'Mis Direcciones'
                    )
                )
            )
        );
    };

    const renderPersonalInfo = () => {
        const handleInputChange = (field, value) => {
            setUserProfile(prev => ({
                ...prev,
                personalInfo: {
                    ...prev.personalInfo,
                    [field]: value
                }
            }));
        };

        const handleSave = async () => {
            try {
                // Aquí iría la lógica para guardar en el backend
                console.log('💾 Guardando información personal:', userProfile.personalInfo);
                setIsEditing(false);
                // Simular guardado exitoso
                alert('✅ Información guardada exitosamente');
            } catch (error) {
                console.error('❌ Error guardando:', error);
                alert('❌ Error al guardar la información');
            }
        };

        return React.createElement('div',
            {
                className: 'personal-info-section',
                style: {
                    background: 'white',
                    borderRadius: '12px',
                    padding: '30px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }
            },
            
            // Header con botón de editar
            React.createElement('div',
                {
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '30px',
                        borderBottom: '2px solid #f0f0f0',
                        paddingBottom: '15px'
                    }
                },
                React.createElement('h3',
                    {
                        style: {
                            fontSize: '1.5rem',
                            color: '#333',
                            margin: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }
                    },
                    '👤', 'Información Personal'
                ),
                React.createElement('div',
                    { style: { display: 'flex', gap: '10px' } },
                    isEditing ? [
                        React.createElement('button',
                            {
                                key: 'save',
                                onClick: handleSave,
                                style: {
                                    background: 'linear-gradient(135deg, #28a745, #20c997)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }
                            },
                            '✅ Guardar'
                        ),
                        React.createElement('button',
                            {
                                key: 'cancel',
                                onClick: () => setIsEditing(false),
                                style: {
                                    background: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }
                            },
                            '❌ Cancelar'
                        )
                    ] : React.createElement('button',
                        {
                            onClick: () => setIsEditing(true),
                            style: {
                                background: 'linear-gradient(135deg, #4A90E2, #357ABD)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 16px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600'
                            }
                        },
                        '✏️ Editar'
                    )
                )
            ),

            // Formulario de información personal
            React.createElement('div',
                {
                    className: 'personal-form',
                    style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '20px'
                    }
                },
                
                // Nombre
                React.createElement('div',
                    { className: 'form-group' },
                    React.createElement('label',
                        {
                            style: {
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: '600',
                                color: '#333'
                            }
                        },
                        '👤 Nombre'
                    ),
                    React.createElement('input',
                        {
                            type: 'text',
                            value: userProfile.personalInfo.firstName,
                            onChange: (e) => handleInputChange('firstName', e.target.value),
                            disabled: !isEditing,
                            style: {
                                width: '100%',
                                padding: '12px',
                                border: isEditing ? '2px solid #4A90E2' : '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '16px',
                                background: isEditing ? 'white' : '#f8f9fa',
                                boxSizing: 'border-box'
                            }
                        }
                    )
                ),

                // Apellido
                React.createElement('div',
                    { className: 'form-group' },
                    React.createElement('label',
                        {
                            style: {
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: '600',
                                color: '#333'
                            }
                        },
                        '👥 Apellido'
                    ),
                    React.createElement('input',
                        {
                            type: 'text',
                            value: userProfile.personalInfo.lastName,
                            onChange: (e) => handleInputChange('lastName', e.target.value),
                            disabled: !isEditing,
                            style: {
                                width: '100%',
                                padding: '12px',
                                border: isEditing ? '2px solid #E45A84' : '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '16px',
                                background: isEditing ? 'white' : '#f8f9fa',
                                boxSizing: 'border-box'
                            }
                        }
                    )
                ),

                // Email
                React.createElement('div',
                    { className: 'form-group' },
                    React.createElement('label',
                        {
                            style: {
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: '600',
                                color: '#333'
                            }
                        },
                        '📧 Email'
                    ),
                    React.createElement('input',
                        {
                            type: 'email',
                            value: userProfile.personalInfo.email,
                            onChange: (e) => handleInputChange('email', e.target.value),
                            disabled: true, // Email no editable por seguridad
                            style: {
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '16px',
                                background: '#f8f9fa',
                                boxSizing: 'border-box',
                                color: '#666'
                            }
                        }
                    ),
                    React.createElement('small',
                        { style: { color: '#999', fontSize: '12px' } },
                        'El email no se puede modificar por seguridad'
                    )
                ),

                // Teléfono
                React.createElement('div',
                    { className: 'form-group' },
                    React.createElement('label',
                        {
                            style: {
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: '600',
                                color: '#333'
                            }
                        },
                        '📱 Teléfono'
                    ),
                    React.createElement('input',
                        {
                            type: 'tel',
                            value: userProfile.personalInfo.phone,
                            onChange: (e) => handleInputChange('phone', e.target.value),
                            disabled: !isEditing,
                            placeholder: '+57 300 123 4567',
                            style: {
                                width: '100%',
                                padding: '12px',
                                border: isEditing ? '2px solid #E45A84' : '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '16px',
                                background: isEditing ? 'white' : '#f8f9fa',
                                boxSizing: 'border-box'
                            }
                        }
                    )
                ),

                // Fecha de nacimiento
                React.createElement('div',
                    { className: 'form-group' },
                    React.createElement('label',
                        {
                            style: {
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: '600',
                                color: '#333'
                            }
                        },
                        '🎂 Fecha de Nacimiento'
                    ),
                    React.createElement('input',
                        {
                            type: 'date',
                            value: userProfile.personalInfo.birthDate,
                            onChange: (e) => handleInputChange('birthDate', e.target.value),
                            disabled: !isEditing,
                            style: {
                                width: '100%',
                                padding: '12px',
                                border: isEditing ? '2px solid #E45A84' : '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '16px',
                                background: isEditing ? 'white' : '#f8f9fa',
                                boxSizing: 'border-box'
                            }
                        }
                    )
                )
            ),

            // Información adicional si no está editando
            !isEditing && React.createElement('div',
                {
                    style: {
                        marginTop: '30px',
                        padding: '20px',
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        border: '1px solid #e9ecef'
                    }
                },
                React.createElement('h4',
                    { style: { color: '#666', marginBottom: '15px' } },
                    '📊 Estadísticas de Cuenta'
                ),
                React.createElement('div',
                    {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '15px'
                        }
                    },
                    React.createElement('div',
                        { style: { textAlign: 'center' } },
                        React.createElement('div', { style: { fontSize: '1.5rem', fontWeight: 'bold', color: '#E45A84' } }, userProfile.stats.totalOrders),
                        React.createElement('div', { style: { fontSize: '14px', color: '#666' } }, 'Órdenes realizadas')
                    ),
                    React.createElement('div',
                        { style: { textAlign: 'center' } },
                        React.createElement('div', { style: { fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' } }, 
                            window.formatCOP ? window.formatCOP(userProfile.stats.totalSpent) : `$${userProfile.stats.totalSpent.toLocaleString()}`
                        ),
                        React.createElement('div', { style: { fontSize: '14px', color: '#666' } }, 'Total gastado')
                    ),
                    React.createElement('div',
                        { style: { textAlign: 'center' } },
                        React.createElement('div', { style: { fontSize: '1.5rem', fontWeight: 'bold', color: '#17a2b8' } }, 
                            Math.floor((new Date() - userProfile.stats.memberSince) / (1000 * 60 * 60 * 24))
                        ),
                        React.createElement('div', { style: { fontSize: '14px', color: '#666' } }, 'Días como miembro')
                    )
                )
            )
        );
    };

    const [showAddPetForm, setShowAddPetForm] = React.useState(false);
    const [editingPet, setEditingPet] = React.useState(null);
    const [newPet, setNewPet] = React.useState({
        name: '',
        type: 'perro',
        breed: '',
        age: '',
        weight: '',
        gender: 'macho',
        color: '',
        microchip: '',
        vaccinated: false,
        sterilized: false,
        medicalNotes: '',
        photo: null
    });

    const petBreeds = {
        perro: [
            'Labrador Retriever', 'Golden Retriever', 'Bulldog Francés', 'Pastor Alemán', 'Beagle',
            'Rottweiler', 'Yorkshire Terrier', 'Poodle', 'Boxer', 'Husky Siberiano',
            'Chihuahua', 'Dachshund', 'Shih Tzu', 'Boston Terrier', 'Mestizo'
        ],
        gato: [
            'Persa', 'Siames', 'Maine Coon', 'Ragdoll', 'Bengal',
            'Británico de Pelo Corto', 'Abisinio', 'Ruso Azul', 'Sphynx', 'Scottish Fold',
            'Angora Turco', 'Birmano', 'Mestizo'
        ]
    };

    const handleAddPet = async () => {
        try {
            const petToAdd = {
                ...newPet,
                id: Date.now().toString(),
                registeredDate: new Date().toISOString()
            };
            
            setUserProfile(prev => ({
                ...prev,
                pets: [...prev.pets, petToAdd]
            }));
            
            // Reset form
            setNewPet({
                name: '',
                type: 'perro',
                breed: '',
                age: '',
                weight: '',
                gender: 'macho',
                color: '',
                microchip: '',
                vaccinated: false,
                sterilized: false,
                medicalNotes: '',
                photo: null
            });
            setShowAddPetForm(false);
            
            console.log('🐾 Mascota agregada:', petToAdd);
            alert('✅ Mascota registrada exitosamente!');
        } catch (error) {
            console.error('❌ Error agregando mascota:', error);
            alert('❌ Error al registrar la mascota');
        }
    };

    const handleEditPet = (pet) => {
        setEditingPet(pet);
        setNewPet(pet);
        setShowAddPetForm(true);
    };

    const handleUpdatePet = async () => {
        try {
            setUserProfile(prev => ({
                ...prev,
                pets: prev.pets.map(pet => 
                    pet.id === editingPet.id ? { ...newPet, id: editingPet.id, registeredDate: editingPet.registeredDate } : pet
                )
            }));
            
            setNewPet({
                name: '',
                type: 'perro',
                breed: '',
                age: '',
                weight: '',
                gender: 'macho',
                color: '',
                microchip: '',
                vaccinated: false,
                sterilized: false,
                medicalNotes: '',
                photo: null
            });
            setEditingPet(null);
            setShowAddPetForm(false);
            
            console.log('🐾 Mascota actualizada');
            alert('✅ Mascota actualizada exitosamente!');
        } catch (error) {
            console.error('❌ Error actualizando mascota:', error);
            alert('❌ Error al actualizar la mascota');
        }
    };

    const handleDeletePet = async (petId) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta mascota?')) {
            try {
                setUserProfile(prev => ({
                    ...prev,
                    pets: prev.pets.filter(pet => pet.id !== petId)
                }));
                
                console.log('🐾 Mascota eliminada:', petId);
                alert('✅ Mascota eliminada exitosamente!');
            } catch (error) {
                console.error('❌ Error eliminando mascota:', error);
                alert('❌ Error al eliminar la mascota');
            }
        }
    };

    const renderPets = () => {
        return React.createElement('div',
            {
                className: 'pets-section',
                style: {
                    background: 'white',
                    borderRadius: '12px',
                    padding: '30px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }
            },
            
            // Header
            React.createElement('div',
                {
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '30px',
                        borderBottom: '2px solid #f0f0f0',
                        paddingBottom: '15px'
                    }
                },
                React.createElement('h3',
                    {
                        style: {
                            fontSize: '1.5rem',
                            color: '#333',
                            margin: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }
                    },
                    '🐾', `Mis Mascotas (${userProfile.pets.length})`
                ),
                React.createElement('button',
                    {
                        onClick: () => setShowAddPetForm(true),
                        style: {
                            background: 'linear-gradient(135deg, #28a745, #20c997)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '12px 20px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }
                    },
                    '➕', 'Agregar Mascota'
                )
            ),

            // Lista de mascotas
            userProfile.pets.length === 0 ? 
                React.createElement('div',
                    {
                        style: {
                            textAlign: 'center',
                            padding: '60px 20px',
                            background: '#f8f9fa',
                            borderRadius: '12px',
                            border: '2px dashed #dee2e6'
                        }
                    },
                    React.createElement('div',
                        { style: { fontSize: '4rem', marginBottom: '20px' } },
                        '🐶'
                    ),
                    React.createElement('h4',
                        { style: { color: '#666', marginBottom: '10px' } },
                        'Aún no has registrado ninguna mascota'
                    ),
                    React.createElement('p',
                        { style: { color: '#999', marginBottom: '20px' } },
                        'Agrega información sobre tus mascotas para una mejor experiencia'
                    ),
                    React.createElement('button',
                        {
                            onClick: () => setShowAddPetForm(true),
                            style: {
                                background: 'linear-gradient(135deg, #E45A84, #D94876)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '15px 25px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '600'
                            }
                        },
                        '🐾 Registrar mi primera mascota'
                    )
                ) :
                React.createElement('div',
                    {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '20px'
                        }
                    },
                    userProfile.pets.map(pet =>
                        React.createElement('div',
                            {
                                key: pet.id,
                                className: 'pet-card',
                                style: {
                                    background: 'white',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    border: '1px solid #e9ecef',
                                    position: 'relative'
                                }
                            },
                            
                            // Avatar y nombre
                            React.createElement('div',
                                {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px',
                                        marginBottom: '20px'
                                    }
                                },
                                React.createElement('div',
                                    {
                                        style: {
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '50%',
                                            background: pet.type === 'perro' ? 
                                                'linear-gradient(135deg, #ff6b6b, #ee5a24)' :
                                                'linear-gradient(135deg, #74b9ff, #0984e3)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.5rem'
                                        }
                                    },
                                    pet.type === 'perro' ? '🐶' : '🐱'
                                ),
                                React.createElement('div',
                                    null,
                                    React.createElement('h4',
                                        {
                                            style: {
                                                margin: '0 0 5px',
                                                color: '#333',
                                                fontSize: '1.3rem'
                                            }
                                        },
                                        pet.name
                                    ),
                                    React.createElement('p',
                                        {
                                            style: {
                                                margin: 0,
                                                color: '#666',
                                                fontSize: '14px'
                                            }
                                        },
                                        `${pet.breed} • ${pet.gender === 'macho' ? '♂️' : '♀️'}`
                                    )
                                )
                            ),
                            
                            // Información básica
                            React.createElement('div',
                                {
                                    style: {
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '15px',
                                        marginBottom: '20px'
                                    }
                                },
                                React.createElement('div',
                                    { style: { textAlign: 'center' } },
                                    React.createElement('div',
                                        { style: { fontSize: '1.2rem', fontWeight: 'bold', color: '#E45A84' } },
                                        pet.age ? `${pet.age} años` : 'N/A'
                                    ),
                                    React.createElement('div',
                                        { style: { fontSize: '12px', color: '#666' } },
                                        'Edad'
                                    )
                                ),
                                React.createElement('div',
                                    { style: { textAlign: 'center' } },
                                    React.createElement('div',
                                        { style: { fontSize: '1.2rem', fontWeight: 'bold', color: '#28a745' } },
                                        pet.weight ? `${pet.weight} kg` : 'N/A'
                                    ),
                                    React.createElement('div',
                                        { style: { fontSize: '12px', color: '#666' } },
                                        'Peso'
                                    )
                                )
                            ),
                            
                            // Estado de salud
                            React.createElement('div',
                                {
                                    style: {
                                        display: 'flex',
                                        gap: '10px',
                                        marginBottom: '20px',
                                        flexWrap: 'wrap'
                                    }
                                },
                                React.createElement('span',
                                    {
                                        style: {
                                            background: pet.vaccinated ? '#d4edda' : '#f8d7da',
                                            color: pet.vaccinated ? '#155724' : '#721c24',
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }
                                    },
                                    pet.vaccinated ? '✅ Vacunado' : '❌ Sin vacunar'
                                ),
                                React.createElement('span',
                                    {
                                        style: {
                                            background: pet.sterilized ? '#d4edda' : '#fff3cd',
                                            color: pet.sterilized ? '#155724' : '#856404',
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }
                                    },
                                    pet.sterilized ? '✅ Esterilizado' : '⚠️ No esterilizado'
                                )
                            ),
                            
                            // Acciones
                            React.createElement('div',
                                {
                                    style: {
                                        display: 'flex',
                                        gap: '10px'
                                    }
                                },
                                React.createElement('button',
                                    {
                                        onClick: () => handleEditPet(pet),
                                        style: {
                                            flex: 1,
                                            background: '#17a2b8',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            padding: '8px 12px',
                                            cursor: 'pointer',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }
                                    },
                                    '✏️ Editar'
                                ),
                                React.createElement('button',
                                    {
                                        onClick: () => handleDeletePet(pet.id),
                                        style: {
                                            background: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            padding: '8px 12px',
                                            cursor: 'pointer',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }
                                    },
                                    '🗑️'
                                )
                            )
                        )
                    )
                ),

            // Modal para agregar/editar mascota
            showAddPetForm && React.createElement('div',
                {
                    style: {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '20px'
                    }
                },
                React.createElement('div',
                    {
                        style: {
                            background: 'white',
                            borderRadius: '12px',
                            padding: '30px',
                            maxWidth: '600px',
                            width: '100%',
                            maxHeight: '80vh',
                            overflow: 'auto'
                        }
                    },
                    
                    // Header del modal
                    React.createElement('div',
                        {
                            style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '25px',
                                paddingBottom: '15px',
                                borderBottom: '2px solid #f0f0f0'
                            }
                        },
                        React.createElement('h3',
                            {
                                style: {
                                    margin: 0,
                                    color: '#333',
                                    fontSize: '1.5rem'
                                }
                            },
                            editingPet ? '✏️ Editar Mascota' : '🐾 Agregar Nueva Mascota'
                        ),
                        React.createElement('button',
                            {
                                onClick: () => {
                                    setShowAddPetForm(false);
                                    setEditingPet(null);
                                    setNewPet({
                                        name: '',
                                        type: 'perro',
                                        breed: '',
                                        age: '',
                                        weight: '',
                                        gender: 'macho',
                                        color: '',
                                        microchip: '',
                                        vaccinated: false,
                                        sterilized: false,
                                        medicalNotes: '',
                                        photo: null
                                    });
                                },
                                style: {
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    color: '#666'
                                }
                            },
                            '✕'
                        )
                    ),
                    
                    // Formulario
                    React.createElement('div',
                        {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '20px'
                            }
                        },
                        
                        // Nombre
                        React.createElement('div',
                            {
                                style: { gridColumn: '1 / -1' }
                            },
                            React.createElement('label',
                                {
                                    style: {
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#333'
                                    }
                                },
                                '📝 Nombre de la mascota *'
                            ),
                            React.createElement('input',
                                {
                                    type: 'text',
                                    value: newPet.name,
                                    onChange: (e) => setNewPet(prev => ({ ...prev, name: e.target.value })),
                                    placeholder: 'Ej: Max, Luna, Rocky...',
                                    required: true,
                                    style: {
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #E45A84',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        boxSizing: 'border-box'
                                    }
                                }
                            )
                        ),
                        
                        // Tipo
                        React.createElement('div',
                            null,
                            React.createElement('label',
                                {
                                    style: {
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#333'
                                    }
                                },
                                '🐾 Tipo de mascota *'
                            ),
                            React.createElement('select',
                                {
                                    value: newPet.type,
                                    onChange: (e) => setNewPet(prev => ({ ...prev, type: e.target.value, breed: '' })),
                                    style: {
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #E45A84',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        boxSizing: 'border-box'
                                    }
                                },
                                React.createElement('option', { value: 'perro' }, '🐶 Perro'),
                                React.createElement('option', { value: 'gato' }, '🐱 Gato')
                            )
                        ),
                        
                        // Raza
                        React.createElement('div',
                            null,
                            React.createElement('label',
                                {
                                    style: {
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#333'
                                    }
                                },
                                '🧠 Raza *'
                            ),
                            React.createElement('select',
                                {
                                    value: newPet.breed,
                                    onChange: (e) => setNewPet(prev => ({ ...prev, breed: e.target.value })),
                                    style: {
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #E45A84',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        boxSizing: 'border-box'
                                    }
                                },
                                React.createElement('option', { value: '' }, 'Seleccionar raza...'),
                                petBreeds[newPet.type].map(breed =>
                                    React.createElement('option', { key: breed, value: breed }, breed)
                                )
                            )
                        ),
                        
                        // Edad
                        React.createElement('div',
                            null,
                            React.createElement('label',
                                {
                                    style: {
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#333'
                                    }
                                },
                                '🎂 Edad (años)'
                            ),
                            React.createElement('input',
                                {
                                    type: 'number',
                                    value: newPet.age,
                                    onChange: (e) => setNewPet(prev => ({ ...prev, age: e.target.value })),
                                    placeholder: 'Ej: 2',
                                    min: '0',
                                    max: '30',
                                    style: {
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        boxSizing: 'border-box'
                                    }
                                }
                            )
                        ),
                        
                        // Peso
                        React.createElement('div',
                            null,
                            React.createElement('label',
                                {
                                    style: {
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#333'
                                    }
                                },
                                '⚖️ Peso (kg)'
                            ),
                            React.createElement('input',
                                {
                                    type: 'number',
                                    value: newPet.weight,
                                    onChange: (e) => setNewPet(prev => ({ ...prev, weight: e.target.value })),
                                    placeholder: 'Ej: 15.5',
                                    min: '0',
                                    step: '0.1',
                                    style: {
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        boxSizing: 'border-box'
                                    }
                                }
                            )
                        ),
                        
                        // Género
                        React.createElement('div',
                            null,
                            React.createElement('label',
                                {
                                    style: {
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#333'
                                    }
                                },
                                '⚪ Género'
                            ),
                            React.createElement('select',
                                {
                                    value: newPet.gender,
                                    onChange: (e) => setNewPet(prev => ({ ...prev, gender: e.target.value })),
                                    style: {
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        boxSizing: 'border-box'
                                    }
                                },
                                React.createElement('option', { value: 'macho' }, '♂️ Macho'),
                                React.createElement('option', { value: 'hembra' }, '♀️ Hembra')
                            )
                        ),
                        
                        // Color
                        React.createElement('div',
                            null,
                            React.createElement('label',
                                {
                                    style: {
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#333'
                                    }
                                },
                                '🎨 Color'
                            ),
                            React.createElement('input',
                                {
                                    type: 'text',
                                    value: newPet.color,
                                    onChange: (e) => setNewPet(prev => ({ ...prev, color: e.target.value })),
                                    placeholder: 'Ej: Dorado, Negro, Tricolor...',
                                    style: {
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        boxSizing: 'border-box'
                                    }
                                }
                            )
                        ),
                        
                        // Microchip
                        React.createElement('div',
                            {
                                style: { gridColumn: '1 / -1' }
                            },
                            React.createElement('label',
                                {
                                    style: {
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#333'
                                    }
                                },
                                '📶 Número de Microchip'
                            ),
                            React.createElement('input',
                                {
                                    type: 'text',
                                    value: newPet.microchip,
                                    onChange: (e) => setNewPet(prev => ({ ...prev, microchip: e.target.value })),
                                    placeholder: 'Ej: 982000123456789',
                                    style: {
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        boxSizing: 'border-box'
                                    }
                                }
                            )
                        ),
                        
                        // Estados de salud
                        React.createElement('div',
                            {
                                style: { gridColumn: '1 / -1' }
                            },
                            React.createElement('label',
                                {
                                    style: {
                                        display: 'block',
                                        marginBottom: '15px',
                                        fontWeight: '600',
                                        color: '#333'
                                    }
                                },
                                '🏥 Estado de Salud'
                            ),
                            React.createElement('div',
                                {
                                    style: {
                                        display: 'flex',
                                        gap: '20px',
                                        marginBottom: '15px'
                                    }
                                },
                                React.createElement('label',
                                    {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            cursor: 'pointer'
                                        }
                                    },
                                    React.createElement('input',
                                        {
                                            type: 'checkbox',
                                            checked: newPet.vaccinated,
                                            onChange: (e) => setNewPet(prev => ({ ...prev, vaccinated: e.target.checked })),
                                            style: {
                                                width: '18px',
                                                height: '18px'
                                            }
                                        }
                                    ),
                                    '💉 Vacunado'
                                ),
                                React.createElement('label',
                                    {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            cursor: 'pointer'
                                        }
                                    },
                                    React.createElement('input',
                                        {
                                            type: 'checkbox',
                                            checked: newPet.sterilized,
                                            onChange: (e) => setNewPet(prev => ({ ...prev, sterilized: e.target.checked })),
                                            style: {
                                                width: '18px',
                                                height: '18px'
                                            }
                                        }
                                    ),
                                    '✂️ Esterilizado'
                                )
                            )
                        ),
                        
                        // Notas médicas
                        React.createElement('div',
                            {
                                style: { gridColumn: '1 / -1' }
                            },
                            React.createElement('label',
                                {
                                    style: {
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#333'
                                    }
                                },
                                '📝 Notas Médicas'
                            ),
                            React.createElement('textarea',
                                {
                                    value: newPet.medicalNotes,
                                    onChange: (e) => setNewPet(prev => ({ ...prev, medicalNotes: e.target.value })),
                                    placeholder: 'Alergias, medicamentos, observaciones especiales...',
                                    rows: 3,
                                    style: {
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        boxSizing: 'border-box',
                                        resize: 'vertical'
                                    }
                                }
                            )
                        )
                    ),
                    
                    // Botones de acción
                    React.createElement('div',
                        {
                            style: {
                                display: 'flex',
                                gap: '15px',
                                marginTop: '30px',
                                paddingTop: '20px',
                                borderTop: '1px solid #eee'
                            }
                        },
                        React.createElement('button',
                            {
                                onClick: () => {
                                    setShowAddPetForm(false);
                                    setEditingPet(null);
                                    setNewPet({
                                        name: '',
                                        type: 'perro',
                                        breed: '',
                                        age: '',
                                        weight: '',
                                        gender: 'macho',
                                        color: '',
                                        microchip: '',
                                        vaccinated: false,
                                        sterilized: false,
                                        medicalNotes: '',
                                        photo: null
                                    });
                                },
                                style: {
                                    flex: 1,
                                    background: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: '600'
                                }
                            },
                            '❌ Cancelar'
                        ),
                        React.createElement('button',
                            {
                                onClick: editingPet ? handleUpdatePet : handleAddPet,
                                disabled: !newPet.name || !newPet.breed,
                                style: {
                                    flex: 2,
                                    background: (!newPet.name || !newPet.breed) ? '#ccc' : 
                                        'linear-gradient(135deg, #28a745, #20c997)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    cursor: (!newPet.name || !newPet.breed) ? 'not-allowed' : 'pointer',
                                    fontSize: '16px',
                                    fontWeight: '600'
                                }
                            },
                            editingPet ? '✅ Actualizar Mascota' : '✅ Registrar Mascota'
                        )
                    )
                )
            )
        );
    };

    const [showAddAddressForm, setShowAddAddressForm] = React.useState(false);
    const [editingAddress, setEditingAddress] = React.useState(null);
    const [newAddress, setNewAddress] = React.useState({
        name: '',
        recipientName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Colombia',
        addressType: 'home',
        instructions: '',
        isPrimary: false
    });

    const colombianCities = [
        'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta', 'Bucaramanga', 'Pereira',
        'Santa Marta', 'Ibagué', 'Soledad', 'Soacha', 'Pasto', 'Villavicencio', 'Bello',
        'Valledupar', 'Montero', 'Palmira', 'Sincelejo', 'Floridablanca', 'Buenaventura'
    ];

    const colombianStates = [
        'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá', 'Caldas', 'Caquetá',
        'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare',
        'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo',
        'Quindío', 'Risaralda', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada'
    ];

    const handleAddAddress = async () => {
        try {
            const addressToAdd = {
                ...newAddress,
                id: Date.now().toString(),
                createdDate: new Date().toISOString()
            };
            
            // Si es la primera dirección o se marca como principal, hacerla principal
            if (userProfile.addresses.length === 0 || newAddress.isPrimary) {
                addressToAdd.isPrimary = true;
                // Si hay otras direcciones, quitarles el estado de principal
                const updatedAddresses = userProfile.addresses.map(addr => ({
                    ...addr,
                    isPrimary: false
                }));
                
                setUserProfile(prev => ({
                    ...prev,
                    addresses: [...updatedAddresses, addressToAdd]
                }));
            } else {
                setUserProfile(prev => ({
                    ...prev,
                    addresses: [...prev.addresses, addressToAdd]
                }));
            }
            
            // Reset form
            setNewAddress({
                name: '',
                recipientName: '',
                phone: '',
                address: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'Colombia',
                addressType: 'home',
                instructions: '',
                isPrimary: false
            });
            setShowAddAddressForm(false);
            
            console.log('📍 Dirección agregada:', addressToAdd);
            alert('✅ Dirección registrada exitosamente!');
        } catch (error) {
            console.error('❌ Error agregando dirección:', error);
            alert('❌ Error al registrar la dirección');
        }
    };

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        setNewAddress(address);
        setShowAddAddressForm(true);
    };

    const handleUpdateAddress = async () => {
        try {
            let updatedAddresses;
            
            if (newAddress.isPrimary) {
                // Si se marca como principal, quitar el estado de principal de las otras
                updatedAddresses = userProfile.addresses.map(addr => ({
                    ...addr,
                    isPrimary: addr.id === editingAddress.id ? true : false
                }));
                
                updatedAddresses = updatedAddresses.map(addr => 
                    addr.id === editingAddress.id ? 
                        { ...newAddress, id: editingAddress.id, createdDate: editingAddress.createdDate } : 
                        addr
                );
            } else {
                updatedAddresses = userProfile.addresses.map(addr => 
                    addr.id === editingAddress.id ? 
                        { ...newAddress, id: editingAddress.id, createdDate: editingAddress.createdDate } : 
                        addr
                );
            }
            
            setUserProfile(prev => ({
                ...prev,
                addresses: updatedAddresses
            }));
            
            setNewAddress({
                name: '',
                recipientName: '',
                phone: '',
                address: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'Colombia',
                addressType: 'home',
                instructions: '',
                isPrimary: false
            });
            setEditingAddress(null);
            setShowAddAddressForm(false);
            
            console.log('📍 Dirección actualizada');
            alert('✅ Dirección actualizada exitosamente!');
        } catch (error) {
            console.error('❌ Error actualizando dirección:', error);
            alert('❌ Error al actualizar la dirección');
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
            try {
                const addressToDelete = userProfile.addresses.find(addr => addr.id === addressId);
                let updatedAddresses = userProfile.addresses.filter(addr => addr.id !== addressId);
                
                // Si se elimina la dirección principal y quedan otras, hacer principal la primera
                if (addressToDelete && addressToDelete.isPrimary && updatedAddresses.length > 0) {
                    updatedAddresses[0].isPrimary = true;
                }
                
                setUserProfile(prev => ({
                    ...prev,
                    addresses: updatedAddresses
                }));
                
                console.log('📍 Dirección eliminada:', addressId);
                alert('✅ Dirección eliminada exitosamente!');
            } catch (error) {
                console.error('❌ Error eliminando dirección:', error);
                alert('❌ Error al eliminar la dirección');
            }
        }
    };

    const handleSetPrimary = async (addressId) => {
        try {
            const updatedAddresses = userProfile.addresses.map(addr => ({
                ...addr,
                isPrimary: addr.id === addressId
            }));
            
            setUserProfile(prev => ({
                ...prev,
                addresses: updatedAddresses
            }));
            
            console.log('📍 Dirección principal actualizada:', addressId);
            alert('✅ Dirección principal actualizada!');
        } catch (error) {
            console.error('❌ Error actualizando dirección principal:', error);
            alert('❌ Error al actualizar la dirección principal');
        }
    };

    const renderAddresses = () => {
        return React.createElement('div',
            {
                className: 'addresses-section',
                style: {
                    background: 'white',
                    borderRadius: '12px',
                    padding: '30px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }
            },
            
            // Header
            React.createElement('div',
                {
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '30px',
                        borderBottom: '2px solid #f0f0f0',
                        paddingBottom: '15px'
                    }
                },
                React.createElement('h3',
                    {
                        style: {
                            fontSize: '1.5rem',
                            color: '#333',
                            margin: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }
                    },
                    '📍', `Mis Direcciones (${userProfile.addresses.length})`
                ),
                React.createElement('button',
                    {
                        onClick: () => setShowAddAddressForm(true),
                        style: {
                            background: 'linear-gradient(135deg, #28a745, #20c997)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '12px 20px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }
                    },
                    '➕', 'Agregar Dirección'
                )
            ),

            // Lista de direcciones
            userProfile.addresses.length === 0 ? 
                React.createElement('div',
                    {
                        style: {
                            textAlign: 'center',
                            padding: '60px 20px',
                            background: '#f8f9fa',
                            borderRadius: '12px',
                            border: '2px dashed #dee2e6'
                        }
                    },
                    React.createElement('div',
                        { style: { fontSize: '4rem', marginBottom: '20px' } },
                        '🏠'
                    ),
                    React.createElement('h4',
                        { style: { color: '#666', marginBottom: '10px' } },
                        'Aún no has registrado ninguna dirección'
                    ),
                    React.createElement('p',
                        { style: { color: '#999', marginBottom: '20px' } },
                        'Agrega direcciones de envío para tus pedidos'
                    ),
                    React.createElement('button',
                        {
                            onClick: () => setShowAddAddressForm(true),
                            style: {
                                background: 'linear-gradient(135deg, #E45A84, #D94876)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '15px 25px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '600'
                            }
                        },
                        '📍 Agregar mi primera dirección'
                    )
                ) :
                React.createElement('div',
                    {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                            gap: '20px'
                        }
                    },
                    userProfile.addresses.map(address =>
                        React.createElement('div',
                            {
                                key: address.id,
                                className: 'address-card',
                                style: {
                                    background: 'white',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    border: address.isPrimary ? '2px solid #4A90E2' : '1px solid #e9ecef',
                                    position: 'relative'
                                }
                            },
                            
                            // Badge de dirección principal
                            address.isPrimary && React.createElement('div',
                                {
                                    style: {
                                        position: 'absolute',
                                        top: '15px',
                                        right: '15px',
                                        background: 'linear-gradient(135deg, #4A90E2, #357ABD)',
                                        color: 'white',
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        fontSize: '11px',
                                        fontWeight: '600'
                                    }
                                },
                                '⭐ PRINCIPAL'
                            ),
                            
                            // Header de la dirección
                            React.createElement('div',
                                {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '12px',
                                        marginBottom: '15px'
                                    }
                                },
                                React.createElement('div',
                                    {
                                        style: {
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '8px',
                                            background: address.addressType === 'home' ? 
                                                'linear-gradient(135deg, #ff6b6b, #ee5a24)' :
                                                address.addressType === 'work' ?
                                                'linear-gradient(135deg, #74b9ff, #0984e3)' :
                                                'linear-gradient(135deg, #00b894, #00a085)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.2rem'
                                        }
                                    },
                                    address.addressType === 'home' ? '🏠' :
                                    address.addressType === 'work' ? '🏢' : '📍'
                                ),
                                React.createElement('div',
                                    { style: { flex: 1 } },
                                    React.createElement('h4',
                                        {
                                            style: {
                                                margin: '0 0 5px',
                                                color: '#333',
                                                fontSize: '1.1rem'
                                            }
                                        },
                                        address.name || `Dirección ${address.addressType === 'home' ? 'Casa' : address.addressType === 'work' ? 'Trabajo' : 'Otra'}`
                                    ),
                                    React.createElement('p',
                                        {
                                            style: {
                                                margin: 0,
                                                color: '#666',
                                                fontSize: '13px'
                                            }
                                        },
                                        address.recipientName
                                    )
                                )
                            ),
                            
                            // Dirección completa
                            React.createElement('div',
                                {
                                    style: {
                                        marginBottom: '15px',
                                        padding: '12px',
                                        background: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '1px solid #e9ecef'
                                    }
                                },
                                React.createElement('p',
                                    {
                                        style: {
                                            margin: '0 0 8px',
                                            color: '#333',
                                            fontSize: '14px',
                                            fontWeight: '600'
                                        }
                                    },
                                    address.address
                                ),
                                React.createElement('p',
                                    {
                                        style: {
                                            margin: '0 0 8px',
                                            color: '#666',
                                            fontSize: '13px'
                                        }
                                    },
                                    `${address.city}, ${address.state}`
                                ),
                                React.createElement('p',
                                    {
                                        style: {
                                            margin: 0,
                                            color: '#666',
                                            fontSize: '13px'
                                        }
                                    },
                                    `${address.country} - ${address.zipCode}`
                                )
                            ),
                            
                            // Información de contacto
                            React.createElement('div',
                                {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px',
                                        marginBottom: '15px',
                                        fontSize: '13px',
                                        color: '#666'
                                    }
                                },
                                address.phone && React.createElement('span',
                                    {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }
                                    },
                                    '📞', address.phone
                                )
                            ),
                            
                            // Instrucciones especiales
                            address.instructions && React.createElement('div',
                                {
                                    style: {
                                        marginBottom: '15px',
                                        padding: '8px',
                                        background: '#fff3cd',
                                        border: '1px solid #ffeaa7',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        color: '#856404'
                                    }
                                },
                                React.createElement('strong', null, '📝 Instrucciones: '),
                                address.instructions
                            ),
                            
                            // Acciones
                            React.createElement('div',
                                {
                                    style: {
                                        display: 'flex',
                                        gap: '8px'
                                    }
                                },
                                !address.isPrimary && React.createElement('button',
                                    {
                                        onClick: () => handleSetPrimary(address.id),
                                        style: {
                                            flex: 1,
                                            background: '#ffc107',
                                            color: '#212529',
                                            border: 'none',
                                            borderRadius: '6px',
                                            padding: '8px 10px',
                                            cursor: 'pointer',
                                            fontSize: '11px',
                                            fontWeight: '600'
                                        }
                                    },
                                    '⭐ Principal'
                                ),
                                React.createElement('button',
                                    {
                                        onClick: () => handleEditAddress(address),
                                        style: {
                                            flex: 1,
                                            background: '#17a2b8',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            padding: '8px 10px',
                                            cursor: 'pointer',
                                            fontSize: '11px',
                                            fontWeight: '600'
                                        }
                                    },
                                    '✏️ Editar'
                                ),
                                React.createElement('button',
                                    {
                                        onClick: () => handleDeleteAddress(address.id),
                                        style: {
                                            background: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            padding: '8px 10px',
                                            cursor: 'pointer',
                                            fontSize: '11px',
                                            fontWeight: '600'
                                        }
                                    },
                                    '🗑️'
                                )
                            )
                        )
                    )
                ),

            // Modal para agregar/editar dirección
            showAddAddressForm && React.createElement('div',
                {
                    style: {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '20px'
                    }
                },
                React.createElement('div',
                    {
                        style: {
                            background: 'white',
                            borderRadius: '12px',
                            padding: '30px',
                            maxWidth: '700px',
                            width: '100%',
                            maxHeight: '80vh',
                            overflow: 'auto'
                        }
                    },
                    
                    // Header del modal
                    React.createElement('div',
                        {
                            style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '25px',
                                paddingBottom: '15px',
                                borderBottom: '2px solid #f0f0f0'
                            }
                        },
                        React.createElement('h3',
                            {
                                style: {
                                    margin: 0,
                                    color: '#333',
                                    fontSize: '1.5rem'
                                }
                            },
                            editingAddress ? '✏️ Editar Dirección' : '📍 Agregar Nueva Dirección'
                        ),
                        React.createElement('button',
                            {
                                onClick: () => {
                                    setShowAddAddressForm(false);
                                    setEditingAddress(null);
                                    setNewAddress({
                                        name: '',
                                        recipientName: '',
                                        phone: '',
                                        address: '',
                                        city: '',
                                        state: '',
                                        zipCode: '',
                                        country: 'Colombia',
                                        addressType: 'home',
                                        instructions: '',
                                        isPrimary: false
                                    });
                                },
                                style: {
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    color: '#666'
                                }
                            },
                            '✕'
                        )
                    ),
                    
                    // Formulario
                    React.createElement('div',
                        {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '20px'
                            }
                        },
                        
                        // Nombre de la dirección
                        React.createElement('div',
                            {
                                style: { gridColumn: '1 / -1' }
                            },
                            React.createElement('label',
                                {
                                    style: {
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#333'
                                    }
                                },
                                '🏷️ Nombre de la dirección (ej: Casa, Trabajo, Casa de Mamá) *'
                            ),
                            React.createElement('input',
                                {
                                    type: 'text',
                                    value: newAddress.name,
                                    onChange: (e) => setNewAddress(prev => ({ ...prev, name: e.target.value })),
                                    placeholder: 'Ej: Casa Principal, Oficina, Apartamento...',
                                    required: true,
                                    style: {
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #E45A84',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        boxSizing: 'border-box'
                                    }
                                }
                            )
                        ),
                        
                        // Tipo de dirección
                        React.createElement('div',
                            null,
                            React.createElement('label',
                                {
                                    style: {
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#333'
                                    }
                                },
                                '🏠 Tipo de dirección'
                            ),
                            React.createElement('select',
                                {
                                    value: newAddress.addressType,
                                    onChange: (e) => setNewAddress(prev => ({ ...prev, addressType: e.target.value })),
                                    style: {
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        boxSizing: 'border-box'
                                    }
                                },
                                React.createElement('option', { value: 'home' }, '🏠 Casa'),
                                React.createElement('option', { value: 'work' }, '🏢 Trabajo'),
                                React.createElement('option', { value: 'other' }, '📍 Otra')
                            )
                        ),
                        
                        // Nombre del destinatario
                        React.createElement('div',
                            null,
                            React.createElement('label',
                                {
                                    style: {
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#333'
                                    }
                                },
                                '👤 Nombre del destinatario *'
                            ),
                            React.createElement('input',
                                {
                                    type: 'text',
                                    value: newAddress.recipientName,
                                    onChange: (e) => setNewAddress(prev => ({ ...prev, recipientName: e.target.value })),
                                    placeholder: 'Nombre completo de quien recibe',
                                    required: true,
                                    style: {
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #E45A84',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        boxSizing: 'border-box'
                                    }
                                }
                            )
                        ),
                        
                        // Teléfono
                        React.createElement('div',
                            null,
                            React.createElement('label',
                                {
                                    style: {
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#333'
                                    }
                                },
                                '📞 Teléfono de contacto *'
                            ),
                            React.createElement('input',
                                {
                                    type: 'tel',
                                    value: newAddress.phone,
                                    onChange: (e) => setNewAddress(prev => ({ ...prev, phone: e.target.value })),
                                    placeholder: '+57 300 123 4567',
                                    required: true,
                                    style: {
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #E45A84',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        boxSizing: 'border-box'
                                    }
                                }
                            )
                        ),
                        
                        // Dirección completa
                        React.createElement('div',
                            {
                                style: { gridColumn: '1 / -1' }
                            },
                            React.createElement('label',
                                {
                                    style: {
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#333'
                                    }
                                },
                                '📍 Dirección completa *'
                            ),
                            React.createElement('input',
                                {
                                    type: 'text',
                                    value: newAddress.address,
                                    onChange: (e) => setNewAddress(prev => ({ ...prev, address: e.target.value })),
                                    placeholder: 'Calle 123 #45-67, Apartamento 8B, Conjunto Residencial...',
                                    required: true,
                                    style: {
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #E45A84',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        boxSizing: 'border-box'
                                    }
                                }
                            )
                        ),
                        
                        // Ciudad
                        React.createElement('div',
                            null,
                            React.createElement('label',
                                {
                                    style: {
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#333'
                                    }
                                },
                                '🏢 Ciudad *'
                            ),
                            React.createElement('select',
                                {
                                    value: newAddress.city,
                                    onChange: (e) => setNewAddress(prev => ({ ...prev, city: e.target.value })),
                                    style: {
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #E45A84',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        boxSizing: 'border-box'
                                    }
                                },
                                React.createElement('option', { value: '' }, 'Seleccionar ciudad...'),
                                colombianCities.map(city =>
                                    React.createElement('option', { key: city, value: city }, city)
                                )
                            )
                        ),
                        
                        // Departamento
                        React.createElement('div',
                            null,
                            React.createElement('label',
                                {
                                    style: {
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#333'
                                    }
                                },
                                '🏞️ Departamento *'
                            ),
                            React.createElement('select',
                                {
                                    value: newAddress.state,
                                    onChange: (e) => setNewAddress(prev => ({ ...prev, state: e.target.value })),
                                    style: {
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #E45A84',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        boxSizing: 'border-box'
                                    }
                                },
                                React.createElement('option', { value: '' }, 'Seleccionar departamento...'),
                                colombianStates.map(state =>
                                    React.createElement('option', { key: state, value: state }, state)
                                )
                            )
                        ),
                        
                        // Código postal
                        React.createElement('div',
                            null,
                            React.createElement('label',
                                {
                                    style: {
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#333'
                                    }
                                },
                                '📮 Código Postal'
                            ),
                            React.createElement('input',
                                {
                                    type: 'text',
                                    value: newAddress.zipCode,
                                    onChange: (e) => setNewAddress(prev => ({ ...prev, zipCode: e.target.value })),
                                    placeholder: '110221',
                                    style: {
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        boxSizing: 'border-box'
                                    }
                                }
                            )
                        ),
                        
                        // País
                        React.createElement('div',
                            null,
                            React.createElement('label',
                                {
                                    style: {
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#333'
                                    }
                                },
                                '🇨🇴 País'
                            ),
                            React.createElement('input',
                                {
                                    type: 'text',
                                    value: newAddress.country,
                                    disabled: true,
                                    style: {
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        background: '#f8f9fa',
                                        color: '#666',
                                        boxSizing: 'border-box'
                                    }
                                }
                            )
                        ),
                        
                        // Instrucciones especiales
                        React.createElement('div',
                            {
                                style: { gridColumn: '1 / -1' }
                            },
                            React.createElement('label',
                                {
                                    style: {
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#333'
                                    }
                                },
                                '📝 Instrucciones especiales (opcional)'
                            ),
                            React.createElement('textarea',
                                {
                                    value: newAddress.instructions,
                                    onChange: (e) => setNewAddress(prev => ({ ...prev, instructions: e.target.value })),
                                    placeholder: 'Timbrar en el apartamento 8B, Casa color azul, Conjunto cerrado con portero...',
                                    rows: 3,
                                    style: {
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        boxSizing: 'border-box',
                                        resize: 'vertical'
                                    }
                                }
                            )
                        ),
                        
                        // Dirección principal
                        React.createElement('div',
                            {
                                style: { gridColumn: '1 / -1' }
                            },
                            React.createElement('label',
                                {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        cursor: 'pointer',
                                        padding: '15px',
                                        background: newAddress.isPrimary ? '#fff3cd' : '#f8f9fa',
                                        border: newAddress.isPrimary ? '2px solid #ffc107' : '1px solid #dee2e6',
                                        borderRadius: '8px'
                                    }
                                },
                                React.createElement('input',
                                    {
                                        type: 'checkbox',
                                        checked: newAddress.isPrimary,
                                        onChange: (e) => setNewAddress(prev => ({ ...prev, isPrimary: e.target.checked })),
                                        style: {
                                            width: '20px',
                                            height: '20px'
                                        }
                                    }
                                ),
                                React.createElement('div',
                                    null,
                                    React.createElement('strong', null, '⭐ Establecer como dirección principal'),
                                    React.createElement('div',
                                        { style: { fontSize: '13px', color: '#666', marginTop: '5px' } },
                                        'Esta será tu dirección predeterminada para envíos'
                                    )
                                )
                            )
                        )
                    ),
                    
                    // Botones de acción
                    React.createElement('div',
                        {
                            style: {
                                display: 'flex',
                                gap: '15px',
                                marginTop: '30px',
                                paddingTop: '20px',
                                borderTop: '1px solid #eee'
                            }
                        },
                        React.createElement('button',
                            {
                                onClick: () => {
                                    setShowAddAddressForm(false);
                                    setEditingAddress(null);
                                    setNewAddress({
                                        name: '',
                                        recipientName: '',
                                        phone: '',
                                        address: '',
                                        city: '',
                                        state: '',
                                        zipCode: '',
                                        country: 'Colombia',
                                        addressType: 'home',
                                        instructions: '',
                                        isPrimary: false
                                    });
                                },
                                style: {
                                    flex: 1,
                                    background: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: '600'
                                }
                            },
                            '❌ Cancelar'
                        ),
                        React.createElement('button',
                            {
                                onClick: editingAddress ? handleUpdateAddress : handleAddAddress,
                                disabled: !newAddress.name || !newAddress.recipientName || !newAddress.phone || !newAddress.address || !newAddress.city || !newAddress.state,
                                style: {
                                    flex: 2,
                                    background: (!newAddress.name || !newAddress.recipientName || !newAddress.phone || !newAddress.address || !newAddress.city || !newAddress.state) ? '#ccc' : 
                                        'linear-gradient(135deg, #28a745, #20c997)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    cursor: (!newAddress.name || !newAddress.recipientName || !newAddress.phone || !newAddress.address || !newAddress.city || !newAddress.state) ? 'not-allowed' : 'pointer',
                                    fontSize: '16px',
                                    fontWeight: '600'
                                }
                            },
                            editingAddress ? '✅ Actualizar Dirección' : '✅ Guardar Dirección'
                        )
                    )
                )
            )
        );
    };

    const [preferencesChanged, setPreferencesChanged] = React.useState(false);

    const handleNotificationChange = (type, value) => {
        setUserProfile(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                notifications: {
                    ...prev.preferences.notifications,
                    [type]: value
                }
            }
        }));
        setPreferencesChanged(true);
    };

    const handleFavoriteBrandToggle = (brand) => {
        setUserProfile(prev => {
            const currentFavorites = prev.preferences.favoriteBrands || [];
            const isAlreadyFavorite = currentFavorites.includes(brand);
            
            return {
                ...prev,
                preferences: {
                    ...prev.preferences,
                    favoriteBrands: isAlreadyFavorite
                        ? currentFavorites.filter(b => b !== brand)
                        : [...currentFavorites, brand]
                }
            };
        });
        setPreferencesChanged(true);
    };

    const handleFavoriteCategoryToggle = (category) => {
        setUserProfile(prev => {
            const currentFavorites = prev.preferences.favoriteCategories || [];
            const isAlreadyFavorite = currentFavorites.includes(category);
            
            return {
                ...prev,
                preferences: {
                    ...prev.preferences,
                    favoriteCategories: isAlreadyFavorite
                        ? currentFavorites.filter(c => c !== category)
                        : [...currentFavorites, category]
                }
            };
        });
        setPreferencesChanged(true);
    };

    const handleSavePreferences = async () => {
        try {
            // Aquí iría la lógica para guardar en el backend
            console.log('⚙️ Guardando preferencias:', userProfile.preferences);
            setPreferencesChanged(false);
            alert('✅ Preferencias guardadas exitosamente!');
        } catch (error) {
            console.error('❌ Error guardando preferencias:', error);
            alert('❌ Error al guardar las preferencias');
        }
    };

    const popularBrands = [
        'Royal Canin', 'Hill\'s', 'Purina Pro Plan', 'Eukanuba', 'Pedigree',
        'Whiskas', 'Nutram', 'Taste of the Wild', 'Acana', 'Orijen',
        'Blue Buffalo', 'Wellness', 'Merrick', 'Natural Balance', 'Canidae'
    ];

    const productCategories = [
        { id: 'alimento-perro', name: 'Alimento para Perros', icon: '🍖' },
        { id: 'alimento-gato', name: 'Alimento para Gatos', icon: '🍼' },
        { id: 'snacks-premios', name: 'Snacks y Premios', icon: '🦾' },
        { id: 'juguetes', name: 'Juguetes', icon: '🧨' },
        { id: 'accesorios', name: 'Accesorios', icon: '🎀' },
        { id: 'higiene', name: 'Higiene y Aseo', icon: '🛁' },
        { id: 'salud', name: 'Salud y Bienestar', icon: '⚕️' },
        { id: 'camas-casas', name: 'Camas y Casas', icon: '🏠' },
        { id: 'transporte', name: 'Transporte', icon: '🚗' },
        { id: 'ropa', name: 'Ropa y Disfraces', icon: '👕' }
    ];

    const renderPreferences = () => {
        return React.createElement('div',
            {
                className: 'preferences-section',
                style: {
                    background: 'white',
                    borderRadius: '12px',
                    padding: '30px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }
            },
            
            // Header
            React.createElement('div',
                {
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '30px',
                        borderBottom: '2px solid #f0f0f0',
                        paddingBottom: '15px'
                    }
                },
                React.createElement('h3',
                    {
                        style: {
                            fontSize: '1.5rem',
                            color: '#333',
                            margin: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }
                    },
                    '⚙️', 'Preferencias y Configuración'
                ),
                preferencesChanged && React.createElement('button',
                    {
                        onClick: handleSavePreferences,
                        style: {
                            background: 'linear-gradient(135deg, #28a745, #20c997)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '12px 20px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            animation: 'pulse 2s infinite'
                        }
                    },
                    '✅', 'Guardar Cambios'
                )
            ),

            // Configuraciones de notificaciones
            React.createElement('div',
                {
                    style: {
                        marginBottom: '40px',
                        background: '#f8f9fa',
                        borderRadius: '12px',
                        padding: '25px',
                        border: '1px solid #e9ecef'
                    }
                },
                React.createElement('h4',
                    {
                        style: {
                            fontSize: '1.3rem',
                            color: '#333',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }
                    },
                    '🔔', 'Notificaciones'
                ),
                React.createElement('div',
                    {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '20px'
                        }
                    },
                    
                    // Email
                    React.createElement('div',
                        {
                            className: 'notification-item',
                            style: {
                                background: 'white',
                                borderRadius: '8px',
                                padding: '20px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }
                        },
                        React.createElement('label',
                            {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    cursor: 'pointer'
                                }
                            },
                            React.createElement('input',
                                {
                                    type: 'checkbox',
                                    checked: userProfile.preferences.notifications.email,
                                    onChange: (e) => handleNotificationChange('email', e.target.checked),
                                    style: {
                                        width: '20px',
                                        height: '20px',
                                        accentColor: '#E45A84'
                                    }
                                }
                            ),
                            React.createElement('div',
                                null,
                                React.createElement('div',
                                    {
                                        style: {
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            color: '#333',
                                            marginBottom: '5px'
                                        }
                                    },
                                    '📧 Notificaciones por Email'
                                ),
                                React.createElement('div',
                                    {
                                        style: {
                                            fontSize: '13px',
                                            color: '#666'
                                        }
                                    },
                                    'Recibe actualizaciones de pedidos, ofertas y noticias'
                                )
                            )
                        )
                    ),
                    
                    // SMS
                    React.createElement('div',
                        {
                            className: 'notification-item',
                            style: {
                                background: 'white',
                                borderRadius: '8px',
                                padding: '20px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }
                        },
                        React.createElement('label',
                            {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    cursor: 'pointer'
                                }
                            },
                            React.createElement('input',
                                {
                                    type: 'checkbox',
                                    checked: userProfile.preferences.notifications.sms,
                                    onChange: (e) => handleNotificationChange('sms', e.target.checked),
                                    style: {
                                        width: '20px',
                                        height: '20px',
                                        accentColor: '#E45A84'
                                    }
                                }
                            ),
                            React.createElement('div',
                                null,
                                React.createElement('div',
                                    {
                                        style: {
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            color: '#333',
                                            marginBottom: '5px'
                                        }
                                    },
                                    '📱 Notificaciones por SMS'
                                ),
                                React.createElement('div',
                                    {
                                        style: {
                                            fontSize: '13px',
                                            color: '#666'
                                        }
                                    },
                                    'Recibe mensajes sobre el estado de tus pedidos'
                                )
                            )
                        )
                    ),
                    
                    // Push
                    React.createElement('div',
                        {
                            className: 'notification-item',
                            style: {
                                background: 'white',
                                borderRadius: '8px',
                                padding: '20px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }
                        },
                        React.createElement('label',
                            {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    cursor: 'pointer'
                                }
                            },
                            React.createElement('input',
                                {
                                    type: 'checkbox',
                                    checked: userProfile.preferences.notifications.push,
                                    onChange: (e) => handleNotificationChange('push', e.target.checked),
                                    style: {
                                        width: '20px',
                                        height: '20px',
                                        accentColor: '#E45A84'
                                    }
                                }
                            ),
                            React.createElement('div',
                                null,
                                React.createElement('div',
                                    {
                                        style: {
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            color: '#333',
                                            marginBottom: '5px'
                                        }
                                    },
                                    '📢 Notificaciones Push'
                                ),
                                React.createElement('div',
                                    {
                                        style: {
                                            fontSize: '13px',
                                            color: '#666'
                                        }
                                    },
                                    'Recibe notificaciones en tiempo real en tu navegador'
                                )
                            )
                        )
                    ),
                    
                    // Promociones
                    React.createElement('div',
                        {
                            className: 'notification-item',
                            style: {
                                background: 'white',
                                borderRadius: '8px',
                                padding: '20px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }
                        },
                        React.createElement('label',
                            {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    cursor: 'pointer'
                                }
                            },
                            React.createElement('input',
                                {
                                    type: 'checkbox',
                                    checked: userProfile.preferences.notifications.promotions,
                                    onChange: (e) => handleNotificationChange('promotions', e.target.checked),
                                    style: {
                                        width: '20px',
                                        height: '20px',
                                        accentColor: '#E45A84'
                                    }
                                }
                            ),
                            React.createElement('div',
                                null,
                                React.createElement('div',
                                    {
                                        style: {
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            color: '#333',
                                            marginBottom: '5px'
                                        }
                                    },
                                    '🎁 Promociones y Ofertas'
                                ),
                                React.createElement('div',
                                    {
                                        style: {
                                            fontSize: '13px',
                                            color: '#666'
                                        }
                                    },
                                    'Recibe ofertas especiales, descuentos y promociones exclusivas'
                                )
                            )
                        )
                    )
                )
            ),

            // Marcas favoritas
            React.createElement('div',
                {
                    style: {
                        marginBottom: '40px',
                        background: '#f8f9fa',
                        borderRadius: '12px',
                        padding: '25px',
                        border: '1px solid #e9ecef'
                    }
                },
                React.createElement('h4',
                    {
                        style: {
                            fontSize: '1.3rem',
                            color: '#333',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }
                    },
                    '⭐', `Marcas Favoritas (${userProfile.preferences.favoriteBrands?.length || 0})`
                ),
                React.createElement('div',
                    {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '12px'
                        }
                    },
                    popularBrands.map(brand =>
                        React.createElement('label',
                            {
                                key: brand,
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    cursor: 'pointer',
                                    padding: '12px',
                                    background: userProfile.preferences.favoriteBrands?.includes(brand) ? '#E45A84' : 'white',
                                    color: userProfile.preferences.favoriteBrands?.includes(brand) ? 'white' : '#333',
                                    borderRadius: '8px',
                                    border: '1px solid #dee2e6',
                                    transition: 'all 0.2s ease',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }
                            },
                            React.createElement('input',
                                {
                                    type: 'checkbox',
                                    checked: userProfile.preferences.favoriteBrands?.includes(brand) || false,
                                    onChange: () => handleFavoriteBrandToggle(brand),
                                    style: {
                                        width: '16px',
                                        height: '16px',
                                        accentColor: userProfile.preferences.favoriteBrands?.includes(brand) ? 'white' : '#E45A84'
                                    }
                                }
                            ),
                            brand
                        )
                    )
                )
            ),

            // Categorías favoritas
            React.createElement('div',
                {
                    style: {
                        marginBottom: '40px',
                        background: '#f8f9fa',
                        borderRadius: '12px',
                        padding: '25px',
                        border: '1px solid #e9ecef'
                    }
                },
                React.createElement('h4',
                    {
                        style: {
                            fontSize: '1.3rem',
                            color: '#333',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }
                    },
                    '📋', `Categorías de Interés (${userProfile.preferences.favoriteCategories?.length || 0})`
                ),
                React.createElement('div',
                    {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: '15px'
                        }
                    },
                    productCategories.map(category =>
                        React.createElement('label',
                            {
                                key: category.id,
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    cursor: 'pointer',
                                    padding: '15px',
                                    background: userProfile.preferences.favoriteCategories?.includes(category.id) ? '#E45A84' : 'white',
                                    color: userProfile.preferences.favoriteCategories?.includes(category.id) ? 'white' : '#333',
                                    borderRadius: '10px',
                                    border: '1px solid #dee2e6',
                                    transition: 'all 0.2s ease',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }
                            },
                            React.createElement('input',
                                {
                                    type: 'checkbox',
                                    checked: userProfile.preferences.favoriteCategories?.includes(category.id) || false,
                                    onChange: () => handleFavoriteCategoryToggle(category.id),
                                    style: {
                                        width: '18px',
                                        height: '18px',
                                        accentColor: userProfile.preferences.favoriteCategories?.includes(category.id) ? 'white' : '#E45A84'
                                    }
                                }
                            ),
                            React.createElement('span', { style: { fontSize: '1.2rem' } }, category.icon),
                            category.name
                        )
                    )
                )
            ),

            // Configuraciones de cuenta
            React.createElement('div',
                {
                    style: {
                        background: '#f8f9fa',
                        borderRadius: '12px',
                        padding: '25px',
                        border: '1px solid #e9ecef'
                    }
                },
                React.createElement('h4',
                    {
                        style: {
                            fontSize: '1.3rem',
                            color: '#333',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }
                    },
                    '🔒', 'Configuraciones de Cuenta'
                ),
                React.createElement('div',
                    {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '15px'
                        }
                    },
                    
                    // Cambiar contraseña
                    React.createElement('button',
                        {
                            onClick: () => alert('🚀 Funcionalidad de cambio de contraseña próximamente'),
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '15px',
                                background: 'white',
                                border: '1px solid #dee2e6',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#333',
                                textAlign: 'left'
                            }
                        },
                        '🔐',
                        React.createElement('div',
                            null,
                            React.createElement('div', { style: { marginBottom: '3px' } }, 'Cambiar Contraseña'),
                            React.createElement('div',
                                { style: { fontSize: '12px', color: '#666', fontWeight: 'normal' } },
                                'Actualiza tu contraseña de acceso'
                            )
                        )
                    ),
                    
                    // Privacidad
                    React.createElement('button',
                        {
                            onClick: () => alert('🚀 Configuraciones de privacidad próximamente'),
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '15px',
                                background: 'white',
                                border: '1px solid #dee2e6',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#333',
                                textAlign: 'left'
                            }
                        },
                        '🔒',
                        React.createElement('div',
                            null,
                            React.createElement('div', { style: { marginBottom: '3px' } }, 'Configuración de Privacidad'),
                            React.createElement('div',
                                { style: { fontSize: '12px', color: '#666', fontWeight: 'normal' } },
                                'Controla quién puede ver tu información'
                            )
                        )
                    ),
                    
                    // Exportar datos
                    React.createElement('button',
                        {
                            onClick: () => {
                                const dataToExport = {
                                    profile: userProfile.personalInfo,
                                    pets: userProfile.pets,
                                    addresses: userProfile.addresses,
                                    preferences: userProfile.preferences,
                                    exportDate: new Date().toISOString()
                                };
                                const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `velykapet-profile-${new Date().toISOString().split('T')[0]}.json`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                                alert('✅ Datos exportados exitosamente!');
                            },
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '15px',
                                background: 'white',
                                border: '1px solid #dee2e6',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#333',
                                textAlign: 'left'
                            }
                        },
                        '📥',
                        React.createElement('div',
                            null,
                            React.createElement('div', { style: { marginBottom: '3px' } }, 'Exportar Mis Datos'),
                            React.createElement('div',
                                { style: { fontSize: '12px', color: '#666', fontWeight: 'normal' } },
                                'Descarga una copia de toda tu información'
                            )
                        )
                    ),
                    
                    // Eliminar cuenta
                    React.createElement('button',
                        {
                            onClick: () => {
                                if (confirm('⚠️ ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
                                    alert('🚀 Funcionalidad de eliminación de cuenta próximamente');
                                }
                            },
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '15px',
                                background: '#fff5f5',
                                border: '1px solid #fed7d7',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#c53030',
                                textAlign: 'left'
                            }
                        },
                        '🗑️',
                        React.createElement('div',
                            null,
                            React.createElement('div', { style: { marginBottom: '3px' } }, 'Eliminar Cuenta'),
                            React.createElement('div',
                                { style: { fontSize: '12px', color: '#e53e3e', fontWeight: 'normal' } },
                                'Elimina permanentemente tu cuenta y todos los datos'
                            )
                        )
                    )
                )
            ),

            // Botón de guardar al final si hay cambios
            preferencesChanged && React.createElement('div',
                {
                    style: {
                        marginTop: '30px',
                        textAlign: 'center',
                        padding: '20px',
                        background: '#fff3cd',
                        border: '1px solid #ffeaa7',
                        borderRadius: '8px'
                    }
                },
                React.createElement('p',
                    {
                        style: {
                            margin: '0 0 15px',
                            color: '#856404',
                            fontSize: '14px',
                            fontWeight: '600'
                        }
                    },
                    '⚠️ Tienes cambios sin guardar en tus preferencias'
                ),
                React.createElement('button',
                    {
                        onClick: handleSavePreferences,
                        style: {
                            background: 'linear-gradient(135deg, #E45A84, #D94876)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '15px 30px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '600',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }
                    },
                    '✅ Guardar Todas las Preferencias'
                )
            )
        );
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return renderDashboard();
            case 'personal':
                return renderPersonalInfo();
            case 'pets':
                return renderPets();
            case 'addresses':
                return renderAddresses();
            case 'preferences':
                return renderPreferences();
            default:
                return renderDashboard();
        }
    };

    if (loading) {
        return React.createElement('div',
            {
                style: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                    flexDirection: 'column',
                    gap: '20px'
                }
            },
            React.createElement('div',
                {
                    style: {
                        width: '50px',
                        height: '50px',
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #E45A84',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }
                }
            ),
            React.createElement('p', { style: { color: '#666' } }, 'Cargando perfil...')
        );
    }

    return React.createElement('div',
        {
            className: 'user-profile',
            style: {
                maxWidth: '100%', // APROVECHAR TODO EL VIEWPORT
                width: '100%',
                margin: '0 auto',
                padding: '20px 2rem', // Padding lateral optimizado
                minHeight: 'calc(100vh - 120px)' // Altura mínima para viewport completo
            }
        },

        // Navegación por pestañas
        React.createElement('div',
            {
                className: 'profile-tabs',
                style: {
                    display: 'flex',
                    background: 'white',
                    borderRadius: '12px',
                    padding: '8px',
                    marginBottom: '30px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    overflowX: 'auto',
                    gap: '4px'
                }
            },
            tabs.map(tab =>
                React.createElement('button',
                    {
                        key: tab.id,
                        onClick: () => setActiveTab(tab.id),
                        style: {
                            background: activeTab === tab.id ? 
                                'linear-gradient(135deg, #4A90E2, #357ABD)' : 'transparent',
                            color: activeTab === tab.id ? 'white' : '#666',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            minWidth: '140px',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                        }
                    },
                    tab.icon, tab.label
                )
            )
        ),

        // Contenido de la pestaña activa
        React.createElement('div',
            {
                className: 'tab-content',
                style: {
                    minHeight: '500px'
                }
            },
            renderTabContent()
        )
    );
}

// Registrar el componente globalmente
window.UserProfile = UserProfile;

console.log('✅ User Profile Component cargado');