import crypto from "crypto";
import { IUser, IUserProfileUpdate } from "../interfaces/users.interfaces";
import User from "../schema/userSchema";
const { ObjectId } = require("mongodb"); // If you're using CommonJS
import SellProperty from "../schema/sellPropertySchema";


export const createUser = async (data: IUser) => {
    if (!data) {
        throw new Error("Data is empty");
    }

    let result = await User.create(data);
    if (!result) {
        return false;
    }
    return result;
};

export const checkByPhoneNumber = async (phoneNumber: number) => {
    if (!phoneNumber) {
        throw new Error("phoneNumber is empty");
    }

    let result = await User.findOne({ phoneNumber: phoneNumber });
    if (!result) {
        return false;
    }
    return result;
};

export const getUserDetail = async (userId: string) => {
    if (!userId) {
        throw new Error("user id is empty");
    }

    let result = await User.findOne({ _id: userId });
    if (!result) {
        return false;
    }
    return result;
};

export const updateUserById = async (userId: string, data: object) => {
    if (!userId || !data) {
        throw new Error("data is empty");
    }

    let result = await User.findByIdAndUpdate(userId, data, { new: true });
    if (!result) {
        return false;
    }
    return result;
};

export const userPropertyDetail = async (
    userId: string,
    page: number,
    limit: number
) => {
    if (!userId) {
        throw new Error("userid is empty");
    }

    let searchData = { userId: new ObjectId(userId) , isDeleted: false}

    // let pipeline = [
    //     {
    //         $match: searchData,
    //     },
    //     {
    //         $lookup: {
    //             from: "sellproperty", // Replace with the actual collection name for "Friends"
    //             let: {
    //                 userId: new ObjectId(userId), // Variable for another user's ID
    //             },
    //             pipeline: [
    //                 {
    //                     $match: {
    //                         $expr: {
    //                             $and: [
    //                                 { $eq: ["$userId", "$$userId"] },
    //                                 { $eq: ["$isDeleted", false] },
    //                             ],
    //                         },
    //                     },
    //                 },
    //             ],
    //             as: "sellproperty_detail",
    //         },
    //     },

    //     // {
    //     //     $lookup: {
    //     //         from: "buyproperty", // Replace with the actual collection name for "Friends"
    //     //         let: {
    //     //             userId: new ObjectId(userId), // Variable for another user's ID
    //     //         },
    //     //         pipeline: [
    //     //             {
    //     //                 $match: {
    //     //                     $expr: {
    //     //                         $and: [
    //     //                             { $eq: ["$userId", "$$userId"] },
    //     //                             { $eq: ["$isDeleted", false] },
    //     //                         ],
    //     //                     },
    //     //                 },
    //     //             },
    //     //         ],
    //     //         as: "buyproperty_detail",
    //     //     },
    //     // },
    //     // {
    //     //   $lookup: {
    //     //     from: 'sellproperty',
    //     //     localField: '_id',
    //     //     foreignField: 'userId',
    //     //     as: 'sellproperty_detail'
    //     //   }
    //     // },
    //     // {
    //     //   $lookup: {
    //     //     from: 'buyproperty',
    //     //     localField: '_id',
    //     //     foreignField: 'userId',
    //     //     as: 'buyproperty_detail'
    //     //   }
    //     // }
    // ]

    const totalCount = await SellProperty.count(searchData);
    const totalPages = Math.ceil(totalCount / limit);

    let skip: number;
    if (page !== 1) {
        skip = (page - 1) * limit;
    } else {
        skip = 0;
    }

    let result = await SellProperty.find(searchData).skip(skip).limit(limit).sort({ _id : 1});

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

export const createNewOtp = async (phoneNumber: number) => {
    const key = process.env.OTP_SECRET;
    const otp = 123456;
    // const otp = Math.floor(100000 + Math.random() * 900000);
    const otpValidityTime = 5 * 60 * 1000;
    const expiresIn = Date.now() + otpValidityTime;
    const data = `${phoneNumber}.${otp}.${expiresIn}`;

    const hash = await crypto
        .createHmac("sha256", key || "")
        .update(data)
        .digest("hex");
    const fullHash = `${hash}.${expiresIn}`;
    return { otp, hash: fullHash };
};

export const verifyOtp = async (phoneNumber: number, hash: any, otp: any) => {
    const key = process.env.OTP_SECRET;
    let [hashValue, expiresIn] = hash.split(".");
    if (Date.now() > parseInt(expiresIn)) return false;
    const data = `${phoneNumber}.${otp}.${expiresIn}`;

    let newHash = await crypto
        .createHmac("sha256", key || "")
        .update(data)
        .digest("hex");

    if (newHash === hashValue) {
        return true;
    }
    return false;
};
