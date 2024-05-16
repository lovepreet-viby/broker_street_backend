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



export const updateBuyPropertyDetail = async ( buyPropertyId :string , data: IBuyProperty) => {
 
  if (!data) {
    throw new Error("Data is empty");
  }

  let result = await BuyProperty.findByIdAndUpdate(buyPropertyId, data, { new: true });
  if (!result) {
    return false;
  }
  return result;
};

export const deleteBuyPropertyDetail= async ( buyPropertyId :string) => {
 
  if (!buyPropertyId) {
    throw new Error("id is empty");
  }

  let result = await BuyProperty.findByIdAndUpdate( buyPropertyId, { isDeleted: true }, { new: true });
  if (!result) {
    return false;
  }
  return result;
};
  


export const getBuyAllPropertyDetail= async (page: number , limit: number) => {
 
  let searchData = { isDeleted: false};

  const totalCount = await BuyProperty.count(searchData);
  const totalPages = Math.ceil(totalCount / limit);

    let skip: number;
  if (page !== 1) {
    skip = (page - 1) * limit;
  } else {
    skip = 0;
  } 

  let result1 = await BuyProperty.aggregate([
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

  let result = await BuyProperty.find(searchData).skip(skip).limit(limit)
   if (!result) {
      return false;
    }

    return {
    totalCount: totalCount,
    totalPages: totalPages,
    currenPage: page,
    buyProperty: result1,
    };
};

export const getBuyPropertyDetail = async (propertyId: string) => {


  if (!propertyId) {
    throw new Error("propertyId is empty");
  }

  let result = await BuyProperty.aggregate([
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


export const getAllUserBuyPropertyList = async (page: number, limit: number, userId: string) => {

  if (!userId) {
    throw new Error("userId is empty");
  }

  let query = {
    userId: new ObjectId(userId),
    isDeleted: false,
  }

  const totalCount = await BuyProperty.count(query);
  const totalPages = Math.ceil(totalCount / limit);

  let skip: number;
  if (page !== 1) {
    skip = (page - 1) * limit;
  } else {
    skip = 0;
  }


  let result = await BuyProperty.find(query).skip(skip).limit(limit).sort({ _id: 1 })

  if (!result) {
    return false;
  }

  return {
    totalCount: totalCount,
    totalPages: totalPages,
    currenPage: page,
    buyProperty: result,
  };
};
