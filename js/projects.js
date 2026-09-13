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
            description: 'Sistema integral para el manejo de inventario, entradas, salidas y reportes.',
            stack: ['Java', 'Spring Boot', 'MySQL'],
            repoUrl: '#',
            status: 'coming-soon',
            images: []
        },
        {
            id: 'quiniela',
            name: 'App de Quiniela',
            description: 'Aplicación para acertar resultados de partidos con sistema de puntuación y ranking de usuarios.',
            stack: ['Java', 'Spring Boot', 'MySQL'],
            repoUrl: '#',
            status: 'coming-soon',
            images: []
        }
    ];

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
        
        // Galería de imágenes
        let galleryHtml = '';
        if (project.images.length > 0) {
            galleryHtml = `
                <div class="project-gallery mt-4">
                    ${project.images.map(img => `
                        <div class="gallery-item" onclick="openModal('${img}')">
                            <img src="${img}" alt="Captura de ${project.name}" onerror="this.src='https://via.placeholder.com/250x150/222/fff?text=Captura+Pendiente'">
                        </div>
                    `).join('')}
                </div>
            `;
        }

        const comingSoonBadgeHtml = isComingSoon ? `<div class="coming-soon-badge">PRÓXIMAMENTE</div>` : '';
        
        const repoBtnHtml = isComingSoon ? '' : `
            <a href="${project.repoUrl}" target="_blank" class="btn-repo">
                <i class="fab fa-github"></i> Ver Código
            </a>
        `;

        const slideHtml = `
            <div class="carousel-item ${isActive}">
                <div class="d-flex justify-content-center px-5 py-4">
                    <div class="project-card ${isComingSoon} w-100" style="max-width: 900px;">
                        ${comingSoonBadgeHtml}
                        <div class="project-card-header">
                            <h2 class="project-title font-monospace">${project.name}</h2>
                            <div class="stack-badges">
                                ${badgesHtml}
                            </div>
                        </div>
                        <div class="p-4">
                            <p class="project-desc">${project.description}</p>
                        </div>
                        ${galleryHtml}
                        <div class="project-links text-end">
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
        observer.observe(el);
    });
});

// Función global para el modal de imágenes
function openModal(imageSrc) {
    const modalImage = document.getElementById('modalImage');
    const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
    
    // Usar placeholder si falla la carga real para que el modal no quede vacío durante el demo
    modalImage.src = imageSrc;
    modalImage.onerror = () => {
        modalImage.src = 'https://via.placeholder.com/1200x800/222/fff?text=Captura+Completa+Pendiente';
    };
    
    imageModal.show();
}
