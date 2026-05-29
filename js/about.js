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
            column.style.opacity = (Math.random() * 0.15 + 0.05).toString();

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