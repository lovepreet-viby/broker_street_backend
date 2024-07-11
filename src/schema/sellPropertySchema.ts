import mongoose, { Document, Model, Schema ,ObjectId} from "mongoose";

// Define an interface for the SellProperty document
interface ISellProperty extends Document {
    propertyType: string;
    district: string;
    // taluka: string;
    village: string;
    // state: string;
    locationURL?: string;
    uploadFilePath: string[];
    uploadImagePath: string[]
    amount: number;
    amountUnit: string;
    descriptions: string;
    isDeleted: boolean;
    userId:ObjectId;

    adminLocationURL?: string;
    adminAmountUnit : string;
    adminAmount: number;
}

// Define the schema
const sellPropertySchema: Schema<ISellProperty> = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
    propertyType: { type: String,enum:["residential", "commercial", "land/plot"], default: null },
    // taluka: { type: String, default: null },
    district: { type: String, default: null },
    village: { type: String, default: null },

    // state: { type: String, default: null },
    locationURL: { type: String },
    uploadFilePath: [{ type: String }],
    uploadImagePath:[{ type: String }],
    amount: { type: Number, default: null },
    amountUnit: { type: String, default: null },
    
    adminLocationURL: { type: String },
    adminAmount: { type: Number, default: null },
    adminAmountUnit: { type: String, default: null },
    descriptions: { type: String, default: null },
    isDeleted : { type: Boolean, default: false },
});

// Create the model
const SellProperty: Model<ISellProperty> = mongoose.model<ISellProperty>('SellProperty', sellPropertySchema, 'sellproperty');

export default SellProperty;
