import SellProperty from "../schema/sellPropertySchema";
const { ObjectId } = require("mongodb"); // If you're using CommonJS
import { ISellProperty } from "../interfaces/sellProperty.interface";

export const createSellPropertyDetail = async (data: ISellProperty) => {

  if (!data) {
    throw new Error("Data is empty");
  }

  let result = await SellProperty.create(data);
  if (!result) {
    return false;
  }
  return result;
};

export const getSellPropertyDetail = async (userId: string, page: number, limit: number) => {

  if (!userId) {
    throw new Error("userId is empty");
  }

  let result = await SellProperty.find({
    userId: { $ne: new ObjectId(userId) }
  })

  if (!result) {
    return false;
  }
  return result;
};

