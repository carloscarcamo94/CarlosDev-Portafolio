document.addEventListener("DOMContentLoaded", function () {
    
    // --- LÓGICA DE LA MÁQUINA DE ESCRIBIR (HERO SECTION) ---
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

        const data = {
            contactName: document.getElementById("contactName").value,
            contactPhone: document.getElementById("contactPhone").value,
            contactEmail: document.getElementById("contactEmail").value,
            contactMessage: document.getElementById("contactMessage").value
        };

        fetch("http://localhost:8080/api/contacto", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                showAlert("¡Mensaje enviado con éxito! Te contactaré pronto.", "alert-success");
                contactForm.reset();
            } else {
                showAlert("Hubo un error al enviar el mensaje. Revisa los datos.", "alert-danger");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            showAlert("No se pudo conectar con el servidor. Intenta más tarde.", "alert-danger");
        })
        .finally(() => {
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