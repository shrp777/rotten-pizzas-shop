const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "db",
  user: "rps",
  password: "azerty",
  database: "rps",
});

connection.connect();

router.use(express.json());

// Fonction pour gérer les réponses JSON
function handleResponse(res, status, data) {
  res.status(status).json(data);
}

// Middleware de vérification du token JWT
function verifyToken(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      handleResponse(res, 401, { error: "Unauthorized" });
    } else {
      next();
    }
  });
}

// CREATE
router.post("/", verifyToken, (req, res) => {
  const orderData = {
    user_id: req.body.user_id,
    amount: req.body.amount,
    createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
  };

  connection.query("INSERT INTO orders SET ?", orderData, (err, result) => {
    if (err) {
      handleResponse(res, 500, { error: "Internal Server Error" });
    } else {
      const orderId = result.insertId;
      const pizzas = req.body.pizzas.map((pizzaId) => [orderId, pizzaId, 1]);

      connection.query(
        "INSERT INTO orders_pizzas (order_id, pizza_id, quantity) VALUES ?",
        [pizzas],
        (err) => {
          if (err) {
            handleResponse(res, 500, { error: "Internal Server Error" });
          } else {
            handleResponse(res, 200, { message: "Order created" });
          }
        }
      );
    }
  });
});

// READ ALL
router.get("/", verifyToken, (req, res) => {
  const filterBy = req.query.user_id
    ? `user_id = ${req.query.user_id}`
    : req.query.status
    ? `status = "${req.query.status}"`
    : "1";

  const query = `SELECT * FROM orders WHERE ${filterBy}`;

  connection.query(query, (err, rows) => {
    if (err) {
      handleResponse(res, 500, { error: "Internal Server Error" });
    } else {
      handleResponse(res, 200, rows);
    }
  });
});

// UPDATE ONE BY ID
router.put("/:id", verifyToken, (req, res) => {
  const orderId = req.params.id;
  const orderData = {
    user_id: req.body.user_id,
    status: req.body.status,
    amount: req.body.amount,
    updatedAt: new Date().toISOString().slice(0, 19).replace("T", " "),
  };

  connection.query(
    "UPDATE orders SET ? WHERE id = ?",
    [orderData, orderId],
    (err, result) => {
      if (err) {
        handleResponse(res, 500, { error: "Internal Server Error" });
      } else {
        handleResponse(res, 200, { message: "Order updated" });
      }
    }
  );
});

// UPDATE STATUS BY ID
router.patch("/:id", verifyToken, (req, res) => {
  const orderId = req.params.id;
  const newStatus = req.body.status;

  const query = "UPDATE orders SET status = ? WHERE id = ?";

  connection.query(query, [newStatus, orderId], (err) => {
    if (err) {
      handleResponse(res, 500, { error: "Internal Server Error" });
    } else {
      if (newStatus === "validated") {
        // TODO: Vérifier le stock et mettre à jour les points de fidélité ici
        handleResponse(res, 200, { message: "Order updated" });
      } else {
        handleResponse(res, 200, { message: "Order updated" });
      }
    }
  });
});

// READ ONE BY ID
router.get("/:id", verifyToken, (req, res) => {
  const orderId = req.params.id;
  const query = "SELECT * FROM orders WHERE id = ?";

  connection.query(query, [orderId], (err, rows) => {
    if (err) {
      handleResponse(res, 500, { error: "Internal Server Error" });
    } else {
      handleResponse(res, 200, rows);
    }
  });
});

module.exports = router;
