import CatModel from "../models/cats.model.ts";


// create cat service 

export const createCatService = async (payload: any) => {
    return await CatModel.create(payload);
};      

// get all cat service 

export const getAllCatsService = async () => {
    return await CatModel.find();
};  

// get single cat service 

export const getSingleCatService = async (id: string) => {
    return await CatModel.findById(id);  
};      

// search  cat service 
export const searchCatsService = async (query: string) => {
    return await CatModel.find({
        $or :[
            {
                name: {
                    $regex: query,
                    $options: "i",    
                }
            },
            {
                breed: {
                    $regex: query,
                    $options: "i", 
                }
            },
            {
                description: {
                    $regex: query,
                    $options: "i",
                }
            }
        ]
    });     
    
}

// recommentcatService  

export const recommendCatsService = async (
    kidsFriendly?: boolean, 
    apartmentFriendly?: boolean
) => {
    const query: any = {};

    if (kidsFriendly !== undefined && apartmentFriendly !== undefined) {
        query.$or = [
            { kidsFriendly: kidsFriendly },
            { apartmentFriendly: apartmentFriendly }
        ];
    } else if (kidsFriendly !== undefined) {
        query.kidsFriendly = kidsFriendly;
    } else if (apartmentFriendly !== undefined) {
        query.apartmentFriendly = apartmentFriendly;
    } else {
        // Default: Return cats that are either kids-friendly OR apartment-friendly
        query.$or = [
            { kidsFriendly: true },
            { apartmentFriendly: true }
        ];
    }

    return await CatModel.find(query);
}   
