export interface ISellProperty {
    propertyType: string;
    district: string;
    taluka: string;
    // state: string;
    locationURL?: string;
    uploadFilePath: string[];
    amount: number;
    descriptions: string;
    userId:string;
}