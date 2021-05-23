require("dotenv").config();
const express = require("express");
const mongoose = require("./db/connection");

const agencyController = require("./controllers/agencies")
const customerController = require("./controllers/customers")
const reviewController = require("./controllers/reviews")
const tripsController = require("./controllers/trips")

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

app.listen(PORT, () => {
  console.log(`Your are listening on port ${PORT}`);
});