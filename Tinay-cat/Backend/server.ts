import app from "./src/app.ts";
import dotenv from "dotenv";

dotenv.config();

let port = process.env.PORT;

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
