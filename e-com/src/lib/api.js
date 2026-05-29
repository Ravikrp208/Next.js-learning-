import axios from "axios";

let api = axios.create({
    baseURL: "https://api.team-sync.space",
    withCredentials: true,  
})  

export default api