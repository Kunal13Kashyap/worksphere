import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const DATABASE_URL = process.env.DATABASE_URL;

if(!DATABASE_URL){
    throw new Error("DataBase URL missing!");
}

if(!JWT_SECRET){
    throw new Error("JWT Secret missing!");
}

export {
    PORT,
    JWT_SECRET,
    DATABASE_URL
}