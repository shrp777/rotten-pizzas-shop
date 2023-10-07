const express = require("express");
const app = express();
const port = 3000;

const orders = require("./routes/orders");
const pizzas = require("./routes/pizzas");
const auth = require("./routes/auth");

app.use("/orders", orders);
app.use("/pizzas", pizzas);
app.use("/auth", auth);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
