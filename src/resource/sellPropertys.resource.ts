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

export const getAllSellPropertyList = async (page: number, limit: number, searchkey: string, userId: string) => {

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
    userId ?
      {
        isDeleted: false,
        userId: { $ne: new ObjectId(userId) }
      } :
      {
        isDeleted: false
      };

  const totalCount = await SellProperty.count(searchData);
  const totalPages = Math.ceil(totalCount / limit);

  let skip: number;
  if (page !== 1) {
    skip = (page - 1) * limit;
  } else {
    skip = 0;
  }


  let result = await SellProperty.find(searchData).skip(skip).limit(limit).sort({ _id: 1 })

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


export const checkSellPropertyId = async (sellPropertyId: string) => {

  if (!sellPropertyId) {
    throw new Error("id is empty");
  }

  let result = await SellProperty.findOne({ _id: sellPropertyId });
  if (!result) {
    return false;
  }
  return result;
};



export const getAllUserSellPropertyList = async (page: number, limit: number, userId: string) => {

  if (!userId) {
    throw new Error("userId is empty");
  }

  let query = {
    userId: new ObjectId(userId),
    isDeleted: false,
  }

  const totalCount = await SellProperty.count(query);
  const totalPages = Math.ceil(totalCount / limit);

  let skip: number;
  if (page !== 1) {
    skip = (page - 1) * limit;
  } else {
    skip = 0;
  }


  let result = await SellProperty.find(query).skip(skip).limit(limit).sort({ _id: 1 })

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



export const getAllSellPropertyWithUserDetailData = async (page: number, limit: number) => {

  let searchData = { isDeleted: false };

  const totalCount = await SellProperty.count(searchData);
  const totalPages = Math.ceil(totalCount / limit);

  let skip: number;
  if (page !== 1) {
    skip = (page - 1) * limit;
  } else {
    skip = 0;
  }

  let result = await SellProperty.aggregate([
    {
      $match: searchData // Optional match condition
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'userDetails'
      }
    },
    {
      $unwind: "$userDetails"
    },
  ]).skip(skip).limit(limit)

  // let result = await SellProperty.find(searchData).skip(skip).limit(limit)
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