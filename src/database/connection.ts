import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const uri = process.env.MONGO_CONNECTION_STRING;

export async function run() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/brokerstreet");
    console.log("mongodb connected!!");
  } catch (err) {
    console.log(err);
  }
}
