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

    // --- Mensaje dinámico ---
    const textElement = document.getElementById("typewriter");
    const phrases = ["Desarrollador Backend.", "Software Developer."];
    let phraseIndex = 0;
    let letterIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            textElement.textContent = currentPhrase.substring(0, letterIndex - 1);
            letterIndex--;
        } else {
            textElement.textContent = currentPhrase.substring(0, letterIndex + 1);
            letterIndex++;
        }

        let typingSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && letterIndex === currentPhrase.length) {
            typingSpeed = 2000; // Pausa al terminar de escribir
            isDeleting = true;
        } else if (isDeleting && letterIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pausa antes de la siguiente palabra
        }

        setTimeout(typeEffect, typingSpeed);
    }
    
    // Iniciar el efecto de escritura
    typeEffect();


    // --- LÓGICA DEL FORMULARIO DE CONTACTO (FETCH API) ---
    const contactForm = document.getElementById("portfolioContactForm");
    const submitBtn = document.getElementById("submitBtn");
    const btnText = document.getElementById("btnText");
    const btnSpinner = document.getElementById("btnSpinner");
    const alertMessage = document.getElementById("alertMessage");

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        btnText.textContent = "Enviando...";
        btnSpinner.classList.remove("d-none");
        submitBtn.disabled = true;
        alertMessage.classList.add("d-none");

        // Declaramos la variable del intervalo fuera para poder cancelarla después
        let coldStartInterval;

        // Temporizador para la mitigación visual (Cold Start)
        const coldStartTimeout = setTimeout(() => {
            showAlert("Esto puede tomar unos momentos, por favor no cierres la página.", "alert-info");
            
            // Iniciamos la animación
            let dotCount = 1;
            btnText.textContent = "Enviando."; // Texto inicial
            
            coldStartInterval = setInterval(() => {
                dotCount++;
                if (dotCount > 3) {
                    dotCount = 1; // Reinicia a 1 punto después de llegar a 3
                }
                btnText.textContent = "Enviando" + ".".repeat(dotCount);
            }, 500); // Velocidad de la animación: cambia cada medio segundo (500ms)
        }, 3000); 

        const data = {
            contactName: document.getElementById("contactName").value,
            // Concatenamos el prefijo con el número
            contactPhone: document.getElementById("countryCode").value + document.getElementById("contactPhone").value,
            contactEmail: document.getElementById("contactEmail").value,
            contactMessage: document.getElementById("contactMessage").value
        };

        fetch("https://api-contactform.onrender.com/api/contacto", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(async response => {
            if (response.ok) {
                showAlert("¡Mensaje enviado con éxito! Te contactaré pronto.", "alert-success");
                contactForm.reset();
            } else {
                // Si hay un error, extraemos el JSON que nos manda SpringBoot
                const errorData = await response.json();
                // Evaluamos qué tipo de error está devolviendo el backend
                if (response.status === 429) {
                    // Límite de peticiones superadas (Utilizamos el alert-warning para este tipo de error)
                    showAlert(errorData.mensaje || "Has excedido el límite de envíos. Intenta más tarde.", "alert-warning");
                } else if (response.status === 400) {
                    // Errores en la validación de datos (Campos vacíos, formato de email incorrecto, etc.)
                    showAlert("Datos inválidos. Por favor verifica tu información.", "alert-danger");
                } else {
                    // Cualquier otro error general (HTTP 500)
                    showAlert("Hubo un error al enviar el mensaje. Revisa los datos.", "alert-danger");
                }
            }
        })
        .catch(error => {
            console.error("Error:", error);
            showAlert("No se pudo conectar con el servidor. Intenta más tarde.", "alert-danger");
        })
        .finally(() => {
            // Cancelamos el temporizador si el servidor respondió rápido
            clearTimeout(coldStartTimeout);
            // Cancelamos la animación
            if (coldStartInterval) clearInterval(coldStartInterval);
            
            // Restauramos el botón a su estado original
            btnText.textContent = "Enviar Mensaje";
            btnSpinner.classList.add("d-none");
            submitBtn.disabled = false;
        });
    });

    function showAlert(message, className) {
        alertMessage.textContent = message;
        alertMessage.className = `alert ${className} mt-3 text-center`;
        alertMessage.classList.remove("d-none");
    }
});