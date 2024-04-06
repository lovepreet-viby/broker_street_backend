import mongoose, { Document, Model, Schema ,ObjectId} from "mongoose";

// Define an interface for the SellProperty document
interface ISellProperty extends Document {
    propertyType: string;
    district: string;
    taluka: string;
    // state: string;
    locationURL?: string;
    uploadFilePath: string[];
    uploadImagePath: string[]
    amount: number;
    descriptions: string;
    isDeleted: boolean;
    userId:ObjectId;
}

// Define the schema
const sellPropertySchema: Schema<ISellProperty> = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
    propertyType: { type: String,enum:["residential", "commercial", "land/plot"], default: null },
    taluka: { type: String, default: null },
    district: { type: String, default: null },
    // state: { type: String, default: null },
    locationURL: { type: String },
    uploadFilePath: [{ type: String }],
    uploadImagePath:[{ type: String }],
    amount: { type: Number, default: null },
    descriptions: { type: String, default: null },
    isDeleted : { type: Boolean, default: false },
});

// Create the model
const SellProperty: Model<ISellProperty> = mongoose.model<ISellProperty>('SellProperty', sellPropertySchema, 'sellproperty');

export default SellProperty;
