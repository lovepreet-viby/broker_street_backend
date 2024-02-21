export interface IUser {
  firstName: string;
  lastName: string;
  email:string;
  location:string
  phoneNumber : number;
}

export interface IUserOtp {
  phoneNumber: number;
  otp : number;
  hash :string;
}

export interface IUserProfileUpdate {
  firstName: string;
  lastName: string;
  email:string;
  location:string
  // phoneNumber : number;
}
