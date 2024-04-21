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

export const getAllSellPropertyList = async ( page: number, limit: number, searchkey: string) => {

  // if (!userId) {
  //   throw new Error("userId is empty");
  // }

  let searchData = searchkey ? {  
    // userId: { $ne: new ObjectId(userId) },
    isDeleted: false,
    $or: [
      { "taluka": { $regex: searchkey, $options: "i" } },
      { "district": { $regex: searchkey, $options: "i" } }
    ]
  } : 
  { isDeleted: false};

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

  let result = await SellProperty.aggregate([
    {
      $match: {
        _id: new ObjectId(propertyId)
      }
    },
    {
      $lookup: {
        from: "users", 
        localField: "userId", 
        foreignField: "_id", 
        as: "user_detail" 
      }
    },
    {
      $unwind: "$user_detail" 
    }
  ])

  if (!result) {
    return false;
  }
  return result;
};




