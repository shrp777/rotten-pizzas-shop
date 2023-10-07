const express = require("express");
const router = express.Router();

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
router.post("/", (req, res) => {
  connection.query(
    `INSERT INTO pizzas (name, price, available) VALUES ("${req.body.name}", ${req.body.price}, ${req.body.available})`,
    (err, rows, fields) => {
      if (err) console.log(err);

      res.json("created");
    }
  );
});

//READ ALL
router.get("/", (req, res) => {
  //FILTER BY NAME
  if (req.query.name) {
    const query = `SELECT * FROM pizzas WHERE name = "${req.query.name}"`;

    connection.query(query, (err, rows, fields) => {
      if (err) console.log(err);

      res.json(rows);
    });
  } else if (req.query.available) {
    const query = `SELECT * FROM pizzas WHERE available = ${req.query.available}`;

    connection.query(query, (err, rows, fields) => {
      if (err) console.log(err);

      res.json(rows);
    });
  } else {
    connection.query(
      "SELECT * FROM pizzas WHERE available = 1",
      (err, rows, fields) => {
        if (err) console.log(err);

        res.json(rows);
      }
    );
  }
});

//UPDATE ONE BY ID
router.put("/:id", (req, res) => {
  const query = `UPDATE pizzas SET id = ${req.body.id}, name = "${req.body.name}", price = ${req.body.price}, available = ${req.body.available} WHERE id = ${req.body.id}`;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);

    res.json("updated");
  });
});

//READ ONE BY ID
router.get("/:id", (req, res) => {
  const query = `SELECT * FROM pizzas WHERE available = 1 AND id =${req.params.id}`;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);

    res.json(rows);
  });
});

//DELETE
router.delete("/:id", (req, res) => {
  connection.query(
    `DELETE FROM pizzas WHERE id = ${req.params.id}`,
    (err, rows, fields) => {
      if (err) console.log(err);

      res.json("deleted");
    }
  );
});

//connection.end();

module.exports = router;
