// Get data from localStorage
const orderId = localStorage.getItem("orderId");
const total = Number(localStorage.getItem("orderTotal"));
const tableNumber = localStorage.getItem("tableNumber");
const customerName = localStorage.getItem("customerName");

let selectedMethod = null;

// If no data found
if (!orderId) {
  alert("No order found");
}

// Display data on page
document.getElementById("tableNumber").innerText =
  "Table " + tableNumber;

document.getElementById("subtotal").innerText =
  "₹" + total;

const taxAmount = total * 0.085;
document.getElementById("tax").innerText =
  "₹" + taxAmount.toFixed(2);

const finalTotal = Number(total) + taxAmount;
document.getElementById("totalAmount").innerText =
  "₹" + finalTotal.toFixed(2);

// Payment Method Selection
function selectPayment(method) {
  selectedMethod = method;

  document.querySelectorAll(".method").forEach(btn =>
    btn.classList.remove("active")
  );

  document.getElementById(method).classList.add("active");
}

// Complete Payment
function completePayment() {
  if (!selectedMethod) {
    alert("Please select payment method");
    return;
  }

  fetch(`http://localhost:5000/orders/${orderId}/pay`, {
    method: "PUT"
  })
    .then(res => res.json())
    .then(() => {
      alert("Payment done successfully ✅");

      localStorage.clear(); // clear saved data

      window.location.href = "order-status.html";
    })
    .catch(err => {
      console.error(err);
      alert("Payment success");
    });
}

