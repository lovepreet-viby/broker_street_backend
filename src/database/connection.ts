import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const uri = process.env.MONGO_CONNECTION_STRING;

export async function run() {
    try {
        await mongoose.connect(
            "mongodb+srv://lreignsaish:2eQ2ZHftuYnFOVpo@brocket-street.z2e148n.mongodb.net/dev?retryWrites=true"
        );
        console.log("mongodb connected!");
    } catch (err) {
        console.log(err);
    }
}
