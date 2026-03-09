const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());
app.use(express.json());

// ============================
// MySQL Connection
// ============================
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Helen@2005",   // change if needed
  database: "dinedesk"
});
// Test MySQL connection
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ MySQL Connected Successfully!");
    connection.release();
  } catch (error) {
    console.error("❌ MySQL Connection Failed:", error.message);
  }
})();


// ============================
// CREATE ORDER
// ============================
app.post("/orders", async (req, res) => {
  try {
    const { customerName, tableNumber, total, items } = req.body;

    if (!customerName || !tableNumber || !total) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    // Insert into orders (AUTO_INCREMENT id)
    const [result] = await db.execute(
      "INSERT INTO orders (customerName, tableNumber, total, paymentStatus) VALUES (?, ?, ?, ?)",
      [customerName, tableNumber, total, "Pending"]
    );

    const orderId = result.insertId;

    // Insert order items
    for (const item of items) {
      await db.execute(
        "INSERT INTO order_items (order_id, item_name, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.name, item.quantity, item.price]
      );
    }

    res.status(201).json({ message: "Order saved successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
});

// ============================
// GET ALL ORDERS
// ============================
app.get("/orders", async (req, res) => {
  try {
    const [orders] = await db.execute("SELECT * FROM orders");

    for (let order of orders) {
      const [items] = await db.execute(
        "SELECT item_name AS name, quantity, price FROM order_items WHERE order_id = ?",
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
});

// ============================
// UPDATE PAYMENT
// ============================
app.put("/orders/:id/pay", async (req, res) => {
  try {
    const orderId = req.params.id;

    const [result] = await db.execute(
      "UPDATE orders SET paymentStatus = ? WHERE id = ?",
      ["Paid", orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Payment updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
});

// ============================
// START SERVER
// ============================
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

