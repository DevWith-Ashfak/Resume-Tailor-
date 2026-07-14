import express from "express";
import cors from "cors";
import { uploadRouter } from "./routes/upload";
import { analyzeRouter } from "./routes/analyze";
import { resultRouter } from "./routes/result";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.use("/api/upload", uploadRouter);
app.use("/api/analyze", analyzeRouter);
app.use("/api/result", resultRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
