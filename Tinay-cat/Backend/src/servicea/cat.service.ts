import CatModel from "../models/cats.model.ts";
import type { ICat } from "../types/cats.types.ts";

export const createCatService = async (payload: Partial<ICat>) => {
    return await CatModel.create(payload);
};

export const getAllCatsService = async () => {
    return await CatModel.find();
};

export const getCatByIdService = async (id: string) => {
    return await CatModel.findById(id);
};

export const updateCatService = async (id: string, payload: Partial<ICat>) => {
    return await CatModel.findByIdAndUpdate(id, payload, { new: true });
};

export const deleteCatService = async (id: string) => {
    return await CatModel.findByIdAndDelete(id);
};

export const searchCatsService = async (query: any) => {
    const filter: any = {};
    if (query.name) {
        filter.name = { $regex: query.name, $options: "i" };
    }
    if (query.breed) {
        filter.breed = { $regex: query.breed, $options: "i" };
    }
    if (query.color) {
        filter.color = { $regex: query.color, $options: "i" };
    }
    if (query.energyLevel) {
        filter.energyLevel = query.energyLevel;
    }
    if (query.kidsFriendly !== undefined) {
        filter.kidsFriendly = query.kidsFriendly === "true";
    }
    if (query.apartmentFriendly !== undefined) {
        filter.apartmentFriendly = query.apartmentFriendly === "true";
    }
    return await CatModel.find(filter);
};

export const recommendCatsService = async (preferences: {
    kidsFriendly?: boolean;
    apartmentFriendly?: boolean;
    energyLevel?: string;
}) => {
    const query: any = {};
    if (preferences.kidsFriendly !== undefined) {
        query.kidsFriendly = preferences.kidsFriendly;
    }
    if (preferences.apartmentFriendly !== undefined) {
        query.apartmentFriendly = preferences.apartmentFriendly;
    }
    if (preferences.energyLevel) {
        query.energyLevel = preferences.energyLevel;
    }
    return await CatModel.find(query);
};