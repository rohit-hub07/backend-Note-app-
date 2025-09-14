import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const dbConnection = async () => {
  await mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("Connected to Db!"))
    .catch((err) => console.log(`Error connection to db: ${err}`));
};
