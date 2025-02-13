document.addEventListener("DOMContentLoaded", function() {
    // Preguntar si el usuario es mayor de 18 años
    const isAdult = confirm("Se necesita un grado de madurez para seguir con la pagina");

    if (!isAdult) {
        alert("Lo sentimos, debes ser mayor de 18 años para acceder a este sitio.");
        window.location.href = "https://www.google.com";
        return;
    }

    // Obtener la ubicación del usuario si es mayor de edad
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("La geolocalización no es compatible con este navegador.");
    }

    // Función para manejar la posición del usuario
    function showPosition(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Llamada a la API de Google Maps para convertir coordenadas en dirección
        const apiKey = 'TU_API_KEY_AQUÍ'; // Reemplaza con tu clave API
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'OK') {
                    const address = data.results[0].formatted_address;
                    alert("Tu dirección es: " + address);
                    // Aquí podrías almacenar la dirección o mostrarla en el formulario de entrega
                } else {
                    alert("No se pudo obtener la dirección. Por favor, intenta nuevamente.");
                }
            })
            .catch(error => {
                console.error("Error al obtener la dirección:", error);
            });
    }

    // Función para manejar errores en la geolocalización
    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("Por favor, permite el acceso a tu ubicación.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("La información de la ubicación no está disponible.");
                break;
            case error.TIMEOUT:
                alert("La solicitud de ubicación ha expirado.");
                break;
            case error.UNKNOWN_ERROR:
                alert("Ha ocurrido un error desconocido.");
                break;
        }
    }

    // Carrito de compras
    const cart = [];
    const cartIcon = document.getElementById("cart-icon");
    const cartContainer = document.getElementById("cart");
    const cartItemsContainer = document.getElementById("cart-items");
    const checkoutButton = document.getElementById("checkout-button");

    // Función para actualizar el carrito
    function updateCart() {
        cartItemsContainer.innerHTML = ""; // Limpia el contenedor del carrito

        cart.forEach(item => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");

            const img = document.createElement("img");
            img.src = item.image;
            img.alt = item.product;

            const details = document.createElement("div");
            details.classList.add("item-details");
            details.innerHTML = `<strong>${item.product}</strong><br>Valor: $${item.price}`;

            const quantity = document.createElement("span");
            quantity.classList.add("item-quantity");
            quantity.textContent = `Cantidad: ${item.quantity}`;

            cartItem.appendChild(img);
            cartItem.appendChild(details);
            cartItem.appendChild(quantity);
            cartItemsContainer.appendChild(cartItem);
        });

        // Muestra el carrito
        cartContainer.style.display = cart.length > 0 ? "block" : "none";
    }

    // Evento para añadir productos al carrito
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function() {
            const product = this.dataset.product;
            const price = parseInt(this.dataset.price, 10);
            const image = this.closest(".carousel-slide").querySelector("img").src;

            const existingItem = cart.find(item => item.product === product);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ product, price, quantity: 1, image });
            }

            updateCart();
        });
    });

    // Evento para mostrar/ocultar el carrito al hacer clic en el ícono del carrito
    cartIcon.addEventListener("click", function() {
        const isVisible = cartContainer.style.display === "block";
        cartContainer.style.display = isVisible ? "none" : "block";
        
        // Ajustar el contenido principal para adaptarse al tamaño del carrito
        const mainContent = document.querySelector(".main-content");
        mainContent.style.marginRight = isVisible ? "0" : "250px"; // Ajusta este valor según el tamaño del carrito
    });

    // Funcionalidad del carrusel
    const carouselContainer = document.querySelector(".carousel-container");
    const carouselSlides = document.querySelectorAll(".carousel-slide");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");

    let currentIndex = 0;

    function showSlide(index) {
        carouselSlides.forEach(slide => {
            slide.classList.remove("active");
        });

        carouselSlides[index].classList.add("active");
    }

    showSlide(currentIndex);

    prevButton.addEventListener("click", function() {
        currentIndex = (currentIndex === 0) ? carouselSlides.length - 1 : currentIndex - 1;
        showSlide(currentIndex);
    });

    nextButton.addEventListener("click", function() {
        currentIndex = (currentIndex === carouselSlides.length - 1) ? 0 : currentIndex + 1;
        showSlide(currentIndex);
    });
});
