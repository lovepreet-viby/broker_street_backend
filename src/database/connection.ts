import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const uri = process.env.MONGO_CONNECTION_STRING;

export async function run() {
  try {
    if (uri) {
      await mongoose.connect(uri);
    }
    console.log("mongodb connected!");
  } catch (err) {
    console.log(err);
  }
}
