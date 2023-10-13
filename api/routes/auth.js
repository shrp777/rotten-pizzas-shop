const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

// SIGNUP
router.post("/signup", (req, res) => {
  // Utilisation de la bibliothèque bcrypt pour le hachage sécurisé des mots de passe
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Password hashing failed" });
    }

    const user = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      role: req.body.role,
      password: hashedPassword,
    };

    connection.query(
      `INSERT INTO users (firstname, lastname, email, role, password) VALUES (?, ?, ?, ?, ?)`,
      [
        user.firstname,
        user.lastname,
        user.email,
        user.role,
        user.password,
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Database error" });
        }

        let token = jwt.sign({ id: result.insertId }, process.env.JWT_KEY);

        res.json({ token: token });
      }
    );
  });
});

// SIGNIN
router.post("/signin", (req, res) => {
  connection.query(
    `SELECT * FROM users WHERE email = ?`,
    [req.body.email],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      if (rows.length === 0) {
        return res.status(401).json({ error: "User not found" });
      }

      const user = rows[0];

      // Utilisation de bcrypt pour comparer le mot de passe
      bcrypt.compare(req.body.password, user.password, (err, passwordMatch) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Password comparison failed" });
        }

        if (passwordMatch) {
          let token = jwt.sign({ id: user.id }, process.env.JWT_KEY);
          res.json({ token: token });
        } else {
          res.status(401).json({ error: "Authentication failed" });
        }
      });
    }
  );
});

module.exports = router;
