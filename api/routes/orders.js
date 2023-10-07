const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "db",
  user: "rps",
  password: "azerty",
  database: "rps"
});

connection.connect();

router.use(express.json());

//CREATE
router.post("/", function (req, res) {
  let token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
    if (err) res.json("unauthorized");
    connection.query(
      `INSERT INTO orders (user_id, amount, createdAt) VALUES (${req.body.id}, ${req.body.amount}, NOW())`,
      (err, rows, fields) => {
        if (err) console.log(err);

        const orderId = rows.insertId;

        for (const pizzaId of req.body.pizzas) {
          connection.query(
            `INSERT INTO orders_pizzas (order_id, pizza_id, quantity) VALUES (${orderId},${pizzaId},1)`,
            (err, rows, fields) => {
              if (err) console.log(err);
            }
          );
        }

        res.json("created");
      }
    );
  });
});

//READ ALL
router.get("/", function (req, res) {
  //FILTER BY USER ID
  if (req.query.user_id) {
    const query = `SELECT * FROM orders WHERE user_id = "${req.query.user_id}"`;

    connection.query(query, (err, rows, fields) => {
      if (err) console.log(err);

      res.json(rows);
    });
  } else if (req.query.status) {
    const query = `SELECT * FROM orders WHERE status = ${req.query.status}`;

    connection.query(query, (err, rows, fields) => {
      if (err) console.log(err);

      res.json(rows);
    });
  } else {
    connection.query("SELECT * FROM orders", (err, rows, fields) => {
      if (err) console.log(err);

      res.json(rows);
    });
  }
});

//UPDATE ONE BY ID
router.put("/:id", function (req, res) {
  let token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
    if (err) res.json("unauthorized");

    const query = `UPDATE orders SET id = ${req.body.id}, status = "${req.body.status}", amount = ${req.body.amount} WHERE id = ${req.body.id}`;

    connection.query(query, (err, rows, fields) => {
      if (err) console.log(err);

      res.json("updated");
    });
  });
});

//READ ONE BY ID
router.get("/:id", function (req, res) {
  const query = `SELECT * FROM orders WHERE id =${req.params.id}`;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);

    res.json(rows);
  });
});

module.exports = router;
