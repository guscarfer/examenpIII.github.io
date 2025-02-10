// Función para mostrar u ocultar el menú hamburguesa
function toggleMenu() {
    const menu = document.getElementById('menu');
    if (menu.style.display === 'flex') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'flex';
    }
}
// Cerrar el menú si se hace clic fuera de él
document.addEventListener('click', function(event) {
    const menu = document.getElementById('menu');
    const hamburgerMenu = document.querySelector('.hamburger-menu');

    // Si el clic no es dentro del menú ni en el botón de hamburguesa, oculta el menú
    if (!menu.contains(event.target) && event.target !== hamburgerMenu) {
        menu.style.display = 'none';
    }
});


// Función para cambiar el modo de diseño (oscuro/claro)
function toggleMode() {
    const body = document.body;
    const modeButton = document.getElementById('mode-toggle');

    // Alternar clases para cambiar entre modo oscuro y claro
    body.classList.toggle('dark-mode');

    // Cambiar el texto del botón según el estado
    if (body.classList.contains('dark-mode')) {
        modeButton.textContent = 'Modo Claro';
        localStorage.setItem('mode', 'dark'); // Guardar estado en localStorage
    } else {
        modeButton.textContent = 'Modo Oscuro';
        localStorage.setItem('mode', 'light'); // Guardar estado en localStorage
    }
}

// Función para cargar la página correspondiente (puedes implementar la lógica necesaria aquí)
function loadPage(page) {
    console.log("Cargar: " + page);
}

// Cargar el estado del modo al cargar la página
document.addEventListener('DOMContentLoaded', loadMode);

function toggleImageOptions() {
    var imageOptions = document.getElementById("imageOptions");
    if (imageOptions.style.display === "block") {
        imageOptions.style.display = "none";
    } else {
        imageOptions.style.display = "block";
    }
}

function loadPage(url) {
    window.location.href = url;
}
// Función para cargar el estado del modo desde localStorage
function loadMode() {
    const body = document.body;
    const modeButton = document.getElementById('mode-toggle');
    const savedMode = localStorage.getItem('mode');

    if (savedMode === 'dark') {
        body.classList.add('dark-mode');
        modeButton.textContent = 'Modo Claro';
    } else {
        body.classList.remove('dark-mode');
        modeButton.textContent = 'Modo Oscuro';
    }
}


let totalCarrito = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Manejar los botones "Añadir al carrito" en la sección de OFERTAS
    document.querySelectorAll('.ofertas-section .comprar-btn').forEach(button => {
        button.addEventListener('click', event => {
            console.log("Botón de oferta clickeado");
            handleAddToCart(event, true); // Marcar como producto de oferta
        });
    });

    // Manejar los botones "Añadir al carrito" en la sección de DISPONIBLES
    document.querySelectorAll('.disponibles-section .comprar-btn').forEach(button => {
        button.addEventListener('click', event => {
            console.log("Botón de disponible clickeado");
            handleAddToCart(event, false); // Marcar como producto disponible
        });
    });

    // Evento para abrir el modal de selección al hacer clic en "Seleccionar otro producto"
    document.getElementById('seleccionar-otro-btn').addEventListener('click', () => {
        mostrarModalSeleccion();
    });

    // Evento para confirmar la selección
    document.getElementById('confirmar-seleccion-btn').addEventListener('click', confirmarSeleccion);

    // Evento para realizar la compra
    document.getElementById('realizar-compra-btn').addEventListener('click', realizarCompra);

    // Evento para mostrar el formulario de compra
    document.getElementById('comprar-btn').addEventListener('click', mostrarFormularioCompra);
});

function handleAddToCart(event, esOferta) {
    const item = event.target.closest('.calzado-item');
    if (!item) {
        console.log("No se encontró el elemento calzado-item");
        return;
    }
    const imgSrc = item.querySelector('img').src;
    let precio;
    if (esOferta) {
        // Obtener precio de oferta si es producto de oferta
        precio = item.querySelector('.precio-oferta').textContent.trim();
    } else {
        // Obtener precio normal si es producto disponible
        const precioDisponible = item.querySelector('.calzado-details p:nth-child(1)');
        if (precioDisponible) {
            precio = precioDisponible.textContent.replace('Precio: ', '').trim();
        } else {
            console.log("No se encontró el precio para el producto disponible");
            return;
        }
    }
    const colores = Array.from(item.querySelectorAll('.color-circle')); // Convertir a array para mapear
    const tallesText = esOferta ?
        item.querySelector('.calzado-details p:nth-child(3)').textContent.trim() :
        item.querySelector('.calzado-details p:nth-child(2)').textContent.trim();
    const talles = tallesText.split(':')[1].trim().split('-'); // Extraer los talles específicos

    abrirModalSeleccion(imgSrc, precio, colores, talles);
}

function abrirModalSeleccion(imgSrc, precio, colores, talles) {
    const colorContainer = document.getElementById('seleccion-color');
    const talleContainer = document.getElementById('seleccion-talle');

    // Limpiar las selecciones previas
    colorContainer.innerHTML = '';
    talleContainer.innerHTML = '';
    document.getElementById('seleccion-cantidad').value = 1;

    colores.forEach(color => {
        const colorOption = document.createElement('div');
        colorOption.className = 'color-option';
        colorOption.style.backgroundColor = color.style.backgroundColor;
        colorOption.dataset.color = color.style.backgroundColor;
        colorOption.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
            colorOption.classList.add('selected');
        });
        colorContainer.appendChild(colorOption);
    });

    talles.forEach(talle => {
        const talleOption = document.createElement('input');
        talleOption.type = 'radio';
        talleOption.name = 'talle';
        talleOption.value = talle.trim();
        talleOption.required = true;
        talleContainer.appendChild(talleOption);
        talleContainer.appendChild(document.createTextNode(talle.trim()));
    });

    document.getElementById('seleccion-img').src = imgSrc;
    document.getElementById('seleccion-precio').textContent = precio;

    abrirModal('modal-seleccion');
}

function confirmarSeleccion(event) {
    event.preventDefault();

    const imgSrc = document.getElementById('seleccion-img').src;
    const precio = document.getElementById('seleccion-precio').textContent;
    const colorElement = document.querySelector('.color-option.selected');
    const talleElement = document.querySelector('input[name="talle"]:checked');
    const cantidad = document.getElementById('seleccion-cantidad').value;

    if (!colorElement || !talleElement) {
        alert('Por favor, selecciona un color y un talle.');
        return;
    }

    if (cantidad > 10) {
        alert('No puedes comprar más de 10 unidades a la vez.');
        return;
    }

    const color = colorElement.dataset.color;
    const talle = talleElement.value;

    añadirAlCarrito(imgSrc, precio, talle, color, cantidad);
    cerrarModal('modal-seleccion');
}

function añadirAlCarrito(imgSrc, precio, talle, color, cantidad) {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const totalCarritoElement = document.getElementById('total-carrito');

    // Calcular el subtotal del ítem añadido
    const subtotal = parseFloat(precio.replace('$', '')) * cantidad;

    // Crear el nuevo ítem del carrito
    const item = document.createElement('div');
    item.className = 'cart-item';
    item.innerHTML = `
        <img src="${imgSrc}" alt="Calzado">
        <div>
            <p>Precio: ${precio}</p>
            <p>Talle: ${talle}</p>
            <p>Color: <span style="background-color: ${color}; padding: 9px 10px; border-radius: 50%; display: inline-block;"></span></p>
            <p>Cantidad: ${cantidad}</p>
        </div>
        <button onclick="eliminarDelCarrito(this)">Eliminar</button>
    `;

    cartItems.appendChild(item);

    // Actualizar el total del carrito
    totalCarrito += subtotal;
    totalCarritoElement.textContent = `Total: $${totalCarrito.toFixed(2)}`;

    // Actualizar la cuenta total de ítems en el carrito
    cartCount.textContent = parseInt(cartCount.textContent) + parseInt(cantidad);

    // Mostrar notificación
    const notification = document.getElementById('notification');
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);
}

function eliminarDelCarrito(button) {
    const item = button.closest('.cart-item');
    const cantidad = parseInt(item.querySelector('p:nth-child(4)').textContent.split(': ')[1]);
    const precio = parseFloat(item.querySelector('p:nth-child(1)').textContent.split(': ')[1].replace('$', ''));
    const subtotal = precio * cantidad;

    totalCarrito -= subtotal;
    document.getElementById('total-carrito').textContent = `Total: $${totalCarrito.toFixed(2)}`;

    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = parseInt(cartCount.textContent) - cantidad;
    item.remove();
}

function mostrarFormularioCompra() {
    const cartItems = document.getElementById('cart-items');
    if (cartItems.children.length === 0) {
        alert('El carrito está vacío. Por favor, añade productos al carrito antes de realizar la compra.');
        return;
    }
    abrirModal('modal-compra');
}

function realizarCompra(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const correo = document.getElementById('correo').value;
    const tarjeta = document.getElementById('tarjeta').value;
    const ubicacion = document.getElementById('ubicacion').value;

    // Guardar el total de la compra antes de vaciar el carrito
    const totalCompra = totalCarrito;

    // Aquí puedes agregar la lógica para procesar el pago

    cerrarModal('modal-compra');
    vaciarCarrito();

    alert(`¡Gracias por tu compra, ${nombre} ${apellido}! Tu total de compra es $${totalCompra.toFixed(2)}. Estar atento/a a tu correo para más detalles.`);

    // Reiniciar los datos del formulario de compra
    document.getElementById('form-compra').reset();
}

function vaciarCarrito() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    document.getElementById('cart-count').textContent = '0';
    totalCarrito = 0;
    document.getElementById('total-carrito').textContent = `Total: $${totalCarrito.toFixed(2)}`;
}

function abrirModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}




function enviarcorreo() {
    emailjs.init("e2NFb3tDq4yVQSPZF"); // clave pública

    var param = {
        nombre: document.getElementById("nombre").value,
        email: document.getElementById("email").value,
        asunto: document.getElementById("asunto").value,
        mensaje: document.getElementById("mensaje").value
    };

    var serviceId = "service_ptb3u26"; // ID del servicio de EmailJS
    var templateId = "template_vtuxuru"; // ID de la plantilla

    document.getElementById("loading-spinner").style.display = "block"; // Mostrar spinner de carga

    emailjs.send(serviceId, templateId, param)
        .then(response => {
            document.getElementById("loading-spinner").style.display = "none"; // Ocultar spinner de carga
            document.getElementById("success-message").style.display = "block"; // Mostrar mensaje de éxito
            alert("ENVIADO CORRECTAMENTE");

            // Reiniciar el formulario después de 3 segundos
            setTimeout(() => {
                document.getElementById("email-form").reset(); // Resetear el formulario
                document.getElementById("success-message").style.display = "none"; // Ocultar mensaje de éxito
            }, 3000); // 3000 milisegundos = 3 segundos
        })
        .catch(error => {
            document.getElementById("loading-spinner").style.display = "none"; // Ocultar spinner de carga
            alert("Error al enviar el correo: " + error.message);
        });
}

function openImage(img) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    lightboxImage.src = img.src;
    lightbox.style.display = 'flex';
}

function closeImage() {
    document.getElementById('lightbox').style.display = 'none';
}


document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('.image-list img');
    const fullscreenOverlay = document.querySelector('.fullscreen-overlay');
    const fullscreenImg = fullscreenOverlay.querySelector('img');
    const closeBtn = fullscreenOverlay.querySelector('.close-btn');

    images.forEach(img => {
        img.addEventListener('click', function () {
            fullscreenImg.src = this.src;
            fullscreenOverlay.style.display = 'block';
        });
    });

    closeBtn.addEventListener('click', function () {
        fullscreenOverlay.style.display = 'none';
    });
});

let slideIndex = 0;

function showSlides(n) {
    const slides = document.getElementsByClassName("slide");
    if (n >= slides.length) {
        slideIndex = 0;
    }
    if (n < 0) {
        slideIndex = slides.length - 1;
    }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex].style.display = "block";
}

function moveSlide(n) {
    showSlides(slideIndex += n);
}

document.addEventListener("DOMContentLoaded", () => {
    showSlides(slideIndex);
});
