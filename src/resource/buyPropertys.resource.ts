import BuyProperty from "../schema/buyPropertySchema";
const { ObjectId } = require("mongodb"); // If you're using CommonJS
import { IBuyProperty } from "../interfaces/buyProperty.interface";

export const createBuyPropertyDetail = async (data: IBuyProperty) => {
 
  if (!data) {
    throw new Error("Data is empty");
  }

  let result = await BuyProperty.create(data);
  if (!result) {
    return false;
  }
  return result;
};


  