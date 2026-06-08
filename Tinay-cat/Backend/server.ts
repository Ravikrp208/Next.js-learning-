import app from "./src/app.ts";
import dotenv from "dotenv";
import { connectDb } from "./src/config/db.ts";


dotenv.config();


connectDb();    

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
