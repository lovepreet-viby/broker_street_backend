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

export const getAllSellPropertyList = async (userId: string, page: number, limit: number, searchkey: string) => {

  if (!userId) {
    throw new Error("userId is empty");
  }

  let searchData = searchkey ? {  // Check if searchkey key is provided
    userId: { $ne: new ObjectId(userId) },
    $or: [
      { "propertyTitle": { $regex: searchkey, $options: "i" } },
      { "description": { $regex: searchkey, $options: "i" } }
    ]
  } : { userId: { $ne: new ObjectId(userId) },isDeleted: true};

  const totalCount = await SellProperty.count(searchData);
  const totalPages = Math.ceil(totalCount / limit);

  let skip: number;
  if (page !== 1) {
    skip = (page - 1) * limit;
  } else {
    skip = 0;
  } 
  
  let result = await SellProperty.find(searchData).skip(skip).limit(limit)

  if (!result) {
    return false;
  }

  return {
    totalCount: totalCount,
    totalPages: totalPages,
    currenPage: page,
    sellProperty: result,
  };
};



export const updateSellPropertyDetail = async (sellPropertyId: string, data: ISellProperty) => {

  if (!data) {
    throw new Error("Data is empty");
  }

  let result = await SellProperty.findByIdAndUpdate(sellPropertyId, data, { new: true });
  if (!result) {
    return false;
  }
  return result;
};


export const deleteSellPropertyDetail = async (sellPropertyId: string) => {

  if (!sellPropertyId) {
    throw new Error("id is empty");
  }

  let result = await SellProperty.findByIdAndUpdate(sellPropertyId, { isDeleted: true }, { new: true });
  if (!result) {
    return false;
  }
  return result;
};




export const getSellPropertyDetail = async (propertyId: string) => {

  if (!propertyId) {
    throw new Error("propertyId is empty");
  }

  let result = await SellProperty.findOne({ _id: new ObjectId(propertyId) })

  if (!result) {
    return false;
  }
  return result;
};


