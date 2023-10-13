/**
 * 🚨 Attention, le code présent dans ce fichier contient volontairement de nombreuses imperfections :
 * 🚨 erreurs de conception, mauvaises pratiques de développement logiciel, failles de sécurité et de performance.
 * 🚨 Ce code servira de support à un exercice de refactoring.
 */

//test sonarcloud
const express = require("express");
const app = express();
const port = 3000;
require('dotenv').config()
const orders = require("./routes/orders");
const pizzas = require("./routes/pizzas");
const auth = require("./routes/auth");
const db = require("./database")
const mysql = require("mysql");


app.use("/orders", orders);
app.use("/pizzas", pizzas); 
app.use("/auth", auth);
// connection.end(function (err) {
//   if (err) console.log(err);
//   // The connection is terminated now
// });
//connection.destroy();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

process.on('exit', () => {
  db.end((err) => {
    if (err) {
      console.error('Error closing the database connection:', err);
    }
  });
});
