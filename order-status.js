async function loadOrders() {
  try {
    const response = await fetch("http://localhost:5000/orders");
    const orders = await response.json();

    const container = document.getElementById("ordersContainer");
    container.innerHTML = "";

    if (!orders || orders.length === 0) {
      container.innerHTML = "<p>No active orders.</p>";
      return;
    }

   orders.forEach(order => {
  const card = document.createElement("div");
  card.className = "order-card";

  // Generate food items HTML
  let itemsHTML = "";

  if (order.items && order.items.length > 0) {
    itemsHTML = `
      <div class="items">
        <h4>Ordered Items:</h4>
        <ul>
          ${order.items.map(item => 
            `<li>${item.name} × ${item.quantity}</li>`
          ).join("")}
        </ul>
      </div>
    `;
  }

  card.innerHTML = `
    

    <h2>Table ${order.tableNumber}</h2>
    <p><strong>Customer:</strong> ${order.customerName}</p>

    ${itemsHTML}

    <div class="summary">
      <p><strong>Total:</strong> ₹${order.total}</p>
    </div>

    ${
      order.paymentStatus === "Pending"
        ? `<button onclick="goToPayment(${order.id}, ${order.total}, '${order.tableNumber}', '${order.customerName}')">
             Pay
           </button>`
        : ""
    }
  `;

  container.appendChild(card);
});


  } catch (error) {
    console.error("Error loading orders:", error);
  }
}

function goToPayment(id, total, table, customer) {
  localStorage.setItem("orderId", id);
  localStorage.setItem("orderTotal", total);
  localStorage.setItem("tableNumber", table);
  localStorage.setItem("customerName", customer);

  window.location.href = "payment.html";
}

loadOrders();
setInterval(loadOrders, 5000);

