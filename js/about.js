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

    // --- Lógica del Typewriter (Terminal) ---
    const textPart1 = "Soy un desarrollador de software, entusiasta de la tecnología 💻. Me apasiona la innovación, crear proyectos y aprender constantemente nuevas herramientas del mundo tech ⚡.\n\nCuando no estoy programando, probablemente estoy leyendo algún libro 📔📕, escuchando música 🎧, jugando un videojuego 🎮 o viendo películas y series 🍿.";

    const textPart2 = "También soy amante del deporte, en especial del fútbol ⚽, voleibol 🏐, baloncesto 🏀 y tenis 🎾. Fiel seguidor del Real Madrid 👑, me identifico con sus valores sobre la resiliencia y la búsqueda constante de la excelencia 🏆.\n\nY, por supuesto, nada acompaña mejor estos hobbies que una buena taza de café ☕.";

    const twElement = document.getElementById("typewriter-text");
    
    if (twElement) {
        let currentArray = Array.from(textPart1);
        let charIndex = 0;
        let phase = 1; // 1: Escribir | 2: Borrar
        let isShowingPart1 = true; // Controla qué texto se está mostrando

        function typeWriter() {
            let typeSpeed = 35; // Velocidad de tipeo base

            if (phase === 1) {
                // Escribiendo...
                if (charIndex < currentArray.length) {
                    twElement.textContent += currentArray[charIndex];
                    charIndex++;
                    // Pausa humana en signos de puntuación
                    if (currentArray[charIndex - 1] === '.' || currentArray[charIndex - 1] === ',') typeSpeed = 300;
                } else {
                    // Cambio a fase de borrado tras una pausa.
                    phase = 2;
                    typeSpeed = 4000; // Tiempo de espera al finalizar la escritura antes de empezar a borrar
                }
            } else if (phase === 2) {
                // Borrando...
                typeSpeed = 10; // Velocidad de borrado rápido
                if (charIndex > 0) {
                    charIndex--;
                    twElement.textContent = currentArray.slice(0, charIndex).join('');
                } else {
                    // Alternamos los textos.
                    phase = 1;
                    isShowingPart1 = !isShowingPart1; // Cambia entre true y false
                    currentArray = Array.from(isShowingPart1 ? textPart1 : textPart2);
                    typeSpeed = 800; // Pausa breve con la terminal vacía antes de iniciar
                }
            }
            
            setTimeout(typeWriter, typeSpeed);
        }

        // Retrasar el inicio
        setTimeout(typeWriter, 1200);
    }

    // URL de tu API en producción (Render)
    const apiUrl = "https://api-contactform.onrender.com/api/libros/actuales";
    const lecturasContainer = document.getElementById("lecturas-container");

    // Función para obtener y renderizar los libros
    async function fetchLibros() {
        try {
            const response = await fetch(apiUrl);
            
            if (response.status === 204) {
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
                <div class="card h-100 text-white cyber-card">
                    <div class="row g-0 h-100">
                        <div class="col-4 d-flex align-items-center justify-content-center p-3">
                            <img src="${coverImage}" class="img-fluid rounded cyber-cover" alt="Portada de ${libro.titulo}" style="max-height: 180px; object-fit: cover;">
                        </div>
                        <div class="col-8 d-flex flex-column justify-content-center">
                            <div class="card-body">
                                <h4 class="card-title text-info fw-bold mb-2">${libro.titulo || 'Sin título'}</h4>
                                
                                <p class="card-text mb-2 text-info fw-medium">
                                    <i class="fas fa-pen-nib me-2"></i>${libro.autor || 'Desconocido'}
                                </p>
                                
                                <p class="card-text mb-3">
                                    <span class="badge bg-dark border border-secondary text-light">${libro.genero || 'General'}</span>
                                </p>
                                
                                <div class="progress mt-auto bg-dark border border-info border-opacity-25" style="height: 6px;">
                                    <div class="progress-bar bg-info" role="progressbar" style="width: ${progressValue}%; box-shadow: 0 0 5px #0dcaf0;" aria-valuenow="${progressValue}" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <div class="text-end mt-2">
                                    <small class="font-monospace text-info fw-bold">${progressValue}% completado</small>
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