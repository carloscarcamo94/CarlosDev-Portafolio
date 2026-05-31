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

// --- Lógica del Datapad ---
    const datapadCarousel = document.getElementById('datapadCarousel');
    
    if (datapadCarousel) {
        // Matriz de caracteres para la encriptación visual
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>";
        
        const decodeText = (element) => {
            const targetText = element.getAttribute('data-text');
            if (!targetText) return;
            
            let iterations = 0;
            const interval = setInterval(() => {
                element.innerText = targetText.split("")
                    .map((letter, index) => {
                        // Si ya superamos el índice, mostramos la letra real
                        if (index < iterations) {
                            return targetText[index]; 
                        }
                        // Dejamos espacios y emojis intactos para que no parpadeen raro
                        if (letter === " " || letter.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/)) {
                            return letter;
                        }
                        // Mostramos un carácter aleatorio
                        return letters[Math.floor(Math.random() * letters.length)];
                    })
                    .join("");

                if (iterations >= targetText.length) {
                    clearInterval(interval);
                    element.innerText = targetText; // Seguro final
                }
                iterations += 1; // Ajusta este número para que se descifre más rápido o más lento
            }, 35); 
        };

        // Ejecutar el efecto en el primer slide al cargar la página
        const initialActiveTexts = datapadCarousel.querySelectorAll('.carousel-item.active .hacker-decode');
        initialActiveTexts.forEach(decodeText);

        // Escuchar el evento nativo de Bootstrap cuando el carrusel cambia de slide
        datapadCarousel.addEventListener('slide.bs.carousel', function (e) {
            const nextTexts = e.relatedTarget.querySelectorAll('.hacker-decode');
            nextTexts.forEach(decodeText);
        });
    }

    // --- Lógica del fondo hacker ---
    const hackerBg = document.getElementById('hacker-background');
    
    if (hackerBg) {
        // Calculamos cuántas columnas caben en la pantalla (una cada 35px aprox)
        const columnWidth = 35;
        const columnsCount = Math.floor(window.innerWidth / columnWidth);
        const hexChars = "0123456789ABCDEF";

        for (let i = 0; i < columnsCount; i++) {
            const column = document.createElement('div');
            column.classList.add('hacker-column');
            
            // Distribuimos los colores: 80% Cyan (principal), 20% Magenta (acento)
            column.classList.add(Math.random() > 0.8 ? 'hacker-magenta' : 'hacker-cyan');
            
            // Posicionamiento de izquierda a derecha
            column.style.left = (i * columnWidth) + 'px';
            
            // Variación en la opacidad para dar sensación de profundidad
            column.style.opacity = (Math.random() * 0.25 + 0.15).toString();

            hackerBg.appendChild(column);

            // Generador dinámico de texto
            const updateColumn = () => {
                let text = '';
                // Altura aleatoria de las cadenas
                const rows = 25 + Math.floor(Math.random() * 20); 
                
                for (let j = 0; j < rows; j++) {
                    // 60% probabilidad de ser Binario, 40% de ser Hexadecimal
                    if (Math.random() > 0.4) {
                        text += Math.random() > 0.5 ? '0' : '1';
                    } else {
                        // Genera un par hexadecimal (ej. "A3", "4F")
                        text += hexChars.charAt(Math.floor(Math.random() * hexChars.length)) + 
                                hexChars.charAt(Math.floor(Math.random() * hexChars.length));
                    }
                    text += '<br>';
                }
                column.innerHTML = text;
            };

            // Primera carga del texto
            updateColumn();

            // Intervalo aleatorio para que las columnas "parpadeen" y se actualicen asíncronamente
            const refreshRate = 150 + Math.random() * 400; // Entre 150ms y 550ms
            setInterval(updateColumn, refreshRate);
        }
    }

    // URL de la API de libros en producción
    const apiUrl = "https://api-contactform.onrender.com/api/libros/actuales";
    // Capturamos los nuevos contenedores del HTML
    const spinner = document.getElementById("loading-spinner");
    const librosWrapper = document.getElementById("libros-wrapper");
    const readingContainer = document.getElementById("reading-books-container");
    const finishedContainer = document.getElementById("finished-books-container");

    // Función principal para obtener y distribuir los libros
    async function fetchLibros() {
        try {
            const response = await fetch(apiUrl);
            
            if (response.status === 204) {
                renderEmptyState("Actualmente no tengo lecturas en mi biblioteca.");
                return;
            }

            if (!response.ok) {
                throw new Error("Error en la conexión con el servidor");
            }

            const libros = await response.json();
            
            // Ocultamos el spinner y mostramos el contenedor principal
            spinner.style.display = 'none';
            librosWrapper.style.display = 'block';

            // Filtramos los libros por su estado exacto en Notion
            const readingBooks = libros.filter(libro => libro.estado === 'Reading');
            const finishedBooks = libros.filter(libro => libro.estado === 'Finished');

            // Renderizamos cada categoría en su respectivo contenedor
            renderListaLibros(readingBooks, readingContainer, "No hay lecturas en progreso en este momento.");
            renderListaLibros(finishedBooks, finishedContainer, "Aún no hay libros completados en el registro.");

        } catch (error) {
            console.error("Error al obtener libros:", error);
            renderEmptyState("Error de conexión al cargar la base de datos de lecturas. Reintentando más tarde.");
        }
    }

    // Función modular para dibujar las tarjetas en el DOM
    function renderListaLibros(librosArray, contenedor, mensajeVacio) {
        contenedor.innerHTML = ''; // Limpiamos cualquier contenido previo

        // Validamos si la lista está vacía
        if (librosArray.length === 0) {
            contenedor.innerHTML = `<p class="text-muted font-monospace ps-3">${mensajeVacio}</p>`;
            return;
        }

        librosArray.forEach(libro => {
            const col = document.createElement("div");
            col.className = "col-md-6";
            
            // Lógica de datos
            const coverImage = libro.portadaUrl ? libro.portadaUrl : 'assets/logos/carlosdev-icon.svg';
            const progressValue = libro.progreso ? (libro.progreso * 100).toFixed(0) : 0;
            const isFinished = libro.estado === 'Finished';
            
            // Dinamismo de colores (Cyan para Reading, Verde para Finished)
            const themeClass = isFinished ? 'success' : 'info';
            const shadowColor = isFinished ? '#198754' : '#0dcaf0'; // Códigos HEX de Bootstrap
            
            // Lógica para Rating (Estrellas de Notion)
            let ratingHtml = '';
            if (isFinished && libro.rating) {
                // Asume que libro.rating trae las estrellas en texto, ej: "⭐⭐⭐⭐"
                ratingHtml = `<div class="mt-1 text-warning" style="letter-spacing: 2px;">${libro.rating}</div>`;
            }

            // Construcción del HTML de la tarjeta
            col.innerHTML = `
                <div class="card h-100 text-white cyber-card border border-${themeClass} border-opacity-25">
                    <div class="row g-0 h-100">
                        <div class="col-4 d-flex align-items-center justify-content-center p-3">
                            <img src="${coverImage}" class="img-fluid rounded cyber-cover shadow-lg" alt="Portada de ${libro.titulo}" style="max-height: 180px; object-fit: cover;">
                        </div>
                        <div class="col-8 d-flex flex-column justify-content-center">
                            <div class="card-body d-flex flex-column h-100">
                                
                                <h4 class="card-title text-${themeClass} fw-bold mb-2">${libro.titulo || 'Sin título'}</h4>
                                
                                <p class="card-text mb-2 text-${themeClass} fw-medium">
                                    <i class="fas fa-pen-nib me-2"></i>${libro.autor || 'Desconocido'}
                                </p>
                                
                                <p class="card-text mb-3">
                                    <span class="badge bg-dark border border-secondary text-light">${libro.genero || 'General'}</span>
                                </p>
                                
                                <div class="mt-auto">
                                    <div class="progress bg-dark border border-${themeClass} border-opacity-25" style="height: 6px;">
                                        <div class="progress-bar bg-${themeClass}" role="progressbar" style="width: ${progressValue}%; box-shadow: 0 0 5px ${shadowColor};" aria-valuenow="${progressValue}" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    
                                    <div class="d-flex justify-content-between align-items-end mt-2">
                                        <div>
                                            ${isFinished ? `<span class="badge bg-success bg-opacity-10 text-success border border-success rounded-pill mb-1"><i class="fas fa-check-circle me-1"></i>Finished</span>` : ''}
                                            ${ratingHtml}
                                        </div>
                                        <small class="font-monospace text-${themeClass} fw-bold">${progressValue}% completado</small>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            `;
            contenedor.appendChild(col);
        });
    }

    // Función para manejar errores de conexión o catálogos vacíos
    function renderEmptyState(mensaje) {
        spinner.style.display = 'none';
        librosWrapper.style.display = 'block';
        librosWrapper.innerHTML = `
            <div class="text-center py-5 border border-warning border-opacity-25 rounded bg-black">
                <i class="fas fa-exclamation-triangle fa-2x text-warning mb-3"></i>
                <p class="text-light-gray font-monospace">${mensaje}</p>
            </div>
        `;
    }

    // Iniciar la petición
    fetchLibros();

    // URL de la API de viajes en producción
    const travelApiUrl = "https://api-contactform.onrender.com/api/viajes/destinos";
    // Capturamos los nuevos contenedores del HTML
    const travelSpinner = document.getElementById("travel-loading-spinner");
    const viajesWrapper = document.getElementById("viajes-wrapper");
    const wantToGoContainer = document.getElementById("want-to-go-container");
    const visitedContainer = document.getElementById("visited-container");

    async function fetchViajes() {
        if (!travelSpinner) return; // Por si no estamos en la pestaña correcta
        
        try {
            const response = await fetch(travelApiUrl);
            
            if (response.status === 204) return renderTravelEmpty("No hay destinos en la bitácora.");
            if (!response.ok) throw new Error("Error en el servidor de viajes");

            const viajes = await response.json();
            
            travelSpinner.style.display = 'none';
            viajesWrapper.style.display = 'block';

            const wantToGo = viajes.filter(v => v.estado === 'Want to go');
            const visited = viajes.filter(v => v.estado === 'Visited');

            renderViajes(wantToGo, wantToGoContainer, "magenta");
            renderViajes(visited, visitedContainer, "info");

        } catch (error) {
            console.error("Error viajes:", error);
            renderTravelEmpty("Sistemas de navegación caídos. Reintentando...");
        }
    }

    function renderViajes(viajesArray, contenedor, themeColor) {
        contenedor.innerHTML = '';
        if (viajesArray.length === 0) {
            contenedor.innerHTML = `<p class="text-muted font-monospace ps-3">Sin registros en este sector.</p>`;
            return;
        }

        viajesArray.forEach(viaje => {
            const col = document.createElement("div");
            col.className = "col-lg-4 col-md-6"; // 3 tarjetas por fila en PC
            
            const coverImage = viaje.portadaUrl ? viaje.portadaUrl : 'assets/logos/carlosdev-icon.svg';
            const heartIcon = viaje.favorito ? `<span class="favorite-badge"><i class="fas fa-heart text-${themeColor}"></i></span>` : '';
            const bookedIcon = viaje.reservado ? `<span class="badge bg-success bg-opacity-25 text-success border border-success mt-2"><i class="fas fa-ticket-alt me-1"></i>Vuelo Reservado</span>` : '';

            col.innerHTML = `
                <div class="cyber-travel-card h-100">
                    <div class="travel-img-wrapper">
                        <img src="${coverImage}" class="travel-cover" alt="${viaje.nombre}">
                        ${heartIcon}
                    </div>
                    <div class="card-body p-4 d-flex flex-column">
                        <h4 class="text-${themeColor} fw-bold mb-1">${viaje.nombre}</h4>
                        <p class="text-light-gray font-monospace small mb-3">
                            <i class="fas fa-globe-americas me-1 text-muted"></i> ${viaje.continente || 'Planeta Tierra'}
                        </p>
                        
                        <div class="d-flex flex-wrap gap-2 mb-3">
                            ${viaje.duracion ? `<span class="badge bg-dark border border-secondary"><i class="far fa-clock me-1"></i>${viaje.duracion}</span>` : ''}
                            ${viaje.presupuesto ? `<span class="badge bg-dark border border-secondary"><i class="fas fa-wallet me-1"></i>${viaje.presupuesto}</span>` : ''}
                        </div>
                        
                        <div class="mt-auto pt-3 border-top border-secondary border-opacity-25">
                            ${bookedIcon}
                        </div>
                    </div>
                </div>
            `;
            contenedor.appendChild(col);
        });
    }

    function renderTravelEmpty(mensaje) {
        travelSpinner.style.display = 'none';
        viajesWrapper.style.display = 'block';
        viajesWrapper.innerHTML = `
            <div class="text-center py-5 border border-danger border-opacity-25 rounded bg-black">
                <i class="fas fa-satellite-dish fa-2x text-danger mb-3"></i>
                <p class="text-light-gray font-monospace">${mensaje}</p>
            </div>
        `;
    }

    // Iniciar carga de viajes
    fetchViajes();
});