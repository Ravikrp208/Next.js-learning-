import express from "express";
import dotenv from "dotenv";
import catRoutes from "./routes/cat.routes.ts";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send({ message: "Tinay-cat API is running...." });
});

app.use("/cat", catRoutes);

export default app;