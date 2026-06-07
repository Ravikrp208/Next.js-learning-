import express from "express";
import {
    createCatController,
    getAllCatsController,
    getSingleCatController,
    searchCatsController,
    recommendCatsController,
}             
    from "../controller/cat.controller.ts";

const router = express.Router();

router.post("/create", createCatController);
router.get("/search/all", searchCatsController);
router.get("/recommend", recommendCatsController);
router.get("/", getAllCatsController);
router.get("/:id", getSingleCatController);

export default router;

