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
router.use(express.urlencoded({ extended: true }));

// Fonction pour gérer les erreurs
function handleResponse(res, error, result) {
  if (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } else {
    res.status(200).json(result);
  }
}

// CREATE
router.post("/", function (req, res) {
  console.log(req.headers.authorization);
  let token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
    if (err) {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      const pizza = {
        name: req.body.name,
        price: req.body.price,
        available: req.body.available,
      };

      connection.query(
        `INSERT INTO pizzas (name, price, available) VALUES (?, ?, ?)`,
        [pizza.name, pizza.price, pizza.available],
        (err, result) => {
          handleResponse(res, err, "Pizza created");
        }
      );
    }
  });
});

// READ ALL
router.get("/", function (req, res) {
  let query = "SELECT * FROM pizzas WHERE available = 1";

  if (req.query.name) {
    query = "SELECT * FROM pizzas WHERE name = ? AND available = 1";
  } else if (req.query.available) {
    query = "SELECT * FROM pizzas WHERE available = ?";
  }

  connection.query(query, [req.query.name || req.query.available], (err, rows) => {
    handleResponse(res, err, rows);
  });
});

// UPDATE ONE BY ID
router.put("/:id", function (req, res) {
  let token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
    if (err) {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      const pizza = {
        id: req.params.id,
        name: req.body.name,
        price: req.body.price,
        available: req.body.available,
      };

      connection.query(
        `UPDATE pizzas SET name = ?, price = ?, available = ? WHERE id = ?`,
        [pizza.name, pizza.price, pizza.available, pizza.id],
        (err, result) => {
          handleResponse(res, err, "Pizza updated");
        }
      );
    }
  });
});

// READ ONE BY ID
router.get("/:id", function (req, res) {
  const query = "SELECT * FROM pizzas WHERE id = ? AND available = 1";

  connection.query(query, [req.params.id], (err, rows) => {
    handleResponse(res, err, rows);
  });
});

// DELETE
router.delete("/:id", function (req, res) {
  let token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
    if (err) {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      connection.query(
        `DELETE FROM pizzas WHERE id = ?`,
        [req.params.id],
        (err, result) => {
          handleResponse(res, err, "Pizza deleted");
        }
      );
    }
  });
});

module.exports = router;
