import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import posts from "./routes/posts.mjs";

import driverRoutes from "./routes/driverRoutes.mjs";
import constructorRoutes from "./routes/constructorRoutes.mjs"
import raceRoutes from "./routes/raceRoutes.mjs"
import circuitRoutes from "./routes/circuitRoutes.mjs"

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

//app.use("/posts", posts);
app.use("/drivers", driverRoutes);
app.use("/constructors", constructorRoutes);
app.use("/races", raceRoutes);
app.use("/circuits", circuitRoutes);

app.use((err, _req, res, _next) => {
  res.status(500).send("An unexpected error occured.")
})

app.listen(PORT, () => {
  console.log(`Server is running on port: 5050`);
});
