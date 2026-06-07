import type { Request, Response } from "express";
import {
    getSingleCatService,
    createCatService,
    getAllCatsService,
    searchCatsService,
    recommendCatsService
} from "../servicea/cat.service.ts";    

// create cat controller 
export const createCatController = async (req: Request, res: Response): Promise<any> => {
    try {
        let result = await createCatService(req.body);  
        return res.status(201).json({
            success: true, 
            message: "Cat created successfully",
            data: result,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Error creating cat",
            error: error?.message || error
        });
    }
};

// Get all cats controller 
export const getAllCatsController = async (req: Request, res: Response): Promise<any> => {
    try {
        let result = await getAllCatsService();
        return res.status(200).json({
            success: true,
            message: "Cats fetched successfully",
            data: result,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Error fetching cats",
            error: error?.message || error
        });
    }
};

// Get single cat controller 
export const getSingleCatController = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id;
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Valid Cat ID is required"
            });
        }
        let result = await getSingleCatService(id);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Cat not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Cat fetched successfully",
            data: result,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Error fetching cat",
            error: error?.message || error
        });
    }
};

// search cat controller 
export const searchCatsController = async (req: Request, res: Response): Promise<any> => {
    try {
        let query = (req.query.search || "") as string;
        let result = await searchCatsService(query);
        return res.status(200).json({
            success: true,
            message: "Cats fetched successfully",
            data: result,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Error searching cats",
            error: error?.message || error
        });
    }
};  

// recommend cat controller 
export const recommendCatsController = async (req: Request, res: Response): Promise<any> => {
    try {
        const kidsFriendlyInput = req.body?.kidsFriendly ?? req.query?.kidsFriendly;
        const apartmentFriendlyInput = req.body?.apartmentFriendly ?? req.query?.apartmentFriendly;

        const kidsFriendly = kidsFriendlyInput !== undefined ? (kidsFriendlyInput === "true" || kidsFriendlyInput === true) : undefined;
        const apartmentFriendly = apartmentFriendlyInput !== undefined ? (apartmentFriendlyInput === "true" || apartmentFriendlyInput === true) : undefined;

        const result = await recommendCatsService(kidsFriendly, apartmentFriendly);    
        
        return res.status(200).json({
            success: true,
            message: "Cats fetched successfully",
            data: result,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Error getting recommendations",
            error: error?.message || error
        });
    }
};
    