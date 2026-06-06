import app from "./src/app.ts";
import dotenv from "dotenv";
import connectDB from "./src/config/db.ts";

dotenv.config();


connectDB();    

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
