const nameInput = document.getElementById('name');
const deliveryTypeSelect = document.getElementById('delivery-type');
const orderList = document.getElementById('order-list');
const totalCount = document.getElementById('total-count');
const sendOrderButton = document.getElementById('send-order');

const pricePerGordita = 20;
const order = {};

// Función para agregar un producto
function addProduct(guiso) {
  if (!order[guiso]) {
    order[guiso] = 0;
  }
  order[guiso]++;
  updateOrderList();
  animateProductChange(guiso, 'add');
}

// Función para quitar un producto
function removeProduct(guiso) {
  if (order[guiso] && order[guiso] > 0) {
    order[guiso]--;
    if (order[guiso] === 0) delete order[guiso];
    updateOrderList();
    animateProductChange(guiso, 'remove');
  }
}

// Función para actualizar la lista de pedidos
function updateOrderList() {
  orderList.innerHTML = '';
  let total = 0;
  for (const guiso in order) {
    const cantidad = order[guiso];
    const subtotal = cantidad * pricePerGordita;
    total += subtotal;

    const li = document.createElement('li');
    li.classList.add('order-item');
    li.textContent = `${guiso} x${cantidad} = $${subtotal}`;
    orderList.appendChild(li);
  }
  totalCount.textContent = `$${total}`;
}

// Función para animar el cambio de productos
function animateProductChange(guiso, action) {
  const productButton = document.querySelector(`[data-guiso="${guiso}"]`);
  if (productButton) {
    productButton.classList.add(action === 'add' ? 'animate-add' : 'animate-remove');
    setTimeout(() => productButton.classList.remove('animate-add', 'animate-remove'), 500);
  }
}

// Función para enviar el pedido a WhatsApp
function sendOrder() {
    const name = nameInput.value.trim();
    const deliveryType = deliveryTypeSelect.value;
  
    if (!name) {
      alert('Por favor, ingresa tu nombre.');
      return;
    }
  
    if (!deliveryType) {
      alert('Por favor, selecciona el tipo de entrega.');
      return;
    }
  
    if (Object.keys(order).length === 0) {
      alert('Por favor, selecciona al menos un producto.');
      return;
    }
  
    // Generar el texto del pedido
    let orderDetails = '';
    let total = 0;
  
    for (const guiso in order) {
      const cantidad = order[guiso];
      const subtotal = cantidad * pricePerGordita;
      total += subtotal;
      orderDetails += `- ${cantidad}: ${guiso} = $${subtotal}\n`;
    }
  
    // Formatear el mensaje
    const message = `
  Hola, soy ${name}.
  Quisiera realizar el siguiente pedido:
  ${orderDetails}
  Total: $${total}
  
  Tipo de entrega: ${deliveryType === 'entrega' ? 'Entrega a domicilio' : 'Pasaré a recoger'}.
  ¡Gracias!
  `;
  
    // Enviar el mensaje a WhatsApp
    const whatsappURL = `https://wa.me/524411156678?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
}

// Event listeners para los botones de agregar y quitar
document.querySelectorAll('.add').forEach(button => {
  button.addEventListener('click', () => addProduct(button.dataset.guiso));
});

// Enviar el pedido cuando se haga clic en el botón
sendOrderButton.addEventListener('click', sendOrder);
