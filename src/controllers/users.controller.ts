import { Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { verifyOtp, checkByPhoneNumber, createUser, createNewOtp, getUserDetail, updateUserById, userPropertyDetail } from "../resource/users.resource";
import { IUser, IUserOtp } from "../interfaces/users.interfaces";
import { isValidObjectId } from "mongoose";


export const getUsers = async (req: Request, res: Response, next: Function) => {
  try {
    res.status(200).send("Get users called");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
};

export const userProfilePhoto = async (
  req: Request,
  res: Response,
  next: Function
) => {
  try {

    let userId: string = req.query.userId as string
    if (!userId) {
      return res.status(400).send("UserId is required");
    }

    if ((req as any).errorMessage) {
      return res.status(400).send((req as any).errorMessage);
    }

    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    let filePath = process.env.BASE_URL + req.file.path


    let user = await updateUserById(userId, { profilePicture: filePath });
    if (!user) {
      return res.status(400).send(false);
    }

    return res.status(200).send({ Message: "File upload successfully", data: filePath });

  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong!");
  }
};

export const userSignUp = async (req: Request, res: Response, next: Function) => {
  try {

    let data = req.body

    let userData: IUser = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      location: data.location
    }

    let checkObject = Object.keys(userData).filter((o) => !(userData as any)[o]);
    if (checkObject.length > 0) {
      return res.status(400).send(checkObject);
    }

    if (!/^\d{10}$/.test(String(userData.phoneNumber))) {
      return res.status(400).send("Invalid phone number");
    }

    let isCheckPhoneNumber = await checkByPhoneNumber(userData.phoneNumber)
    if (isCheckPhoneNumber) {
      return res.status(400).send("This number already exits");
    }

    // let user = await createUser(userData) as { _id: string, phoneNumber: number, role: string, lastName : string, firstName : string }
    // if (!user) {
    //   return res.status(400).send(false);
    // }

    let otpData = await createNewOtp(userData.phoneNumber);
    if (!otpData) {
      return res.status(400).send(false);
    }

    // const secretKey: string = process.env.JWT_SECRET ? process.env.JWT_SECRET : "lreigns"
    // let token = await jwt.sign({
    //   user_id: user._id,
    //   phoneNumber: user.phoneNumber,
    //   role: user.role
    // }, secretKey, { expiresIn: "24h" });
    //userId: user._id,  userName : user.firstName+" "+user.lastName

    return res.status(200).send({ hash: otpData.hash, phoneNumber: data.phoneNumber });

  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
};


export const checkUserOtp = async (req: Request, res: Response, next: Function) => {
  try {


    let data: IUserOtp = req.body
    let userData = {
      phoneNumber: data.phoneNumber,
      otp: data.otp,
      hash: data.hash
    }

    let checkObject = Object.keys(userData).filter((o) => !(userData as any)[o]);
    if (checkObject.length > 0) {
      return res.status(400).send(checkObject);
    }

    let checkOtp = await verifyOtp(userData.phoneNumber, userData.hash, userData.otp)
    if (!checkOtp) {
      return res.status(400).send(false);
    }

    let user
    if(data.newuser == true){    


      let checkPhoneNumber = await checkByPhoneNumber(userData.phoneNumber) as any
      if (checkPhoneNumber) {
        return res.status(400).send("Phone number already exits");
      }

      let userObj: IUser = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        location: data.location
      }

      user = await createUser(userObj) as any
      if (!user) {
        return res.status(400).send(false);
      }
      
    }else{

      user = await checkByPhoneNumber(userData.phoneNumber) as any
      if (!user) {
        return res.status(400).send("Invalid Phone number");
      }
    }

    const secretKey: string = process.env.JWT_SECRET ? process.env.JWT_SECRET : "lreigns"
    let token = await jwt.sign({
      user_id: user._id,
      phoneNumber: user.phoneNumber,
      role: user.role
    }, secretKey, { expiresIn: "24h" });

    return res.status(200).send({ token: token, userId: user._id,  userName : user.firstName+" "+user.lastName,
    role : user.role,
    profilePicture : user.profilePicture
    });


  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
};


export const resendUserOtp = async (req: Request, res: Response, next: Function) => {
  try {

    let phoneNumber: number = req.body.phoneNumber
    if (!phoneNumber) {
      return res.status(400).send("phone number is required");
    }

    if (!/^\d{10}$/.test(String(phoneNumber))) {
      return res.status(400).send("Invalid phone number");
    }
    // To Do 
    // messages service function 
    let otpData = await createNewOtp(phoneNumber);
    if (!otpData) {
      return res.status(400).send(false);
    }
    console.log(otpData.otp)
    return res.status(200).send({ hash: otpData.hash });

  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
};



export const userLogin = async (req: Request, res: Response, next: Function) => {
  try {

    let phoneNumber: number = req.body.phoneNumber
    if (!phoneNumber) {
      return res.status(400).send("phoneNumber is required");
    }

    if (!/^\d{10}$/.test(String(phoneNumber))) {
      return res.status(400).send("Invalid phone number");
    }

    let isCheckPhoneNumber = await checkByPhoneNumber(phoneNumber) as { _id: string, phoneNumber: number, role: string, lastName: string, firstName: string }
    if (!isCheckPhoneNumber) {
      return res.status(400).send("There was no account on this phone number");
    }
    // To do
    // otp send service  

    // const secretKey: string = process.env.JWT_SECRET ? process.env.JWT_SECRET : "lreigns"
    // let token = await jwt.sign({
    //   user_id: isCheckPhoneNumber._id,
    //   phoneNumber: isCheckPhoneNumber.phoneNumber,
    //   role: isCheckPhoneNumber.role
    // }, secretKey, { expiresIn: "24h" });

    let otpData = await createNewOtp(phoneNumber);
    if (!otpData) {
      return res.status(400).send(false);
    }

    return res.status(200).send({ hash: otpData.hash, phoneNumber: isCheckPhoneNumber.phoneNumber });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
};

export const userDetail = async (req: Request, res: Response, next: Function) => {
  try {

    let userId: string = req.query.userId as string
    if (!userId) {
      return res.status(400).send("UserId is required");
    }

    let user = await getUserDetail(userId);
    if (!user) {
      return res.status(400).send(false);
    }
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
};


export const updateUserDetail = async (req: Request, res: Response, next: Function) => {
  try {

    let data = req.body
    let userData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      location: data.location
    }

    let user = await updateUserById(req.body.userId, userData);
    if (!user) {
      return res.status(400).send(false);
    }
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
};

export const userProperty = async (req: Request, res: Response, next: Function) => {
  try {

    const userId: string = req.query?.userId as string;
    const page: number = parseInt(req.query?.page as string) || 1;
    const limit: number = parseInt(req.query?.limit as string) || 10;

    if (!isValidObjectId(userId)) {
      return res.status(400).send("Invalid userId");
    }

    let user = await userPropertyDetail(userId, page, limit);
    if (!user) {
      return res.status(400).send(false);
    }
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
};
