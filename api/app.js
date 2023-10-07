const express = require("express");
const app = express();
var port = 3000;

app.use(express.json());

const pizzas = require("./routes/pizzas");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/pizzas", pizzas);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
