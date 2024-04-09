const { ObjectId } = require("mongodb"); // If you're using CommonJS
import { IAssignProperty } from "../interfaces/assignProperty.interface";
import AssignProperty from "../schema/assignProperty";


export const createAssignPropertyDetail = async (data: IAssignProperty) => {

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




export const getUserAssignPropertyDetail = async (userId: string, page: number, limit: number) => {

  if (!userId) {
    throw new Error("userId is empty");
  }


  let query  = { userId: userId ,isDeleted: false }


  const totalCount = await AssignProperty.count(query);
  const totalPages = Math.ceil(totalCount / limit);

  let skip: number;
  if (page !== 1) {
    skip = (page - 1) * limit;
  } else {
    skip = 0;
  }

  let result = await AssignProperty.find(query).skip(skip).limit(limit);
  if (!result) {
    return false;
  }
  return {
    totalCount: totalCount,
    totalPages: totalPages,
    currenPage: page,
    assignProperty: result,
  }
};
