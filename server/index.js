const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;

const driverRoutes = require("./routes/driverRoutes");

app.use(express.json());

const mongoURI = "mongodb://localhost:27017/f1_project";
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to mongo"))
  .catch((err) => console.error("Mongo connection failed", err));

app.use("/drivers", driverRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
