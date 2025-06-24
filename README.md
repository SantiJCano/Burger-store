# Burger Store 🍔

Tienda web de hamburguesas y otros productos, con carrito de compras, proceso de checkout y página de agradecimiento. Proyecto desarrollado en HTML, CSS y JavaScript.

## Descripción

Burger Store es una tienda en línea que permite a los usuarios:
- Navegar por un catálogo de hamburguesas, pizzas, papas y pollo frito.
- Agregar productos al carrito de compras.
- Realizar un proceso de checkout con selección de método de pago y datos de envío.
- Visualizar un resumen de compra y recibir un mensaje de agradecimiento tras finalizar el pedido.

## Estructura del Proyecto

```
archivos-plantilla/
├── index.html           # Página principal (catálogo y navegación)
├── cart.html            # Carrito de compras
├── checkout.html        # Proceso de compra y pago
├── thankyou.html        # Página de agradecimiento
├── style.css            # Estilos generales
├── js/
│   ├── carrito.js           # Lógica del carrito de compras
│   ├── detalleCarrito.js    # Detalles y visualización del carrito
│   ├── checkout.js          # Lógica del proceso de checkout
│   └── thankyou.js          # Lógica de la página de agradecimiento
└── images/              # Imágenes de productos y logotipos
```

## Guía de Uso

1. **Inicio**: El usuario navega por el catálogo en `index.html` y puede agregar productos al carrito.
2. **Carrito**: Al hacer clic en el ícono del carrito, puede revisar, modificar o eliminar productos (`cart.html`).
3. **Checkout**: Al proceder a pagar, completa sus datos y elige método de pago (`checkout.html`).
4. **Agradecimiento**: Tras finalizar la compra, se muestra un resumen y mensaje de agradecimiento (`thankyou.html`).

## Lógica Principal

- **Carrito de Compras (`carrito.js`)**: 
  - Permite agregar, eliminar y actualizar productos.
  - Guarda el estado en `localStorage` para persistencia.
  - Actualiza el contador y el panel del carrito en tiempo real.

- **Checkout (`checkout.js`)**:
  - Recupera los productos y datos del pedido desde el carrito.
  - Permite seleccionar método de pago (contraentrega, PSE, transferencia) y calcula recargos.
  - Valida los datos del usuario antes de finalizar la compra.
  - Guarda el pedido completo y redirige a la página de agradecimiento.

- **Página de Agradecimiento (`thankyou.html` y `thankyou.js`)**:
  - Muestra un resumen del pedido y un mensaje personalizado al cliente.
  - Ofrece la opción de realizar otra compra.

## Tecnologías Utilizadas
- HTML5, CSS3 (con Bootstrap y fuentes de Google)
- JavaScript (manejo de DOM, eventos y almacenamiento local)

## Créditos
- Diseño base: SA coding
- Adaptación y lógica de carrito/checkout: [Tu nombre o equipo]

## Licencia
Este proyecto es de uso libre para fines educativos y personales. Puedes modificarlo y adaptarlo según tus necesidades.
