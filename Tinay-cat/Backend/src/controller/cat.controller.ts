import type { Request, Response } from "express";
import {
    createCatService,
    getAllCatsService,
    getCatByIdService,
    updateCatService,
    deleteCatService,
    searchCatsService,
    recommendCatsService
} from "../servicea/cat.service.ts";

export const createCat = async (req: Request, res: Response): Promise<void> => {
    try {
        const cat = await createCatService(req.body);
        res.status(201).json({ success: true, message: "Cat created successfully", data: cat });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Error creating cat", error: error?.message || error });
    }
};

export const getAllCats = async (req: Request, res: Response): Promise<void> => {
    try {
        const cats = await getAllCatsService();
        res.status(200).json({ success: true, data: cats });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Error fetching cats", error: error?.message || error });
    }
};

export const getCatById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ success: false, message: "Cat ID is required" });
            return;
        }
        const cat = await getCatByIdService(id as string);
        if (!cat) {
            res.status(404).json({ success: false, message: "Cat not found" });
            return;
        }
        res.status(200).json({ success: true, data: cat });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Error fetching cat", error: error?.message || error });
    }
};

export const updateCat = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ success: false, message: "Cat ID is required" });
            return;
        }
        const cat = await updateCatService(id as string, req.body);
        if (!cat) {
            res.status(404).json({ success: false, message: "Cat not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Cat updated successfully", data: cat });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Error updating cat", error: error?.message || error });
    }
};

export const deleteCat = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ success: false, message: "Cat ID is required" });
            return;
        }
        const cat = await deleteCatService(id as string);
        if (!cat) {
            res.status(404).json({ success: false, message: "Cat not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Cat deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Error deleting cat", error: error?.message || error });
    }
};

export const searchCats = async (req: Request, res: Response): Promise<void> => {
    try {
        const cats = await searchCatsService(req.query);
        res.status(200).json({ success: true, data: cats });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Error searching cats", error: error?.message || error });
    }
};

export const recommendCats = async (req: Request, res: Response): Promise<void> => {
    try {
        const { kidsFriendly, apartmentFriendly, energyLevel } = req.body;
        const cats = await recommendCatsService({ kidsFriendly, apartmentFriendly, energyLevel });
        res.status(200).json({ success: true, data: cats });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Error getting recommendations", error: error?.message || error });
    }
};
