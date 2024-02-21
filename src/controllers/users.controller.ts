import { Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { verifyOtp, checkByPhoneNumber, createUser,createNewOtp,getUserDetail ,updateUserById} from "../resource/users.resource";
import { IUser, IUserOtp } from "../interfaces/users.interfaces";


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

    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    
    let filePath  = process.env.BASE_URL+req.file.path
    return res.status(200).send({Message :"File upload successfully", data:filePath});

  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong!");
  }
};

export const userSignUp = async (req: Request, res: Response, next: Function) => {
  try {

    let data = req.body 

    let userData: IUser = {
      firstName : data.firstName,
      lastName : data.lastName,
      email: data.email,
      phoneNumber : data.phoneNumber,
      location: data.location
    }

    let checkObject = Object.keys(userData).filter((o) => !(userData as any)[o]);
    if (checkObject.length > 0) {
      return res.status(400).send(checkObject);
    }

    if (!/^\d{10}$/.test(String(userData.phoneNumber))) {
      return res.status(400).send("Invalid phone number");
    }

    let isCheckPhoneNumber =  await checkByPhoneNumber(userData.phoneNumber)
    if(isCheckPhoneNumber){
      return res.status(400).send("This number already exits");
    }
    
    let user =  await createUser(userData) as { _id : string , phoneNumber :number, role : string }

    let otpData = await createNewOtp(userData.phoneNumber);

    const secretKey: string  = process.env.JWT_SECRET ? process.env.JWT_SECRET : "lreigns"
    let token =  await jwt.sign({
      user_id: user._id,
      phoneNumber : user.phoneNumber,
      role: user.role
    }, secretKey, { expiresIn : "24h" });
    
    if(!user){
      return res.status(400).send(false);
    }
    console.log(otpData.otp)
    return res.status(200).send({hash : otpData.hash , token : token , phoneNumber:user.phoneNumber , userId: user._id });

  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
};


export const checkUserOtp = async (req: Request, res: Response, next: Function) => {
  try {


    let data: IUserOtp = req.body
    let userData  = {
      phoneNumber: data.phoneNumber,
      otp : data.otp,
      hash : data.hash
    }

    let checkObject = Object.keys(userData).filter((o) => !(userData as any)[o]);
    if (checkObject.length > 0) {
      return res.status(400).send(checkObject);
    }
   
    let checkOtp =  await verifyOtp(userData.phoneNumber,userData.hash ,userData.otp )
    if(!checkOtp){
      return res.status(400).send(false);
    }

    return res.status(200).send(true);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
};


export const resendUserOtp = async (req: Request, res: Response, next: Function) => {
  try {

    let phoneNumber:number= req.body.phoneNumber 
    if(!phoneNumber){
      return res.status(400).send("phone number is required");
    }

    if (!/^\d{10}$/.test(String(phoneNumber))) {
      return res.status(400).send("Invalid phone number");
    }
    // To Do 
    // messages service function 
    let otpData = await createNewOtp(phoneNumber);
    if(!otpData){
      return res.status(400).send(false);
    }
    console.log(otpData.otp)
    return res.status(200).send({hash : otpData.hash});

  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
};



export const userLogin = async (req: Request, res: Response, next: Function) => {
  try {

    let phoneNumber: number = req.body.phoneNumber 
    if(!phoneNumber){
      return res.status(400).send("phoneNumber is required");
    }

    if (!/^\d{10}$/.test(String(phoneNumber))) {
      return res.status(400).send("Invalid phone number");
    }

    let isCheckPhoneNumber =  await checkByPhoneNumber(phoneNumber) as { _id : string , phoneNumber :number, role : string }
    if(!isCheckPhoneNumber){
      return res.status(400).send("There was no account on this phone number");
    }
    // To do
    // otp send service  
    
    const secretKey: string  = process.env.JWT_SECRET ? process.env.JWT_SECRET : "lreigns"
    let token =  await jwt.sign({
      user_id: isCheckPhoneNumber._id,
      phoneNumber : isCheckPhoneNumber.phoneNumber,
      role: isCheckPhoneNumber.role
    }, secretKey, { expiresIn : "24h" });
    
    let otpData = await createNewOtp(phoneNumber);
    if(!otpData){
      return res.status(400).send(false);
    }
    console.log(otpData.otp)
    return res.status(200).send({ hash : otpData.hash , token : token,phoneNumber:isCheckPhoneNumber.phoneNumber, userId: isCheckPhoneNumber._id });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
};

export const userDetail = async (req: Request, res: Response, next: Function) => {
  try {

    let userId: string = req.query.userId as string
    if(!userId){
      return res.status(400).send("UserId is required");
    }

    let user = await getUserDetail(userId);
    if(!user){
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
      firstName : data.firstName,
      lastName: data.lastName,
      email: data.email,
      location : data.location
    }

    let user = await updateUserById(req.body.userId, userData);
    if(!user){
      return res.status(400).send(false);
    }
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
};
