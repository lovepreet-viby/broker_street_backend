const { ObjectId } = require("mongodb"); // If you're using CommonJS
import { IAssignProperty } from "../interfaces/assignProperty.interface";
import AssignProperty from "../schema/assignProperty";


export const createAssignPropertyDetail = async (data: IAssignProperty[]) => {

  if (!data) {
    throw new Error("Data is empty");
  }

  let result = await AssignProperty.create(data);
  if (!result) {
    return false;
  }
  return result;
};


export const updateAssignPropertyDetail = async (data: IAssignProperty) => {

  if (!data) {
    throw new Error("Data is empty");
  }

  let result = await AssignProperty.findByIdAndUpdate(data.id, data, { new: true });
  if (!result) {
    return false;
  }
  return result;
};


export const deleteAssignPropertyDetail = async (assignId: string) => {

  if (!assignId) {
    throw new Error("assignId is empty");
  }

  let result = await AssignProperty.findByIdAndUpdate(assignId, { isDeleted: true }, { new: true });
  if (!result) {
    return false;
  }
  return result;
};



export const getUserAssignPropertyDetail = async (userId: string, page: number, limit: number, searchkey: string) => {

  if (!userId) {
    throw new Error("userId is empty");
  }

  let query =
    searchkey ? {
      userId: new ObjectId(userId),
      isDeleted: false,
      $or: [
        { "sellproperty_detail.taluka": { $regex: searchkey, $options: "i" } },
        { "sellproperty_detail.district": { $regex: searchkey, $options: "i" } }
      ]
    } :
      { userId: new ObjectId(userId), isDeleted: false }


  // let pipeline = [{
  //   $lookup: {
  //     from: 'sellproperty',
  //     localField: 'propertyId',
  //     foreignField: '_id',
  //     as: 'sellproperty_detail'
  //   }
  // },
  // {
  //   $unwind: {
  //     path: "$sellproperty_detail",
  //     preserveNullAndEmptyArrays: true
  //   }
  // },
  // {
  //   $match: query
  // }]


  let pipeline = [
    {
      $lookup: {
        from: 'sellproperty',
        let: { propertyId: '$propertyId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$_id', '$$propertyId'] },
                  { $eq: ["$isDeleted", false] }
                ]
              },
            }
          },
        ],
        as: 'sellproperty_detail'
      }
    },
    {
      $unwind: {
        path: "$sellproperty_detail",
        preserveNullAndEmptyArrays: false
      }
    },
    {
      $match: query
    }
  ];


  const totalCount = await AssignProperty.aggregate(pipeline);
  const totalPages = Math.ceil(totalCount.length / limit);

  let skip: number;
  if (page !== 1) {
    skip = (page - 1) * limit;
  } else {
    skip = 0;
  }


  let result = await AssignProperty.aggregate(pipeline).skip(skip).limit(limit);
  if (!result) {
    return false;
  }
  return {
    totalCount: totalCount.length,
    totalPages: totalPages,
    currenPage: page,
    assignProperty: result,
  }
};
