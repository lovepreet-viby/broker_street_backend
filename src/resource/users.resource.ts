const nodemailer = require("nodemailer");
import crypto from "crypto";
import { IUser, IUserProfileUpdate } from "../interfaces/users.interfaces";
import User from "../schema/userSchema";
const { ObjectId } = require("mongodb"); // If you're using CommonJS
import SellProperty from "../schema/sellPropertySchema";
import { sendOtp } from "../constants/messageService";
import Message from "../schema/messageServiceSchema";
import * as jwt from "jsonwebtoken";
import { ITokenUserData } from "../interfaces/auth";

// Function to create a new user
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

// Function to check if a phone number already exists
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

export const checkByEmail = async (email: String) => {
  if (!email) {
    throw new Error("email is empty");
  }

  let result = await User.findOne({ email: email });
  if (!result) {
    return false;
  }
  return result;
};

// Function to get user details by user ID
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

// Function to update user details by user ID
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

// Function to get user property details with pagination
export const userPropertyDetail = async (
  userId: string,
  page: number,
  limit: number
) => {
  if (!userId) {
    throw new Error("userid is empty");
  }

  let searchData = { userId: new ObjectId(userId), isDeleted: false };
  const totalCount = await SellProperty.count(searchData);
  const totalPages = Math.ceil(totalCount / limit);

  let skip: number;
  if (page !== 1) {
    skip = (page - 1) * limit;
  } else {
    skip = 0;
  }

  let result = await SellProperty.find(searchData)
    .skip(skip)
    .limit(limit)
    .sort({ _id: 1 });

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

// Function to create a new OTP
export const createNewOtp = async (email: String) => {

  const key = process.env.OTP_SECRET;
  const otp = Math.floor(100000 + Math.random() * 900000);

  const otpValidityTime = 5 * 60 * 1000;
  const expiresIn = Date.now() + otpValidityTime;
  const data = `${email}.${otp}.${expiresIn}`;

  const hash = await crypto
    .createHmac("sha256", key || "")
    .update(data)
    .digest("hex");
  const fullHash = `${hash}.${expiresIn}`;
  console.log(otp)
  await otpSender(otp,email)
  return { otp, hash: fullHash };
};

// Function to verify OTP
export const verifyOtp = async (email: string, hash: any, otp: any) => {
  const key = process.env.OTP_SECRET;
  let [hashValue, expiresIn] = hash.split(".");
  if (Date.now() > parseInt(expiresIn)) return false;
  const data = `${email}.${otp}.${expiresIn}`;

  let newHash = await crypto
    .createHmac("sha256", key || "")
    .update(data)
    .digest("hex");

  if (newHash === hashValue) {
    return true;
  }
  return false;
};

// Funaction to Get userdetail by user role
export const getUserDetailByRole = async (role: string) => {
  if (!role) {
    throw new Error("role is empty");
  }

  let result = await User.findOne({ role: role });
  if (!result) {
    return false;
  }
  return result;
};

export const tokenGenerator = async (
  userData: ITokenUserData,
  expiresIn: string = "24h", // Default value for expiresIn
  secretKey: string = process.env.JWT_SECRET ?? "lreigns" // Default value for secretKey
): Promise<string> => {
  return jwt.sign(userData, secretKey, { expiresIn });
};

export const otpSender = async (otp: any, email: String) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASS,
    },
  });
  console.log(transporter)
  console.log(otp,"send otp");

  await transporter
    .sendMail({
      from: "'Broker Streets'" + process.env.SMTP_USERNAME,
      to: email,
      subject: "OTP to Verify email",
      html: `<b><h1>Broker Streets </h1>
        <h2>${otp} is the otp to verify your email.</h2>
        </b>`,
    }).then((result: any) => {
        console.log("OTP sent to user");
    })
    .catch((err: any) => {
      console.log(err);
    });
};

