import express from "express";
import cors from "cors";
import "./loadEnvironment.js";
import driverRoutes from "./routes/driverRoutes.mjs";
import constructorRoutes from "./routes/constructorRoutes.mjs"
import raceRoutes from "./routes/raceRoutes.mjs"
import circuitRoutes from "./routes/circuitRoutes.mjs"
import seasonRoutes from "./routes/seasonRoutes.mjs"
import qualifyingRoutes from "./routes/qualifyingRoutes.mjs"
import resultsRoutes from "./routes/resultsRoutes.mjs";
import standingsRoutes from "./routes/standingsRoutes.mjs";
import lapTimesRoutes from "./routes/lapTimesRoutes.mjs";
import pitStopsRoutes from "./routes/pitStopsRoutes.mjs";
import openf1Routes from "./openF1/routes/openf1Routes.js";
import externalRoutes from "./routes/externalRoutes.mjs";
const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/drivers", driverRoutes);
app.use("/constructors", constructorRoutes);
app.use("/races", raceRoutes);
app.use("/circuits", circuitRoutes);
app.use("/seasons", seasonRoutes);
app.use("/qualifying", qualifyingRoutes)
app.use("/results", resultsRoutes);
app.use("/standings", standingsRoutes);
app.use("/lap-times", lapTimesRoutes);
app.use("/pit-stops", pitStopsRoutes);
app.use("/openf1", openf1Routes);
app.use("/external", externalRoutes);
app.use((err, _req, res, _next) => {
  res.status(500).send("An unexpected error occured.")
})

app.listen(PORT, () => {
  console.log(`Server is running on port: 5050`);
});
app.get("/", (req, res) => {
  res.json({ message: "F1 API is running" });
});

export default app;