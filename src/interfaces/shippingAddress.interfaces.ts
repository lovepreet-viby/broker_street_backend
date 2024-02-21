export interface IShippingAddress {
    userId?: string;
    fullName: string;
    addressLine: string;
    city: string;
    state?: string;
    pinCode: number;
    country?: string;
    phoneNumber: number;
}