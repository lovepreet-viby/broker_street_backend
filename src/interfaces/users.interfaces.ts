export interface IUser {
  firstName: string;
  lastName: string;
  email:string;
  location:string
  phoneNumber : number;
}
export interface IUser2 {
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

  firstName: string;
  lastName: string;
  email:string;
  location:string;
  newuser : boolean
}

export interface IUserProfileUpdate {
  firstName: string;
  lastName: string;
  email:string;
  location:string
  // phoneNumber : number;
}
