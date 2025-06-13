export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  [key: string]: any;
}

export interface IUserOtp {
  phoneNumber: number;
  otp: number;
  hash: string;

  firstName: string;
  lastName: string;
  email: string;
  location: string;
  newuser: boolean;
}

export interface IUserProfileUpdate {
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  // phoneNumber : number;
}
