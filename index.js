const mtnMomo = require("./middleware/mtnMomo");
const express = require("express");
const cors = require("cors");
const app = express();
const { urlencoded } = require("express");
const dotenv = require("dotenv");
dotenv.config();

const port = 49153;

const paymentRoute = require("./routes/paymentroute");

app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use("/dadsonmomostk/payment", paymentRoute);

app.listen(port, () => {
  console.log(`dadsonmomostk server is running on ${port}`);
});

module.exports = mtnMomo;
