import axios from "axios";

const recommendCatsTool = async (
    kidsFriendly: boolean,
    apartmentFriendly: boolean,
) => {
    
        const response = await axios.post("http://localhost:3000/api/aiRecommend",   
        { 
         kids: kidsFriendly,
         apartmentFriendly: apartmentFriendly
         });

         return response.data;

}
export default recommendCatsTool;   