document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const productosContainer = document.querySelector(".productos");
  const subTotalEl = document.querySelector(".res-sub-total");
  const valorDomiEl = document.querySelector(".valor-domi");
  const destinoEl = document.querySelector(".destino");
  const promoEl = document.querySelector(".promo");
  const totalEl = document.querySelector(".total");
  const btnCheckout = document.querySelector(".btn-checkout");
  
  // Métodos de pago
  const codRadio = document.getElementById("cod");
  const pseRadio = document.getElementById("cp");
  const transferRadio = document.getElementById("bt");
  
  console.log("Cargando página de checkout...");
  
  // Obtener datos del pedido desde localStorage
  const orderData = JSON.parse(localStorage.getItem("orderData"));
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  if (!orderData || !cart || cart.length === 0) {
    alert("No hay información de pedido disponible");
    window.location.href = "cart.html";
    return;
  }
  
  console.log("Datos del pedido:", orderData);
  
  // Función para formatear moneda en formato colombiano
  function formatCurrency(value, isInteger = false) {
    if (isInteger) {
      // Para valores enteros como domicilio y promociones
      return `$${Math.round(value).toLocaleString('es-CO')}`;
    } else {
      // Para valores con decimales como subtotal y total
      return `$${Number(value).toLocaleString('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })}`;
    }
  }
  
  // Mostrar productos en el resumen
  let productosHTML = "";
  cart.forEach(item => {
    // Extraer precio limpio
    let price = 0;
    if (typeof item.precio === 'string') {
      price = parseFloat(item.precio.replace(/[$,]/g, '')) || 0;
    } else if (typeof item.precio === 'number') {
      price = item.precio;
    }
    
    const quantity = parseInt(item.cantidad) || 1;
    const totalItem = price * quantity;
    
    productosHTML += `
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <img src="${item.imagen || './images/default.png'}" alt="${item.nombre}" 
               width="40" height="40" style="border-radius: 5px; margin-right: 10px; object-fit: cover;">
          <span>${item.nombre} x ${quantity}</span>
        </div>
        <p class="mb-0">${formatCurrency(totalItem)}</p>
      </div>
    `;
  });
  
  if (productosContainer) {
    productosContainer.innerHTML = productosHTML;
  }
  
  // Mostrar información del pedido
  if (subTotalEl) subTotalEl.textContent = formatCurrency(orderData.subtotal);
  if (valorDomiEl) valorDomiEl.textContent = formatCurrency(orderData.valorDomicilio, true);
  if (destinoEl) destinoEl.textContent = orderData.destino;
  if (promoEl) promoEl.textContent = formatCurrency(orderData.descuento, true);
  
  // Función para calcular el total según el método de pago
  function calcularTotal() {
    let recargo = 0;
    let baseTotal = orderData.total;
    
    if (codRadio && codRadio.checked) {
      // Contraentrega: recargo del 5%
      recargo = baseTotal * 0.05;
      console.log("Método de pago: Contraentrega (5%)");
    } else if (pseRadio && pseRadio.checked) {
      // PSE: recargo del 3%
      recargo = baseTotal * 0.03;
      console.log("Método de pago: PSE (3%)");
    } else {
      // Transferencia: sin recargo
      console.log("Método de pago: Transferencia (0%)");
    }
    
    const totalConRecargo = baseTotal + recargo;
    
    if (totalEl) totalEl.textContent = formatCurrency(totalConRecargo);
    
    // Actualizar orderData con el nuevo total y método de pago
    orderData.totalConRecargo = totalConRecargo;
    orderData.recargo = recargo;
    orderData.metodoPago = codRadio && codRadio.checked ? "Contraentrega" : 
                         (pseRadio && pseRadio.checked ? "PSE" : "Transferencia");
    orderData.porcentajeRecargo = codRadio && codRadio.checked ? "5%" : 
                              (pseRadio && pseRadio.checked ? "3%" : "0%");
    
    localStorage.setItem("orderData", JSON.stringify(orderData));
  }
  
  // Event listeners para los radios de métodos de pago
  if (codRadio) codRadio.addEventListener("change", calcularTotal);
  if (pseRadio) pseRadio.addEventListener("change", calcularTotal);
  if (transferRadio) transferRadio.addEventListener("change", calcularTotal);
  
  // Calcular total inicial
  calcularTotal();
  
  // Capturar datos del formulario
  const nombresInput = document.getElementById("nombres-input");
  const apellidosInput = document.getElementById("apellidos-input");
  const emailInput = document.getElementById("email-input");
  const celularInput = document.getElementById("celular-input");
  const direccionInput = document.getElementById("direccion-input");
  const direccion2Input = document.getElementById("direccion-2-input");
  const notasInput = document.getElementById("additiona-note");
  
  // Event listener para el botón de finalizar compra
  if (btnCheckout) {
    btnCheckout.addEventListener("click", () => {
      // Validar campos obligatorios
      if (!nombresInput.value || !apellidosInput.value || !emailInput.value || 
          !celularInput.value || !direccionInput.value) {
        alert("Por favor complete todos los campos obligatorios");
        return;
      }
      
      // Guardar datos del cliente
      const clienteData = {
        nombres: nombresInput.value,
        apellidos: apellidosInput.value,
        email: emailInput.value,
        celular: celularInput.value,
        direccion: direccionInput.value,
        direccion2: direccion2Input.value || "",
        notas: notasInput.value || "",
        fechaPedido: new Date().toLocaleString()
      };
      
      // Combinar datos del cliente con datos del pedido
      const pedidoCompleto = {
        ...orderData,
        cliente: clienteData,
        ordenId: "ORD-" + Date.now().toString().slice(-6)
      };
      
      console.log("Pedido completo:", pedidoCompleto);
      localStorage.setItem("pedidoCompleto", JSON.stringify(pedidoCompleto));
      
      // Redireccionar a la página de agradecimiento
      window.location.href = "thankyou.html";
    });
  }
}); 