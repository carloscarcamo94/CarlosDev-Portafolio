document.addEventListener("DOMContentLoaded", function () {
    
    // --- Lógica de Smart Navbar (Ocultar al bajar, mostrar al subir) ---
    // const navbar = document.getElementById('main-navbar');
    // let lastScrollTop = 0;

    // window.addEventListener('scroll', function() {
    //     let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Si el usuario hace scroll hacia abajo y ha pasado los primeros 100px
    //     if (scrollTop > lastScrollTop && scrollTop > 100) {
    //         navbar.style.transform = 'translateY(-100%)'; // Oculta la barra hacia arriba
    //     } else {
    //         navbar.style.transform = 'translateY(0)'; // Muestra la barra al subir
    //     }
        
    //     lastScrollTop = scrollTop;
    // });

    // URL de tu API en producción (Render)
    const apiUrl = "https://api-contactform.onrender.com/api/libros/actuales";
    const lecturasContainer = document.getElementById("lecturas-container");

    // Función para obtener y renderizar los libros
    async function fetchLibros() {
        try {
            const response = await fetch(apiUrl);
            
            if (response.status === 204) {
                // No content (La lista está vacía en Notion)
                renderEmptyState("Actualmente no tengo lecturas en progreso.");
                return;
            }

            if (!response.ok) {
                throw new Error("Error en la conexión con el servidor");
            }

            const libros = await response.json();
            renderLibros(libros);

        } catch (error) {
            console.error("Error al obtener libros:", error);
            renderEmptyState("Error de conexión al cargar la base de datos de lecturas. Reintentando más tarde.");
        }
    }

    // Función para dibujar las tarjetas HTML
    function renderLibros(libros) {
        lecturasContainer.innerHTML = ''; // Limpiar el spinner

        // Creamos un grid de Bootstrap para las tarjetas
        const row = document.createElement("div");
        row.className = "row g-4";

        libros.forEach(libro => {
            const col = document.createElement("div");
            col.className = "col-md-6";
            
            // Reemplazo de portada nula por una imagen Sci-Fi por defecto si no hay URL
            const coverImage = libro.portadaUrl ? libro.portadaUrl : 'assets/logos/carlosdev-icon.svg';
            const progressValue = libro.progreso ? (libro.progreso * 100).toFixed(0) : 0;

            col.innerHTML = `
                <div class="card bg-black border-info border-1 h-100 text-white" style="transition: transform 0.3s; cursor: crosshair;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                    <div class="row g-0">
                        <div class="col-4 d-flex align-items-center justify-content-center p-2">
                            <img src="${coverImage}" class="img-fluid rounded border border-secondary" alt="Portada de ${libro.titulo}" style="max-height: 150px; object-fit: cover;">
                        </div>
                        <div class="col-8">
                            <div class="card-body">
                                <h5 class="card-title text-info fw-bold">${libro.titulo || 'Sin título'}</h5>
                                <p class="card-text mb-1"><small class="text-muted"><i class="fas fa-pen-nib me-1"></i>${libro.autor || 'Desconocido'}</small></p>
                                <p class="card-text mb-2"><span class="badge bg-secondary">${libro.genero || 'General'}</span></p>
                                
                                <!-- Barra de progreso al estilo Cyberpunk -->
                                <div class="progress mt-3 bg-dark" style="height: 5px;">
                                    <div class="progress-bar bg-info" role="progressbar" style="width: ${progressValue}%;" aria-valuenow="${progressValue}" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <div class="text-end mt-1">
                                    <small class="font-monospace text-info">${progressValue}% completado</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            row.appendChild(col);
        });

        lecturasContainer.appendChild(row);
    }

    // Función para manejar estados vacíos o errores
    function renderEmptyState(mensaje) {
        lecturasContainer.innerHTML = `
            <div class="text-center py-5 border border-warning border-opacity-25 rounded bg-black">
                <i class="fas fa-exclamation-triangle fa-2x text-warning mb-3"></i>
                <p class="text-light-gray font-monospace">${mensaje}</p>
            </div>
        `;
    }

    // Iniciar la petición
    fetchLibros();
});