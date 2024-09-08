import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import {
    verifyOtp,
    checkByPhoneNumber,
    createUser,
    createNewOtp,
    getUserDetail,
    updateUserById,
    userPropertyDetail,
    tokenGenerator,
} from "../resource/users.resource";
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

// Function to upload a user profile photo
export const userProfilePhoto = async (
    req: Request,
    res: Response,
    next: Function
) => {
    try {
        let userId: string = req.query.userId as string;
        if (!userId) {
            return res.status(400).send("UserId is required");
        }

        if ((req as any).errorMessage) {
            return res.status(400).send((req as any).errorMessage);
        }

        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        let filePath = process.env.BASE_URL + req.file.path;

        let user = await updateUserById(userId, { profilePicture: filePath });
        if (!user) {
            return res.status(400).send(false);
        }

        return res
            .status(200)
            .send({ Message: "File upload successfully", data: filePath });
    } catch (err) {
        console.log(err);
        return res.status(500).send("Something went wrong!");
    }
};

// Function for user sign-up
export const userSignUp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { firstName, lastName, email, phoneNumber, location } = req.body;
  
      // Validate required fields
      const missingFields = [firstName, lastName, email, phoneNumber, location]
        .map((value, index) => (value ? null : ['firstName', 'lastName', 'email', 'phoneNumber', 'location'][index]))
        .filter(Boolean);
  
      if (missingFields.length > 0) {
        return res.status(400).json({ error: 'Missing required fields', fields: missingFields });
      }
  
      // Validate phone number format
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(String(phoneNumber))) {
        return res.status(400).json({ error: 'Invalid phone number' });
      }
  
      // Check if phone number already exists
      const existingUser = await checkByPhoneNumber(phoneNumber);
      if (existingUser) {
        return res.status(400).json({ error: 'This number already exists' });
      }
  
      // Create OTP
      const otpData = await createNewOtp(phoneNumber);
      if (!otpData) {
        return res.status(500).json({ error: 'Failed to generate OTP' });
      }
  
      // Respond with OTP hash and phone number
      return res.status(200).json({
        hash: otpData.hash,
        phoneNumber,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  };

// function to validate OTP and create user
export const validateSignupOtpAndCreateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data: IUserOtp = req.body;
  
      // Destructure and validate user data
      const { firstName, lastName, email, phoneNumber, location } = data;
      const userData: IUser = { firstName, lastName, email, phoneNumber, location };
  
      // Check for missing required fields
      const missingFields = Object.keys(userData).filter(key => !userData[key]);

      if (missingFields.length > 0) {
        return res.status(400).json({ message: 'Missing fields', fields: missingFields });
      }
  
      // Verify OTP
      const isOtpValid = await verifyOtp(phoneNumber, data.hash, data.otp);
      if (!isOtpValid) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      // Create user
      const user = await createUser(userData);
      if (!user) {
        return res.status(400).json({ message: 'User creation failed' });
      }
  
      // Generate token
      const token = await tokenGenerator({ phoneNumber: userData.phoneNumber, user_id: user._id, role: user.role });
  
      // Respond with token and user details
      return res.status(200).json({
        token,
        userId: user._id,
        userName: `${user.firstName} ${user.lastName}`,
        role: user.role,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Something went wrong!' });
    }
  };
export const validateLoginOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {    
    const data: IUserOtp = req.body;
    
    // Destructure and validate user data
    const { phoneNumber, otp, hash } = data;
    const userData = { phoneNumber, otp, hash };
    
    // Check for missing required fields
    const missingFields = Object.keys(userData).filter(key => !(key in userData) || !userData[key as keyof typeof userData]);   

    if (missingFields.length > 0) {
      return res.status(400).json({ message: 'Missing fields', fields: missingFields });
    }

    // Verify if user exists
    const user = await checkByPhoneNumber(phoneNumber);
    if (!user) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    // Verify OTP
    const isOtpValid = await verifyOtp(phoneNumber, hash, otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: 'Incorrect OTP' });
    }

    // Generate token
    const token = await tokenGenerator({ phoneNumber, user_id: user._id, role: user.role });

    // Respond with token and user details
    return res.status(200).json({
      token,
      userId: user._id,
      userName: `${user.firstName} ${user.lastName}`,
      role: user.role,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};



// Function to resend OTP
export const resendUserOtp = async (
    req: Request,
    res: Response,
    next: Function
) => {
    try {
        let phoneNumber: number = req.body.phoneNumber;
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
        console.log(otpData.otp);
        return res.status(200).send({ hash: otpData.hash });
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
};

// Function for user login
export const userLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  )=> {
    try {
      const { phoneNumber } = req.body;
  
      // Validate phone number presence and format
      if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required" });
      }
  
      if (!/^\d{10}$/.test(String(phoneNumber))) {
        return res.status(400).json({ message: "Invalid phone number" });
      }
  
      // Check if phone number exists in the database
      const user = await checkByPhoneNumber(phoneNumber) as IUser;
      if (!user) {
        return res.status(400).json({ message: "No account associated with this phone number" });
      }
  
      // Create new OTP for the user
      const otpData = await createNewOtp(phoneNumber);
      if (!otpData) {
        return res.status(500).json({ message: "Failed to generate OTP" });
      }
  
      // Respond with OTP hash and phone number
      return res.status(200).json({
        hash: otpData.hash,
        phoneNumber: user.phoneNumber,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Something went wrong!" });
    }
  };

// Function to get user details
export const userDetail = async (
    req: Request,
    res: Response,
    next: Function
) => {
    try {
        let userId: string = req.query.userId as string;
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

// Function to update user details
export const updateUserDetail = async (
    req: Request,
    res: Response,
    next: Function
) => {
    try {
        let data = req.body;
        let userData = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            location: data.location,
        };

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

// Function to get user properties with pagination
export const userProperty = async (
    req: Request,
    res: Response,
    next: Function
) => {
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
