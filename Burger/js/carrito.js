// Sistema de Carrito de Compras Unificado
class ShoppingCart {
    constructor() {
        this.cart = [];
        this.loadFromLocalStorage();
        this.bindEvents();
        this.updateCartUI();
    }

    // Cargar carrito desde localStorage (usando clave 'cart' para compatibilidad)
    loadFromLocalStorage() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }

    // Guardar carrito en localStorage (usando clave 'cart')
    saveToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    // Formatear precio en pesos colombianos (sin símbolo $ y sin puntos)
    formatPrice(price) {
        const numericPrice = typeof price === 'string' ? 
            parseFloat(price.replace(/[$,]/g, '')) : 
            parseFloat(price) || 0;
        
        return Math.round(numericPrice).toString();
    }

    // Agregar producto al carrito
    addToCart(product) {
        // Verificar si el producto ya existe en el carrito
        const existingProduct = this.cart.find(item => item.id === product.id);
        
        if (existingProduct) {
            existingProduct.cantidad += 1;
        } else {
            // Formato compatible con detalleCarrito.js
            this.cart.push({
                id: product.id || Date.now(),
                nombre: product.name,
                precio: product.price,
                imagen: product.image,
                cantidad: 1
            });
        }
        
        this.saveToLocalStorage();
        this.updateCartUI();
        this.showAddedMessage(product.name);
    }

    // Remover producto del carrito
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveToLocalStorage();
        this.updateCartUI();
        this.updateCartPanel();
    }

    // Obtener total de items en el carrito
    getTotalItems() {
        return this.cart.reduce((total, item) => total + (item.cantidad || 1), 0);
    }

    // Obtener precio total del carrito
    getTotalPrice() {
        return this.cart.reduce((total, item) => {
            const price = typeof item.precio === 'string' ? 
                parseFloat(item.precio.replace(/[$,]/g, '')) : 
                parseFloat(item.precio) || 0;
            return total + (price * (item.cantidad || 1));
        }, 0);
    }

    // Actualizar UI del contador del carrito
    updateCartUI() {
        const cartCounter = document.querySelector('.contar-pro');
        if (cartCounter) {
            cartCounter.textContent = this.getTotalItems();
        }
    }

    // Mostrar/ocultar panel del carrito
    toggleCartPanel() {
        const cartPanel = document.getElementById('cart-panel');
        if (cartPanel) {
            cartPanel.classList.toggle('ocultar');
            if (!cartPanel.classList.contains('ocultar')) {
                this.updateCartPanel();
            }
        }
    }

    // Actualizar contenido del panel del carrito
    updateCartPanel() {
        const cartItems = document.getElementById('cart-items');
        if (!cartItems) return;

        cartItems.innerHTML = '';

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">
                        <p>Tu carrito está vacío</p>
                    </td>
                </tr>
            `;
            return;
        }

        this.cart.forEach((item, index) => {
            const price = typeof item.precio === 'string' ? 
                parseFloat(item.precio.replace(/[$,]/g, '')) : 
                parseFloat(item.precio) || 0;
            const quantity = item.cantidad || 1;
            const subtotal = price * quantity;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>
                    <img src="${item.imagen}" alt="${item.nombre}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 5px;">
                </td>
                <td>
                    <strong>${item.nombre}</strong>
                    ${quantity > 1 ? `<br><small>Cantidad: ${quantity}</small>` : ''}
                </td>
                <td>
                    <strong>${this.formatPrice(subtotal)}</strong>
                    ${quantity > 1 ? `<br><small>${this.formatPrice(price)} c/u</small>` : ''}
                </td>
                <td>
                    <button class="btn btn-danger btn-sm remove-item" data-id="${item.id}" title="Eliminar">
                        <i class="fa-solid fa-times"></i>
                    </button>
                </td>
            `;
            cartItems.appendChild(row);
        });

        // Agregar fila de total
        const totalRow = document.createElement('tr');
        totalRow.innerHTML = `
            <td colspan="4" class="text-right"><strong>Total:</strong></td>
            <td><strong>${this.formatPrice(this.getTotalPrice())}</strong></td>
        `;
        totalRow.style.backgroundColor = '#f8f9fa';
        totalRow.style.fontWeight = 'bold';
        cartItems.appendChild(totalRow);

        // Bind eventos de eliminar
        this.bindRemoveEvents();
    }

    // Bind eventos de eliminar productos
    bindRemoveEvents() {
        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.currentTarget.getAttribute('data-id'));
                this.removeFromCart(productId);
            });
        });
    }

    // Extraer información del producto desde el DOM
    extractProductInfo(productCard) {
        const img = productCard.querySelector('img');
        const name = productCard.querySelector('h3').textContent.trim();
        const priceText = productCard.querySelector('h5').textContent;
        
        // Extraer el precio numérico del texto (sin símbolo $ y sin puntos)
        const priceMatch = priceText.match(/([0-9,]+)/);
        const price = priceMatch ? parseFloat(priceMatch[1].replace(/[,]/g, '')) : 0;
        
        // Generar ID único basado en nombre y precio
        const id = btoa(name + price).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
        
        return {
            id: parseInt(id, 36), // Convertir a número
            name: name,
            price: price,
            image: img ? img.src : './images/default.png'
        };
    }

    // Mostrar mensaje de producto agregado
    showAddedMessage(productName) {
        // Crear mensaje temporal
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        message.innerHTML = `
            <i class="fa-solid fa-check-circle"></i>
            <strong>${productName}</strong> agregado al carrito
        `;
        
        document.body.appendChild(message);
        
        // Animar entrada
        setTimeout(() => {
            message.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            message.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }, 3000);
    }

    // Bind eventos principales
    bindEvents() {
        // Eventos para agregar al carrito
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-product')) {
                e.preventDefault();
                const productCard = e.target.closest('.card');
                if (productCard) {
                    const product = this.extractProductInfo(productCard);
                    this.addToCart(product);
                }
            }
        });

        // Evento para toggle del panel del carrito
        document.addEventListener('click', (e) => {
            if (e.target.closest('.carrito') || e.target.closest('.fa-cart-shopping')) {
                e.preventDefault();
                this.toggleCartPanel();
            }
        });

        // Cerrar panel al hacer click fuera
        document.addEventListener('click', (e) => {
            const cartPanel = document.getElementById('cart-panel');
            const cartIcon = e.target.closest('.carrito');
            
            if (cartPanel && !cartPanel.contains(e.target) && !cartIcon) {
                cartPanel.classList.add('ocultar');
            }
        });

        // Actualizar carrito al cargar la página
        document.addEventListener('DOMContentLoaded', () => {
            this.updateCartUI();
        });
    }

    // Limpiar carrito completamente
    clearCart() {
        this.cart = [];
        this.saveToLocalStorage();
        this.updateCartUI();
        this.updateCartPanel();
    }

    // Obtener información del carrito para debugging
    getCartInfo() {
        return {
            items: this.cart,
            totalItems: this.getTotalItems(),
            totalPrice: this.formatPrice(this.getTotalPrice())
        };
    }
}

// Inicializar el carrito cuando se carga la página
let cart;

document.addEventListener('DOMContentLoaded', function() {
    cart = new ShoppingCart();
    
    // Agregar estilos CSS adicionales si no existen
    if (!document.getElementById('cart-styles')) {
        const styles = document.createElement('style');
        styles.id = 'cart-styles';
        styles.textContent = `
            #cart-panel {
                position: fixed;
                top: 80px;
                right: 20px;
                width: 400px;
                max-height: 70vh;
                background: white;
                border: 2px solid #ffc800;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                overflow-y: auto;
                z-index: 1000;
                padding: 20px;
                transform: translateX(0);
                transition: transform 0.3s ease;
            }
            
            #cart-panel.ocultar {
                transform: translateX(100%);
            }
            
            #cart-panel h5 {
                color: #ffc800;
                text-align: center;
                margin-bottom: 20px;
                font-weight: bold;
                border-bottom: 2px solid #ffc800;
                padding-bottom: 10px;
            }
            
            #cart-panel table {
                font-size: 14px;
            }
            
            #cart-panel table img {
                width: 40px;
                height: 40px;
                object-fit: cover;
                border-radius: 5px;
            }
            
            #cart-panel .btn-danger {
                padding: 5px 8px;
                font-size: 12px;
            }
            
            .carrito {
                cursor: pointer;
                transition: transform 0.2s ease;
            }
            
            .carrito:hover {
                transform: scale(1.1);
            }
            
            .btn-product {
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .btn-product:hover {
                background-color: #ffdb4a !important;
                transform: scale(1.05);
            }
            
            @media (max-width: 768px) {
                #cart-panel {
                    width: 90vw;
                    right: 5vw;
                    max-height: 60vh;
                }
            }
        `;
        document.head.appendChild(styles);
    }
});

// Funciones globales para debugging (opcional)
function getCartStatus() {
    if (cart) {
        console.log('Estado del carrito:', cart.getCartInfo());
    }
}

function clearAllCart() {
    if (cart) {
        cart.clearCart();
        console.log('Carrito limpiado');
    }
}