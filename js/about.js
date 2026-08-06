// ==========================================
// Archivo: js/about.js
// Capa de Vista y Animaciones UI
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ------------------------------------------
    // Lógica de interfaz y animaciones
    // ------------------------------------------

    // --- Lógica del Datapad ---
    const datapadCarousel = document.getElementById('datapadCarousel');
    if (datapadCarousel) {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>";
        const decodeText = (element) => {
            const targetText = element.getAttribute('data-text');
            if (!targetText) return;

            let iterations = 0;
            const interval = setInterval(() => {
                element.innerText = targetText.split("")
                    .map((letter, index) => {
                        if (index < iterations) return targetText[index]; 
                        if (letter === " " || letter.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/)) return letter;
                        return letters[Math.floor(Math.random() * letters.length)];
                    })
                    .join("");

                if (iterations >= targetText.length) {
                    clearInterval(interval);
                    element.innerText = targetText;
                }
                iterations += 1; 
            }, 35); 
        };

        const initialActiveTexts = datapadCarousel.querySelectorAll('.carousel-item.active .hacker-decode');
        initialActiveTexts.forEach(decodeText);

        datapadCarousel.addEventListener('slide.bs.carousel', function (e) {
            const nextTexts = e.relatedTarget.querySelectorAll('.hacker-decode');
            nextTexts.forEach(decodeText);
        });
    }

    // --- Lógica del fondo hacker ---
    const hackerBg = document.getElementById('hacker-background');
    if (hackerBg) {
        const columnWidth = 35;
        const columnsCount = Math.floor(window.innerWidth / columnWidth);
        const hexChars = "0123456789ABCDEF";

        for (let i = 0; i < columnsCount; i++) {
            const column = document.createElement('div');
            column.classList.add('hacker-column');
            column.classList.add(Math.random() > 0.8 ? 'hacker-magenta' : 'hacker-cyan');
            column.style.left = (i * columnWidth) + 'px';
            column.style.opacity = (Math.random() * 0.25 + 0.15).toString();
            hackerBg.appendChild(column);

            const updateColumn = () => {
                let text = '';
                const rows = 25 + Math.floor(Math.random() * 20); 
                for (let j = 0; j < rows; j++) {
                    if (Math.random() > 0.4) {
                        text += Math.random() > 0.5 ? '0' : '1';
                    } else {
                        text += hexChars.charAt(Math.floor(Math.random() * hexChars.length)) + 
                                hexChars.charAt(Math.floor(Math.random() * hexChars.length));
                    }
                    text += '<br>';
                }
                column.innerHTML = text;
            };

            updateColumn();
            const refreshRate = 150 + Math.random() * 400; 
            setInterval(updateColumn, refreshRate);
        }
    }

    // ------------------------------------------
    // Orquestación de módulos y consumo de API
    // ------------------------------------------

    // --- Módulo Libros ---
    async function initLibros() {
        const spinner = document.getElementById("loading-spinner");
        const librosWrapper = document.getElementById("libros-wrapper");
        const readingContainer = document.getElementById("reading-books-container");
        const finishedContainer = document.getElementById("finished-books-container");

        if (!spinner) return;

        try {
            const libros = await getLibrosData();

            if (!libros) {
                renderEmptyLibros("Actualmente no tengo lecturas en mi biblioteca.", spinner, librosWrapper);
                return;
            }

            spinner.style.display = 'none';
            librosWrapper.style.display = 'block';

            const readingBooks = libros.filter(libro => libro.estado === 'Reading');
            const finishedBooks = libros.filter(libro => libro.estado === 'Finished');

            renderListaLibros(readingBooks, readingContainer, "No hay lecturas en progreso en este momento.");
            renderListaLibros(finishedBooks, finishedContainer, "Aún no hay libros completados en el registro.");

        } catch (error) {
            console.error("Error UI Libros:", error);
            renderEmptyLibros("Error de conexión al cargar la base de datos de lecturas.", spinner, librosWrapper);
        }
    }

    function renderEmptyLibros(mensaje, spinner, wrapper) {
        spinner.style.display = 'none';
        wrapper.style.display = 'block';
        wrapper.innerHTML = `
            <div class="text-center py-5 border border-warning border-opacity-25 rounded bg-black">
                <i class="fas fa-exclamation-triangle fa-2x text-warning mb-3"></i>
                <p class="text-light-gray font-monospace">${mensaje}</p>
            </div>
        `;
    }

    function renderListaLibros(librosArray, contenedor, mensajeVacio) {
        contenedor.innerHTML = ''; 
        if (librosArray.length === 0) {
            contenedor.innerHTML = `<p class="text-muted font-monospace ps-3">${mensajeVacio}</p>`;
            return;
        }

        librosArray.forEach(libro => {
            const col = document.createElement("div");
            col.className = "col-md-6";
            const coverImage = libro.portadaUrl ? libro.portadaUrl : 'assets/logos/carlosdev-icon.svg';
            const progressValue = libro.progreso ? (libro.progreso * 100).toFixed(0) : 0;
            const isFinished = libro.estado === 'Finished';
            const themeClass = isFinished ? 'success' : 'info';
            const shadowColor = isFinished ? '#198754' : '#0dcaf0'; 

            let ratingHtml = '';
            if (isFinished && libro.rating) {
                ratingHtml = `<div class="mt-1 text-warning" style="letter-spacing: 2px;">${libro.rating}</div>`;
            }

            col.innerHTML = `
                <div class="card h-100 text-white cyber-card border border-${themeClass} border-opacity-25">
                    <div class="row g-0 h-100">
                        <div class="col-4 d-flex align-items-center justify-content-center p-3">
                            <img src="${coverImage}" class="img-fluid rounded cyber-cover shadow-lg" alt="Portada" style="max-height: 180px; object-fit: cover;">
                        </div>
                        <div class="col-8 d-flex flex-column justify-content-center">
                            <div class="card-body d-flex flex-column h-100">
                                <h4 class="card-title text-${themeClass} fw-bold mb-2">${libro.titulo || 'Sin título'}</h4>
                                <p class="card-text mb-2 text-${themeClass} fw-medium"><i class="fas fa-pen-nib me-2"></i>${libro.autor || 'Desconocido'}</p>
                                <p class="card-text mb-3"><span class="badge bg-dark border border-secondary text-light">${libro.genero || 'General'}</span></p>
                                <div class="mt-auto">
                                    <div class="progress bg-dark border border-${themeClass} border-opacity-25" style="height: 6px;">
                                        <div class="progress-bar bg-${themeClass}" role="progressbar" style="width: ${progressValue}%; box-shadow: 0 0 5px ${shadowColor};"></div>
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

    // --- Módulo Viajes ---
    function optimizeImageUrl(originalUrl) {
        if (!originalUrl.includes('images.unsplash.com')) return originalUrl;
        try {
            const url = new URL(originalUrl);
            url.searchParams.set('w', '600');
            url.searchParams.set('q', '80');
            url.searchParams.set('auto', 'format');
            return url.toString();
        } catch (e) {
            return originalUrl;
        }
    }

    async function initViajes() {
        const travelSpinner = document.getElementById("travel-loading-spinner");
        const viajesWrapper = document.getElementById("viajes-wrapper");
        const wantToGoContainer = document.getElementById("want-to-go-container");
        const visitedContainer = document.getElementById("visited-container");

        if (!travelSpinner) return;

        try {
            const viajes = await getViajesData();

            if (!viajes) {
                renderTravelEmpty("No hay destinos en la bitácora.", travelSpinner, viajesWrapper);
                return;
            }

            travelSpinner.style.display = 'none';
            viajesWrapper.style.display = 'block';

            const wantToGo = viajes.filter(v => v.estado === 'Want to go');
            const visited = viajes.filter(v => v.estado === 'Visited');

            renderViajes(wantToGo, wantToGoContainer, "magenta");
            renderViajes(visited, visitedContainer, "info");

        } catch (error) {
            console.error("Error UI Viajes:", error);
            renderTravelEmpty("Sistemas de navegación caídos.", travelSpinner, viajesWrapper);
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
            col.className = "col-lg-4 col-md-6"; 
            const coverImage = viaje.portadaUrl ? optimizeImageUrl(viaje.portadaUrl) : 'assets/logos/carlosdev-icon.svg';
            const heartIcon = viaje.favorito ? `<i class="fas fa-heart cyber-heart-icon" title="Destino Favorito"></i>` : '';
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
                            <i class="fas fa-globe-americas me-1"></i> ${viaje.continente || 'Planeta Tierra'}
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

    function renderTravelEmpty(mensaje, spinner, wrapper) {
        spinner.style.display = 'none';
        wrapper.style.display = 'block';
        wrapper.innerHTML = `
            <div class="text-center py-5 border border-danger border-opacity-25 rounded bg-black">
                <i class="fas fa-satellite-dish fa-2x text-danger mb-3"></i>
                <p class="text-light-gray font-monospace">${mensaje}</p>
            </div>
        `;
    }

    // --- Módulo Música (Spotify) ---
    async function initSpotify() {
        const spotifyLoading = document.getElementById("spotify-loading");
        const spotifyContainer = document.getElementById("spotify-widget-container");

        if (!spotifyLoading) return;

        try {
            const track = await getSpotifyActualData();

            if (!track) {
                renderSpotifyError("Dispositivo fuera de línea. Transmisión inactiva.", spotifyLoading, spotifyContainer);
                return;
            }

            spotifyLoading.style.display = 'none';
            spotifyContainer.style.display = 'block';

            const isLive = track.escuchandoAhora;
            const textTheme = isLive ? "text-info" : "text-light-gray";
            const statusLabel = isLive ? "Escuchando ahora" : "Última reproducción";
            const equalizerHtml = isLive ? 
                '<i class="fas fa-music animated-note"></i>' : 
                '<i class="fas fa-headphones-alt text-light-gray fs-5"></i>';

            spotifyContainer.innerHTML = `
                <div class="cyber-spotify-card shadow-lg">
                    <div class="spotify-status-bar d-flex justify-content-between align-items-center px-3 py-2">
                        <span class="${textTheme} font-monospace small fw-bold tracking-wider">
                            <i class="fab fa-spotify me-2 ${isLive ? 'fa-spin text-info' : ''}"></i>${statusLabel}
                        </span>
                        ${equalizerHtml}
                    </div>
                    <div class="p-4 d-flex align-items-center gap-4">
                        <img src="${track.portadaUrl || 'assets/logos/carlosdev-icon.svg'}" class="img-fluid rounded spotify-album-cover" alt="Portada">
                        <div class="flex-grow-1" style="min-width: 0;">
                            <h4 class="text-white fw-bold text-truncate mb-1 font-monospace" title="${track.titulo}">${track.titulo}</h4>
                            <p class="text-info fw-medium text-truncate mb-2 small"><i class="fas fa-microphone-alt me-1 text-opacity-50"></i> ${track.autor}</p>
                            <p class="text-light-gray text-truncate mb-3 small font-monospace" style="font-size: 0.85rem;"><i class="fas fa-compact-disc me-1"></i> ${track.album}</p>
                            <a href="${track.spotifyUrl}" target="_blank" class="btn spotify-link-btn rounded-pill px-3 py-1 mb-1 ms-1 font-monospace fw-bold text-decoration-none d-inline-flex align-items-center gap-1">
                                <i class="fab fa-spotify"></i> Open Spotify
                            </a>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error("Error UI Spotify:", error);
            renderSpotifyError("Error de enlace de frecuencia con los servidores de audio.", spotifyLoading, spotifyContainer);
        }
    }

    function renderSpotifyError(mensaje, loading, container) {
        loading.style.display = 'none';
        container.style.display = 'block';
        container.innerHTML = `
            <div class="text-center py-4 border border-info border-opacity-25 rounded bg-black bg-opacity-50 font-monospace">
                <i class="fab fa-spotify fa-2x text-muted mb-2"></i>
                <p class="text-muted small m-0">${mensaje}</p>
            </div>
        `;
    }

    // --- Módulo Música (Top Tracks) ---
    async function initSpotifyTopTracks() {
        const topTracksSection = document.getElementById("top-tracks-section");
        const topTracksContainer = document.getElementById("top-tracks-container");

        if (!topTracksContainer) return;

        try {
            const tracks = await getSpotifyTopTracksData();

            if (!tracks) {
                topTracksSection.style.display = 'none';
                return;
            }

            topTracksContainer.innerHTML = '';
            topTracksSection.style.display = 'block';

            tracks.forEach((track, index) => {
                const trackRow = document.createElement("a");
                trackRow.href = track.spotifyUrl;
                trackRow.target = "_blank";
                trackRow.className = "cyber-top-track d-flex align-items-center p-2 text-decoration-none";

                trackRow.innerHTML = `
                    <div class="track-number font-monospace me-2 text-center text-light-gray fw-bold" style="width: 20px;">${index + 1}</div>
                    <img src="${track.portadaUrl}" class="top-track-img rounded me-3" alt="Portada">
                    <div class="flex-grow-1 overflow-hidden" style="min-width: 0;">
                        <h6 class="track-title text-white font-monospace mb-1 text-truncate">${track.titulo}</h6>
                        <p class="text-light-gray small mb-0 text-truncate"><i class="fas fa-microphone-alt me-1 text-secondary opacity-75"></i>${track.artista}</p>
                    </div>
                    <div class="ms-2 play-icon-wrapper text-info px-2"><i class="fas fa-play fa-sm"></i></div>
                `;
                topTracksContainer.appendChild(trackRow);
            });
        } catch (error) {
            console.error("Error UI Top Tracks:", error);
            topTracksSection.style.display = 'none';
        }
    }

    // --- Módulo Steam: HUD ---
    async function initSteamHUD() {
        const loading = document.getElementById("steam-hud-loading");
        const container = document.getElementById("steam-hud-container");
        if (!loading || !container) return;

        try {
            const status = await getSteamCurrentStatus();
            
            if (!status) {
                renderSteamError("Señal de Steam perdida.", loading, container);
                return;
            }

            loading.style.display = 'none';
            container.style.display = 'block';

            const isPlaying = status.status === "In-Game";
            // Si está jugando, el texto principal sigue siendo "Online"
            const isOnline = status.status === "Online" || isPlaying; 
            
            // Colores e iconos dinámicos
            const statusColor = isOnline ? "text-info" : "text-secondary";
            const avatarGlowClass = isOnline ? "steam-avatar-online" : "steam-avatar-offline";
            const statusIcon = isPlaying ? "fa-gamepad fa-beat" : "fa-signal";
            
            let gameHtml = '';
            let profileUrl = status.profileUrl ? status.profileUrl : `https://steamcommunity.com/search/users/#text=${status.username}`;

            // Rediseño de la caja del juego actual
            if (isPlaying && status.currentGame) {
                gameHtml = `
                    <div class="mt-2 px-3 py-2 bg-dark bg-opacity-50 rounded border border-success d-inline-block">
                        <p class="text-success small fw-bold font-monospace mb-0"><i class="fas fa-play me-2"></i>${status.currentGame}</p>
                    </div>
                `;
            }

            container.innerHTML = `
                <div class="card bg-black border border-info border-opacity-25 shadow-lg p-4 group-hover-border mx-auto" style="max-width: 600px; transition: all 0.3s ease;">
                    <div class="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-4 text-center text-sm-start">
                        
                        <div class="d-flex flex-column flex-sm-row align-items-center gap-4">
                            <div class="position-relative">
                                <img src="${status.avatarUrl}" class="rounded border border-2 ${avatarGlowClass}" alt="Steam Avatar" style="width: 100px; height: 100px; object-fit: cover;">
                            </div>
                            
                            <!-- Info del Usuario -->
                            <div>
                                <h4 class="text-white font-monospace mb-1 fw-bold">${status.username}</h4>
                                <div class="d-flex align-items-center justify-content-center justify-content-sm-start ${statusColor} font-monospace small mb-1" style="gap: 6px;">
                                    <i class="fas ${statusIcon}" style="transform: translateY(-1px);"></i>
                                    <span style="line-height: 1;">${isOnline ? "Online" : "Offline"}</span>
                                </div>
                                ${gameHtml}
                            </div>
                        </div>
                        
                        <div class="mt-3 mt-sm-0">
                            <a href="${profileUrl}" target="_blank" class="btn btn-steam-profile font-monospace rounded-pill px-4 py-2">
                                <i class="fab fa-steam me-2"></i>Ver Perfil
                            </a>
                        </div>
                        
                    </div>
                </div>
            `;
        } catch (error) {
            console.error("Error UI Steam HUD:", error);
            renderSteamError("Fallo de enlace con Steamworks.", loading, container);
        }
    }

    // --- Módulo Videojuegos: Top de Juegos ---
    async function initSteamTopGames() {
        const loading = document.getElementById("steam-top-loading");
        const container = document.getElementById("steam-top-container");
        if (!loading || !container) return;

        try {
            const games = await getSteamTopPlayed();
            if (!games || games.length === 0) {
                renderSteamError("No hay registros de juego.", loading, container);
                return;
            }

            loading.style.display = 'none';
            container.style.display = 'flex';
            container.innerHTML = '';

            games.forEach((game, index) => {
                const col = document.createElement("div");
                col.className = "col-12 col-md-6 mb-3";
                
                if (index === 0) {
                    // Diseño HERO para el Top 1
                    col.innerHTML = `
                        <div class="card bg-black border border-warning border-opacity-50 position-relative overflow-hidden group-hover-border h-100" style="transition: transform 0.3s ease;">
                            <div class="position-absolute top-0 start-0 bg-warning text-black font-monospace px-3 py-1 fw-bold" style="z-index: 2; border-bottom-right-radius: 8px; box-shadow: 2px 2px 10px rgba(255, 193, 7, 0.4);">
                                <i class="fas fa-trophy me-1"></i>#1
                            </div>
                            
                            <img src="${game.bannerUrl}" onerror="this.onerror=null; this.src=this.src.replace('capsule_616x353.jpg', 'header.jpg');" class="card-img-top bg-black" alt="${game.name}" style="width: 100%; aspect-ratio: 616 / 353; object-fit: contain; opacity: 0.9;">
                            
                            <div class="position-absolute bottom-0 w-100 p-3 d-flex justify-content-between align-items-end" style="background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%);">
                                <h6 class="text-white font-monospace mb-0 text-truncate text-shadow" style="text-shadow: 2px 2px 4px #000;">${game.name}</h6>
                                <span class="text-warning font-monospace fw-bold small" style="text-shadow: 1px 1px 2px #000;"><i class="far fa-clock me-1"></i>${game.playTimeHours}h</span>
                            </div>
                        </div>
                    `;
                } else {
                    // Diseño para el resto del top
                    
                    let badgeBg = "";
                    let badgeText = "";
                    let shadowColor = "";
                    
                    if (index === 1) { // Segundo lugar (#2)
                        badgeBg = "#C0C0C0"; // Plata
                        badgeText = "#000000"; // Texto negro
                        shadowColor = "rgba(192, 192, 192, 0.4)";
                    } else { // Del tercer lugar en adelante (#3 al #6)
                        badgeBg = "#CD7F32"; // Bronce
                        badgeText = "#FFFFFF"; // Texto blanco para mejor contraste
                        shadowColor = "rgba(205, 127, 50, 0.4)";
                    }

                    col.innerHTML = `
                        <div class="card bg-black border border-secondary border-opacity-50 position-relative overflow-hidden group-hover-border h-100" style="transition: transform 0.3s ease;">
                            <div class="position-absolute top-0 start-0 font-monospace px-3 py-1 fw-bold" style="background-color: ${badgeBg}; color: ${badgeText}; z-index: 2; border-bottom-right-radius: 8px; box-shadow: 2px 2px 10px ${shadowColor};">
                                #${index + 1}
                            </div>
                            
                            <img src="${game.bannerUrl}" onerror="this.onerror=null; this.src=this.src.replace('capsule_616x353.jpg', 'header.jpg');" class="card-img-top bg-black" alt="${game.name}" style="width: 100%; aspect-ratio: 616 / 353; object-fit: contain; opacity: 0.9;">
                            
                            <div class="position-absolute bottom-0 w-100 p-3 d-flex justify-content-between align-items-end" style="background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%);">
                                <h6 class="text-white font-monospace mb-0 text-truncate text-shadow" style="text-shadow: 2px 2px 4px #000;">${game.name}</h6>
                                <!-- Se cambió text-warning por text-info para obtener el color cyan -->
                                <span class="text-info font-monospace fw-bold small" style="text-shadow: 1px 1px 2px #000;"><i class="far fa-clock me-1"></i>${game.playTimeHours}h</span>
                            </div>
                        </div>
                    `;
                }
                
                container.appendChild(col);
            });
        } catch (error) {
            console.error("Error UI Steam Top Games:", error);
            renderSteamError("No se pudo recuperar los registros.", loading, container);
        }
    }

    // --- Módulo Videojuegos: Vitrina de Logros ---
    async function initSteamAchievements() {
        const loading = document.getElementById("steam-achievements-loading");
        const container = document.getElementById("steam-achievements-container");
        if (!loading || !container) return;

        try {
            const achievements = await getSteamAchievements();
            if (!achievements || achievements.length === 0) {
                renderSteamError("No hay datos de logros disponibles.", loading, container);
                return;
            }

            loading.style.display = 'none';
            container.style.display = 'flex';
            container.innerHTML = '';

            achievements.forEach(game => {
                const col = document.createElement("div");
                col.className = "col-md-6 mb-3";
                
                const percentage = game.completionPercentage.toFixed(1);
                // Si está al 100%, pinta de dorado, si no, de verde
                const themeClass = percentage == 100.0 ? "warning" : "success"; 

                col.innerHTML = `
                    <div class="d-flex align-items-center bg-black border border-${themeClass} border-opacity-25 p-2 rounded">
                        <img src="${game.bannerUrl}" class="rounded me-3" alt="${game.gameName}" style="width: 120px; height: 56px; object-fit: cover;">
                        <div class="flex-grow-1">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <span class="text-white font-monospace small text-truncate" style="max-width: 150px;">${game.gameName}</span>
                                <span class="text-${themeClass} font-monospace fw-bold small">${percentage}%</span>
                            </div>
                            <div class="progress bg-dark" style="height: 6px;">
                                <div class="progress-bar bg-${themeClass}" role="progressbar" style="width: ${percentage}%; box-shadow: 0 0 5px var(--bs-${themeClass});"></div>
                            </div>
                            <div class="text-end mt-1">
                                <span class="text-light-gray font-monospace" style="font-size: 0.7rem;">${game.unlockedAchievements} / ${game.totalAchievements} Unlocked</span>
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(col);
            });
        } catch (error) {
            console.error("Error UI Steam Achievements:", error);
            renderSteamError("No se pudieron sincronizar los trofeos.", loading, container);
        }
    }

    // Función auxiliar para capturar errores de Steam
    function renderSteamError(mensaje, loading, container) {
        loading.style.display = 'none';
        container.style.display = 'block';
        container.innerHTML = `
            <div class="text-center py-3 border border-danger border-opacity-25 rounded bg-black">
                <i class="fas fa-exclamation-triangle text-danger mb-2"></i>
                <p class="text-light-gray font-monospace small mb-0">${mensaje}</p>
            </div>
        `;
    }

    // ------------------------------------------
    // Inicialización de módulos
    // ------------------------------------------
    initLibros();
    initViajes();
    initSpotify();
    initSpotifyTopTracks();
    initSteamHUD();
    initSteamTopGames();
    initSteamAchievements();

});