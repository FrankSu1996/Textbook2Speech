const express = require("express");

const app = express();

const port = 5000;

app.get("/api/customers", (req, res) => {
  const customers = [
    { id: 1, firstName: "Frank", lastName: "Su" },
    { id: 2, firstName: "Anna", lastName: "LM" },
    { id: 3, firstName: "Anna", lastName: "Jo" },
    { id: 4, firstName: "Peter", lastName: "Weng" }
  ];

  res.json(customers);
});

app.listen(port, () => console.log("Server started on port " + port));
