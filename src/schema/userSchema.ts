import mongoose, { Document, Model } from "mongoose";

// Define an interface for the User document
interface IUser extends Document {
  profilePicture?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber:number;
  location : string;
  role: string;
  isBlocked:Boolean;
  userType:string;
}

// Define the Mongoose schema for User
const userSchema = new mongoose.Schema<IUser>({
  profilePicture: { type: String , default : null},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  email: { type: String, required: true },
  location : { type: String, required: true },
  // password :  { type: String, required: true },
  // otp:{ type: Number, default: null },

  // token : { type: String, default: null },
  // fcmToken : { type: String, default: null },
  // deviceId :  { type: String, default: null },

  role : { type: String , enum : ["user", "admin", "superadmin", "enterprise"], default :"user"},
  isBlocked : { type: Boolean, default: false },
},{timestamps: true});

// Define the Mongoose model for User
const UserModel: Model<IUser> = mongoose.model<IUser>(
  "Users",
  userSchema,
  "users"
);

export default UserModel;
