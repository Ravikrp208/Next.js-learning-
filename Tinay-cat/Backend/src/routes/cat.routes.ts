import express from "express";
import {
    createCat,
    searchCats,
    getAllCats,
    getCatById,
    recommendCats,
    updateCat,
    deleteCat
} from "../controller/cat.controller.ts";

const router = express.Router();

router.post("/create", createCat);
router.get("/search/all", searchCats);
router.get("/", getAllCats);
router.get("/:id", getCatById);
router.post("/recommend", recommendCats);
router.put("/:id", updateCat);
router.delete("/:id", deleteCat);

export default router;
