import type { Request, Response } from "express";
import { aiRecommendService } from "../services/aiRecommend.service.ts";

export const aiRecommendController = async (req: Request, res: Response) => {
  try {
    const kidsFriendly = req.body?.kidsFriendly === true || req.body?.kidsFriendly === "true";
    const apartmentFriendly = req.body?.apartmentFriendly === true || req.body?.apartmentFriendly === "true";

    const result = await aiRecommendService(kidsFriendly, apartmentFriendly);

    return res.status(200).json({
      success: true,
      count: result ? result.length : 0,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get AI recommendation",
    });
  }
};