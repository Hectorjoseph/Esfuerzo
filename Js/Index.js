document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const totalAmount = document.querySelector('.total-amount');

    // Estado del carrito
    let cart = [];

    // Verificación de edad
    function checkAge() {
        const isAdult = localStorage.getItem('isAdult');
        
        if (!isAdult) {
            const confirmed = confirm("Se necesita un grado de madurez para seguir con la página. ¿Eres mayor de 18 años?");
            
            if (!confirmed) {
                window.location.href = "https://www.google.com";
                return false;
            }
            
            localStorage.setItem('isAdult', 'true');
        }
        
        return true;
    }

    // Funcionalidad del carrito
    function toggleCart() {
        cartSidebar.classList.toggle('active');
    }

    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalAmount.textContent = `$${total.toLocaleString()}`;
    }

    function addToCart(product, price, image) {
        const existingItem = cart.find(item => item.product === product);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                product,
                price,
                quantity: 1,
                image
            });
        }

        updateCart();
        showToast(`${product} añadido al carrito`);
    }

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.product}">
                <div class="item-details">
                    <h4>${item.product}</h4>
                    <p>$${item.price.toLocaleString()}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-product="${item.product}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-product="${item.product}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-product="${item.product}">&times;</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        updateCartCount();
        updateCartTotal();
    }

    // Sistema de notificaciones
    function showToast(message) {
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Carrusel de productos destacados
    function initProductCarousel() {
        const carousel = document.querySelector('.featured-products .product-grid');
        let isDown = false;
        let startX;
        let scrollLeft;

        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            carousel.classList.add('active');
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });

        carousel.addEventListener('mouseleave', () => {
            isDown = false;
            carousel.classList.remove('active');
        });

        carousel.addEventListener('mouseup', () => {
            isDown = false;
            carousel.classList.remove('active');
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        });
    }

    // Sistema de búsqueda
    function initSearch() {
        const searchInput = document.querySelector('.search-bar input');
        const products = document.querySelectorAll('.product-card');

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();

            products.forEach(product => {
                const title = product.querySelector('h3').textContent.toLowerCase();
                const isVisible = title.includes(searchTerm);
                product.style.display = isVisible ? 'block' : 'none';
            });
        });
    }

    // Geolocalización
    function initGeolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    // Aquí puedes usar la API de Google Maps o similar
                    console.log(`Ubicación: ${latitude}, ${longitude}`);
                },
                error => {
                    console.error('Error al obtener la ubicación:', error);
                }
            );
        }
    }

    // Event Listeners
    cartIcon.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const product = e.target.dataset.product;
            const price = parseInt(e.target.dataset.price);
            const image = e.target.closest('.product-card').querySelector('img').src;
            addToCart(product, price, image);
        });
    });

    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('quantity-btn')) {
            const product = e.target.dataset.product;
            const item = cart.find(item => item.product === product);
            
            if (e.target.classList.contains('plus')) {
                item.quantity++;
            } else if (e.target.classList.contains('minus') && item.quantity > 1) {
                item.quantity--;
            }
            
            updateCart();
        }

        if (e.target.classList.contains('remove-item')) {
            const product = e.target.dataset.product;
            cart = cart.filter(item => item.product !== product);
            updateCart();
            showToast(`${product} eliminado del carrito`);
        }
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('El carrito está vacío');
            return;
        }
        
        // Aquí iría la lógica de checkout
        alert('¡Gracias por tu compra!');
        cart = [];
        updateCart();
        toggleCart();
    });

    // Lazy loading para imágenes
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Inicialización
    if (checkAge()) {
        initProductCarousel();
        initSearch();
        initGeolocation();
        lazyLoadImages();
    }
});