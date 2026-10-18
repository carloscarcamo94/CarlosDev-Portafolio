document.addEventListener('DOMContentLoaded', () => {
    // Proyectos Data
    const projects = [
        {
            id: 'tripapp',
            name: 'TripApp',
            description: 'Plataforma web para publicar y gestionar trips (excursiones y aventuras) en El Salvador. Permite a los usuarios explorar viajes disponibles, filtrarlos por categoría o descripción de texto libre, y ver el detalle de cada uno. Incluye un panel de administración con CRUD completo de trips y categorías, subida de imágenes y editor de texto enriquecido (TinyMCE).',
            stack: ['Java 17', 'Spring Boot 3.5', 'JPA/Hibernate', 'MySQL 8.0', 'Thymeleaf', 'Bootstrap 4', 'TinyMCE'],
            repoUrl: 'https://github.com/carloscarcamo94/tripDemo',
            status: 'active',
            images: [
                'assets/projects/tripapp-1.png', // Assuming user will upload these or I can use placeholders
                'assets/projects/tripapp-2.png',
                'assets/projects/tripapp-3.png'
            ]
        },
        {
            id: 'inventory',
            name: 'Control de Inventario',
            description: 'Sistema empresarial para la gestión y trazabilidad de inventarios en tiempo real. Permite el control minucioso de stock con alertas de reabastecimiento, registro y auditoría de movimientos de kardex, administración de almacenes múltiples y proveedores, y generación automatizada de reportes con persistencia relacional íntegra.',
            stack: ['Java 17', 'Spring Boot 3.5', 'JPA/Hibernate', 'MySQL 8.0', 'Thymeleaf', 'Spring Security', 'Bootstrap 5'],
            repoUrl: '#',
            status: 'coming-soon',
            previewItems: [
                { icon: 'fa-boxes-stacked', label: 'Gestión de Stock & Kardex', color: 'text-info' },
                { icon: 'fa-chart-line', label: 'Reportes & Métricas', color: 'text-magenta' },
                { icon: 'fa-warehouse', label: 'Control Multialmacén', color: 'text-info' }
            ],
            images: []
        },
        {
            id: 'quiniela',
            name: 'App de Quiniela',
            description: 'Plataforma web de pronósticos deportivos y quinielas comunitarias. Integra un motor algorítmico para el cálculo automático de puntuaciones según resultados en vivo, administración de fixtures de torneos y ligas, tablas de clasificación y ranking en tiempo real, gestión de perfiles de usuario y reglas de desempate.',
            stack: ['Java 17', 'Spring Boot 3.5', 'JPA/Hibernate', 'MySQL 8.0', 'REST APIs', 'Spring Security', 'Bootstrap 5'],
            repoUrl: '#',
            status: 'coming-soon',
            previewItems: [
                { icon: 'fa-futbol', label: 'Pronósticos en Vivo', color: 'text-info' },
                { icon: 'fa-trophy', label: 'Tabla de Posiciones', color: 'text-magenta' },
                { icon: 'fa-calculator', label: 'Motor de Puntuación', color: 'text-info' }
            ],
            images: []
        }
    ];

    window.projectsData = projects;

    const container = document.getElementById('projects-container');
    const indicators = document.getElementById('projects-indicators');
    
    // Generar HTML de los proyectos
    projects.forEach((project, index) => {
        // Indicador
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.dataset.bsTarget = '#projectsCarousel';
        indicator.dataset.bsSlideTo = index;
        if (index === 0) {
            indicator.classList.add('active');
            indicator.setAttribute('aria-current', 'true');
        }
        indicator.setAttribute('aria-label', `Slide ${index + 1}`);
        indicators.appendChild(indicator);

        // Slide
        const isActive = index === 0 ? 'active' : '';
        const isComingSoon = project.status === 'coming-soon' ? 'coming-soon' : '';
        
        let badgesHtml = project.stack.map(tech => `<span class="badge-stack">${tech}</span>`).join('');
        
        // Galería de imágenes o wireframes de previsualización
        let galleryHtml = '';
        if (project.images.length > 0) {
            galleryHtml = `
                <div class="project-gallery mt-2 mt-md-4">
                    ${project.images.map((img, imgIdx) => `
                        <div class="gallery-item" onclick="openModal('${project.id}', ${imgIdx})">
                            <img src="${img}" alt="Captura ${imgIdx + 1} de ${project.name}" onerror="this.src='https://via.placeholder.com/250x150/222/fff?text=Captura+Pendiente'">
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (project.previewItems && project.previewItems.length > 0) {
            galleryHtml = `
                <div class="project-gallery mt-2 mt-md-4">
                    ${project.previewItems.map(item => `
                        <div class="gallery-item placeholder-item">
                            <div class="placeholder-content">
                                <i class="fa-solid ${item.icon} fs-2 ${item.color} mb-2"></i>
                                <span>${item.label}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        const comingSoonBadgeHtml = isComingSoon ? `<div class="coming-soon-badge">PRÓXIMAMENTE</div>` : '';
        
        const repoBtnHtml = isComingSoon ? `
            <span class="btn-repo disabled opacity-50" style="cursor: not-allowed; border-color: rgba(255,255,255,0.2); color: #888;">
                <i class="fa-solid fa-code"></i> En Desarrollo
            </span>
        ` : `
            <a href="${project.repoUrl}" target="_blank" class="btn-repo">
                <i class="fab fa-github"></i> Ver Código
            </a>
        `;

        const slideHtml = `
            <div class="carousel-item ${isActive}">
                <div class="d-flex justify-content-center px-2 px-sm-4 px-md-5 py-4">
                    <div class="project-card ${isComingSoon} w-100" style="max-width: 900px;">
                        ${comingSoonBadgeHtml}
                        <div class="project-card-header">
                            <h2 class="project-title font-monospace">${project.name}</h2>
                            <div class="stack-badges">
                                ${badgesHtml}
                            </div>
                        </div>
                        <div class="project-card-body">
                            <p class="project-desc">${project.description}</p>
                        </div>
                        ${galleryHtml}
                        <div class="project-links text-center">
                            ${repoBtnHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML += slideHtml;
    });

    // Intersection Observer para animación de entrada
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease-out';
    });
});

// Función global para el modal de imágenes con carrusel
function openModal(projectIdOrSrc, selectedIndex = 0) {
    const modalEl = document.getElementById('imageModal');
    if (!modalEl) return;

    const carouselInner = document.getElementById('modalCarouselInner');
    const counterEl = document.getElementById('modalImageCounter');
    const prevBtn = modalEl.querySelector('.carousel-control-prev');
    const nextBtn = modalEl.querySelector('.carousel-control-next');
    const modalCarouselEl = document.getElementById('modalCarousel');

    // Buscar si es un ID de proyecto
    const project = (window.projectsData && Array.isArray(window.projectsData)) 
        ? window.projectsData.find(p => p.id === projectIdOrSrc) 
        : null;

    let imagesList = [];
    let projectName = 'Proyecto';

    if (project && project.images && project.images.length > 0) {
        imagesList = project.images;
        projectName = project.name;
    } else if (typeof projectIdOrSrc === 'string' && projectIdOrSrc.trim() !== '') {
        imagesList = [projectIdOrSrc];
    }

    if (imagesList.length === 0) return;

    const totalImages = imagesList.length;
    const initialIndex = (selectedIndex >= 0 && selectedIndex < totalImages) ? selectedIndex : 0;

    // Generar slides del carrusel
    carouselInner.innerHTML = imagesList.map((img, idx) => `
        <div class="carousel-item ${idx === initialIndex ? 'active' : ''}">
            <div class="d-flex align-items-center justify-content-center p-2" style="min-height: 380px; background: #080c14;">
                <img src="${img}" alt="Captura ${idx + 1} de ${projectName}" class="img-fluid" 
                     onerror="this.src='https://via.placeholder.com/1200x800/181f2a/79c0ff?text=Captura+${idx + 1}+de+${encodeURIComponent(projectName)}'">
            </div>
        </div>
    `).join('');

    // Ajustar visibilidad de flechas y contador
    if (totalImages <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (counterEl) counterEl.textContent = '1 / 1';
    } else {
        if (prevBtn) prevBtn.style.display = 'flex';
        if (nextBtn) nextBtn.style.display = 'flex';
        if (counterEl) counterEl.textContent = `${initialIndex + 1} / ${totalImages}`;
    }

    // Inicializar carrusel sin autoplay
    let carouselInstance = bootstrap.Carousel.getInstance(modalCarouselEl);
    if (carouselInstance) {
        carouselInstance.dispose();
    }
    carouselInstance = new bootstrap.Carousel(modalCarouselEl, {
        interval: false,
        wrap: true,
        keyboard: true
    });
    carouselInstance.to(initialIndex);

    // Actualizar contador al cambiar de imagen
    if (modalCarouselEl._slideHandler) {
        modalCarouselEl.removeEventListener('slid.bs.carousel', modalCarouselEl._slideHandler);
    }
    modalCarouselEl._slideHandler = (e) => {
        if (counterEl) {
            counterEl.textContent = `${e.to + 1} / ${totalImages}`;
        }
    };
    modalCarouselEl.addEventListener('slid.bs.carousel', modalCarouselEl._slideHandler);

    const imageModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    imageModal.show();
}
