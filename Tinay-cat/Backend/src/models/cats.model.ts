import mongoose from "mongoose";
import type { ICat } from "../types/cats.types.ts"; 

const catSchema = new mongoose.Schema<ICat>({
    name: {
        type: String,
        required: true,
    },
    breed: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    kidsFriendly: {
        type: Boolean,
        required: true,
    },
    apartmentFriendly: {
        type: Boolean,
        required: true,
    },
    lifespan: {
        type: Number,
        default: 1,
    },
    energyLevel: {
        type: String,
        enum: ["low", "medium", "high"],
    },
    image: {
        type: String,
        color: String,
    },
    color: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },  
    
    
}, 
{timestamps: true}
);  

const CatModel = mongoose.model<ICat>("Cat", catSchema);

export default CatModel;