import mongoose from "mongoose";
import { DATABASE_URL } from "./env.js";

export const connectDB = async ()=>{
    try {
        await mongoose.connect(DATABASE_URL);
        console.log("DataBase connected successfully");
    } catch (error) {
        console.log(`DataBase Connection Error! : ${error}`);
        process.exit(1);
    }
}