const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/products", require("./routes/products"));
app.use("/api/users", require("./routes/users"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;