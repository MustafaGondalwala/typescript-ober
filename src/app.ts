import express from "express";
import dotenv from "dotenv";
import { initializeTelemetry } from "./utils/tracer";
import routes from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

initializeTelemetry();

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
