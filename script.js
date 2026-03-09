// ===== Prices =====
const prices = {
  fries: 100,
  burger: 140
};

// ===== Quantities =====
let qty = {
  fries: 0,
  burger: 0
};

// ===== Scroll Button =====
window.onload = function () {
  const scrollBtn = document.getElementById("scrollBtn");
  if (scrollBtn) {
    scrollBtn.onclick = function () {
      document
        .getElementById("orderSection")
        .scrollIntoView({ behavior: "smooth" });
    };
  }
};

// ===== Change Quantity =====
function changeQty(item, amount) {

  qty[item] += amount;

  if (qty[item] < 0) {
    qty[item] = 0;
  }

  document.getElementById("friesQty").innerText = qty.fries;
  document.getElementById("burgerQty").innerText = qty.burger;

  const total =
    qty.fries * prices.fries +
    qty.burger * prices.burger;

  document.getElementById("total").innerText = total;
}

// ===== Save Order =====
function saveOrder() {
  const name = document.getElementById("name").value.trim();
  const tableNumber = document.getElementById("table").value.trim();

  const total =
    qty.fries * prices.fries +
    qty.burger * prices.burger;

  if (!name || !tableNumber || total === 0) {
    alert("Fill all details and add items");
    return;
  }

  const orderData = {
    customerName: name,
    tableNumber: tableNumber,
    items: [
      { name: "Truffle Fries", quantity: qty.fries, price: prices.fries },
      { name: "Wagyu Burger", quantity: qty.burger, price: prices.burger }
    ].filter(item => item.quantity > 0),
    total: total
  };

  fetch("http://localhost:5000/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData)
  })
  .then(res => res.json())
  .then(() => {
    alert("Order Saved Successfully ✅");
  })
  .catch(err => {
    console.error(err);
    alert("Error saving order");
  });
}
