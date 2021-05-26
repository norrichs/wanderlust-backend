require("dotenv").config();
const express = require("express");
const mongoose = require("./db/connection");

const agencyController = require("./controllers/agency")
const customerController = require("./controllers/customer")
const reviewController = require("./controllers/review")
const tripsController = require("./controllers/trip")
const seedController = require("./controllers/seed")

const app = express();
const PORT = process.env.PORT
//imports
const cors = require("cors")
const morgan = require("morgan")

//midleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))


app.get("/", (req, res) => {
    res.json({ hello: "Hello World!" });
  });

app.use("/agency", agencyController)
app.use("/customer", customerController)
app.use("/review", reviewController)
app.use('/trip', tripsController)
app.use('/seed', seedController)

app.listen(PORT, () => {
  console.log(`Your are listening on port ${PORT}`);
});