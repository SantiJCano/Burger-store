document.addEventListener("DOMContentLoaded", () => {
  console.log("Cargando página de agradecimiento...");
  
  // Obtener datos del pedido completo
  const pedidoCompleto = JSON.parse(localStorage.getItem("pedidoCompleto"));
  
  if (!pedidoCompleto) {
    alert("No hay información de pedido disponible");
    window.location.href = "index.html";
    return;
  }
  
  console.log("Datos del pedido completo:", pedidoCompleto);
  
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
  
  // Elementos del DOM
  const clienteNombre = document.querySelector(".resumen-compra h5 span");
  const ordenId = document.querySelector(".resumen-compra p");
  const cardTitle = document.querySelector(".card-header");
  const cardContent = document.querySelector(".row");
  const cardFooter = document.querySelector(".card-footer");
  const btnGracias = document.querySelector(".btn-gracias");
  
  // Mostrar información del cliente y orden
  if (clienteNombre) {
    clienteNombre.textContent = `${pedidoCompleto.cliente.nombres} `;
  }
  
  if (ordenId) {
    ordenId.textContent = `Orden #${pedidoCompleto.ordenId}`;
  }
  
  if (cardTitle) {
    cardTitle.textContent = `Resumen de tu compra - ${new Date().toLocaleDateString('es-CO')}`;
  }
  
  // Construir el contenido del resumen
  if (cardContent) {
    // Columna izquierda: Datos del cliente
    const colIzquierda = cardContent.querySelector(".col-sm-6:first-child .card-body");
    if (colIzquierda) {
      colIzquierda.innerHTML = `
        <h5 class="card-title">Datos de Entrega</h5>
        <p class="card-text">
          <strong>Cliente:</strong> ${pedidoCompleto.cliente.nombres} ${pedidoCompleto.cliente.apellidos}<br>
          <strong>Email:</strong> ${pedidoCompleto.cliente.email}<br>
          <strong>Teléfono:</strong> ${pedidoCompleto.cliente.celular}<br>
          <strong>Dirección:</strong> ${pedidoCompleto.cliente.direccion}<br>
          ${pedidoCompleto.cliente.direccion2 ? `<strong>Información adicional:</strong> ${pedidoCompleto.cliente.direccion2}<br>` : ''}
          <strong>Ciudad:</strong> ${pedidoCompleto.destino}<br>
          ${pedidoCompleto.cliente.notas ? `<strong>Notas:</strong> ${pedidoCompleto.cliente.notas}` : ''}
        </p>
      `;
    }
    
    // Columna derecha: Detalles del pedido
    const colDerecha = cardContent.querySelector(".col-sm-6:last-child .card-body");
    if (colDerecha) {
      // Construir lista de productos
      let productosHTML = "<ul class='list-unstyled'>";
      pedidoCompleto.productos.forEach(item => {
        const price = typeof item.precio === 'string' ? 
          parseFloat(item.precio.replace(/[$,]/g, '')) : 
          parseFloat(item.precio) || 0;
        const quantity = parseInt(item.cantidad) || 1;
        const totalItem = price * quantity;
        
        productosHTML += `
          <li class="mb-2">
            <div class="d-flex justify-content-between align-items-center">
              <span>${item.nombre} x ${quantity}</span>
              <span>${formatCurrency(totalItem)}</span>
            </div>
          </li>
        `;
      });
      productosHTML += "</ul>";
      
      colDerecha.innerHTML = `
        <h5 class="card-title">Detalles del Pedido</h5>
        <div class="card-text">
          ${productosHTML}
          <hr>
          <div class="d-flex justify-content-between">
            <strong>Subtotal:</strong>
            <span>${formatCurrency(pedidoCompleto.subtotal)}</span>
          </div>
          <div class="d-flex justify-content-between">
            <strong>Domicilio (${pedidoCompleto.destino}):</strong>
            <span>${formatCurrency(pedidoCompleto.valorDomicilio, true)}</span>
          </div>
          <div class="d-flex justify-content-between">
            <strong>Descuento:</strong>
            <span>${formatCurrency(pedidoCompleto.descuento, true)}</span>
          </div>
          <div class="d-flex justify-content-between">
            <strong>Método de pago:</strong>
            <span>${pedidoCompleto.metodoPago}</span>
          </div>
          <div class="d-flex justify-content-between">
            <strong>Recargo (${pedidoCompleto.porcentajeRecargo}):</strong>
            <span>${formatCurrency(pedidoCompleto.recargo)}</span>
          </div>
        </div>
      `;
    }
  }
  
  // Mostrar el total en el footer
  if (cardFooter) {
    cardFooter.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="mb-0">TOTAL:</h5>
        <h5 class="mb-0 color-primary">${formatCurrency(pedidoCompleto.totalConRecargo)}</h5>
      </div>
    `;
  }
  
  // Event listener para el botón de realizar otra compra
  if (btnGracias) {
    btnGracias.addEventListener("click", () => {
      // Limpiar datos del pedido pero mantener el carrito
      localStorage.removeItem("orderData");
      localStorage.removeItem("pedidoCompleto");
      
      // Redireccionar a la página principal
      window.location.href = "index.html";
    });
  }
}); 