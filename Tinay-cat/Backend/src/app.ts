import express, { type Request, type Response } from "express";
import cors from "cors";
import catsRoute from "./routes/cat.routes.ts";
import aiRoutes from "./routes/ai.routes.ts";
import aiRecommendRoutes from "./routes/aiRecommend.routes.ts";
import mcpRoutes from "./routes/test-mcp.routes.ts";
import authRoutes from "./routes/auth.routes.ts";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send({
    success: true,
    message: "Tiny cats backend running...",
  });
});

app.use("/api/cats", catsRoute);
app.use("/api/ai", aiRoutes);
app.use("/api/aiRecommend", aiRecommendRoutes);
app.use("/api/mcp", mcpRoutes);
app.use("/api/auth", authRoutes);

export default app;