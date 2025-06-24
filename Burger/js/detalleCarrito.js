document.addEventListener("DOMContentLoaded", () => {
  const cartTableBody = document.querySelector(".cart-table tbody");
  const subTotalEl = document.querySelector(".res-sub-total");
  const valorDomiEl = document.querySelector(".valor-domi");
  const promoEl = document.querySelector(".promo");
  const totalEl = document.querySelector(".total");
  const destinoSelect = document.querySelector(".destino");

  console.log("Cargando carrito...");

  // Obtener datos del carrito desde localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  console.log("Datos del carrito:", cart);

  // Verificar si el carrito está vacío
  if (cart.length === 0) {
    cartTableBody.innerHTML =
      "<tr><td colspan='5' class='text-center py-4'><h5>El carrito está vacío.</h5><p>¡Agrega algunos productos deliciosos!</p></td></tr>";
    updateTotals(0);
    return;
  }

  let subtotal = 0;
  cartTableBody.innerHTML = ""; // Limpiar tabla

  // Renderizar productos del carrito
  cart.forEach((item, index) => {
    console.log(`Producto ${index + 1}:`, item);

    // Extraer precio limpio - maneja diferentes formatos
    let price = 0;
    if (typeof item.precio === "string") {
      // Remover símbolo $ y convertir a número
      price = parseFloat(item.precio.replace(/[$,]/g, "")) || 0;
    } else if (typeof item.precio === "number") {
      price = item.precio;
    } else {
      price = 0;
    }

    const quantity = parseInt(item.cantidad) || 1;
    const totalItem = price * quantity;
    subtotal += totalItem;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="text-center">
        <button class="btn btn-danger btn-sm delete-item" data-index="${index}" title="Eliminar producto">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
      <td class="product-block">
        <div class="d-flex flex-column align-items-center">
          <span style="font-weight: 500; margin-bottom: 10px;">${
            item.nombre
          }</span>
          <img src="${item.imagen || "./images/default.png"}" alt="${
      item.nombre
    }" 
               width="80" height="80" style="border-radius: 8px; object-fit: cover;" />
        </div>
      </td>
      <td>
        <div class="d-flex flex-column align-items-center">
          <span class="mb-2">Precio:</span>
          <span style="font-weight: 500;">${formatCurrency(price)}</span>
        </div>
      </td>
      <td>
        <div class="d-flex flex-column align-items-center">
          <span class="mb-2">Cantidad:</span>
          <div class="quantity-controls d-flex align-items-center justify-content-center">
            <button class="btn btn-sm btn-outline-secondary decrease-qty me-2" data-index="${index}" style="width: 30px;">-</button>
            <span class="fw-bold mx-2" style="min-width: 30px; text-align: center;">${quantity}</span>
            <button class="btn btn-sm btn-outline-secondary increase-qty ms-2" data-index="${index}" style="width: 30px;">+</button>
          </div>
        </div>
      </td>
      <td>
        <div class="d-flex flex-column align-items-center">
          <span class="mb-2">Subtotal:</span>
          <span style="font-weight: 500; color: #ffc800;">${formatCurrency(
            totalItem
          )}</span>
        </div>
      </td>
    `;
    cartTableBody.appendChild(row);
  });

  // Función para actualizar totales
  function updateTotals(currentSubtotal) {
    const selectedDestino = destinoSelect ? destinoSelect.value : "Medellin";
    let domicilio = 0;

    // Calcular costo de domicilio según destino
    switch (selectedDestino) {
      case "Medellin":
        domicilio = 0;
        break;
      case "Bello":
        domicilio = 10000;
        break;
      case "Itagui":
      case "Envigado":
      case "Sabaneta":
        domicilio = 15000;
        break;
      case "La Estrella":
      case "Caldas":
      case "Copacabana":
        domicilio = 20000;
        break;
      default:
        domicilio = 0;
    }

    const promo = 5000; // Descuento fijo

    // Actualizar valores en la interfaz con formato colombiano
    if (subTotalEl) subTotalEl.textContent = formatCurrency(currentSubtotal);
    if (valorDomiEl) valorDomiEl.textContent = formatCurrency(domicilio, true);
    if (promoEl) promoEl.textContent = formatCurrency(promo, true);

    const total = currentSubtotal + domicilio - promo;
    if (totalEl) totalEl.textContent = formatCurrency(total);
  }

  // Función para formatear moneda en formato colombiano
  function formatCurrency(value, isInteger = false) {
    if (isInteger) {
      // Para valores enteros como domicilio y promociones
      return `$${Math.round(value).toLocaleString("es-CO")}`;
    } else {
      // Para valores con decimales como subtotal y total
      return `$${Number(value).toLocaleString("es-CO", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;
    }
  }

  // Actualizar totales iniciales
  updateTotals(subtotal);

  // Event listener para cambio de destino
  if (destinoSelect) {
    destinoSelect.addEventListener("change", () => {
      updateTotals(subtotal);
    });
  }

  // Event listeners para botones de cantidad y eliminar
  cartTableBody.addEventListener("click", (e) => {
    const index = parseInt(e.target.closest("button")?.dataset?.index);

    if (isNaN(index)) return;

    let currentCart = JSON.parse(localStorage.getItem("cart")) || [];

    if (e.target.closest(".increase-qty")) {
      // Aumentar cantidad
      currentCart[index].cantidad = (currentCart[index].cantidad || 1) + 1;
      localStorage.setItem("cart", JSON.stringify(currentCart));
      location.reload();
    }

    if (e.target.closest(".decrease-qty")) {
      // Disminuir cantidad
      if (currentCart[index].cantidad > 1) {
        currentCart[index].cantidad -= 1;
        localStorage.setItem("cart", JSON.stringify(currentCart));
        location.reload();
      } else {
        // Si la cantidad es 1, eliminar el producto
        if (confirm("¿Eliminar este producto del carrito?")) {
          currentCart.splice(index, 1);
          localStorage.setItem("cart", JSON.stringify(currentCart));
          location.reload();
        }
      }
    }

    if (e.target.closest(".delete-item")) {
      // Eliminar producto directamente
      if (confirm(`¿Eliminar "${currentCart[index].nombre}" del carrito?`)) {
        currentCart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(currentCart));
        location.reload();
      }
    }
  });

  // Event listener para el botón "Ir a pagar"
  const btnPagar = document.querySelector(".btn-resumen");
  if (btnPagar) {
    btnPagar.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Tu carrito está vacío");
        return;
      }

      const finalSubtotal = cart.reduce((sum, item) => {
        const price =
          typeof item.precio === "string"
            ? parseFloat(item.precio.replace(/[$,]/g, ""))
            : parseFloat(item.precio) || 0;
        return sum + price * (item.cantidad || 1);
      }, 0);

      // Obtener el valor total desde el elemento del DOM para asegurar consistencia
      const totalValue = parseFloat(totalEl.textContent.replace(/[$.,]/g, ""));

      const orderData = {
        productos: cart,
        subtotal: finalSubtotal,
        destino: destinoSelect ? destinoSelect.value : "Medellin",
        valorDomicilio: destinoSelect
          ? getDeliveryCost(destinoSelect.value)
          : 0,
        descuento: 5000,
        total: totalValue || finalSubtotal,
      };

      // Guardar los datos del pedido en localStorage para usarlos en checkout
      localStorage.setItem("orderData", JSON.stringify(orderData));

      // Redireccionar a la página de checkout
      window.location.href = "checkout.html";
    });
  }

  // Función auxiliar para obtener costo de envío
  function getDeliveryCost(destino) {
    switch (destino) {
      case "Medellin":
        return 0;
      case "Bello":
        return 10000;
      case "Itagui":
      case "Envigado":
      case "Sabaneta":
        return 15000;
      case "La Estrella":
      case "Caldas":
      case "Copacabana":
        return 20000;
      default:
        return 0;
    }
  }
});

// Función global para limpiar el carrito
function clearCart() {
  if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
    localStorage.removeItem("cart");
    location.reload();
  }
}

// Función para debug - puedes llamarla desde la consola
function debugCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  console.log("Estado actual del carrito:", cart);
  console.table(cart);
  return cart;
}

// Función para agregar un producto de prueba (útil para testing)
function addTestProduct() {
  const testProduct = {
    id: Date.now(),
    nombre: "Producto de Prueba",
    precio: 15.99,
    imagen: "./images/b1.png",
    cantidad: 1,
  };

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(testProduct);
  localStorage.setItem("cart", JSON.stringify(cart));
  location.reload();
}
