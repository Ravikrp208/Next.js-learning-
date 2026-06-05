import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";


const app = express();


app.get("/", (req, res) => {
    res.send({ message: "Tinay-cat API is running...." });
});
export default app; 