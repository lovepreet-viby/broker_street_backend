export interface ISellProperty {
    propertyType: string;
    district: string;
    village: string;
    // taluka: string;
    // state: string;
    amountUnit: string;
    locationURL?: string;
    uploadFilePath: string[];
    uploadImagePath: string[];
    amount: number;
    descriptions: string;
    userId:string;
    adminLocationURL?: string;
    adminAmountUnit? : string;
    adminAmount?: number;
}