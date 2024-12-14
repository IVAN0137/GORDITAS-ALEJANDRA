document.addEventListener("DOMContentLoaded", function() {
    // Variables para manejar el pedido y el total
    const orderList = document.getElementById("order-list");
    const totalCount = document.getElementById("total-count");
    const totalPrice = document.getElementById("total-price"); // Para mostrar el total en dinero
    const totalGeneral = document.getElementById("total-general"); // Total general
    const sendOrderButton = document.getElementById("send-order");

    // Almacenar los guisos seleccionados y sus cantidades
    let order = {};

    // Función para actualizar el resumen del pedido
    function updateOrderSummary() {
        // Limpiar el listado de pedidos
        orderList.innerHTML = "";

        let total = 0; // Inicializamos el total en 0
        let totalGorditas = 0; // Para el total en dinero

        // Mostrar los elementos seleccionados
        for (let guiso in order) {
            const li = document.createElement("li");
            li.textContent = `${guiso} - Cantidad: ${order[guiso]}`;
            orderList.appendChild(li);

            // Actualizar el total de gorditas
            total += order[guiso]; // Contar el total de gorditas
            totalGorditas += order[guiso] * 20; // El total en dinero, 20 por cada gordita
        }

        // Actualizar el total de gorditas
        totalCount.textContent = total;

        // Actualizar el total en dinero
        totalPrice.textContent = `$${totalGorditas}`;

        // Mostrar el total general
        totalGeneral.textContent = `${total} gorditas - Total: $${totalGorditas}`;
    }

    // Función para agregar un guiso
    function addItemToOrder(guiso) {
        if (order[guiso]) {
            order[guiso] += 1; // Si ya está en el pedido, aumentar la cantidad
        } else {
            order[guiso] = 1; // Si no está, agregarlo con cantidad 1
        }
        updateOrderSummary();
    }

    // Función para quitar un guiso
    function removeItemFromOrder(guiso) {
        if (order[guiso]) {
            order[guiso] -= 1; // Disminuir la cantidad
            if (order[guiso] === 0) {
                delete order[guiso]; // Si la cantidad llega a 0, eliminarlo
            }
            updateOrderSummary();
        }
    }

    // Función para enviar el pedido a WhatsApp
    function sendOrderToWhatsApp() {
        const name = document.getElementById("name").value;
        const deliveryType = document.getElementById("delivery-type").value;

        if (name && deliveryType && Object.keys(order).length > 0) {
            const totalQuantity = Object.values(order).reduce((a, b) => a + b, 0); // Total en cantidad de gorditas
            const totalMoney = totalQuantity * 20; // Total en dinero

            // Crear el mensaje para WhatsApp con un tono más casual y directo
            let orderMessage = `
                ¡Hola! 🙌🏻
                Soy ${name} y me gustaría pedir unas gorditas para ${deliveryType}.
                
                Aquí te dejo lo que quiero:
            `;

            // Agregar los guisos y su cantidad al mensaje
            for (let guiso in order) {
                orderMessage += `\n- ${guiso}: ${order[guiso]} gordita(s)`;
            }

            // Agregar los totales al mensaje
            orderMessage += `\n\nResumen:
- Total de gorditas: ${totalQuantity} gordita(s)
- Total a pagar: $${totalMoney}

¡Gracias! 🙌🏼`;

            // Codificar el mensaje para URL
            const whatsappURL = `https://wa.me/524411156678?text=${encodeURIComponent(orderMessage)}`;

            // Abrir WhatsApp con el mensaje
            window.open(whatsappURL, "_blank");

            // Limpiar el pedido
            order = {};
            updateOrderSummary();
            document.getElementById("name").value = '';
            document.getElementById("delivery-type").value = '';
        } else {
            alert("Por favor, completa todos los campos del pedido.");
        }
    }

    // Eventos para los botones de agregar y quitar
    document.querySelectorAll(".add").forEach(button => {
        button.addEventListener("click", function() {
            const guiso = this.getAttribute("data-guiso");
            addItemToOrder(guiso);
        });
    });

    document.querySelectorAll(".remove").forEach(button => {
        button.addEventListener("click", function() {
            const guiso = this.getAttribute("data-guiso");
            removeItemFromOrder(guiso);
        });
    });

    // Evento para el botón de enviar el pedido a WhatsApp
    sendOrderButton.addEventListener("click", sendOrderToWhatsApp);
});
