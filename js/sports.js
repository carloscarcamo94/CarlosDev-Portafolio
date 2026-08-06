// ==========================================
// Archivo: js/sports.js
// Capa de Servicios: Datos Locales
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    
    const deportesContainer = document.getElementById("deportes-container");
    if (!deportesContainer) return;

    // Base de Datos Simulada (Mock Data API)
    const deportesData = [
        {
            id: "real-madrid",
            titulo: "Real Madrid",
            iconoBadge: "fas fa-crown",
            colorTema: "warning",
            descripcion: 'Fiel seguidor del "Rey de Europa", me siento representado por los valores del club. La valentía, el honor, la perseverancia, la tenacidad y el respeto son algunos de los valores que pregona la institución blanca.',
            imgFondo: "assets/img/sports/madrid.webp",
            textoFondo: "La Décima - Lisboa, Portugal (2014)",
            iconoFondo: "fas fa-camera",
            colorFondo: "magenta"
        },
        {
            id: "champions-league",
            titulo: "UEFA Champions League",
            iconoBadge: "fas fa-trophy",
            colorTema: "info",
            descripcion: 'La competición por excelencia de clubes. Me fascinan las "Noches Mágicas" de la Liga de Campeones de la UEFA porque siempre están cargadas de sorpresas y emociones.',
            imgFondo: "assets/img/sports/champions.webp",
            textoFondo: "Real Madrid 3-1 vs Man City - Madrid, España (2022)",
            iconoFondo: "fas fa-bolt",
            colorFondo: "magenta"
        },
        {
            id: "world-cup",
            titulo: "FIFA World Cup",
            iconoBadge: "fas fa-globe-americas",
            colorTema: "magenta",
            descripcion: 'La Copa Mundial de la FIFA, el torneo más prestigioso de selecciones, se disputa cada cuatro años y, sin duda, se disfrutan de partidos cargados de sentimientos.',
            imgFondo: "assets/img/sports/world-cup.webp",
            textoFondo: "Zinedine Zidane - Francia (1998)",
            iconoFondo: "fas fa-star",
            colorFondo: "magenta"
        },
        {
            id: "nba",
            titulo: "NBA",
            iconoBadge: "fas fa-basketball-ball",
            colorTema: "warning",
            descripcion: 'La National Basketball Association, competición que desde el momento en que comienza, el ambiente es aturdidor. Es una fiesta continua y a medida que avanza la competición, la presión y la adrenalina se sienten en cada posesión.',
            imgFondo: "assets/img/sports/nba.webp",
            textoFondo: 'Kobe Bryant "Black Mamba"',
            iconoFondo: "fas fa-fire",
            colorFondo: "warning"
        },
        {
            id: "olympic-games",
            titulo: "Olympic Games",
            iconoBadge: "fas fa-fire-burner",
            colorTema: "danger",
            descripcion: 'Los Juegos Olímpicos son el mayor evento deportivo internacional multidisciplinario. Promueve valores fundamentales como la excelencia, la amistad y el respeto, fomentando la competencia justa.',
            imgFondo: "assets/img/sports/olympic-games.webp",
            textoFondo: "Michael Phelps - Rio de Janeiro (2016)",
            iconoFondo: "fas fa-medal",
            colorFondo: "info"
        },
        {
            id: "vnl",
            titulo: "VNL",
            iconoBadge: "fas fa-volleyball-ball",
            colorTema: "info",
            descripcion: 'La élite del voleibol mundial reunida en un formato de liga vertiginoso. Un espectáculo puro de potencia, reflejos en defensa y combinaciones aéreas cargadas de adrenalina pura.',
            imgFondo: "assets/img/sports/vnl.webp",
            textoFondo: "VNL: Japón vs Rusia",
            iconoFondo: "fas fa-play",
            colorFondo: "info"
        },
        {
            id: "australian-open",
            titulo: "Australian Open",
            iconoBadge: "fas fa-sun",
            colorTema: "warning",
            descripcion: 'El primer Grand Slam de la temporada bajo el ardiente verano de Melbourne. Destaca por el juego ultrarrápido y una atmósfera eléctrica donde la élite inicia la carrera por la gloria.',
            imgFondo: "assets/img/sports/australian-open.webp",
            textoFondo: "Novak Djokovic - Melbourne, Australia",
            iconoFondo: "fas fa-user-ninja",
            colorFondo: "warning"
        },
        {
            id: "roland-garros",
            titulo: "Roland Garros",
            iconoBadge: "fas fa-award",
            colorTema: "danger",
            descripcion: 'La prueba de fuego definitiva sobre la mítica arcilla roja de París. Un torneo implacable que exige la máxima resistencia física y una fortaleza mental inquebrantable para conseguir cada punto.',
            imgFondo: "assets/img/sports/roland-garros.webp",
            textoFondo: "Rafael Nadal - París, Francia",
            iconoFondo: "fas fa-crown",
            colorFondo: "danger"
        },
        {
            id: "wimbledon",
            titulo: "Wimbledon",
            iconoBadge: "fas fa-leaf",
            colorTema: "success",
            descripcion: 'El templo sagrado del tenis, celebrado sobre la tradicional hierba de Londres. Mantiene intactas las costumbres más clásicas del tenis, combinándolas con un juego de ritmo frenético.',
            imgFondo: "assets/img/sports/wimbledon.webp",
            textoFondo: "Roger Federer - Londres, Inglaterra",
            iconoFondo: "fas fa-magic",
            colorFondo: "success"
        },
        {
            id: "us-open",
            titulo: "US Open",
            iconoBadge: "fas fa-bolt",
            colorTema: "magenta",
            descripcion: 'El último gran escenario del año, iluminado por las vibrantes noches de New York. Definitivamente, las canchas más duras y veloces y, sin duda, las mejores sesiones nocturnas.',
            imgFondo: "assets/img/sports/us-open.webp",
            textoFondo: "Jannik Sinner - Queens, Nueva York",
            iconoFondo: "fas fa-fire-alt",
            colorFondo: "magenta"
        }
    ];

    // Función renderizadora aislada
    function renderDeportes() {
        deportesContainer.innerHTML = ''; 

        deportesData.forEach(deporte => {
            const col = document.createElement("div");
            col.className = "col-lg-4 col-md-6";

            col.innerHTML = `
                <div class="cyber-sport-scene h-100" onclick="this.classList.toggle('flipped')">
                    <div class="cyber-sport-inner">
                        <div class="cyber-sport-front cyber-sport-card h-100">
                            <div class="sport-hud-accent"></div>
                            <div class="sport-card-body p-4 h-100">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h4 class="text-info fw-bold font-monospace m-0">${deporte.titulo}</h4>
                                    <i class="${deporte.iconoBadge} text-${deporte.colorTema} fs-3 sport-icon-glow"></i>
                                </div>
                                <p class="text-light-gray small font-monospace lh-base">
                                    ${deporte.descripcion}
                                </p>
                            </div>
                        </div>
                        <div class="cyber-sport-back cyber-sport-card h-100">
                            <img src="${deporte.imgFondo}" alt="${deporte.titulo}" loading="lazy">
                            <div class="sport-back-overlay">
                                <span class="font-monospace text-${deporte.colorFondo} small fw-bold">
                                    <i class="${deporte.iconoFondo} me-1"></i> ${deporte.textoFondo}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            deportesContainer.appendChild(col);
        });
    }

    renderDeportes();
});